/* Importa movimientos desde PDF con revisión previa en el navegador. */
(() => {
    const PDFJS_VERSION = "5.4.530";
    const PDFJS_BASE = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build`;
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    const DATE_PATTERN = /\b(?:\d{4}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b/g;
    const AMOUNT_PATTERN = /(?:\(\s*)?[-−]?\s*(?:(?:GTQ|USD|US\$|Q|\$)\s*)?\d(?:[\d.,]*\d)?(?:\s*\))?(?:-)?/gi;
    const SUMMARY_TERMS = [
        "saldo anterior", "saldo final", "saldo disponible", "saldo promedio",
        "total a pagar", "total del periodo", "total del período", "pago minimo",
        "pago minimo", "pago requerido", "fecha de corte", "fecha limite",
        "periodo de facturacion", "periodo del estado", "resumen de cuenta",
        "cargos del periodo", "abonos del periodo", "pagina", "numero de cuenta"
    ];

    const dialog = document.getElementById("statementImportDialog");
    const openButton = document.getElementById("importStatementButton");
    const closeButton = document.getElementById("closeStatementImportButton");
    const cancelButton = document.getElementById("cancelStatementImportButton");
    const fileInput = document.getElementById("statementPdfFile");
    const statusBox = document.getElementById("statementImportStatus");
    const settingsPanel = document.getElementById("statementImportSettings");
    const paymentMethodInput = document.getElementById("statementImportPaymentMethod");
    const cardGroup = document.getElementById("statementImportCardGroup");
    const cardInput = document.getElementById("statementImportCard");
    const currencyInput = document.getElementById("statementImportCurrency");
    const rateGroup = document.getElementById("statementImportRateGroup");
    const rateInput = document.getElementById("statementImportRate");
    const preview = document.getElementById("statementPreview");
    const previewRows = document.getElementById("statementPreviewRows");
    const previewSummary = document.getElementById("statementPreviewSummary");
    const selectAll = document.getElementById("statementSelectAll");
    const confirmButton = document.getElementById("confirmStatementImportButton");
    const footerHint = document.getElementById("statementImportFooterHint");
    const stepNodes = [
        document.getElementById("statementStepUpload"),
        document.getElementById("statementStepReview"),
        document.getElementById("statementStepSave")
    ];

    if (!dialog || !openButton || !fileInput) return;

    function setStep(activeStep) {
        stepNodes.forEach((node, index) => {
            if (!node) return;
            node.classList.toggle("is-current", index + 1 === activeStep);
            node.classList.toggle("is-complete", index + 1 < activeStep);
        });
    }

    let parsedRows = [];
    let pdfLibraryPromise = null;
    let previousFocus = null;
    let isSaving = false;

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function safeText(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
        })[char]);
    }

    function setStatus(message, state = "") {
        statusBox.textContent = message;
        statusBox.classList.toggle("is-error", state === "error");
        statusBox.classList.toggle("is-success", state === "success");
    }

    function getAppState() {
        return window.FinanzasPersonalesImport?.getState?.() || null;
    }

    async function openDialog() {
        previousFocus = document.activeElement;
        setStep(1);
        dialog.hidden = false;
        document.body.style.overflow = "hidden";
        fileInput.focus();
        setStatus("Preparando categorías y tarjetas…");
        try {
            const ready = await window.FinanzasPersonalesImport?.ensureReady?.();
            if (!ready) {
                setStatus("Inicia sesión para cargar tus categorías antes de importar.", "error");
                return;
            }
            populateCards();
            setStatus("Aún no has seleccionado un archivo.");
        } catch (error) {
            console.error("No se pudieron preparar las categorías:", error);
            setStatus("No se pudieron cargar las categorías. Revisa tu conexión e inténtalo de nuevo.", "error");
        }
    }

    function closeDialog() {
        dialog.hidden = true;
        document.body.style.overflow = "";
        resetDialog();
        previousFocus?.focus?.();
    }

    function resetDialog() {
        setStep(1);
        fileInput.value = "";
        parsedRows = [];
        previewRows.innerHTML = "";
        preview.hidden = true;
        settingsPanel.hidden = true;
        selectAll.checked = true;
        confirmButton.disabled = true;
        confirmButton.textContent = "Importar movimientos";
        footerHint.textContent = "No se guardará nada hasta que confirmes.";
        paymentMethodInput.value = "cash";
        currencyInput.value = "GTQ";
        rateInput.value = "";
        syncSettings();
        setStatus("Aún no has seleccionado un archivo.");
    }

    function populateCards() {
        const state = getAppState();
        const activeCards = (state?.creditCards || []).filter(card => card.active !== false);
        cardInput.innerHTML = '<option value="">Selecciona una tarjeta</option>' + activeCards.map(card =>
            `<option value="${safeText(card.id)}">${safeText(card.bank)} · ${safeText(card.name)}</option>`
        ).join("");
    }

    function syncSettings() {
        const isCard = paymentMethodInput.value === "card";
        const isUsd = currencyInput.value === "USD";
        cardGroup.hidden = !isCard;
        rateGroup.hidden = !isUsd;
        updateImportButton();
    }

    function loadPdfJs() {
        if (!pdfLibraryPromise) {
            pdfLibraryPromise = import(`${PDFJS_BASE}/pdf.mjs`).then(pdfjs => {
                pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.mjs`;
                return pdfjs;
            });
        }
        return pdfLibraryPromise;
    }

    function dateFromToken(token) {
        const parts = token.split(/[./-]/).map(Number);
        let year, month, day;
        if (parts[0] > 999) [year, month, day] = parts;
        else {
            [day, month, year] = parts;
            if (year < 100) year += year < 70 ? 2000 : 1900;
        }
        if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null;
        const candidate = new Date(Date.UTC(year, month - 1, day));
        if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) return null;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    function parseMoney(token) {
        const negative = /[-−]|\(/.test(token);
        let number = String(token).replace(/[^\d.,]/g, "");
        if (!number) return null;

        const comma = number.lastIndexOf(",");
        const dot = number.lastIndexOf(".");
        if (comma >= 0 && dot >= 0) {
            const decimal = comma > dot ? "," : ".";
            const grouping = decimal === "," ? /\./g : /,/g;
            number = number.replace(grouping, "");
            number = decimal === "," ? number.replace(",", ".") : number;
        } else if (comma >= 0 || dot >= 0) {
            const separator = comma >= 0 ? "," : ".";
            const decimals = number.length - number.lastIndexOf(separator) - 1;
            if (decimals >= 1 && decimals <= 2) {
                number = number.replace(/[,.](?=.*[,.])/g, "");
                number = number.replace(separator, ".");
            } else {
                number = number.replace(/[,.]/g, "");
            }
        }

        const value = Number(number);
        if (!Number.isFinite(value) || value <= 0) return null;
        return { amount: Math.abs(value), negative };
    }

    function extractAmountCandidates(line) {
        const candidates = [];
        for (const item of line.items) {
            const withoutDates = item.str.replace(DATE_PATTERN, " ");
            const pattern = new RegExp(AMOUNT_PATTERN.source, "gi");
            for (const match of withoutDates.matchAll(pattern)) {
                const parsed = parseMoney(match[0]);
                if (parsed) candidates.push({ ...parsed, x: item.x + item.width / 2, token: match[0], item });
            }
        }
        return candidates;
    }

    function groupPageLines(items) {
        const ordered = items
            .filter(item => typeof item.str === "string" && item.str.trim())
            .map(item => ({
                str: item.str.trim(),
                x: Number(item.transform?.[4] || 0),
                y: Number(item.transform?.[5] || 0),
                width: Number(item.width || 0)
            }))
            .sort((a, b) => Math.abs(b.y - a.y) > 2.4 ? b.y - a.y : a.x - b.x);

        const lines = [];
        for (const item of ordered) {
            let line = lines.find(candidate => Math.abs(candidate.y - item.y) <= 2.4);
            if (!line) {
                line = { y: item.y, items: [] };
                lines.push(line);
            }
            line.items.push(item);
        }
        return lines
            .map(line => {
                line.items.sort((a, b) => a.x - b.x);
                line.text = line.items.map(item => item.str).join(" ").replace(/\s+/g, " ").trim();
                return line;
            })
            .sort((a, b) => b.y - a.y);
    }

    function detectColumns(lines) {
        const amountTerms = ["cargo", "cargos", "debito", "debit", "abono", "abonos", "credito", "credit", "monto", "importe", "valor", "amount"];
        const header = lines.find(line => {
            const text = normalize(line.text);
            return /\b(fecha|date)\b/.test(text) && amountTerms.some(term => text.includes(term));
        });
        if (!header) return null;

        const columns = { debitX: null, creditX: null, amountX: null };
        for (const item of header.items) {
            const text = normalize(item.str);
            const x = item.x + item.width / 2;
            if (["cargo", "cargos", "debito", "debit"].some(term => text.includes(term))) columns.debitX ??= x;
            else if (["abono", "abonos", "credito", "credit"].some(term => text.includes(term))) columns.creditX ??= x;
            else if (["monto", "importe", "valor", "amount"].some(term => text.includes(term))) columns.amountX ??= x;
        }
        return columns;
    }

    function nearestCandidate(candidates, x, maxDistance = 75) {
        if (x === null || x === undefined || !candidates.length) return null;
        const ranked = [...candidates].sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
        return Math.abs(ranked[0].x - x) <= maxDistance ? ranked[0] : null;
    }

    function pickAmount(candidates, columns, rowText) {
        if (columns) {
            if (columns.debitX !== null || columns.creditX !== null) {
                const debit = nearestCandidate(candidates, columns.debitX);
                const credit = nearestCandidate(candidates, columns.creditX);
                if (debit && credit) {
                    const debitDistance = Math.abs(debit.x - columns.debitX);
                    const creditDistance = Math.abs(credit.x - columns.creditX);
                    const isDebit = debitDistance <= creditDistance;
                    return {
                        candidate: isDebit ? debit : credit,
                        type: isDebit ? "expense" : "income",
                        confidence: 0.58
                    };
                }
                if (debit) return { candidate: debit, type: "expense", confidence: 0.88 };
                if (credit) return { candidate: credit, type: "income", confidence: 0.88 };
            }
            const amount = nearestCandidate(candidates, columns.amountX);
            if (amount) {
                const normalizedText = normalize(rowText);
                const incomeHint = amount.negative || /\b(abono|deposito|deposit|nomina|salario|transferencia recibida|credito recibido|intereses a favor)\b/.test(normalizedText);
                return { candidate: amount, type: incomeHint ? "income" : "expense", confidence: 0.58 };
            }
        }

        if (!candidates.length) return null;
        const candidate = candidates.length > 1 ? candidates[candidates.length - 2] : candidates[0];
        const normalizedText = normalize(rowText);
        const incomeHint = candidate.negative || /\b(abono|deposito|deposit|nomina|salario|transferencia recibida|credito recibido|intereses a favor)\b/.test(normalizedText);
        return { candidate, type: incomeHint ? "income" : "expense", confidence: candidates.length === 1 ? 0.55 : 0.38 };
    }

    function cleanDescription(line) {
        const pieces = line.items.map(item => item.str
            .replace(DATE_PATTERN, " ")
            .replace(new RegExp(AMOUNT_PATTERN.source, "gi"), " ")
            .trim())
            .filter(Boolean);
        const value = pieces.join(" ").replace(/\s+/g, " ").replace(/[|·]+/g, " ").trim();
        return value || "Movimiento importado";
    }

    function parseStatementLine(line, columns, index) {
        const match = line.text.match(DATE_PATTERN);
        if (!match) return null;
        const date = dateFromToken(match[0]);
        if (!date) return null;

        const normalizedText = normalize(line.text);
        if (SUMMARY_TERMS.some(term => normalizedText.includes(term))) return null;
        const candidates = extractAmountCandidates(line);
        const picked = pickAmount(candidates, columns, line.text);
        if (!picked || !picked.candidate.amount) return null;

        return {
            id: index,
            date,
            description: cleanDescription(line),
            amount: Number(picked.candidate.amount.toFixed(2)),
            type: picked.type,
            confidence: picked.confidence,
            categoryId: "",
            duplicate: false
        };
    }

    async function readPdf(file) {
        const pdfjs = await loadPdfJs();
        const pdf = await pdfjs.getDocument({
            data: new Uint8Array(await file.arrayBuffer()),
            isEvalSupported: false,
            enableXfa: false
        }).promise;
        if (pdf.numPages > 80) throw new Error("El PDF tiene más de 80 páginas. Divide el archivo e importa cada parte.");

        const rows = [];
        let index = 0;
        let textCharacterCount = 0;
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();
            const lines = groupPageLines(content.items || []);
            textCharacterCount += lines.reduce((sum, line) => sum + line.text.length, 0);
            const columns = detectColumns(lines);
            for (const line of lines) {
                const parsed = parseStatementLine(line, columns, index);
                if (parsed) {
                    rows.push(parsed);
                    index++;
                }
            }
            page.cleanup?.();
        }
        pdf.cleanup?.();
        return { rows, textCharacterCount };
    }

    function findExistingMatch(row, state) {
        const list = row.type === "income" ? state.incomes : state.expenses;
        const expectedMethod = paymentMethodInput.value === "card" ? "card" : "cash";
        const sameAccount = entry => row.type === "income"
            || ((entry.paymentMethod || "cash") === expectedMethod
                && (expectedMethod !== "card" || String(entry.creditCardId) === String(cardInput.value)));
        const sameCurrency = entry => entry.currency === currencyInput.value;
        const sameDate = entry => entry.date === row.date && sameCurrency(entry) && sameAccount(entry);
        const sameDescription = entry => normalize(entry.description) === normalize(row.description);
        const byExact = (list || []).filter(entry => sameDate(entry)
            && sameDescription(entry)
            && Math.abs(Number(entry.amount) - Number(row.amount)) < 0.01);
        if (byExact.length === 1) return { entry: byExact[0], reason: "exact" };
        if (byExact.length > 1) return { ambiguous: true };

        const byAmount = (list || []).filter(entry => sameDate(entry)
            && Math.abs(Number(entry.amount) - Number(row.amount)) < 0.01);
        if (byAmount.length === 1) return { entry: byAmount[0], reason: "amount" };
        if (byAmount.length > 1) return { ambiguous: true };

        const byDescription = (list || []).filter(entry => sameDate(entry) && sameDescription(entry));
        if (byDescription.length === 1) return { entry: byDescription[0], reason: "description" };
        if (byDescription.length > 1) return { ambiguous: true };
        return null;
    }

    function suggestCategory(row, state) {
        const list = row.type === "income" ? state.incomes : state.expenses;
        const previous = (list || []).find(entry => normalize(entry.description) === normalize(row.description));
        return previous?.categoryId || "";
    }

    function markDuplicates() {
        const state = getAppState();
        if (!state) return;
        const seen = new Set();
        const matchedIds = new Set();
        parsedRows.forEach(row => {
            const match = findExistingMatch(row, state);
            row.matchAmbiguous = Boolean(match?.ambiguous);
            row.matchedId = match?.entry && !matchedIds.has(String(match.entry.id))
                ? String(match.entry.id)
                : "";
            if (match?.entry && matchedIds.has(String(match.entry.id))) row.matchAmbiguous = true;
            if (row.matchedId) {
                matchedIds.add(row.matchedId);
                row.categoryId ||= match.entry.categoryId || "";
            }
            row.categoryId ||= suggestCategory(row, state);

            const fingerprint = [row.type, row.date, row.amount, normalize(row.description), currencyInput.value].join("|");
            row.duplicateWithinPdf = seen.has(fingerprint);
            if (row.action === undefined) row.action = row.matchedId ? "update" : "insert";
            if (row.include === undefined) {
                row.include = !row.matchAmbiguous && !row.duplicateWithinPdf && row.confidence >= 0.7;
            }
            seen.add(fingerprint);
        });
    }

    function categoryOptions(type, selectedId) {
        const state = getAppState();
        const options = (state?.categories?.[type] || []).filter(category => category.active !== false);
        const placeholder = options.length
            ? '<option value="">Selecciona categoría</option>'
            : '<option value="">Configura una categoría en Ajustes</option>';
        return placeholder + options.map(category =>
            `<option value="${safeText(category.id)}" ${category.id === selectedId ? "selected" : ""}>${safeText(category.name)}</option>`
        ).join("");
    }

    function renderRows() {
        markDuplicates();
        previewRows.innerHTML = parsedRows.map((row, index) => {
            const status = row.matchAmbiguous || row.duplicateWithinPdf
                ? '<span class="statement-row-status review">Revisar coincidencia</span>'
                : row.matchedId
                    ? '<span class="statement-row-status">Coincide · actualizar</span>'
                    : row.confidence < 0.7
                        ? '<span class="statement-row-status review">Revisar extracción</span>'
                        : '<span class="statement-row-status">Movimiento nuevo</span>';
            const actionOptions = row.matchedId
                ? `<option value="update" ${row.action === "update" ? "selected" : ""}>Actualizar existente</option><option value="insert" ${row.action === "insert" ? "selected" : ""}>Agregar como nuevo</option>`
                : '<option value="insert">Agregar como nuevo</option>';
            return `<tr data-statement-row="${index}" data-match-id="${safeText(row.matchedId || "")}">
                <td><input class="statement-row-include" type="checkbox" aria-label="Incluir movimiento ${index + 1}" ${row.include ? "checked" : ""}></td>
                <td><input class="statement-row-date" type="date" value="${safeText(row.date)}" aria-label="Fecha del movimiento ${index + 1}"></td>
                <td><input class="statement-row-description" type="text" value="${safeText(row.description)}" aria-label="Descripción del movimiento ${index + 1}" maxlength="180"></td>
                <td><input class="statement-row-amount" type="number" min="0.01" step="0.01" value="${safeText(row.amount)}" aria-label="Monto del movimiento ${index + 1}"></td>
                <td><select class="statement-row-type" aria-label="Tipo del movimiento ${index + 1}"><option value="expense" ${row.type === "expense" ? "selected" : ""}>Gasto</option><option value="income" ${row.type === "income" ? "selected" : ""}>Ingreso</option></select></td>
                <td><select class="statement-row-category" aria-label="Categoría del movimiento ${index + 1}">${categoryOptions(row.type, row.categoryId)}</select></td>
                <td><select class="statement-row-action" aria-label="Acción para el movimiento ${index + 1}">${actionOptions}</select></td>
                <td>${status}</td>
            </tr>`;
        }).join("");
        const updateCount = parsedRows.filter(row => row.matchedId).length;
        previewSummary.textContent = `${parsedRows.length} movimiento(s) detectado(s); ${updateCount} coinciden con registros existentes y podrán actualizarse. Revisa las filas marcadas.`;
        updateSelectAllState();
        updateImportButton();
    }

    function updateSelectAllState() {
        const boxes = [...previewRows.querySelectorAll(".statement-row-include")];
        const selected = boxes.filter(box => box.checked).length;
        selectAll.checked = boxes.length > 0 && selected === boxes.length;
        selectAll.indeterminate = selected > 0 && selected < boxes.length;
    }

    function updateImportButton() {
        const selected = previewRows.querySelectorAll(".statement-row-include:checked").length;
        const cardMissing = paymentMethodInput.value === "card" && !cardInput.value;
        const rateInvalid = currencyInput.value === "USD" && !(Number(rateInput.value) > 0);
        confirmButton.disabled = isSaving || selected === 0 || cardMissing || rateInvalid;
        confirmButton.textContent = selected ? `Importar ${selected} movimiento${selected === 1 ? "" : "s"}` : "Importar movimientos";
        footerHint.textContent = selected
            ? `${selected} fila(s) seleccionada(s). Revisa también el tipo de cuenta y la moneda.`
            : "Selecciona al menos un movimiento para continuar.";
    }

    async function handleFile(file) {
        resetPreview();
        setStep(1);
        if (!file) return;
        if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
            setStatus("Selecciona un archivo PDF.", "error");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setStatus("El PDF supera el límite de 20 MB.", "error");
            return;
        }
        if (!window.FinanzasPersonalesImport) {
            setStatus("La aplicación todavía está cargando. Intenta nuevamente en unos segundos.", "error");
            return;
        }

        setStatus("Preparando categorías y leyendo el PDF…");
        try {
            const ready = await window.FinanzasPersonalesImport.ensureReady();
            if (!ready) {
                setStatus("Inicia sesión para cargar tus categorías antes de importar.", "error");
                return;
            }
            populateCards();
            const result = await readPdf(file);
            if (!result.textCharacterCount || !result.rows.length) {
                setStatus("No se encontraron movimientos legibles. El PDF puede ser un escaneo o usar un formato distinto; por ahora se admiten PDF con texto seleccionable.", "error");
                return;
            }
            parsedRows = result.rows;
            setStep(2);
            settingsPanel.hidden = false;
            preview.hidden = false;
            syncSettings();
            renderRows();
            const state = getAppState();
            const missingTypes = [...new Set(parsedRows
                .filter(row => !(state?.categories?.[row.type] || []).some(category => category.active !== false))
                .map(row => row.type === "income" ? "ingresos" : "gastos"))];
            if (missingTypes.length) {
                setStatus(file.name + ": se leyeron " + result.rows.length + " movimiento(s), pero no hay categorías activas para " + missingTypes.join(" y ") + ". Actívalas en Configuración antes de importar.", "error");
            } else {
                setStatus(file.name + ": se leyeron " + result.rows.length + " movimiento(s). Revisa especialmente las filas marcadas “Revisar”.", "success");
            }
        } catch (error) {
            console.error("No se pudo leer el estado de cuenta:", error);
            setStatus(error?.message || "No se pudo leer el PDF. Revisa que no tenga contraseña y prueba nuevamente.", "error");
        }
    }

    function resetPreview() {
        parsedRows = [];
        previewRows.innerHTML = "";
        settingsPanel.hidden = true;
        preview.hidden = true;
        confirmButton.disabled = true;
        confirmButton.textContent = "Importar movimientos";
        footerHint.textContent = "No se guardará nada hasta que confirmes.";
    }

    function readVisibleRows() {
        return [...previewRows.querySelectorAll("tr[data-statement-row]")].map(row => ({
            clientKey: String(row.dataset.statementRow),
            include: row.querySelector(".statement-row-include")?.checked || false,
            date: row.querySelector(".statement-row-date")?.value || "",
            description: row.querySelector(".statement-row-description")?.value.trim() || "",
            amount: Number(row.querySelector(".statement-row-amount")?.value),
            type: row.querySelector(".statement-row-type")?.value || "expense",
            categoryId: row.querySelector(".statement-row-category")?.value || "",
            action: row.querySelector(".statement-row-action")?.value || "insert"
        }));
    }

    async function saveSelectedRows() {
        if (isSaving) return;
        const visibleRows = readVisibleRows();
        const selectedRows = visibleRows.filter(row => row.include);
        if (!selectedRows.length) return;
        const invalid = selectedRows.find(row => !row.date || !row.description || !Number.isFinite(row.amount) || row.amount <= 0 || !row.categoryId);
        if (invalid) {
            setStatus("Completa fecha, descripción, monto y categoría en todos los movimientos seleccionados.", "error");
            return;
        }
        if (paymentMethodInput.value === "card" && !cardInput.value) {
            setStatus("Selecciona la tarjeta de crédito relacionada con el PDF.", "error");
            return;
        }

        const state = getAppState();
        const matchedIds = new Set();
        for (const row of selectedRows) {
            if (row.action !== "update") {
                row.existingId = null;
                continue;
            }
            const match = findExistingMatch(row, state);
            if (!match?.entry || match.ambiguous) {
                setStatus(`No se encontró una coincidencia única para actualizar “${row.description}”. Cambia la acción a agregar nuevo o corrige la fila.`, "error");
                return;
            }
            const existingId = String(match.entry.id);
            if (matchedIds.has(existingId)) {
                setStatus("Dos filas intentarían actualizar el mismo registro. Deja una como movimiento nuevo o desmarca una.", "error");
                return;
            }
            matchedIds.add(existingId);
            row.existingId = existingId;
        }

        setStep(3);
        parsedRows = visibleRows.map((row, index) => ({
            ...parsedRows[index],
            date: row.date,
            description: row.description,
            amount: row.amount,
            type: row.type,
            categoryId: row.categoryId,
            action: row.action,
            include: row.include
        }));
        isSaving = true;
        confirmButton.disabled = true;
        confirmButton.textContent = "Guardando…";
        setStatus("Guardando los movimientos confirmados…");
        try {
            const result = await window.FinanzasPersonalesImport.importStatementRows(selectedRows, {
                currency: currencyInput.value,
                exchangeRate: rateInput.value,
                paymentMethod: paymentMethodInput.value,
                creditCardId: cardInput.value
            });
            const savedKeys = new Set(result.savedClientKeys || []);
            parsedRows.forEach(row => {
                if (savedKeys.has(String(row.id))) row.include = false;
            });
            renderRows();
            const failures = result.errors?.length || 0;
            const summary = `${result.updated || 0} actualizado(s), ${result.inserted || 0} nuevo(s)`;
            if (failures) {
                setStatus(`Guardado parcial: ${summary}. No se pudieron guardar registros de: ${result.errors.join(" y ")}.`, "error");
            } else {
                setStatus(`Listo: ${summary}. El archivo PDF no se conservó.`, "success");
            }
            footerHint.textContent = failures
                ? "Las filas que no se guardaron siguen seleccionadas para que puedas reintentarlas."
                : "Los registros ya están actualizados; puedes cerrar esta ventana.";
        } catch (error) {
            console.error("Error al importar los movimientos:", error);
            setStatus(error?.message || "No se pudieron guardar los movimientos.", "error");
        } finally {
            isSaving = false;
            updateImportButton();
        }
    }

    openButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    cancelButton.addEventListener("click", closeDialog);
    dialog.addEventListener("click", event => {
        if (event.target === dialog) closeDialog();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !dialog.hidden) closeDialog();
    });
    fileInput.addEventListener("change", event => handleFile(event.target.files?.[0]));
    paymentMethodInput.addEventListener("change", syncSettings);
    cardInput.addEventListener("change", updateImportButton);
    currencyInput.addEventListener("change", syncSettings);
    rateInput.addEventListener("input", updateImportButton);
    selectAll.addEventListener("change", () => {
        previewRows.querySelectorAll(".statement-row-include").forEach(box => { box.checked = selectAll.checked; });
        updateImportButton();
    });
    previewRows.addEventListener("change", event => {
        const row = event.target.closest("tr[data-statement-row]");
        if (row && event.target.matches(".statement-row-type")) {
            const category = row.querySelector(".statement-row-category");
            const oldCategory = category.value;
            category.innerHTML = categoryOptions(event.target.value, oldCategory);
        }
        updateSelectAllState();
        updateImportButton();
    });
    previewRows.addEventListener("input", updateImportButton);
    confirmButton.addEventListener("click", saveSelectedRows);
})();