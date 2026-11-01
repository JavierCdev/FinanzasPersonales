// ============================================================
// FINANZAS PERSONALES
// app.js
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://ecgshuyxokeqikpchsbf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Y9USSLp_ANtygPbJ-foiug_Pm0hqM8u";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    // ============================================================
// AUTENTICACIÓN
// ============================================================

const loginScreen =
    document.getElementById("loginScreen");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");


function showLogin() {

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

}


function hideLogin() {

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

}


function showLoginMessage(message) {

    if (loginMessage) {
        loginMessage.textContent = message;
    }

}


async function checkAuthentication() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

        showLogin();

        showLoginMessage(
            "No fue posible comprobar la sesión."
        );

        return;
    }


    if (data.session) {

        hideLogin();

        console.log(
            "Sesión activa."
        );

    } else {

        showLogin();

        console.log(
            "No hay una sesión activa."
        );

    }

}


loginForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        showLoginMessage("");


        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email || !password) {

            showLoginMessage(
                "Ingresa tu correo y contraseña."
            );

            return;
        }


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


        if (error) {

            console.error(
                "Error iniciando sesión:",
                error
            );

            showLoginMessage(
                "Correo o contraseña incorrectos."
            );

            return;
        }


        if (data.session) {

            hideLogin();

            loginForm.reset();

            showLoginMessage("");

            console.log(
                "Inicio de sesión correcto."
            );

        }

    }
);


// Detectar cambios de sesión

supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) {
        hideLogin();
        window.setTimeout(() => {
            initializeAppData().catch(error => {
                console.error("No se pudieron cargar los datos de la aplicación:", error);
            });
        }, 0);
    } else {
        showLogin();
    }
});


// Comprobar sesión al cargar

checkAuthentication();

// ============================================================
// 1. NAVEGACIÓN
// ============================================================

const menuButtons = document.querySelectorAll(".menu-item");
const pageSections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("pageTitle");

const sectionTitles = {
    dashboard: "Dashboard",
    ingresos: "Ingresos",
    gastos: "Gastos",
    cuentas: "Cuentas bancarias",
    presupuesto: "Presupuesto",
    fijos: "Gastos Fijos",
    reportes: "Reportes",
    configuracion: "Configuración"
};

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.dataset.section;

        menuButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        pageSections.forEach(item => {
            item.classList.remove("active");
        });

        const target = document.getElementById(section);

        if (target) {
            target.classList.add("active");
        }

        if (pageTitle) {
            pageTitle.textContent =
                sectionTitles[section] || "Finanzas Personales";
        }
    });

});


// ============================================================
// 2. CATEGORÍAS
// ============================================================

const defaultCategories = {

    income: [
        "Sueldo",
        "Bonificación",
        "Horas Extras",
        "Vacaciones",
        "Transferencias"
    ],

    expense: [
        "Accesorios",
        "Mantenimiento",
        "Refacción Angie",
        "Citas médicas",
        "Combustible",
        "Comida y restaurantes",
        "Cuidado Personal",
        "Visa Cuotas",
        "Entretenimiento",
        "Extra Financiamiento",
        "Hospedaje",
        "Seguro",
        "Suscripciones",
        "Útiles Escolares"
    ]

};


function createId(type) {

    return (
        type +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


let bankAccounts = [];
let accountTransfers = [];
<<<<<<< HEAD
=======
let cardPayments = [];
let cardPaymentsSchemaReady = false;
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
let accountsSchemaReady = false;
let accountsSchemaError = null;

const accountMigrationNotice = document.getElementById("accountMigrationNotice");
const accountFeatureContent = document.getElementById("accountFeatureContent");
const accountCardsContainer = document.getElementById("accountCards");
const accountUnassignedNotice = document.getElementById("accountUnassignedNotice");
const accountUnassignedDescription = document.getElementById("accountUnassignedDescription");
const accountFormPanel = document.getElementById("accountFormPanel");
const accountForm = document.getElementById("accountForm");
const accountEditId = document.getElementById("accountEditId");
const accountInstitution = document.getElementById("accountInstitution");
const accountInstitutionGroup = document.getElementById("accountInstitutionGroup");
const accountName = document.getElementById("accountName");
const accountType = document.getElementById("accountType");
const accountCurrency = document.getElementById("accountCurrency");
const accountOpeningBalance = document.getElementById("accountOpeningBalance");
const accountOpeningDate = document.getElementById("accountOpeningDate");
const accountFormTitle = document.getElementById("accountFormTitle");
const accountTransferFormPanel = document.getElementById("transferFormPanel");
const transferForm = document.getElementById("transferForm");
const transferDate = document.getElementById("transferDate");
const transferDescription = document.getElementById("transferDescription");
const transferFromAccount = document.getElementById("transferFromAccount");
const transferToAccount = document.getElementById("transferToAccount");
const transferSentAmount = document.getElementById("transferSentAmount");
const transferReceivedAmount = document.getElementById("transferReceivedAmount");
const transferSentCurrency = document.getElementById("transferSentCurrency");
const transferReceivedCurrency = document.getElementById("transferReceivedCurrency");
const transfersTable = document.getElementById("transfersTable");
<<<<<<< HEAD
=======
const cardPaymentFormPanel = document.getElementById("cardPaymentFormPanel");
const cardPaymentForm = document.getElementById("cardPaymentForm");
const cardPaymentCard = document.getElementById("cardPaymentCard");
const cardPaymentStatement = document.getElementById("cardPaymentStatement");
const cardPaymentOutstandingHint = document.getElementById("cardPaymentOutstandingHint");
const cardPaymentAccount = document.getElementById("cardPaymentAccount");
const cardPaymentDate = document.getElementById("cardPaymentDate");
const cardPaymentAmount = document.getElementById("cardPaymentAmount");
const cardPaymentCurrencyHint = document.getElementById("cardPaymentCurrencyHint");
const cardPaymentExchangeRateGroup = document.getElementById("cardPaymentExchangeRateGroup");
const cardPaymentExchangeRate = document.getElementById("cardPaymentExchangeRate");
const cardPaymentDescription = document.getElementById("cardPaymentDescription");
const cardPaymentsTable = document.getElementById("cardPaymentsTable");
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
const accountTypeLabels = { checking: "Monetaria", savings: "Ahorro", cash: "Efectivo" };

function getBankAccount(id) {
    return bankAccounts.find(account => String(account.id) === String(id)) || null;
}

function fillAccountSelect(select, selectedId = "", currency = "", includeInactive = false) {
    if (!select) return;
    const placeholder = select.dataset.placeholder || "Selecciona una cuenta";
    select.replaceChildren(new Option(placeholder, ""));
    bankAccounts.filter(account =>
        (includeInactive || account.isActive !== false) && (!currency || account.currency === currency)
    ).forEach(account => {
        select.add(new Option(
            `${account.institution ? `${account.institution} · ` : ""}${account.name} · ${account.currency}`,
            String(account.id)
        ));
    });
    if (selectedId && [...select.options].some(option => option.value === String(selectedId))) {
        select.value = String(selectedId);
    }
}

function getSingleAccountId(currency) {
    const matches = bankAccounts.filter(account => account.isActive !== false && account.currency === currency);
    return matches.length === 1 ? String(matches[0].id) : "";
}

function populateTransactionAccountSelectors() {
    const incomeSelect = document.getElementById("incomeAccountId");
    const expenseSelect = document.getElementById("expenseAccountId");
    fillAccountSelect(incomeSelect, incomeSelect?.value || "", document.getElementById("incomeCurrency")?.value || "GTQ");
    fillAccountSelect(expenseSelect, expenseSelect?.value || "", document.getElementById("expenseCurrency")?.value || "GTQ");
    const incomeGroup = document.getElementById("incomeAccountGroup");
    const expenseGroup = document.getElementById("expenseAccountGroup");
    const isCard = document.getElementById("expensePaymentMethod")?.value === "card";
    if (incomeGroup) incomeGroup.hidden = !accountsSchemaReady;
    if (expenseGroup) expenseGroup.hidden = !accountsSchemaReady || isCard;
    if (incomeSelect) incomeSelect.required = accountsSchemaReady;
    if (expenseSelect) expenseSelect.required = accountsSchemaReady && !isCard;
}

function populateTransferAccountSelectors(fromId = transferFromAccount?.value || "", toId = transferToAccount?.value || "") {
    fillAccountSelect(transferFromAccount, fromId);
    fillAccountSelect(transferToAccount, toId);
    updateTransferCurrencyHints();
}

async function initializeAccounts() {
    accountsSchemaReady = false;
    accountsSchemaError = null;
    const user = await getCurrentUser();
    if (!user) return false;
    try {
        const [{ data: accountRows, error: accountError }, { data: transferRows, error: transferError }] = await Promise.all([
            supabaseClient.from("cuentas_bancarias")
                .select("id,institution,name,account_type,currency,opening_balance,opening_date,is_active,notes,created_at,updated_at")
                .order("created_at", { ascending: true }),
            supabaseClient.from("transferencias_cuentas")
                .select("id,date,description,from_account_id,to_account_id,sent_amount,received_amount,notes,created_at,updated_at")
                .order("date", { ascending: false })
        ]);
        if (accountError) throw accountError;
        if (transferError) throw transferError;
        bankAccounts = (accountRows || []).map(row => ({
            id: String(row.id), institution: row.institution || "", name: row.name || "Cuenta",
            type: row.account_type, currency: row.currency || "GTQ",
            openingBalance: Number(row.opening_balance) || 0,
            openingDate: String(row.opening_date || getTodayISO()).slice(0, 10),
            isActive: row.is_active !== false, notes: row.notes || "",
            createdAt: row.created_at, updatedAt: row.updated_at
        }));
        accountTransfers = (transferRows || []).map(row => ({
            id: String(row.id), date: row.date, description: row.description || "Transferencia",
            fromAccountId: String(row.from_account_id), toAccountId: String(row.to_account_id),
            sentAmount: Number(row.sent_amount) || 0, receivedAmount: Number(row.received_amount) || 0,
            notes: row.notes || "", createdAt: row.created_at, updatedAt: row.updated_at
        }));
<<<<<<< HEAD
=======
        cardPayments = [];
        cardPaymentsSchemaReady = false;
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
        accountsSchemaReady = true;
        if (accountMigrationNotice) accountMigrationNotice.hidden = true;
        if (accountFeatureContent) accountFeatureContent.hidden = false;
        populateTransactionAccountSelectors();
        populateTransferAccountSelectors();
        renderAccounts();
        return true;
    } catch (error) {
        accountsSchemaError = error;
        bankAccounts = [];
        accountTransfers = [];
        console.warn("La sección de cuentas requiere su migración de Supabase:", error);
        if (accountMigrationNotice) accountMigrationNotice.hidden = false;
        if (accountFeatureContent) accountFeatureContent.hidden = true;
        populateTransactionAccountSelectors();
        return false;
    }
}

function calculateBankAccountBalance(account) {
    let balance = Number(account.openingBalance) || 0;
    const afterOpening = date => String(date || "") > String(account.openingDate || "");
    incomes.forEach(income => {
        if (String(income.accountId || "") !== String(account.id) || !afterOpening(income.date) || income.currency !== account.currency) return;
        balance += Number(income.amount) || 0;
    });
    expenses.forEach(expense => {
        if (expense.paymentMethod === "card" || String(expense.accountId || "") !== String(account.id) || !afterOpening(expense.date) || expense.currency !== account.currency) return;
        balance -= Number(expense.amount) || 0;
    });
    accountTransfers.forEach(transfer => {
        if (!afterOpening(transfer.date)) return;
        if (String(transfer.fromAccountId) === String(account.id)) balance -= Number(transfer.sentAmount) || 0;
        if (String(transfer.toAccountId) === String(account.id)) balance += Number(transfer.receivedAmount) || 0;
    });
<<<<<<< HEAD
=======
    cardPayments.forEach(payment => {
        if (
            String(payment.accountId) === String(account.id) &&
            payment.currency === account.currency &&
            afterOpening(payment.date)
        ) {
            balance -= Number(payment.amount) || 0;
        }
    });
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    return balance;
}

function renderAccounts() {
    if (!accountsSchemaReady || !accountCardsContainer) return;
    const totals = new Map();
    bankAccounts.forEach(account => totals.set(account.currency, (totals.get(account.currency) || 0) + calculateBankAccountBalance(account)));
    const totalCards = [...totals.entries()].map(([currency, amount]) => `
        <div class="account-total-card"><span>Saldo total en ${escapeHtml(currency)}</span><strong>${formatCurrency(amount, currency)}</strong></div>
    `).join("");
    const cards = bankAccounts.map(account => `
        <article class="account-card ${account.isActive ? "" : "is-archived"}">
            <div class="account-card-top"><span class="account-institution">${escapeHtml(account.institution || "Efectivo")}</span><span class="account-status ${account.isActive ? "is-active" : ""}">${account.isActive ? "Activa" : "Archivada"}</span></div>
            <h3>${escapeHtml(account.name)}</h3>
            <span class="account-type-label">${escapeHtml(accountTypeLabels[account.type] || "Cuenta")} · ${escapeHtml(account.currency)}</span>
            <strong class="account-balance">${formatCurrency(calculateBankAccountBalance(account), account.currency)}</strong>
            <small>Saldo al ${escapeHtml(formatDate(account.openingDate))} + movimientos posteriores</small>
            <div class="account-card-actions">
                <button type="button" class="secondary-button" data-account-action="edit" data-account-id="${escapeHtml(account.id)}">Editar</button>
                <button type="button" class="secondary-button" data-account-action="toggle" data-account-id="${escapeHtml(account.id)}">${account.isActive ? "Archivar" : "Reactivar"}</button>
            </div>
        </article>
    `).join("");
    accountCardsContainer.innerHTML = bankAccounts.length
        ? `${totalCards}${cards}`
        : `${totalCards}<div class="panel account-empty-state"><h2>Aún no tienes cuentas</h2><p>Agrega una cuenta bancaria, de ahorro o efectivo para empezar a separar tus saldos.</p></div>`;

    const unassigned = incomes.filter(item => !item.accountId).length + expenses.filter(item => item.paymentMethod !== "card" && !item.accountId).length;
<<<<<<< HEAD
    if (accountUnassignedNotice) accountUnassignedNotice.hidden = unassigned === 0;
    if (accountUnassignedDescription && unassigned) {
        accountUnassignedDescription.textContent = `${unassigned} movimientos históricos no tienen una cuenta vinculada. Edítalos desde Ingresos o Gastos para incluirlos en los saldos.`;
    }
=======
    if (accountUnassignedNotice) {
    accountUnassignedNotice.hidden = unassigned === 0;
}

if (accountUnassignedDescription && unassigned) {
    accountUnassignedDescription.textContent =
        `${unassigned} movimientos históricos no tienen una cuenta vinculada. ` +
        `Elige una cuenta para vincular de una vez los que usan su misma moneda, ` +
        `o edítalos uno por uno desde Ingresos o Gastos.`;
}

fillAccountSelect(
    accountAssignSelect,
    accountAssignSelect?.value || ""
);
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    renderTransfersTable();
}

function updateTransferCurrencyHints() {
    const from = getBankAccount(transferFromAccount?.value);
    const to = getBankAccount(transferToAccount?.value);
    if (transferSentCurrency) transferSentCurrency.textContent = from ? `Se descontará en ${from.currency}` : "Moneda de la cuenta de origen";
    if (transferReceivedCurrency) transferReceivedCurrency.textContent = to ? `Se acreditará en ${to.currency}` : "Moneda de la cuenta de destino";
    if (!transferReceivedAmount) return;
    const wasReadOnly = transferReceivedAmount.readOnly;
    const sameCurrency = Boolean(from && to && from.currency === to.currency);
    transferReceivedAmount.readOnly = sameCurrency;
    if (sameCurrency && transferSentAmount) transferReceivedAmount.value = transferSentAmount.value;
    else if (wasReadOnly) transferReceivedAmount.value = "";
}

function renderTransfersTable() {
    if (!transfersTable) return;
    if (!accountTransfers.length) {
        transfersTable.innerHTML = '<div class="empty-table">Todavía no has registrado transferencias.</div>';
        return;
    }
    const rows = [...accountTransfers].sort((a, b) => String(b.date).localeCompare(String(a.date))).map(transfer => {
        const from = getBankAccount(transfer.fromAccountId);
        const to = getBankAccount(transfer.toAccountId);
        if (!from || !to) return "";
        return `<tr><td>${escapeHtml(formatDate(transfer.date))}</td><td>${escapeHtml(transfer.description)}</td><td>${escapeHtml(from.institution ? `${from.institution} · ${from.name}` : from.name)}</td><td>${escapeHtml(to.institution ? `${to.institution} · ${to.name}` : to.name)}</td><td><strong>${formatCurrency(transfer.sentAmount, from.currency)}</strong><br><span class="account-transfer-arrow">↓ ${formatCurrency(transfer.receivedAmount, to.currency)}</span></td><td><button type="button" class="icon-button account-transfer-delete" data-transfer-action="delete" data-transfer-id="${escapeHtml(transfer.id)}" aria-label="Eliminar transferencia">×</button></td></tr>`;
    }).join("");
    transfersTable.innerHTML = `<div class="account-transfer-table-wrap"><table class="data-table account-transfer-table"><thead><tr><th>Fecha</th><th>Descripción</th><th>Desde</th><th>Hacia</th><th>Montos</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

<<<<<<< HEAD
=======

async function initializeCardPayments() {
    cardPayments = [];
    cardPaymentsSchemaReady = false;
    const { data, error } = await supabaseClient
        .from("pagos_tarjeta")
        .select("id,credit_card_id,account_id,statement_cutoff_date,statement_due_date,date,description,amount,currency,exchange_rate,amount_gtq,created_at")
        .order("date", { ascending: false });

    if (error) {
        console.warn("No se pudieron cargar los pagos de tarjetas. Verifica la migración 20261031_card_payments.sql.", error);
        renderCardPaymentsTable();
        return false;
    }

    cardPayments = (data || []).map(row => ({
        id: String(row.id),
        creditCardId: String(row.credit_card_id),
        accountId: String(row.account_id),
        statementCutoffDate: row.statement_cutoff_date,
        statementDueDate: row.statement_due_date,
        date: row.date,
        description: row.description || "Pago de tarjeta",
        amount: Number(row.amount) || 0,
        currency: row.currency || "GTQ",
        exchangeRate: Number(row.exchange_rate) || 1,
        amountGTQ: Number(row.amount_gtq) || 0,
        createdAt: row.created_at
    }));
    cardPaymentsSchemaReady = true;
    renderCardPaymentsTable();
    renderAccounts();
    renderDashboardCardPayments();
    return true;
}

function getCardStatementBalances(cardId) {
    const statements = new Map();

    expenses.forEach(expense => {
        if (
            expense.paymentMethod !== "card" ||
            String(expense.creditCardId || "") !== String(cardId) ||
            !expense.statementCutoffDate ||
            !expense.statementDueDate
        ) return;

        const key = `${expense.statementCutoffDate}|${expense.statementDueDate}`;
        if (!statements.has(key)) {
            statements.set(key, {
                cutoffDate: expense.statementCutoffDate,
                dueDate: expense.statementDueDate,
                totalGTQ: 0
            });
        }
        statements.get(key).totalGTQ += Number(expense.amountGTQ) || 0;
    });

    return [...statements.values()]
        .map(statement => {
            const paidGTQ = cardPayments
                .filter(payment =>
                    String(payment.creditCardId) === String(cardId) &&
                    payment.statementCutoffDate === statement.cutoffDate &&
                    payment.statementDueDate === statement.dueDate
                )
                .reduce((sum, payment) => sum + (Number(payment.amountGTQ) || 0), 0);

            return {
                ...statement,
                paidGTQ,
                outstandingGTQ: Math.max(0, statement.totalGTQ - paidGTQ)
            };
        })
        .filter(statement => statement.outstandingGTQ > 0.009)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function populateCardPaymentCardOptions(selectedId = "") {
    if (!cardPaymentCard) return;
    cardPaymentCard.replaceChildren(new Option("Selecciona una tarjeta", ""));
    creditCards
        .filter(card => card.active !== false)
        .forEach(card => {
            cardPaymentCard.add(new Option(`${card.bank} · ${card.name}`, String(card.id)));
        });
    if (selectedId && [...cardPaymentCard.options].some(option => option.value === String(selectedId))) {
        cardPaymentCard.value = String(selectedId);
    }
}

function populateCardPaymentStatementOptions(selectedKey = "") {
    if (!cardPaymentStatement) return;
    const cardId = cardPaymentCard?.value || "";
    cardPaymentStatement.replaceChildren(new Option(
        cardId ? "Selecciona el estado de cuenta" : "Primero selecciona una tarjeta",
        ""
    ));

    const statements = cardId ? getCardStatementBalances(cardId) : [];
    statements.forEach(statement => {
        const key = `${statement.cutoffDate}|${statement.dueDate}`;
        cardPaymentStatement.add(new Option(
            `Corte ${formatDate(statement.cutoffDate)} · Vence ${formatDate(statement.dueDate)} · Pendiente ${formatCurrency(statement.outstandingGTQ, "GTQ")}`,
            key
        ));
    });

    cardPaymentStatement.disabled = statements.length === 0;
    if (selectedKey && [...cardPaymentStatement.options].some(option => option.value === selectedKey)) {
        cardPaymentStatement.value = selectedKey;
    }
    updateCardPaymentHints();
}

function getSelectedCardStatement() {
    const [cutoffDate, dueDate] = (cardPaymentStatement?.value || "").split("|");
    if (!cutoffDate || !dueDate) return null;
    return getCardStatementBalances(cardPaymentCard.value)
        .find(statement => statement.cutoffDate === cutoffDate && statement.dueDate === dueDate) || null;
}

function populateCardPaymentAccountOptions(selectedId = "") {
    if (!cardPaymentAccount) return;
    fillAccountSelect(cardPaymentAccount, selectedId);
    updateCardPaymentHints();
}

function updateCardPaymentHints() {
    const account = getBankAccount(cardPaymentAccount?.value);
    const statement = getSelectedCardStatement();

    if (cardPaymentCurrencyHint) {
        cardPaymentCurrencyHint.textContent = account
            ? `El débito se registrará en ${account.currency}. El abono al estado de cuenta se calcula en GTQ.`
            : "Selecciona una cuenta para ver la moneda del débito.";
    }

    if (cardPaymentOutstandingHint) {
        cardPaymentOutstandingHint.textContent = statement
            ? `Pendiente de este estado de cuenta: ${formatCurrency(statement.outstandingGTQ, "GTQ")}.`
            : "Selecciona un estado de cuenta pendiente.";
    }

    const needsRate = Boolean(account && account.currency === "USD");
    if (cardPaymentExchangeRateGroup) cardPaymentExchangeRateGroup.hidden = !needsRate;
    if (cardPaymentExchangeRate) cardPaymentExchangeRate.required = needsRate;

    if (cardPaymentAmount) {
        if (statement && account) {
            const rate = needsRate ? Number(cardPaymentExchangeRate?.value) : 1;
            const maxAmount = rate > 0 ? statement.outstandingGTQ / rate : 0;
            cardPaymentAmount.max = String(maxAmount.toFixed(2));
        } else {
            cardPaymentAmount.removeAttribute("max");
        }
    }
}

function openCardPaymentForm() {
    if (!accountsSchemaReady) {
        alert("Primero configura tus cuentas bancarias.");
        return;
    }
    if (!cardPaymentsSchemaReady) {
        alert("Primero ejecuta la migración supabase/migrations/20261031_card_payments.sql en Supabase y recarga la aplicación.");
        return;
    }
    if (!creditCards.some(card => card.active !== false)) {
        alert("Primero registra una tarjeta de crédito activa.");
        return;
    }
    if (!bankAccounts.some(account => account.isActive !== false)) {
        alert("Primero registra una cuenta bancaria activa.");
        return;
    }

    cardPaymentForm.reset();
    cardPaymentDate.value = getTodayISO();
    refreshDatePicker("cardPaymentDate");
    cardPaymentExchangeRate.value = "1";
    populateCardPaymentCardOptions();
    populateCardPaymentAccountOptions();
    populateCardPaymentStatementOptions();
    cardPaymentFormPanel.hidden = false;
    cardPaymentFormPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCardPaymentForm() {
    if (cardPaymentFormPanel) cardPaymentFormPanel.hidden = true;
    cardPaymentForm?.reset();
    if (cardPaymentExchangeRateGroup) cardPaymentExchangeRateGroup.hidden = true;
}

function renderCardPaymentsTable() {
    if (!cardPaymentsTable) return;
    if (!cardPaymentsSchemaReady) {
        cardPaymentsTable.innerHTML = '<div class="empty-table">Ejecuta la migración 20261031_card_payments.sql para habilitar los pagos.</div>';
        return;
    }
    if (!cardPayments.length) {
        cardPaymentsTable.innerHTML = '<div class="empty-table">Todavía no has registrado pagos de tarjetas.</div>';
        return;
    }

    const rows = [...cardPayments]
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .map(payment => {
            const card = creditCards.find(item => String(item.id) === String(payment.creditCardId));
            const account = getBankAccount(payment.accountId);
            return `<tr>
                <td>${escapeHtml(formatDate(payment.date))}</td>
                <td>${escapeHtml(card ? `${card.bank} · ${card.name}` : "Tarjeta")}</td>
                <td>${escapeHtml(account ? `${account.institution ? account.institution + " · " : ""}${account.name}` : "Cuenta")}</td>
                <td>${escapeHtml(formatDate(payment.statementDueDate))}</td>
                <td>${escapeHtml(payment.description)}</td>
                <td><strong>${formatCurrency(payment.amount, payment.currency)}</strong></td>
                <td>${formatCurrency(payment.amountGTQ, "GTQ")}</td>
                <td><button type="button" class="icon-button account-transfer-delete" data-card-payment-delete="${escapeHtml(payment.id)}" aria-label="Eliminar pago">×</button></td>
            </tr>`;
        }).join("");

    cardPaymentsTable.innerHTML = `<div class="account-transfer-table-wrap">
        <table class="data-table account-transfer-table card-payments-table">
            <thead><tr><th>Fecha</th><th>Tarjeta</th><th>Cuenta utilizada</th><th>Estado de cuenta</th><th>Descripción</th><th>Débito</th><th>Abono GTQ</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

cardPaymentCard?.addEventListener("change", () => populateCardPaymentStatementOptions());
cardPaymentStatement?.addEventListener("change", updateCardPaymentHints);
cardPaymentAccount?.addEventListener("change", updateCardPaymentHints);
cardPaymentExchangeRate?.addEventListener("input", updateCardPaymentHints);

document.getElementById("newCardPaymentButton")?.addEventListener("click", openCardPaymentForm);
document.getElementById("cancelCardPaymentButton")?.addEventListener("click", closeCardPaymentForm);

cardPaymentForm?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountsSchemaReady || !cardPaymentsSchemaReady) {
        alert("La función de pagos no está disponible. Revisa la migración de Supabase.");
        return;
    }

    const card = creditCards.find(item =>
        String(item.id) === String(cardPaymentCard.value) && item.active !== false
    );
    const account = getBankAccount(cardPaymentAccount.value);
    const statement = getSelectedCardStatement();
    const amount = Number(cardPaymentAmount.value);
    const date = cardPaymentDate.value;
    const exchangeRate = account?.currency === "USD" ? Number(cardPaymentExchangeRate.value) : 1;

    if (!card) return alert("Selecciona una tarjeta activa.");
    if (!statement) return alert("Selecciona un estado de cuenta que tenga saldo pendiente.");
    if (!account || account.isActive === false) return alert("Selecciona una cuenta bancaria activa.");
    if (!date || !Number.isFinite(amount) || amount <= 0) return alert("Ingresa una fecha y un monto válido.");
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) return alert("Ingresa un tipo de cambio válido.");

    const amountGTQ = Number((amount * exchangeRate).toFixed(2));
    if (amountGTQ > statement.outstandingGTQ + 0.009) {
        return alert(`El pago supera el saldo pendiente de ${formatCurrency(statement.outstandingGTQ, "GTQ")}.`);
    }

    const user = await getCurrentUser();
    if (!user) return alert("Tu sesión ha expirado. Inicia sesión nuevamente.");

    const now = new Date().toISOString();
    const id = createId("card-payment");
    const payment = {
        id,
        creditCardId: String(card.id),
        accountId: String(account.id),
        statementCutoffDate: statement.cutoffDate,
        statementDueDate: statement.dueDate,
        date,
        description: cardPaymentDescription.value.trim() || `Pago de ${card.bank} · ${card.name}`,
        amount,
        currency: account.currency,
        exchangeRate,
        amountGTQ,
        createdAt: now
    };

    const row = {
        id,
        user_id: user.id,
        credit_card_id: payment.creditCardId,
        account_id: payment.accountId,
        statement_cutoff_date: payment.statementCutoffDate,
        statement_due_date: payment.statementDueDate,
        date: payment.date,
        description: payment.description,
        amount: payment.amount,
        currency: payment.currency,
        exchange_rate: payment.exchangeRate,
        amount_gtq: payment.amountGTQ,
        created_at: now
    };

    const saveButton = document.getElementById("saveCardPaymentButton");
    if (saveButton) saveButton.disabled = true;

    try {
        const { error } = await supabaseClient.from("pagos_tarjeta").insert(row);
        if (error) throw error;

        cardPayments.unshift(payment);
        renderCardPaymentsTable();
        renderAccounts();
        renderDashboardCardPayments();
        closeCardPaymentForm();
        alert("Pago de tarjeta registrado correctamente.");
    } catch (error) {
        console.error("No se pudo registrar el pago de tarjeta:", error);
        alert("No se pudo registrar el pago. Verifica la migración de Supabase y vuelve a intentarlo.");
    } finally {
        if (saveButton) saveButton.disabled = false;
    }
});

document.addEventListener("click", async event => {
    const deleteButton = event.target.closest("[data-card-payment-delete]");
    if (!deleteButton) return;

    const id = deleteButton.dataset.cardPaymentDelete;
    if (!confirm("¿Eliminar este pago? El saldo bancario y el pendiente del estado de cuenta se recalcularán.")) return;

    const { error } = await supabaseClient
        .from("pagos_tarjeta")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("No se pudo eliminar el pago:", error);
        alert("No se pudo eliminar el pago.");
        return;
    }

    cardPayments = cardPayments.filter(payment => String(payment.id) !== String(id));
    renderCardPaymentsTable();
    renderAccounts();
    renderDashboardCardPayments();
});

>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
function updateAccountInstitutionVisibility() {
    const isCash = accountType?.value === "cash";
    if (accountInstitutionGroup) accountInstitutionGroup.hidden = isCash;
    if (accountInstitution) accountInstitution.required = !isCash;
}

function openAccountForm(account = null) {
<<<<<<< HEAD
=======
        if (!accountsSchemaReady) {
        alert("Primero aplica la migración de cuentas en Supabase y recarga la app.");
        return;
    }
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    if (!accountFormPanel || !accountForm) return;
    accountForm.reset();
    accountEditId.value = account?.id || "";
    accountFormTitle.textContent = account ? "Editar cuenta" : "Nueva cuenta";
    accountInstitution.value = account?.institution || "";
    accountName.value = account?.name || "";
    accountType.value = account?.type || "checking";
    accountCurrency.value = account?.currency || "GTQ";
    accountOpeningBalance.value = String(account?.openingBalance ?? 0);
    accountOpeningDate.value = account?.openingDate || getTodayISO();
    updateAccountInstitutionVisibility();
    const hasActivity = account && (
        incomes.some(item => String(item.accountId || "") === String(account.id)) ||
        expenses.some(item => String(item.accountId || "") === String(account.id)) ||
        accountTransfers.some(item => String(item.fromAccountId) === String(account.id) || String(item.toAccountId) === String(account.id))
    );
    accountCurrency.disabled = Boolean(hasActivity);
    accountFormPanel.hidden = false;
    refreshDatePicker("accountOpeningDate");
    accountFormPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeAccountForm() {
    if (accountFormPanel) accountFormPanel.hidden = true;
    accountForm?.reset();
    if (accountCurrency) accountCurrency.disabled = false;
}

function openTransferForm() {
<<<<<<< HEAD
=======
        if (!accountsSchemaReady) {
        alert("Primero aplica la migración de cuentas en Supabase y recarga la app.");
        return;
    }
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    if (!bankAccounts.some(account => account.isActive !== false)) {
        alert("Primero agrega al menos una cuenta activa.");
        return;
    }
    transferForm?.reset();
    transferDate.value = getTodayISO();
    transferDescription.value = "";
    transferSentAmount.value = "";
    transferReceivedAmount.value = "";
    populateTransferAccountSelectors("", "");
    if (accountTransferFormPanel) accountTransferFormPanel.hidden = false;
    refreshDatePicker("transferDate");
    accountTransferFormPanel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeTransferForm() {
    if (accountTransferFormPanel) accountTransferFormPanel.hidden = true;
    transferForm?.reset();
    if (transferReceivedAmount) transferReceivedAmount.readOnly = false;
}

const newAccountButton = document.getElementById("newAccountButton");
const cancelAccountButton = document.getElementById("cancelAccountButton");
const newTransferButton = document.getElementById("newTransferButton");
const cancelTransferButton = document.getElementById("cancelTransferButton");
<<<<<<< HEAD
=======
const accountAssignSelect = document.getElementById("accountAssignSelect");
const assignUnassignedButton = document.getElementById("assignUnassignedButton");
async function assignUnassignedToAccount() {
    const account = getBankAccount(accountAssignSelect?.value);

    if (!account) {
        alert("Selecciona la cuenta a la que pertenecen estos movimientos.");
        return;
    }

    const pendingIncomes = incomes.filter(
        income => !income.accountId && income.currency === account.currency
    );

    const pendingExpenses = expenses.filter(
        expense =>
            expense.paymentMethod !== "card" &&
            !expense.accountId &&
            expense.currency === account.currency
    );

    const total = pendingIncomes.length + pendingExpenses.length;

    if (!total) {
        alert(`No hay movimientos sin cuenta en ${account.currency}.`);
        return;
    }

    if (!confirm(
        `Se vincularán ${total} movimiento(s) en ${account.currency} a "${account.name}".\n\n` +
        `Solo los posteriores al ${formatDate(account.openingDate)} afectarán su saldo. ¿Continuar?`
    )) {
        return;
    }

    assignUnassignedButton.disabled = true;

    try {
        for (const [table, items] of [
            ["ingresos", pendingIncomes],
            ["gastos", pendingExpenses]
        ]) {
            for (let i = 0; i < items.length; i += 100) {
                const chunk = items.slice(i, i + 100);

                const { error } = await supabaseClient
                    .from(table)
                    .update({ account_id: account.id })
                    .in("id", chunk.map(item => item.id));

                if (error) throw error;

                chunk.forEach(item => {
                    item.accountId = account.id;
                });
            }
        }

        renderAccounts();
        alert(`Se vincularon ${total} movimiento(s).`);

    } catch (error) {
        console.error("No se pudieron vincular los movimientos:", error);

        alert(
            "No se pudieron vincular todos los movimientos. Recarga la app para ver el estado real."
        );

        renderAccounts();

    } finally {
        assignUnassignedButton.disabled = false;
    }
}

assignUnassignedButton?.addEventListener(
    "click",
    assignUnassignedToAccount
);
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
newAccountButton?.addEventListener("click", () => openAccountForm());
cancelAccountButton?.addEventListener("click", closeAccountForm);
newTransferButton?.addEventListener("click", openTransferForm);
cancelTransferButton?.addEventListener("click", closeTransferForm);
accountType?.addEventListener("change", updateAccountInstitutionVisibility);
transferFromAccount?.addEventListener("change", () => {
    if (transferToAccount.value === transferFromAccount.value) transferToAccount.value = "";
    updateTransferCurrencyHints();
});
transferToAccount?.addEventListener("change", updateTransferCurrencyHints);
transferSentAmount?.addEventListener("input", updateTransferCurrencyHints);

accountForm?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountsSchemaReady) return alert("Primero aplica la migración de cuentas en Supabase y recarga la app.");
    const user = await getCurrentUser();
    if (!user) return alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
    const institution = accountInstitution.value.trim();
    const name = accountName.value.trim();
    const type = accountType.value;
    const currency = accountCurrency.value;
    const openingBalance = Number(accountOpeningBalance.value);
    const openingDate = accountOpeningDate.value;
    if (!name || !openingDate || !Number.isFinite(openingBalance)) return alert("Completa el nombre, saldo y fecha de la cuenta.");
    if (type !== "cash" && !institution) return alert("Indica el banco o institución.");
    const existing = bankAccounts.find(account => String(account.id) === String(accountEditId.value));
    const id = existing?.id || createId("account");
    const now = new Date().toISOString();
    const memory = {
        id, institution, name, type, currency, openingBalance, openingDate,
        isActive: existing?.isActive !== false, notes: existing?.notes || "",
        createdAt: existing?.createdAt || now, updatedAt: now
    };
    const database = {
        id, user_id: user.id, institution, name, account_type: type, currency,
        opening_balance: openingBalance, opening_date: openingDate,
        is_active: memory.isActive, notes: memory.notes,
        created_at: memory.createdAt, updated_at: now
    };
    try {
        const { error } = await supabaseClient.from("cuentas_bancarias").upsert(database);
        if (error) throw error;
        if (existing) bankAccounts = bankAccounts.map(account => account.id === existing.id ? memory : account);
        else bankAccounts.push(memory);
        populateTransactionAccountSelectors();
        populateTransferAccountSelectors();
        renderAccounts();
        closeAccountForm();
    } catch (error) {
        console.error("No se pudo guardar la cuenta:", error);
        alert("No se pudo guardar la cuenta. Revisa la conexión y la migración de Supabase.");
    }
});

transferForm?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountsSchemaReady) return alert("La base de datos de cuentas aún no está configurada.");
    const from = getBankAccount(transferFromAccount.value);
    const to = getBankAccount(transferToAccount.value);
    const sentAmount = Number(transferSentAmount.value);
    const receivedAmount = Number(transferReceivedAmount.value);
    const date = transferDate.value;
    if (!from || !to) return alert("Selecciona las cuentas de origen y destino.");
    if (from.id === to.id) return alert("La cuenta de origen y destino deben ser distintas.");
    if (from.isActive === false || to.isActive === false) return alert("Solo puedes transferir entre cuentas activas.");
    if (!date || !Number.isFinite(sentAmount) || sentAmount <= 0) return alert("Ingresa fecha y un monto debitado válido.");
    if (!Number.isFinite(receivedAmount) || receivedAmount <= 0) return alert("Ingresa el monto que se acreditó en la cuenta destino.");
    if (from.currency === to.currency && Math.abs(sentAmount - receivedAmount) > 0.009) return alert("Las cuentas usan la misma moneda; los montos deben coincidir.");
    const user = await getCurrentUser();
    if (!user) return alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
    const id = createId("transfer");
    const now = new Date().toISOString();
    const memory = {
        id, date, description: transferDescription.value.trim() || "Transferencia entre cuentas",
        fromAccountId: from.id, toAccountId: to.id, sentAmount, receivedAmount,
        notes: "", createdAt: now, updatedAt: now
    };
    const database = {
        id, user_id: user.id, date, description: memory.description,
        from_account_id: from.id, to_account_id: to.id,
        sent_amount: sentAmount, received_amount: receivedAmount,
        notes: memory.notes, created_at: now, updated_at: now
    };
    try {
        const { error } = await supabaseClient.from("transferencias_cuentas").insert(database);
        if (error) throw error;
        accountTransfers.unshift(memory);
        renderAccounts();
        closeTransferForm();
    } catch (error) {
        console.error("No se pudo registrar la transferencia:", error);
        alert("No se pudo registrar la transferencia. Revisa las cuentas y la migración de Supabase.");
    }
});

document.addEventListener("click", async event => {
    const accountButton = event.target.closest("[data-account-action]");
    if (accountButton) {
        const account = getBankAccount(accountButton.dataset.accountId);
        if (!account) return;
        if (accountButton.dataset.accountAction === "edit") openAccountForm(account);
        if (accountButton.dataset.accountAction === "toggle") {
            const user = await getCurrentUser();
            if (!user) return;
            const isActive = !account.isActive;
            const updatedAt = new Date().toISOString();
            const { error } = await supabaseClient.from("cuentas_bancarias")
                .update({ is_active: isActive, updated_at: updatedAt }).eq("id", account.id);
            if (error) {
                console.error("No se pudo actualizar el estado de la cuenta:", error);
                alert("No se pudo actualizar la cuenta.");
                return;
            }
            bankAccounts = bankAccounts.map(item => item.id === account.id ? { ...item, isActive, updatedAt } : item);
            populateTransactionAccountSelectors();
            populateTransferAccountSelectors();
            renderAccounts();
        }
        return;
    }
    const transferButton = event.target.closest("[data-transfer-action='delete']");
    if (!transferButton) return;
    if (!confirm("¿Eliminar esta transferencia? Los saldos de ambas cuentas se recalcularán.")) return;
    const id = transferButton.dataset.transferId;
    const { error } = await supabaseClient.from("transferencias_cuentas").delete().eq("id", id);
    if (error) {
        console.error("No se pudo eliminar la transferencia:", error);
        alert("No se pudo eliminar la transferencia.");
        return;
    }
    accountTransfers = accountTransfers.filter(transfer => transfer.id !== id);
    renderAccounts();
});
function createDefaultCategories(type) {

    return defaultCategories[type].map(name => {

        return {
            id: createId(type),
            name: name,
            active: true
        };

    });

}

let categories = {
    income: [],
    expense: []
};
let categoryLoadError = null;

// ============================================================
// SUPABASE - CATEGORÍAS
// ============================================================

async function getCurrentUser() {

    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;
    }

    return data.user || null;

}


async function initializeCategories() {

    categoryLoadError = null;
    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar categorías."
        );

        renderCategories();

        return false;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("categorias")
            .select(
                "id, type, name, active"
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        // ----------------------------------------------------
        // SUPABASE YA TIENE CATEGORÍAS
        // ----------------------------------------------------

        if (data && data.length > 0) {

                       categories = {

                income: data
                    .filter(
                        category =>
                            ["income", "ingreso"].includes(String(category.type || "").toLowerCase())
                    )
                    .map(category => ({

                        id: category.id,

                        name: category.name,

                        active:
                            category.active !== false

                    })),

                expense: data
                    .filter(
                        category =>
                            ["expense", "gasto"].includes(String(category.type || "").toLowerCase())
                    )
                    .map(category => ({

                        id: category.id,

                        name: category.name,

                        active:
                            category.active !== false

                    }))

            };

            renderCategories();

            console.log(
                "Categorías cargadas desde Supabase."
            );

            return true;
        }

        // ----------------------------------------------------
// SUPABASE ESTÁ VACÍO
// CREAR CATEGORÍAS PREDETERMINADAS
// ----------------------------------------------------

categories = {
    income:
        createDefaultCategories("income"),

    expense:
        createDefaultCategories("expense")
};


const rows = [
    ...categories.income.map(category => ({
        id:
            category.id,

        user_id:
            user.id,

        type:
            "income",

        name:
            category.name,

        active:
            category.active !== false
    })),

    ...categories.expense.map(category => ({
        id:
            category.id,

        user_id:
            user.id,

        type:
            "expense",

        name:
            category.name,

        active:
            category.active !== false
    }))
];


if (rows.length > 0) {

    const {
        error: insertError
    } = await supabaseClient
        .from("categorias")
        .insert(rows);

    if (insertError) {
        throw insertError;
    }

}


renderCategories();

console.log(
    "Categorías predeterminadas creadas en Supabase."
);

return true;

    } catch (error) {

        console.error(
            "Error cargando categorías desde Supabase:",
            error
        );

        renderCategories();
        categoryLoadError = error;
        return false;

    }

}


// ============================================================
// 3. CONFIGURACIÓN DE CATEGORÍAS
// ============================================================

const incomeCategoriesList =
    document.getElementById(
        "incomeCategoriesList"
    );


const expenseCategoriesList =
    document.getElementById(
        "expenseCategoriesList"
    );


const addIncomeCategory =
    document.getElementById(
        "addIncomeCategory"
    );


const addExpenseCategory =
    document.getElementById(
        "addExpenseCategory"
    );


const showInactive = {

    income: false,

    expense: false

};


function renderCategories() {

    renderCategoryList(
        "income",
        incomeCategoriesList
    );


    renderCategoryList(
        "expense",
        expenseCategoriesList
    );


    populateIncomeCategories();

}


function renderCategoryList(type, container) {

    if (!container) {
        return;
    }


    const list =
        Array.isArray(categories[type])
            ? categories[type]
            : [];

    
const sortedList = [...list].sort((a, b) =>
    a.name.localeCompare(b.name, "es", {
        sensitivity: "base"
    })
);
    
const active = sortedList.filter(
    category => category.active !== false
);

const inactive = sortedList.filter(
    category => category.active === false
);

    const visible =
        showInactive[type]
            ? list
            : active;


    let html = "";


    html += `
        <div class="category-list-header">

            <span>
                ${active.length} activa(s)

                ${
                    inactive.length
                        ? ` · ${inactive.length} inactiva(s)`
                        : ""
                }
            </span>

            ${
                inactive.length
                    ? `
                        <button
                            type="button"
                            class="category-filter-button"
                            data-category-filter="${type}"
                        >
                            ${
                                showInactive[type]
                                    ? "Ocultar inactivas"
                                    : `Mostrar inactivas (${inactive.length})`
                            }
                        </button>
                    `
                    : ""
            }

        </div>
    `;


    if (visible.length === 0) {

        html += `
            <div class="category-empty">
                No hay categorías.
            </div>
        `;

        container.innerHTML = html;

        return;
    }


    html += `
        <div class="category-list">
    `;


    visible.forEach(category => {

        html += `

            <div
                class="category-item ${
                    category.active === false
                        ? "inactive-category"
                        : ""
                }"
            >

                <div class="category-info">

                    <span
                        class="category-status ${
                            category.active === false
                                ? "inactive"
                                : ""
                        }"
                    ></span>

                    <span class="category-name">
                        ${escapeHtml(category.name)}
                    </span>

                </div>


                <div class="category-actions">

                    <button
                        type="button"
                        class="category-button"
                        data-category-action="edit"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="category-button"
                        data-category-action="toggle"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        ${
                            category.active === false
                                ? "Activar"
                                : "Desactivar"
                        }
                    </button>


                    <button
                        type="button"
                        class="category-button delete"
                        data-category-action="delete"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });


    html += `
        </div>
    `;


    container.innerHTML = html;

}


// ============================================================
// 4. CATEGORÍAS EN FORMULARIO DE INGRESOS
// ============================================================

function populateIncomeCategories() {

    const select =
        document.getElementById(
            "incomeCategory"
        );


    if (!select) {

        console.error(
            "No existe #incomeCategory en index.html"
        );

        return;
    }


    // Guardamos la selección actual
    const currentValue =
        select.value;


    // --------------------------------------------------------
    // IMPORTANTE:
    // Solo consideramos inactivas las que explícitamente
    // tengan active === false.
    // --------------------------------------------------------

    const activeCategories =
        categories.income.filter(
            category =>
                category.active !== false
        );


    // Limpiar selector
    select.innerHTML = "";


    // Opción inicial
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Selecciona una categoría";

    select.appendChild(
        defaultOption
    );


    // --------------------------------------------------------
    // Crear opciones
    // --------------------------------------------------------

    activeCategories.forEach(category => {

        const option =
            document.createElement("option");


        option.value =
            category.id;


        option.textContent =
            category.name;


        select.appendChild(
            option
        );

    });


    // --------------------------------------------------------
    // Mantener selección anterior
    // --------------------------------------------------------

    if (
        currentValue &&
        activeCategories.some(
            category =>
                category.id === currentValue
        )
    ) {

        select.value =
            currentValue;

    }

}

// ============================================================
// 5. AGREGAR CATEGORÍA
// ============================================================

async function addCategory(type) {

    const label =
        type === "income"
            ? "ingreso"
            : "gasto";


    const value =
        prompt(
            `Nombre de la nueva categoría de ${label}:`
        );


    if (value === null) {
        return;
    }


    const name =
        value.trim();


    if (!name) {

        alert(
            "Debes ingresar un nombre."
        );

        return;
    }


    const exists =
        categories[type].some(
            category =>
                category.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "Ya existe una categoría con ese nombre."
        );

        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        alert(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
        );

        return;
    }


    const newCategory = {

        id: createId(type),

        name: name,

        active: true

    };


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .insert({

            id: newCategory.id,

            user_id: user.id,

            type: type,

            name: newCategory.name,

            active: true

        });


    if (error) {

        console.error(
            "Error creando categoría:",
            error
        );

        alert(
            "No se pudo guardar la categoría."
        );

        return;
    }


        categories[type].push(
        newCategory
    );


    renderCategories();

}

if (addIncomeCategory) {

    addIncomeCategory.addEventListener(
        "click",
        () => addCategory("income")
    );

}


if (addExpenseCategory) {

    addExpenseCategory.addEventListener(
        "click",
        () => addCategory("expense")
    );

}


// ============================================================
// 6. EDITAR / ACTIVAR / ELIMINAR CATEGORÍA
// ============================================================

function findCategory(type, id) {

    return categories[type].find(
        category =>
            category.id === id
    );

}


async function editCategory(type, id) {

    const category =
        findCategory(type, id);


    if (!category) {
        return;
    }


    const newName =
        prompt(
            "Nuevo nombre de la categoría:",
            category.name
        );


    if (newName === null) {
        return;
    }


    const name =
        newName.trim();


    if (!name) {

        alert(
            "El nombre no puede estar vacío."
        );

        return;
    }


    const duplicate =
        categories[type].some(
            item =>
                item.id !== id &&
                item.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (duplicate) {

        alert(
            "Ya existe otra categoría con ese nombre."
        );

        return;
    }


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .update({

            name: name,

            updated_at:
                new Date().toISOString()

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error editando categoría:",
            error
        );

        alert(
            "No se pudo actualizar la categoría."
        );

        return;
    }

        category.name =
        name;

    renderCategories();

}

async function toggleCategory(type, id) {

    const category =
        findCategory(type, id);


    if (!category) {
        return;
    }


    const newActive =
        category.active === false;


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .update({

            active: newActive,

            updated_at:
                new Date().toISOString()

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error cambiando estado de categoría:",
            error
        );

        alert(
            "No se pudo cambiar el estado de la categoría."
        );

        return;
    }

        category.active =
        newActive;

    renderCategories();

}


function categoryHasTransactions(
    type,
    id
) {

    const transactions =
        type === "income"
            ? incomes
            : expenses;


    return Array.isArray(transactions)
        && transactions.some(
            transaction =>
                transaction.categoryId === id
        );

}


async function deleteCategory(type, id) {

    const category =
        findCategory(type, id);

        const user = await getCurrentUser();

if (!user) {
    alert(
        "Tu sesión ha expirado. Inicia sesión nuevamente."
    );
    return;
}


    if (!category) {
        return;
    }


    if (
        categoryHasTransactions(
            type,
            id
        )
    ) {

        const deactivate =
            confirm(
                `La categoría "${category.name}" ya tiene transacciones asociadas.\n\n` +
                `No podemos eliminarla porque perderíamos la referencia histórica.\n\n` +
                `¿Quieres desactivarla?`
            );


        if (deactivate) {

            await toggleCategory(
                type,
                id
            );

        }


        return;
    }


    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar "${category.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const {
    data: deletedRows,
    error
} = await supabaseClient
    .from("categorias")
    .delete()
    .eq(
        "id",
        id
    )
    .eq(
        "user_id",
        user.id
    )
    .select("id");


if (error) {

    console.error(
        "Error eliminando categoría:",
        error
    );

    alert(
        "No se pudo eliminar la categoría."
    );

    return;

}


console.log(
    "Categoría eliminada de Supabase:",
    deletedRows
);


if (
    !deletedRows ||
    deletedRows.length === 0
) {

    console.error(
        "DELETE ejecutado, pero Supabase no eliminó ninguna fila."
    );

    alert(
        "Supabase no eliminó la categoría. Revisa las políticas RLS de DELETE."
    );

    return;

}



        categories[type] =
        categories[type].filter(
            item =>
                item.id !== id
        );


    renderCategories();

}


document.addEventListener(
    "click",
    event => {

        const categoryButton =
            event.target.closest(
                "[data-category-action]"
            );


        if (categoryButton) {

            const action =
                categoryButton.dataset.categoryAction;


            const type =
                categoryButton.dataset.categoryType;


            const id =
                categoryButton.dataset.categoryId;


            if (action === "edit") {

                editCategory(
                    type,
                    id
                );

            }


            if (action === "toggle") {

                toggleCategory(
                    type,
                    id
                );

            }


            if (action === "delete") {

                deleteCategory(
                    type,
                    id
                );

            }


            return;
        }


        const filterButton =
            event.target.closest(
                "[data-category-filter]"
            );


        if (filterButton) {

            const type =
                filterButton.dataset.categoryFilter;


            showInactive[type] =
                !showInactive[type];


            renderCategories();

        }

    }
);


// ============================================================
// 7. INGRESOS
// ============================================================

let incomes = [];

// Selección múltiple de ingresos
const selectedIncomeIds = new Set();

// ============================================================
// SUPABASE - INGRESOS
// ============================================================

async function initializeIncomes() {

    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar ingresos."
        );

        renderIncomeTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("ingresos")
            .select(`
                id,
                date,
                description,
                category_id,
                category_name,
                currency,
                amount,
                exchange_rate,
                amount_gtq,
                exchange_rate_source,
                notes,
                created_at,
                updated_at${accountsSchemaReady ? ", account_id" : ""}
            `)
            .order(
                "date",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseIncomes =
            data || [];

        // ====================================================
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ====================================================

        incomes =
            supabaseIncomes.map(
                income => ({

                    id:
                        income.id,

                    date:
                        income.date,

                    description:
                        income.description,

                    categoryId:
                        income.category_id,

                    categoryName:
                        income.category_name,

                    currency:
                        income.currency,

                    amount:
                        Number(
                            income.amount
                        ),

                    exchangeRate:
                        Number(
                            income.exchange_rate
                        ),

                    amountGTQ:
                        Number(
                            income.amount_gtq
                        ),

                    exchangeRateSource:
                        income.exchange_rate_source ||
                        "",

                    notes:
                        income.notes ||
                        "",

                    accountId:
                        income.account_id || null,

                    createdAt:
                        income.created_at,

                    updatedAt:
                        income.updated_at

                })
            );

        renderIncomeTable();


        console.log(
            "Ingresos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando ingresos con Supabase:",
            error
        );

        renderIncomeTable();

    }

}

// Elementos

const newIncomeButton =
    document.getElementById(
        "newIncomeButton"
    );


const incomeFormPanel =
    document.getElementById(
        "incomeFormPanel"
    );


const incomeForm =
    document.getElementById(
        "incomeForm"
    );


const incomeId =
    document.getElementById(
        "incomeId"
    );


const incomeDate =
    document.getElementById(
        "incomeDate"
    );


const incomeDescription =
    document.getElementById(
        "incomeDescription"
    );


const incomeCategory =
    document.getElementById(
        "incomeCategory"
    );


const incomeCurrency =
    document.getElementById(
        "incomeCurrency"
    );


const incomeAmount =
    document.getElementById(
        "incomeAmount"
    );

const incomeAccountId = document.getElementById("incomeAccountId");


const incomeExchangeGroup =
    document.getElementById(
        "incomeExchangeGroup"
    );


const incomeExchangeRate =
    document.getElementById(
        "incomeExchangeRate"
    );


const refreshExchangeRate =
    document.getElementById(
        "refreshExchangeRate"
    );


const exchangeRateStatus =
    document.getElementById(
        "exchangeRateStatus"
    );


const incomeAmountGTQ =
    document.getElementById(
        "incomeAmountGTQ"
    );


const incomeNotes =
    document.getElementById(
        "incomeNotes"
    );


const cancelIncomeButton =
    document.getElementById(
        "cancelIncomeButton"
    );


const incomeTableContainer =
    document.getElementById(
        "incomeTableContainer"
    );


// ============================================================
// 8. ABRIR FORMULARIO
// ============================================================

function openIncomeForm(
    income = null
) {

    if (
        !incomeFormPanel ||
        !incomeForm
    ) {

        console.error(
            "No existe el formulario de ingresos."
        );

        return;
    }


    incomeFormPanel.style.display = "block";


    // Siempre reconstruimos las categorías
    // antes de mostrar el formulario.
    populateIncomeCategories();


    if (income) {

        incomeId.value =
            income.id;


        incomeDate.value =
            income.date;


        incomeDescription.value =
            income.description;


        incomeCategory.value =
            income.categoryId;


        incomeCurrency.value =
            income.currency;

<<<<<<< HEAD
=======
            populateTransactionAccountSelectors();

>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
        if (incomeAccountId) incomeAccountId.value = income.accountId || "";

        incomeAmount.value =
            income.amount;


        incomeNotes.value =
            income.notes || "";


        if (
            income.currency === "USD"
        ) {

            incomeExchangeGroup.hidden =
                false;


            incomeExchangeRate.value =
                income.exchangeRate || "";

        } else {

            incomeExchangeGroup.hidden =
                true;


            incomeExchangeRate.value =
                "";

        }


        updateIncomeConversion();


    } else {

        incomeForm.reset();


        incomeId.value =
            "";


        incomeDate.value =
            getTodayISO();


        incomeCurrency.value =
            "GTQ";

<<<<<<< HEAD
=======
            populateTransactionAccountSelectors();

>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
        if (incomeAccountId) incomeAccountId.value = getSingleAccountId("GTQ");

        incomeExchangeGroup.hidden =
            true;


        incomeExchangeRate.value =
            "";


        incomeAmountGTQ.textContent =
            "Q 0.00";


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "";

        }


        populateIncomeCategories();

    }


    populateTransactionAccountSelectors();
    refreshDatePicker("incomeDate");
    focusDatePicker("incomeDate");

}


function closeIncomeForm() {

    if (!incomeFormPanel) {
        return;
    }


    incomeFormPanel.style.display = "none";


    if (incomeForm) {
        incomeForm.reset();
    }


    if (incomeId) {
        incomeId.value = "";
    }


    if (incomeExchangeGroup) {
        incomeExchangeGroup.hidden = true;
    }


    if (incomeAmountGTQ) {

        incomeAmountGTQ.textContent =
            "Q 0.00";

    }


    if (exchangeRateStatus) {

        exchangeRateStatus.textContent =
            "";

    }

}


if (newIncomeButton) {

    newIncomeButton.addEventListener(
        "click",
        () => openIncomeForm()
    );

}


if (cancelIncomeButton) {

    cancelIncomeButton.addEventListener(
        "click",
        closeIncomeForm
    );

}


// ============================================================
// 9. MONEDA
// ============================================================

function updateIncomeCurrencyUI() {

    if (!incomeCurrency) {
        return;
    }


    const currency =
        incomeCurrency.value;


    if (
        currency === "USD"
    ) {

        incomeExchangeGroup.hidden =
            false;


        if (
            !incomeExchangeRate.value
        ) {

            fetchExchangeRate();

        }

    } else {

        incomeExchangeGroup.hidden =
            true;


        incomeExchangeRate.value =
            "";


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "";

        }

    }


    updateIncomeConversion();

}


function updateIncomeConversion() {

    if (!incomeAmountGTQ) {
        return;
    }


    const amount =
        parseFloat(
            incomeAmount?.value
        ) || 0;


    const currency =
        incomeCurrency?.value ||
        "GTQ";


    let amountGTQ = 0;


    if (
        currency === "GTQ"
    ) {

        amountGTQ =
            amount;

    } else {

        const rate =
            parseFloat(
                incomeExchangeRate?.value
            ) || 0;


        amountGTQ =
            amount * rate;

    }


    incomeAmountGTQ.textContent =
        formatCurrency(
            amountGTQ,
            "GTQ"
        );

}


if (incomeCurrency) {

    incomeCurrency.addEventListener(
        "change",
        updateIncomeCurrencyUI
    );
    incomeCurrency.addEventListener("change", populateTransactionAccountSelectors);

}


if (incomeAmount) {

    incomeAmount.addEventListener(
        "input",
        updateIncomeConversion
    );

}


if (incomeExchangeRate) {

    incomeExchangeRate.addEventListener(
        "input",
        updateIncomeConversion
    );

}


// ============================================================
// 10. TIPO DE CAMBIO
// ============================================================

async function getBanguatReferenceRate() {
    const { data, error } = await supabaseClient.functions.invoke("banguat-exchange-rate");
    if (error) throw error;

    const rate = Number(data?.rate);
    if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error("Banguat devolvió un tipo de cambio inválido.");
    }

    return {
        rate,
        date: String(data.date || ""),
        source: data.source || "Banco de Guatemala"
    };
}

async function fetchExchangeRate() {
    if (!incomeExchangeRate) return;
    if (exchangeRateStatus) exchangeRateStatus.textContent = "Consultando referencia del Banco de Guatemala…";
    if (refreshExchangeRate) refreshExchangeRate.disabled = true;

    try {
        const quote = await getBanguatReferenceRate();
        incomeExchangeRate.value = quote.rate.toFixed(5);
        if (exchangeRateStatus) {
            exchangeRateStatus.textContent = `Referencia Banguat${quote.date ? ` · ${quote.date}` : ""}.`;
        }
        updateIncomeConversion();
    } catch (error) {
        console.error("No se pudo consultar el tipo de cambio de Banguat:", error);
        if (exchangeRateStatus) {
            exchangeRateStatus.textContent = "No se pudo consultar Banguat. Ingresa la tasa manualmente o despliega la función de conexión.";
        }
    } finally {
        if (refreshExchangeRate) refreshExchangeRate.disabled = false;
    }
}
// ============================================================
// 11. GUARDAR INGRESO
// ============================================================

if (incomeForm) {

    incomeForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const date =
                incomeDate.value;

            const description =
                incomeDescription.value.trim();

            const categoryId =
                incomeCategory.value;

            const currency =
                incomeCurrency.value;

            const amount =
                parseFloat(
                    incomeAmount.value
                );

            const notes =
                incomeNotes.value.trim();
            const accountId = incomeAccountId?.value || "";


            if (!date) {

                alert(
                    "Selecciona la fecha."
                );

                return;
            }


            if (!description) {

                alert(
                    "Ingresa una descripción."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.income.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada no existe."
                );

                return;
            }

            const selectedAccount = getBankAccount(accountId);
            if (accountsSchemaReady && (!selectedAccount || selectedAccount.isActive === false || selectedAccount.currency !== currency)) {
                alert("Selecciona una cuenta activa que use la misma moneda del ingreso.");
                return;
            }

            let exchangeRate = 1;

            let amountGTQ = amount;


            if (
                currency === "USD"
            ) {

                exchangeRate =
                    parseFloat(
                        incomeExchangeRate.value
                    );


                if (
                    !exchangeRate ||
                    exchangeRate <= 0
                ) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;
                }


                amountGTQ =
                    amount *
                    exchangeRate;

            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );

                return;
            }


            const id =
                incomeId.value ||
                createId("income");


            const existingIndex =
                incomes.findIndex(
                    item =>
                        item.id === id
                );


            const now =
                new Date().toISOString();


            const existingIncome =
                existingIndex !== -1
                    ? incomes[existingIndex]
                    : null;


            const incomeData = {

                id:

                    id,

                date:

                    date,

                description:

                    description,

                categoryId:

                    category.id,

                categoryName:

                    category.name,

                currency:

                    currency,

                amount:

                    amount,

                exchangeRate:

                    exchangeRate,

                amountGTQ:

                    amountGTQ,

                exchangeRateSource:

                    currency === "USD"
                        ? "Banguat/Manual"
                        : "N/A",

                notes:

                    notes,

                accountId: accountsSchemaReady ? accountId : existingIncome?.accountId || null,

                createdAt:

                    existingIncome?.createdAt ||
                    now,

                updatedAt:

                    now

            };


            const databaseData = {

                id:

                    incomeData.id,

                user_id:

                    user.id,

                date:

                    incomeData.date,

                description:

                    incomeData.description,

                category_id:

                    incomeData.categoryId,

                category_name:

                    incomeData.categoryName,

                currency:

                    incomeData.currency,

                amount:

                    incomeData.amount,

                exchange_rate:

                    incomeData.exchangeRate,

                amount_gtq:

                    incomeData.amountGTQ,

                exchange_rate_source:

                    incomeData.exchangeRateSource,

                notes:

                    incomeData.notes,

                ...(accountsSchemaReady ? { account_id: incomeData.accountId } : {}),

                updated_at:

                    incomeData.updatedAt

            };


            let error;


            if (existingIndex !== -1) {

                const result =
                    await supabaseClient
                        .from("ingresos")
                        .update(databaseData)
                        .eq(
                            "id",
                            id
                        );

                error =
                    result.error;

            } else {

                databaseData.created_at =
                    incomeData.createdAt;

                const result =
                    await supabaseClient
                        .from("ingresos")
                        .insert(
                            databaseData
                        );

                error =
                    result.error;

            }


            if (error) {

                console.error(
                    "Error guardando ingreso en Supabase:",
                    error
                );

                alert(
                    "No se pudo guardar el ingreso."
                );

                return;
            }


            if (existingIndex !== -1) {

                incomes[existingIndex] =
                    incomeData;

            } else {

                incomes.push(
                    incomeData
                );

            }

            renderIncomeTable();
            renderAccounts();
            updateDashboard();
            closeIncomeForm();


            alert(
                existingIndex !== -1
                    ? "Ingreso actualizado correctamente."
                    : "Ingreso guardado correctamente."
            );

        }
    );

}

// ============================================================
// 12. TABLA DE INGRESOS
// ============================================================

function renderIncomeTable() {

    if (!incomeTableContainer) {
        return;
    }


   const selectedMonth = String(
    dashboardMonth?.value ||
    new Date().getMonth() + 1
).padStart(2, "0");

const selectedYear =
    dashboardYear?.value ||
    String(new Date().getFullYear());

const monthlyIncomes = incomes.filter(income => {
    if (!income.date) return false;

    const [incomeYear, incomeMonth] =
        income.date.split("-");

    return (
        incomeYear === selectedYear &&
        incomeMonth === selectedMonth
    );
});

keepOnlyVisibleSelection(
    selectedIncomeIds,
    monthlyIncomes.map(income => income.id)
);

if (monthlyIncomes.length === 0) {
    incomeTableContainer.innerHTML = `
        <div class="empty-table">
            No hay ingresos registrados en el mes seleccionado.
        </div>
    `;
    return;
}

const sorted =
    [...monthlyIncomes].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    let html = `
    <div class="income-bulk-actions">
    <label class="bulk-select-all-mobile">
    <input
        type="checkbox"
        id="selectAllIncomesMobile"
        aria-label="Seleccionar todos los ingresos">
    Todos
</label>
        <span id="selectedIncomeCount">
            ${selectedIncomeIds.size} seleccionados
        </span>

        <button
            type="button"
            id="deleteSelectedIncomes"
            class="table-action-button delete"
            ${selectedIncomeIds.size === 0 ? "disabled" : ""}
        >
            Eliminar seleccionados
        </button>
    </div>

        <table class="data-table">

            <thead>

                <tr>

                    <th>
    <label>
        <input
            type="checkbox"
            id="selectAllIncomes"
            aria-label="Seleccionar todos los ingresos visibles"
        >
        Fecha
    </label>
</th>

                    <th>Descripción</th>

                    <th>Categoría</th>

                    <th>Moneda</th>

                    <th>Monto</th>

                    <th>Equivalente GTQ</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

    `;


    sorted.forEach(income => {

        const category =
            categories.income.find(
                item =>
                    item.id ===
                    income.categoryId
            );


        const categoryName =
            category?.name ||
            income.categoryName ||
            "Categoría eliminada";


                html += `
            <tr class="income-main-row">
                <td>
    <label>
        <input
            type="checkbox"
            class="income-select-checkbox"
            data-income-select-id="${income.id}"
            aria-label="Seleccionar ingreso"
            ${selectedIncomeIds.has(income.id) ? "checked" : ""}
        >
        ${formatDate(income.date)}
    </label>
</td>
                <td>${escapeHtml(income.description || "")}</td>
                <td>${escapeHtml(categoryName)}</td>
                <td>${escapeHtml(income.currency || "GTQ")}</td>
                <td class="income-amount">
                    ${formatCurrency(income.amount, income.currency)}
                </td>
                <td class="income-amount">
                    ${formatCurrency(income.amountGTQ, "GTQ")}
                </td>
                <td>
                    <div class="table-actions">
                        <button
                            type="button"
                            class="table-action-button"
                            data-income-action="edit"
                            data-income-id="${income.id}">
                            Editar
                        </button>
                        <button
                            type="button"
                            class="table-action-button delete"
                            data-income-action="delete"
                            data-income-id="${income.id}">
                            Eliminar
                        </button>
                    </div>
                </td>

                <td class="income-mobile-summary-cell" colspan="7">
    <input
        type="checkbox"
        class="income-select-checkbox income-mobile-select-checkbox"
        data-income-select-id="${income.id}"
        aria-label="Seleccionar ingreso"
        ${selectedIncomeIds.has(income.id) ? "checked" : ""}>

    <button
        type="button"
        class="income-mobile-toggle"

                    <button
                        type="button"
                        class="income-mobile-toggle"
                        data-income-toggle="${income.id}"
                        aria-expanded="false">
                        <span class="income-mobile-date">
                            ${formatDate(income.date)}
                        </span>
                        <span class="income-mobile-description">
                            ${escapeHtml(income.description || "Sin descripción")}
                        </span>
                        <span class="income-mobile-category">
                            ${escapeHtml(categoryName)}
                        </span>
                        <span class="income-mobile-chevron" aria-hidden="true">⌄</span>
                    </button>
                </td>
            </tr>

            <tr
                class="income-details-row"
                data-income-details="${income.id}"
                hidden>
                <td colspan="7">
                    <div class="income-details-panel">
                        ${
                            income.description
                                ? `
                                    <div class="income-detail-item full income-detail-description">
                                        <span>Descripción completa</span>
                                        <strong>${escapeHtml(income.description)}</strong>
                                    </div>
                                `
                                : ""
                        }

                        <div class="income-detail-group">
                            <div class="income-detail-item">
                                <span>Moneda y monto</span>
                                <strong>
                                    ${formatCurrency(income.amount, income.currency)}
                                </strong>
                            </div>

                            <div class="income-detail-item">
                                <span>Equivalente en GTQ</span>
                                <strong>
                                    ${formatCurrency(income.amountGTQ, "GTQ")}
                                </strong>
                            </div>
                        </div>

                        ${
                            income.notes
                                ? `
                                    <div class="income-detail-item full income-detail-notes">
                                        <span>Notas</span>
                                        <strong>${escapeHtml(income.notes)}</strong>
                                    </div>
                                `
                                : ""
                        }

                        <div class="income-details-actions">
                            <button
                                type="button"
                                class="table-action-button"
                                data-income-action="edit"
                                data-income-id="${income.id}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="table-action-button delete"
                                data-income-action="delete"
                                data-income-id="${income.id}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `;

    });


    html += `

            </tbody>

        </table>

    `;


    incomeTableContainer.innerHTML =
        html;

}

incomeTableContainer?.addEventListener("click", event => {
    const toggle = event.target.closest("[data-income-toggle]");

    if (!toggle || !incomeTableContainer.contains(toggle)) {
        return;
    }

    const incomeId = toggle.dataset.incomeToggle;

    const detailRows = [
        ...incomeTableContainer.querySelectorAll(".income-details-row")
    ];

    const selectedDetails = detailRows.find(
        row => row.dataset.incomeDetails === incomeId
    );

    if (!selectedDetails) return;

    const shouldOpen = selectedDetails.hidden;

    detailRows.forEach(row => {
        row.hidden = true;
    });

    incomeTableContainer
        .querySelectorAll("[data-income-toggle]")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
        });

    if (shouldOpen) {
        selectedDetails.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    }
});

// Selección individual y selección de todos los ingresos
bindBulkSelection({
    container: incomeTableContainer,
    checkboxSelector: ".income-select-checkbox",
    selectAllId: "selectAllIncomes",
    idKey: "incomeSelectId",
    selectedIds: selectedIncomeIds,
    counterId: "selectedIncomeCount",
    deleteButtonId: "deleteSelectedIncomes"
});

// ============================================================
// ELIMINACIÓN MÚLTIPLE DE INGRESOS
// ============================================================

document.addEventListener("click", async event => {
    const button = event.target.closest("#deleteSelectedIncomes");

    if (!button) return;

        const ids = getVisibleSelectedIds(
        incomeTableContainer,
        ".income-select-checkbox",
        "incomeSelectId",
        selectedIncomeIds
    );

    if (ids.length === 0) {
        alert("Selecciona al menos un ingreso.");
        return;
    }

        const confirmed = confirm(
        `¿Seguro que quieres eliminar ${ids.length} ingreso(s) de ${getSelectedPeriodLabel()}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    button.disabled = true;

    const { data, error } = await supabaseClient
        .from("ingresos")
        .delete()
        .in("id", ids)
        .select("id");

    if (error) {
        console.error("Error eliminando ingresos:", error);
        alert("No se pudieron eliminar los ingresos seleccionados.");
        button.disabled = false;
        return;
    }

    const deletedIds = new Set((data || []).map(item => item.id));

    if (deletedIds.size === 0) {
        alert("Supabase no eliminó ningún ingreso. Revisa los permisos de DELETE.");
        button.disabled = false;
        return;
    }

    incomes = incomes.filter(income => !deletedIds.has(income.id));

    deletedIds.forEach(id => selectedIncomeIds.delete(id));

    renderIncomeTable();
    renderAccounts();
    updateDashboard();

    alert(`Se eliminaron ${deletedIds.size} ingreso(s).`);
});

// ============================================================
// 13. EDITAR / ELIMINAR INGRESOS
// ============================================================

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-income-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.incomeAction;


        const id =
            button.dataset.incomeId;


        const income =
            incomes.find(
                item =>
                    item.id === id
            );


        if (!income) {
            return;
        }


        if (
            action === "edit"
        ) {

            openIncomeForm(
                income
            );

            return;
        }


        if (
    action === "delete"
) {

    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar el ingreso "${income.description}"?`
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("ingresos")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error eliminando ingreso:",
            error
        );

        alert(
            "No se pudo eliminar el ingreso."
        );

        return;
    }


    incomes =
        incomes.filter(
            item =>
                item.id !== id
        );

    renderIncomeTable();
    renderAccounts();
    updateDashboard();

}

    }
);

// ============================================================
// 13. PRESUPUESTOS
// ============================================================
let budgets = [];

const selectedBudgetIds = new Set();

// ------------------------------------------------------------
// ELEMENTOS DEL FORMULARIO
// ------------------------------------------------------------

const newBudgetButton =
    document.getElementById("newBudgetButton");

const budgetFormPanel =
    document.getElementById("budgetFormPanel");

const budgetForm =
    document.getElementById("budgetForm");

const budgetFormTitle =
    document.getElementById("budgetFormTitle");

const budgetId =
    document.getElementById("budgetId");

const budgetMonth =
    document.getElementById("budgetMonth");

const budgetMonthSelect =
    document.getElementById("budgetMonthSelect");

const budgetYearSelect =
    document.getElementById("budgetYearSelect");

const budgetCategory =
    document.getElementById("budgetCategory");

const budgetAmount =
    document.getElementById("budgetAmount");

const cancelBudgetButton =
    document.getElementById("cancelBudgetButton");

const budgetTableContainer =
    document.getElementById("budgetTableContainer");

function updateBudgetMonthFromPeriods() {
    if (!budgetMonth || !budgetMonthSelect?.value || !budgetYearSelect?.value) return;
    budgetMonth.value = `${budgetYearSelect.value}-${budgetMonthSelect.value}`;
}

function syncBudgetPeriodsFromMonth() {
    if (!budgetMonth?.value || !budgetMonthSelect || !budgetYearSelect) return;
    const [year, month] = budgetMonth.value.split("-");
    if (!year || !month) return;

    if (![...budgetYearSelect.options].some(option => option.value === year)) {
        const yearOption = document.createElement("option");
        yearOption.value = year;
        yearOption.textContent = year;
        budgetYearSelect.appendChild(yearOption);
        const sortedYears = [...budgetYearSelect.options]
            .sort((a, b) => Number(b.value) - Number(a.value));
        budgetYearSelect.replaceChildren(...sortedYears);
    }

    budgetYearSelect.value = year;
    budgetMonthSelect.value = month;
    budgetYearSelect.dispatchEvent(new Event("change", { bubbles: true }));
    budgetMonthSelect.dispatchEvent(new Event("change", { bubbles: true }));
}

budgetMonthSelect?.addEventListener("change", updateBudgetMonthFromPeriods);
budgetYearSelect?.addEventListener("change", updateBudgetMonthFromPeriods);

function populateBudgetYearOptions() {
    if (!budgetYearSelect) return;

    const currentYear = new Date().getFullYear();
    const selectedYear = budgetYearSelect.value || String(currentYear);
    const years = new Set();

    for (let year = currentYear + 10; year >= currentYear - 30; year--) {
        years.add(year);
    }
    (Array.isArray(budgets) ? budgets : []).forEach(budget => {
        const year = Number(String(budget.month || "").slice(0, 4));
        if (Number.isInteger(year) && year > 0) years.add(year);
    });

    budgetYearSelect.replaceChildren(...[...years]
        .sort((a, b) => b - a)
        .map(year => {
            const option = document.createElement("option");
            option.value = String(year);
            option.textContent = String(year);
            return option;
        }));

    budgetYearSelect.value = years.has(Number(selectedYear))
        ? selectedYear
        : String(currentYear);
}


// ------------------------------------------------------------
// GUARDAR PRESUPUESTOS
// ------------------------------------------------------------

// ============================================================
// SUPABASE - PRESUPUESTOS
// ============================================================

async function initializeBudgets() {

    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar presupuestos."
        );

        renderBudgetTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("presupuestos")
            .select(`
                id,
                month,
                category_id,
                category_name,
                amount,
                created_at,
                updated_at
            `)
            .order(
                "month",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseBudgets =
            data || [];

        // ----------------------------------------------------
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ----------------------------------------------------

        budgets =
            supabaseBudgets.map(
                budget => ({

                    id:
                        budget.id,

                    month:
                        String(
                            budget.month
                        ).substring(
                            0,
                            7
                        ),

                    categoryId:
                        budget.category_id,

                    categoryName:
                        budget.category_name,

                    amount:
                        Number(
                            budget.amount
                        ),

                    createdAt:
                        budget.created_at,

                    updatedAt:
                        budget.updated_at

                })
            );

        renderBudgetTable();


        console.log(
            "Presupuestos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando presupuestos con Supabase:",
            error
        );

        renderBudgetTable();

    }

}

// ------------------------------------------------------------
// POPULAR CATEGORÍAS
// ------------------------------------------------------------

function populateBudgetCategories() {

    if (!budgetCategory) {
        return;
    }


    const currentValue =
        budgetCategory.value;


    budgetCategory.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;


    const expenseCategories =
        Array.isArray(categories.expense)
            ? categories.expense
            : [];


    expenseCategories
        .filter(category => category.active !== false)
        .forEach(category => {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            budgetCategory.appendChild(option);

        });


    if (currentValue) {

        const exists =
            [...budgetCategory.options]
                .some(
                    option =>
                        option.value === currentValue
                );

        if (exists) {
            budgetCategory.value =
                currentValue;
        }

    }

}


// ------------------------------------------------------------
// ABRIR FORMULARIO
// ------------------------------------------------------------

function closeBudgetPickerMenus() {
    budgetFormPanel?.querySelectorAll(".period-trigger[aria-expanded='true']")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
            const listbox = document.getElementById(button.getAttribute("aria-controls"));
            if (!listbox) return;
            listbox.hidden = true;
            listbox.classList.remove("has-custom-scrollbar");
            const track = listbox.parentElement?.querySelector(".period-scrollbar");
            if (track) track.hidden = true;
        });
}

function openBudgetForm(budget = null) {

    if (!budgetFormPanel || !budgetForm) {
        return;
    }

    closeBudgetPickerMenus();
    populateBudgetCategories();
    populateBudgetYearOptions();
    initializePeriodPicker(
        "budgetMonthSelect",
        "budgetMonthPickerButton",
        "budgetMonthPickerValue",
        "budgetMonthPickerOptions"
    );
    initializePeriodPicker(
        "budgetYearSelect",
        "budgetYearPickerButton",
        "budgetYearPickerValue",
        "budgetYearPickerOptions"
    );
    initializePeriodPicker(
        "budgetCategory",
        "budgetCategoryPickerButton",
        "budgetCategoryPickerValue",
        "budgetCategoryPickerOptions"
    );

    budgetFormPanel.hidden = false;


    if (budget) {

        budgetFormTitle.textContent =
            "Editar presupuesto";

        budgetId.value =
            budget.id;

        budgetMonth.value =
            budget.month;

        budgetCategory.value =
            budget.categoryId;

        budgetAmount.value =
            budget.amount;

    } else {

        budgetFormTitle.textContent =
            "Nuevo presupuesto";

        budgetId.value =
            "";

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        budgetMonth.value =
            `${year}-${month}`;

        budgetCategory.value =
            "";

        budgetAmount.value =
            "";

    }

    syncBudgetPeriodsFromMonth();
    budgetCategory.dispatchEvent(new Event("change", { bubbles: true }));
    // Actualiza el menú si se añadió un año histórico para editar un presupuesto.
    initializePeriodPicker(
        "budgetYearSelect",
        "budgetYearPickerButton",
        "budgetYearPickerValue",
        "budgetYearPickerOptions"
    );

}


// ------------------------------------------------------------
// CERRAR FORMULARIO
// ------------------------------------------------------------

function closeBudgetForm() {

    if (!budgetFormPanel) {
        return;
    }

    closeBudgetPickerMenus();
    budgetFormPanel.hidden = true;


    if (budgetForm) {
        budgetForm.reset();
    }


    if (budgetId) {
        budgetId.value = "";
    }

}


// ------------------------------------------------------------
// BOTÓN NUEVO
// ------------------------------------------------------------

if (newBudgetButton) {

    newBudgetButton.addEventListener(
        "click",
        () => openBudgetForm()
    );

}


// ------------------------------------------------------------
// BOTÓN CANCELAR
// ------------------------------------------------------------

if (cancelBudgetButton) {

    cancelBudgetButton.addEventListener(
        "click",
        closeBudgetForm
    );

}


// ------------------------------------------------------------
// GUARDAR PRESUPUESTO
// ------------------------------------------------------------

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const month =
                budgetMonth.value;

            const categoryId =
                budgetCategory.value;

            const amount =
                parseFloat(
                    budgetAmount.value
                );


            if (!month) {

                alert(
                    "Selecciona el mes del presupuesto."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.expense.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada ya no existe."
                );

                return;
            }


            const existingId =
                budgetId.value;


            // ------------------------------------------------
            // EVITAR DUPLICADOS
            // ------------------------------------------------

            const duplicate =
                budgets.find(
                    item =>
                        item.month === month &&
                        item.categoryId === categoryId &&
                        item.id !== existingId
                );


            if (duplicate) {

                const confirmed =
                    confirm(
                        `Ya existe un presupuesto para "${category.name}" en ${formatBudgetMonth(month)}.\n\n` +
                        `¿Quieres actualizarlo con el nuevo monto?`
                    );


                if (!confirmed) {
                    return;
                }


                const user =
                    await getCurrentUser();


                if (!user) {

                    alert(
                        "No hay un usuario autenticado."
                    );

                    return;
                }


                try {

                    const {
                        data,
                        error
                    } = await supabaseClient
                        .from("presupuestos")
                        .update({

                            category_name:
                                category.name,

                            amount:
                                amount,

                            updated_at:
                                new Date().toISOString()

                        })
                        .eq(
                            "id",
                            duplicate.id
                        )
                        .select()
                        .single();


                    if (error) {
                        throw error;
                    }


                    duplicate.amount =
                        Number(
                            data.amount
                        );

                    duplicate.categoryName =
                        data.category_name;

                    duplicate.amount =
                        Number(
                        data.amount
                                  );

                    duplicate.categoryName =
                        data.category_name;

                    duplicate.updatedAt =
                        data.updated_at;


                    renderBudgetTable();

                    closeBudgetForm();


                    alert(
                        "Presupuesto actualizado correctamente."
                    );


                } catch (error) {

                    console.error(
                        "Error actualizando presupuesto en Supabase:",
                        error
                    );


                    alert(
                        "No se pudo actualizar el presupuesto en Supabase."
                    );

                }


                return;
            }


            const now =
                new Date().toISOString();


            const existingBudget =
                budgets.find(
                    item =>
                        item.id === existingId
                );


            const id =
                existingId ||
                `budget-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`;


            const budgetData = {

                id:
                    id,

                month:
                    month,

                categoryId:
                    categoryId,

                categoryName:
                    category.name,

                amount:
                    amount,

                createdAt:
                    existingBudget?.createdAt ||
                    now,

                updatedAt:
                    now

            };


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const supabaseData = {

                    id:
                        budgetData.id,

                    user_id:
                        user.id,

                    month:
                        `${budgetData.month}-01`,

                    category_id:
                        budgetData.categoryId,

                    category_name:
                        budgetData.categoryName,

                    amount:
                        budgetData.amount,

                    created_at:
                        budgetData.createdAt,

                    updated_at:
                        budgetData.updatedAt

                };


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("presupuestos")
                    .upsert(
                        supabaseData
                    )
                    .select()
                    .single();


                if (error) {
                    throw error;
                }


                const savedBudget = {

                    id:
                        data.id,

                    month:
                        String(
                            data.month
                        ).substring(
                            0,
                            7
                        ),

                    categoryId:
                        data.category_id,

                    categoryName:
                        data.category_name,

                    amount:
                        Number(
                            data.amount
                        ),

                    createdAt:
                        data.created_at,

                    updatedAt:
                        data.updated_at

                };


                const index =
                    budgets.findIndex(
                        item =>
                            item.id === id
                    );


                if (index !== -1) {

    budgets[index] =
        savedBudget;

} else {

    budgets.push(
        savedBudget
    );

}

renderBudgetTable();

updateDashboard();

closeBudgetForm();


                alert(
                    existingId
                        ? "Presupuesto actualizado correctamente."
                        : "Presupuesto guardado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error guardando presupuesto en Supabase:",
                    error
                );


                alert(
                    "No se pudo guardar el presupuesto en Supabase."
                );

            }

        }
    );

}

// ------------------------------------------------------------
// CALCULAR GASTADO
// ------------------------------------------------------------

function getSpentForBudget(
    month,
    categoryId
) {

    const expensesList =
    Array.isArray(expenses)
        ? expenses
        : [];


        return expensesList.reduce(
        (total, expense) => {

            if (
                expense.categoryId !==
                categoryId
            ) {
                return total;
            }


            if (
                !expense.date ||
                !expense.date.startsWith(month)
            ) {
                return total;
            }


            const amountGTQ =
                parseFloat(
                    expense.amountGTQ
                );


            if (
                !Number.isFinite(
                    amountGTQ
                )
            ) {
                return total;
            }


            return total + amountGTQ;

        },
        0
    );

}

// ------------------------------------------------------------
// FORMATEAR MES
// ------------------------------------------------------------

function formatBudgetMonth(month) {

    if (!month) {
        return "";
    }


    const [
        year,
        monthNumber
    ] =
        month.split("-");


    const date =
        new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );


    return date.toLocaleDateString(
        "es-GT",
        {
            month: "long",
            year: "numeric"
        }
    );

}


// ------------------------------------------------------------
// RENDERIZAR TABLA
// ------------------------------------------------------------

function renderBudgetTable() {

    if (!budgetTableContainer) {
        return;
    }


    if (budgets.length === 0) {

        budgetTableContainer.innerHTML = `
            <div class="empty-table">
                Todavía no tienes presupuestos registrados.
            </div>
        `;

        return;

    }


    const sortedBudgets =
        [...budgets].sort(
            (a, b) =>
                b.month.localeCompare(
                    a.month
                )
        );


    let html = `
    <div class="budget-bulk-actions">
<label class="bulk-select-all-mobile">
    <input
        type="checkbox"
        id="selectAllBudgetsMobile"
        aria-label="Seleccionar todos los presupuestos">
    Todos
</label>
        <span id="selectedBudgetCount">
            ${selectedBudgetIds.size} seleccionados
        </span>

        <button
            type="button"
            id="deleteSelectedBudgets"
            class="table-action-button delete"
            ${selectedBudgetIds.size === 0 ? "disabled" : ""}>
            Eliminar seleccionados
        </button>
    </div>

    <table class="data-table compact-table">

        <thead>

            <tr>

                <th>
                    <input
                        type="checkbox"
                        id="selectAllBudgets"
                        aria-label="Seleccionar todos los presupuestos">
                    Mes
                </th>

                <th>Categoría</th>

                <th>Presupuesto</th>

                <th>Gastado</th>

                <th>Disponible</th>

                <th>Progreso</th>

                <th>Acciones</th>

            </tr>

        </thead>

        <tbody>
    `;


    sortedBudgets.forEach(
        budget => {

            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        budget.categoryId
                );


            const categoryName =
                category?.name ||
                budget.categoryName ||
                "Categoría eliminada";


            const amountValue =
                parseFloat(
                    budget.amount
                ) || 0;


            const spent =
                getSpentForBudget(
                    budget.month,
                    budget.categoryId
                );


            const remaining =
                amountValue -
                spent;


            const percentage =
                amountValue > 0
                    ? (spent / amountValue) * 100
                    : 0;


            const progressWidth =
                Math.min(
                    percentage,
                    100
                );


            let progressClass =
                "normal";


            if (percentage >= 100) {

                progressClass =
                    "danger";

            } else if (
                percentage >= 80
            ) {

                progressClass =
                    "warning";

            }


            let remainingClass =
                "positive";


            if (remaining < 0) {

                remainingClass =
                    "negative";

            } else if (
                percentage >= 80
            ) {

                remainingClass =
                    "warning";

            }


            const monthLabel =
                formatBudgetMonth(budget.month);

            const isSelected =
                selectedBudgetIds.has(String(budget.id));

            const progressHtml = `
                <div class="budget-progress">
                    <div class="budget-progress-bar">
                        <div
                            class="budget-progress-fill ${progressClass}"
                            style="width: ${progressWidth}%"></div>
                    </div>
                    <div class="budget-percentage">
                        ${percentage.toFixed(1)}%
                    </div>
                </div>
            `;


            html += `

                <tr class="compact-main-row">

                    <td class="budget-month">
                        <input
                            type="checkbox"
                            class="budget-select-checkbox"
                            data-budget-select-id="${budget.id}"
                            aria-label="Seleccionar presupuesto"
                            ${isSelected ? "checked" : ""}>

                        ${monthLabel}
                    </td>

                    <td>${escapeHtml(categoryName)}</td>

                    <td>${formatCurrency(amountValue, "GTQ")}</td>

                    <td>${formatCurrency(spent, "GTQ")}</td>

                    <td>
                        <span class="budget-remaining ${remainingClass}">
                            ${formatCurrency(remaining, "GTQ")}
                        </span>
                    </td>

                    <td>${progressHtml}</td>

                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="table-action-button"
                                data-budget-action="edit"
                                data-budget-id="${budget.id}">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="table-action-button delete"
                                data-budget-action="delete"
                                data-budget-id="${budget.id}">
                                Eliminar
                            </button>
                        </div>
                    </td>

                    <td class="compact-summary-cell" colspan="7">
                        <input
                            type="checkbox"
                            class="budget-select-checkbox compact-select-checkbox"
                            data-budget-select-id="${budget.id}"
                            aria-label="Seleccionar presupuesto"
                            ${isSelected ? "checked" : ""}>

                        <button
                            type="button"
                            class="compact-toggle"
                            data-budget-toggle="${budget.id}"
                            aria-expanded="false">
                            <span class="compact-lead">${monthLabel}</span>
                            <span class="compact-title">${escapeHtml(categoryName)}</span>
                            <span class="compact-badge ${progressClass}">
                                ${percentage.toFixed(1)}%
                            </span>
                            <span class="compact-chevron" aria-hidden="true">⌄</span>
                        </button>
                    </td>

                </tr>

                <tr
                    class="compact-details-row"
                    data-budget-details="${budget.id}"
                    hidden>
                    <td colspan="7">
                        <div class="compact-details-panel">

                            <div class="compact-detail-group">
                                <div class="compact-detail-item">
                                    <span>Presupuesto</span>
                                    <strong>${formatCurrency(amountValue, "GTQ")}</strong>
                                </div>

                                <div class="compact-detail-item">
                                    <span>Gastado</span>
                                    <strong>${formatCurrency(spent, "GTQ")}</strong>
                                </div>
                            </div>

                            <div class="compact-detail-item compact-detail-box">
                                <span>Disponible</span>
                                <strong class="budget-remaining ${remainingClass}">
                                    ${formatCurrency(remaining, "GTQ")}
                                </strong>
                            </div>

                            <div class="compact-detail-item">
                                <span>Progreso</span>
                                ${progressHtml}
                            </div>

                            <div class="compact-details-actions">
                                <button
                                    type="button"
                                    class="table-action-button"
                                    data-budget-action="edit"
                                    data-budget-id="${budget.id}">
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="table-action-button delete"
                                    data-budget-action="delete"
                                    data-budget-id="${budget.id}">
                                    Eliminar
                                </button>
                            </div>

                        </div>
                    </td>
                </tr>

            `;

        }
    );


    html += `

        </tbody>

    </table>

    `;


    budgetTableContainer.innerHTML =
        html;

}

bindBulkSelection({
    container: budgetTableContainer,
    checkboxSelector: ".budget-select-checkbox",
    selectAllId: "selectAllBudgets",
    idKey: "budgetSelectId",
    selectedIds: selectedBudgetIds,
    counterId: "selectedBudgetCount",
    deleteButtonId: "deleteSelectedBudgets"
});

bindAccordion({
    container: budgetTableContainer,
    toggleAttr: "data-budget-toggle",
    detailsAttr: "data-budget-details"
});

// ------------------------------------------------------------
// EDITAR / ELIMINAR
// ------------------------------------------------------------

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-budget-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.budgetAction;

        const id =
            button.dataset.budgetId;


        const budget =
            budgets.find(
                item =>
                    item.id === id
            );


        if (!budget) {
            return;
        }


        // ------------------------------------------------
        // EDITAR
        // ------------------------------------------------

        if (
            action === "edit"
        ) {

            openBudgetForm(
                budget
            );

            return;
        }

        // ------------------------------------------------
        // ELIMINAR
        // ------------------------------------------------

        if (
            action === "delete"
        ) {

            const confirmed =
                confirm(
                    `¿Seguro que quieres eliminar el presupuesto de "${budget.categoryName}" para ${formatBudgetMonth(budget.month)}?`
                );


            if (!confirmed) {
                return;
            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const {
                    error
                } = await supabaseClient
                    .from("presupuestos")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


                if (error) {
                    throw error;
                }


                budgets =
    budgets.filter(
        item =>
            item.id !== id
    );

            renderBudgetTable();


                alert(
                    "Presupuesto eliminado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error eliminando presupuesto de Supabase:",
                    error
                );


                alert(
                    "No se pudo eliminar el presupuesto de Supabase."
                );

            }

        }

    }
);

document.addEventListener("click", async event => {
    const button = event.target.closest("#deleteSelectedBudgets");

    if (!button) {
        return;
    }

    const ids = [...selectedBudgetIds];

    if (ids.length === 0) {
        return;
    }

    const confirmed = confirm(
        `¿Seguro que quieres eliminar ${ids.length} presupuesto(s) seleccionado(s)? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        alert("No hay un usuario autenticado.");
        return;
    }

    button.disabled = true;

    try {
        const { data, error } = await supabaseClient
            .from("presupuestos")
            .delete()
            .in("id", ids)
            .select("id");

        if (error) {
            throw error;
        }

        const deletedIds = new Set(
            (data || []).map(item => String(item.id))
        );

        budgets = budgets.filter(
            item => !deletedIds.has(String(item.id))
        );

        selectedBudgetIds.clear();

        renderBudgetTable();

        if (typeof updateDashboard === "function") {
            updateDashboard();
        }

        alert(
            `${deletedIds.size} presupuesto(s) eliminado(s).`
        );
    } catch (error) {
        console.error(
            "Error eliminando presupuestos seleccionados:",
            error
        );

        alert(
            "No se pudieron eliminar los presupuestos seleccionados."
        );

        button.disabled = false;
    }
});


// ------------------------------------------------------------
// INICIALIZAR PRESUPUESTOS
// ------------------------------------------------------------

populateBudgetCategories();

renderBudgetTable();

// ============================================================
// 14. GASTOS
// ============================================================

let expenses = [];

const selectedExpenseIds = new Set();


// ============================================================
// ELEMENTOS
// ============================================================

const newExpenseButton =
    document.getElementById(
        "newExpenseButton"
    );

const expenseFormPanel =
    document.getElementById(
        "expenseFormPanel"
    );

const expenseForm =
    document.getElementById(
        "expenseForm"
    );

const expenseId =
    document.getElementById(
        "expenseId"
    );

const expenseDate =
    document.getElementById(
        "expenseDate"
    );

const expenseDescription =
    document.getElementById(
        "expenseDescription"
    );

const expenseCategory =
    document.getElementById(
        "expenseCategory"
    );

const expenseCurrency =
    document.getElementById(
        "expenseCurrency"
    );

const expenseAmount =
    document.getElementById(
        "expenseAmount"
    );

const expenseAccountId = document.getElementById("expenseAccountId");

const expenseExchangeGroup =
    document.getElementById(
        "expenseExchangeGroup"
    );

const expenseExchangeRate =
    document.getElementById(
        "expenseExchangeRate"
    );

const refreshExpenseExchangeRate =
    document.getElementById(
        "refreshExpenseExchangeRate"
    );

const expenseExchangeRateStatus =
    document.getElementById(
        "expenseExchangeRateStatus"
    );

const expenseAmountGTQ =
    document.getElementById(
        "expenseAmountGTQ"
    );

const expenseNotes =
    document.getElementById(
        "expenseNotes"
    );

const cancelExpenseButton =
    document.getElementById(
        "cancelExpenseButton"
    );

const expenseTableContainer =
    document.getElementById(
        "expenseTableContainer"
    );

const creditCardStatementsContainer =
    document.getElementById(
        "creditCardStatementsContainer"
    );  

    const expensePaymentMethod =
    document.getElementById("expensePaymentMethod");

const expenseCreditCardGroup =
    document.getElementById("expenseCreditCardGroup");

const expenseCreditCardId =
    document.getElementById("expenseCreditCardId");

expensePaymentMethod?.addEventListener("change", () => {
    const usesCard =
        expensePaymentMethod.value === "card";

    expenseCreditCardGroup.hidden = !usesCard;
    expenseCreditCardId.required = usesCard;
    populateTransactionAccountSelectors();

    if (!usesCard) {
        expenseCreditCardId.value = "";
    }
});

// ============================================================
// GUARDAR GASTOS
// ============================================================

// ============================================================
// SUPABASE - GASTOS
// ============================================================

async function initializeExpenses() {

    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar gastos."
        );

        renderExpenseTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("gastos")
            .select(`
                id,
                date,
                description,
                category_id,
                category_name,
                currency,
                amount,
                exchange_rate,
                amount_gtq,
                exchange_rate_source,
                notes,
                payment_method,
                credit_card_id,
                statement_cutoff_date,
                statement_due_date,
                created_at,
                updated_at${accountsSchemaReady ? ", account_id" : ""}
            `)
            .order(
                "date",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseExpenses =
            data || [];

        // ====================================================
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ====================================================

        expenses =
            supabaseExpenses.map(
                expense => ({

                    id:
                        expense.id,

                    date:
                        expense.date,

                    description:
                        expense.description,

                    categoryId:
                        expense.category_id,

                    categoryName:
                        expense.category_name,

                    currency:
                        expense.currency,

                    amount:
                        Number(
                            expense.amount
                        ),

                    exchangeRate:
                        Number(
                            expense.exchange_rate
                        ),

                    amountGTQ:
                        Number(
                            expense.amount_gtq
                        ),

                    exchangeRateSource:
                        expense.exchange_rate_source ||
                        "",

                    notes:
                        expense.notes ||
                        "",

                    accountId:
                        expense.account_id || null,

                    paymentMethod:
                          expense.payment_method || "cash",

                    creditCardId:
                         expense.credit_card_id || null,

                    statementCutoffDate:
                        expense.statement_cutoff_date || null,

                    statementDueDate:
                        expense.statement_due_date || null,

                    createdAt:
                        expense.created_at,

                    updatedAt:
                        expense.updated_at

                })
            );

        renderExpenseTable();

        console.log(
            "Gastos sincronizados correctamente con Supabase."
        );

    } catch (error) {

        console.error(
            "Error sincronizando gastos con Supabase:",
            error
        );

        renderExpenseTable();

    }

}

// ============================================================
// CATEGORÍAS DE GASTOS
// ============================================================

function populateExpenseCategories() {

    if (!expenseCategory) {
        return;
    }

    const currentValue =
        expenseCategory.value;

    const activeCategories =
        categories.expense.filter(
            category =>
                category.active !== false
        );


    expenseCategory.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "Selecciona una categoría";

    expenseCategory.appendChild(
        defaultOption
    );


    activeCategories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            expenseCategory.appendChild(
                option
            );

        }
    );


    if (
        currentValue &&
        activeCategories.some(
            category =>
                category.id === currentValue
        )
    ) {

        expenseCategory.value =
            currentValue;

    }

}


// ============================================================
// ABRIR FORMULARIO
// ============================================================

function openExpenseForm(
    expense = null
) {

    if (
        !expenseFormPanel ||
        !expenseForm
    ) {

        console.error(
            "No existe el formulario de gastos."
        );

        return;
    }


    expenseFormPanel.hidden = false;


    populateExpenseCategories();


    if (expense) {

        expenseId.value =
            expense.id;

        expenseDate.value =
            expense.date;

        expenseDescription.value =
            expense.description;

        expenseCategory.value =
            expense.categoryId;

        expenseCurrency.value =
            expense.currency;

        expenseAmount.value =
            expense.amount;

        expenseNotes.value =
            expense.notes || "";

        expensePaymentMethod.value =
<<<<<<< HEAD
           expense.paymentMethod || "cash";
        if (expenseAccountId) expenseAccountId.value = expense.accountId || "";
=======
    expense.paymentMethod || "cash";
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)

expensePaymentMethod.dispatchEvent(
    new Event("change")
);

if (expenseAccountId) {
    expenseAccountId.value = expense.accountId || "";
}

populateExpenseCreditCardOptions(
    expense.creditCardId || null
);

expenseCreditCardId.value =
    expense.creditCardId || "";


        if (
            expense.currency === "USD"
        ) {

            expenseExchangeGroup.hidden =
                false;

            expenseExchangeRate.value =
                expense.exchangeRate || "";

        } else {

            expenseExchangeGroup.hidden =
                true;

            expenseExchangeRate.value =
                "";

        }


        updateExpenseConversion();


    } else {

        expenseForm.reset();
        expensePaymentMethod.value = "cash";

expensePaymentMethod.dispatchEvent(
    new Event("change")
);


        expenseId.value =
            "";

        expenseDate.value =
            getTodayISO();

        expenseCurrency.value =
            "GTQ";
        if (expenseAccountId) expenseAccountId.value = getSingleAccountId("GTQ");

          populateTransactionAccountSelectors();

        if (expenseAccountId) expenseAccountId.value = getSingleAccountId("GTQ");

        expenseExchangeGroup.hidden =
            true;

        expenseExchangeRate.value =
            "";

        expenseAmountGTQ.textContent =
            "Q 0.00";

        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "";

        }

    }


    populateTransactionAccountSelectors();
    refreshDatePicker("expenseDate");
    focusDatePicker("expenseDate");

}


// ============================================================
// CERRAR FORMULARIO
// ============================================================

function closeExpenseForm() {

    if (!expenseFormPanel) {
        return;
    }

    expenseFormPanel.hidden =
        true;


    if (expenseForm) {
        expenseForm.reset();
    }


    if (expenseId) {
        expenseId.value = "";
    }


    if (expenseExchangeGroup) {

        expenseExchangeGroup.hidden =
            true;

    }


    if (expenseExchangeRate) {

        expenseExchangeRate.value =
            "";

    }


    if (expenseAmountGTQ) {

        expenseAmountGTQ.textContent =
            "Q 0.00";

    }


    if (
        expenseExchangeRateStatus
    ) {

        expenseExchangeRateStatus.textContent =
            "";

    }

}


// ============================================================
// BOTONES DEL FORMULARIO
// ============================================================

if (newExpenseButton) {

    newExpenseButton.addEventListener(
        "click",
        () => openExpenseForm()
    );

}


if (cancelExpenseButton) {

    cancelExpenseButton.addEventListener(
        "click",
        closeExpenseForm
    );

}


// ============================================================
// MONEDA
// ============================================================

function updateExpenseCurrencyUI() {

    if (!expenseCurrency) {
        return;
    }


    const currency =
        expenseCurrency.value;


    if (
        currency === "USD"
    ) {

        expenseExchangeGroup.hidden =
            false;


        if (
            !expenseExchangeRate.value
        ) {

            fetchExpenseExchangeRate();

        }

    } else {

        expenseExchangeGroup.hidden =
            true;

        expenseExchangeRate.value =
            "";

        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "";

        }

    }


    updateExpenseConversion();

}


function updateExpenseConversion() {

    if (!expenseAmountGTQ) {
        return;
    }


    const amount =
        parseFloat(
            expenseAmount?.value
        ) || 0;


    const currency =
        expenseCurrency?.value ||
        "GTQ";


    let amountGTQ = 0;


    if (
        currency === "GTQ"
    ) {

        amountGTQ =
            amount;

    } else {

        const rate =
            parseFloat(
                expenseExchangeRate?.value
            ) || 0;

        amountGTQ =
            amount * rate;

    }


    expenseAmountGTQ.textContent =
        formatCurrency(
            amountGTQ,
            "GTQ"
        );

}


if (expenseCurrency) {

    expenseCurrency.addEventListener(
        "change",
        updateExpenseCurrencyUI
    );
    expenseCurrency.addEventListener("change", populateTransactionAccountSelectors);

}


if (expenseAmount) {

    expenseAmount.addEventListener(
        "input",
        updateExpenseConversion
    );

}


if (expenseExchangeRate) {

    expenseExchangeRate.addEventListener(
        "input",
        updateExpenseConversion
    );

}


// ============================================================
// TIPO DE CAMBIO
// ============================================================

async function fetchExpenseExchangeRate() {
    if (!expenseExchangeRate) return;
    if (expenseExchangeRateStatus) expenseExchangeRateStatus.textContent = "Consultando referencia del Banco de Guatemala…";
    if (refreshExpenseExchangeRate) refreshExpenseExchangeRate.disabled = true;

    try {
        const quote = await getBanguatReferenceRate();
        expenseExchangeRate.value = quote.rate.toFixed(5);
        if (expenseExchangeRateStatus) {
            expenseExchangeRateStatus.textContent = `Referencia Banguat${quote.date ? ` · ${quote.date}` : ""}.`;
        }
        updateExpenseConversion();
    } catch (error) {
        console.error("No se pudo consultar el tipo de cambio de Banguat:", error);
        if (expenseExchangeRateStatus) {
            expenseExchangeRateStatus.textContent = "No se pudo consultar Banguat. Ingresa la tasa manualmente o despliega la función de conexión.";
        }
    } finally {
        if (refreshExpenseExchangeRate) refreshExpenseExchangeRate.disabled = false;
    }
}

if (refreshExpenseExchangeRate) {

    refreshExpenseExchangeRate.addEventListener(
        "click",
        fetchExpenseExchangeRate
    );

}


// ============================================================
// GUARDAR GASTO
// ============================================================

if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const date =
                expenseDate.value;

            const description =
                expenseDescription.value.trim();

            const categoryId =
                expenseCategory.value;

            const currency =
                expenseCurrency.value;

            const amount =
                parseFloat(
                    expenseAmount.value
                );

            const notes =
                expenseNotes.value.trim();

                const paymentMethod =
    expensePaymentMethod.value;

const creditCardId =
    paymentMethod === "card"
        ? expenseCreditCardId.value
        : null;
const accountId = paymentMethod === "card" ? null : (expenseAccountId?.value || "");

if (paymentMethod === "card" && !creditCardId) {
    alert("Selecciona una tarjeta de crédito.");
    return;
}
if (accountsSchemaReady && paymentMethod !== "card") {
    const selectedAccount = getBankAccount(accountId);
    if (!selectedAccount || selectedAccount.isActive === false || selectedAccount.currency !== currency) {
        alert("Selecciona una cuenta activa que use la misma moneda del gasto.");
        return;
    }
}

            if (!date) {

                alert(
                    "Selecciona la fecha."
                );

                return;
            }


            if (!description) {

                alert(
                    "Ingresa una descripción."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.expense.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada no existe."
                );

                return;
            }

            const selectedCreditCard =
    paymentMethod === "card"
        ? creditCards.find(
            card =>
                card.id === creditCardId &&
                card.active !== false
        )
        : null;

if (paymentMethod === "card" && !selectedCreditCard) {
    alert("La tarjeta seleccionada no está disponible.");
    return;
}

const statementDates =
    selectedCreditCard
        ? getCreditCardStatementDates(date, selectedCreditCard)
        : {
            statementCutoffDate: null,
            statementDueDate: null
        };

            let exchangeRate =
                1;

            let amountGTQ =
                amount;


            if (
                currency === "USD"
            ) {

                exchangeRate =
                    parseFloat(
                        expenseExchangeRate.value
                    );


                if (
                    !exchangeRate ||
                    exchangeRate <= 0
                ) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;
                }


                amountGTQ =
                    amount *
                    exchangeRate;

            }


            const id =
                expenseId.value ||
                createId("expense");


            const existingExpense =
                expenses.find(
                    item =>
                        item.id === id
                );


            const now =
                new Date().toISOString();


            const expenseData = {

                id: id,

                date: date,

                description: description,

                categoryId:
                    category.id,

                categoryName:
                    category.name,

                currency:
                    currency,

                amount:
                    amount,

                exchangeRate:
                    exchangeRate,

                amountGTQ:
                    amountGTQ,

                exchangeRateSource:
                    currency === "USD"
                        ? "Banguat/Manual"
                        : "N/A",

                notes:
                    notes,

                accountId: accountsSchemaReady ? accountId || null : existingExpense?.accountId || null,

                paymentMethod:
                   paymentMethod,

                  creditCardId:
                    creditCardId,

                statementCutoffDate:
                   statementDates.statementCutoffDate,

                statementDueDate:
                   statementDates.statementDueDate,

                createdAt:
                    existingExpense?.createdAt ||
                    now,

                updatedAt:
                    now

            };


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const supabaseData = {

                    id:
                        expenseData.id,

                    user_id:
                        user.id,

                    date:
                        expenseData.date,

                    description:
                        expenseData.description,

                    category_id:
                        expenseData.categoryId,

                    category_name:
                        expenseData.categoryName,

                    currency:
                        expenseData.currency,

                    amount:
                        expenseData.amount,

                    exchange_rate:
                        expenseData.exchangeRate,

                    amount_gtq:
                        expenseData.amountGTQ,

                    exchange_rate_source:
                        expenseData.exchangeRateSource,

                    notes:
                        expenseData.notes,

                    payment_method:
                        expenseData.paymentMethod,

                    credit_card_id:
                        expenseData.creditCardId,

                    ...(accountsSchemaReady ? { account_id: expenseData.accountId } : {}),

                    statement_cutoff_date:
                        expenseData.statementCutoffDate,

                    statement_due_date:
                        expenseData.statementDueDate,

                    created_at:
                        expenseData.createdAt,

                    updated_at:
                        expenseData.updatedAt

                };


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("gastos")
                    .upsert(
                        supabaseData
                    )
                    .select()
                    .single();


                if (error) {

                    throw error;

                }


                expenses =
                    expenses.filter(
                        item =>
                            item.id !== id
                    );

                expenses.push(
                    expenseData
                );

                renderExpenseTable();
                renderAccounts();
                updateDashboard();
                closeExpenseForm();

                alert(
                    existingExpense
                        ? "Gasto actualizado correctamente."
                        : "Gasto guardado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error guardando gasto en Supabase:",
                    error
                );


                alert(
                    "No se pudo guardar el gasto en Supabase."
                );

            }

        }
    );

}

// ============================================================
// TABLA DE GASTOS
// ============================================================

function renderExpenseTable() {

    if (!expenseTableContainer) {
        return;
    }

renderCreditCardStatements();
renderDashboardCardPayments();

    const selectedMonth = String(
    dashboardMonth?.value ||
    new Date().getMonth() + 1
).padStart(2, "0");

const selectedYear =
    dashboardYear?.value ||
    String(new Date().getFullYear());


const searchTerm =
    (document.getElementById("expenseAuditSearch")?.value || "")
        .trim()
        .toLowerCase();

const monthlyExpenses = expenses.filter(expense => {
    if (!expense.date) return false;

    const [expenseYear, expenseMonth] =
        expense.date.split("-");

    const matchesPeriod =
        expenseYear === selectedYear &&
        expenseMonth === selectedMonth;

    if (!matchesPeriod) return false;

    if (!searchTerm) return true;

    const category = categories.expense.find(
        item => item.id === expense.categoryId
    );

    const card = creditCards.find(
        item =>
            String(item.id) === String(expense.creditCardId)
    );

    const searchableText = [
        expense.description || "",
        expense.notes || "",
        expense.categoryName || "",
        category?.name || "",
        expense.amount,
        expense.amountGTQ,
        expense.currency || "GTQ",
        expense.paymentMethod === "card"
            ? "tarjeta credito"
            : "efectivo",
        card?.bank || "",
        card?.name || ""
    ].join(" ").toLowerCase();

    return searchableText.includes(searchTerm);
});

keepOnlyVisibleSelection(
    selectedExpenseIds,
    monthlyExpenses.map(expense => expense.id)
);

if (monthlyExpenses.length === 0) {
    expenseTableContainer.innerHTML = `
        <div class="empty-table">
            No hay gastos registrados en el mes seleccionado.
        </div>
    `;
    return;
}

const sorted =
    [...monthlyExpenses].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    
let html = `
    <div class="expense-bulk-actions">
<label class="bulk-select-all-mobile">
    <input
        type="checkbox"
        id="selectAllExpensesMobile"
        aria-label="Seleccionar todos los gastos">
    Todos
</label>
        <span id="selectedExpenseCount">
            ${selectedExpenseIds.size} seleccionados
        </span>

        <button
            type="button"
            id="deleteSelectedExpenses"
            class="table-action-button delete"
            ${selectedExpenseIds.size === 0 ? "disabled" : ""}>
            Eliminar seleccionados
        </button>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>
                    <input
                        type="checkbox"
                        id="selectAllExpenses"
                        aria-label="Seleccionar todos los gastos">
                    Fecha
                </th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Moneda</th>
                <th>Monto</th>
                <th>Equivalente GTQ</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
`;

    sorted.forEach(
        expense => {

            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        expense.categoryId
                );


            const categoryName =
                category?.name ||
                expense.categoryName ||
                "Categoría eliminada";


                        html += `
                <tr class="expense-main-row">
                    
<td>
    <input
        type="checkbox"
        class="expense-select-checkbox"
        data-expense-select-id="${expense.id}"
        aria-label="Seleccionar gasto">
    ${formatDate(expense.date)}
</td>

                    <td>${escapeHtml(expense.description || "")}</td>
                    <td>${escapeHtml(categoryName)}</td>
                    <td>${escapeHtml(expense.currency || "GTQ")}</td>
                    <td class="income-amount">
                        ${formatCurrency(expense.amount, expense.currency)}
                    </td>
                    <td class="income-amount">
                        ${formatCurrency(expense.amountGTQ, "GTQ")}
                    </td>
                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="table-action-button"
                                data-expense-action="edit"
                                data-expense-id="${expense.id}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="table-action-button delete"
                                data-expense-action="delete"
                                data-expense-id="${expense.id}">
                                Eliminar
                            </button>
                        </div>
                    </td>

                    <td class="expense-mobile-summary-cell" colspan="7">

<input
    type="checkbox"
    class="expense-select-checkbox expense-select-checkbox-mobile"
    data-expense-select-id="${expense.id}"
    aria-label="Seleccionar gasto">
                    
                        <button
                            type="button"
                            class="expense-mobile-toggle"
                            data-expense-toggle="${expense.id}"
                            aria-expanded="false">
                            <span class="expense-mobile-date">
                                ${formatDate(expense.date)}
                            </span>
                            <span class="expense-mobile-description">
                                ${escapeHtml(expense.description || "Sin descripción")}
                            </span>
                            <span class="expense-mobile-category">
                                ${escapeHtml(categoryName)}
                            </span>
                            <span class="expense-mobile-chevron" aria-hidden="true">⌄</span>
                        </button>
                    </td>
                </tr>

                <tr
                    class="expense-details-row"
                    data-expense-details="${expense.id}"
                    hidden>
                    <td colspan="7">
                                                <div class="expense-details-panel">
                            ${
                                expense.description
                                    ? `
                                        <div class="expense-detail-item full expense-detail-description">
                                            <span>Descripción completa</span>
                                            <strong>${escapeHtml(expense.description)}</strong>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="expense-detail-group">
                                <div class="expense-detail-item">
                                    <span>Moneda y monto</span>
                                    <strong>
                                        ${formatCurrency(expense.amount, expense.currency)}
                                    </strong>
                                </div>

                                <div class="expense-detail-item">
                                    <span>Equivalente en GTQ</span>
                                    <strong>
                                        ${formatCurrency(expense.amountGTQ, "GTQ")}
                                    </strong>
                                </div>
                            </div>

                            ${
                                expense.notes
                                    ? `
                                        <div class="expense-detail-item full expense-detail-notes">
                                            <span>Notas</span>
                                            <strong>${escapeHtml(expense.notes)}</strong>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="expense-details-actions">
                                <button
                                    type="button"
                                    class="table-action-button"
                                    data-expense-action="edit"
                                    data-expense-id="${expense.id}">
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    class="table-action-button delete"
                                    data-expense-action="delete"
                                    data-expense-id="${expense.id}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;

        }
    );


    html += `

            </tbody>

        </table>

    `;


    expenseTableContainer.innerHTML =
        html;

}


bindBulkSelection({
    container: expenseTableContainer,
    checkboxSelector: ".expense-select-checkbox",
    selectAllId: "selectAllExpenses",
    idKey: "expenseSelectId",
    selectedIds: selectedExpenseIds,
    counterId: "selectedExpenseCount",
    deleteButtonId: "deleteSelectedExpenses"
});


expenseTableContainer?.addEventListener("click", event => {
    const toggle = event.target.closest("[data-expense-toggle]");

    if (!toggle || !expenseTableContainer.contains(toggle)) {
        return;
    }

    const expenseId = toggle.dataset.expenseToggle;

    const detailsRows = [
        ...expenseTableContainer.querySelectorAll(".expense-details-row")
    ];

    const selectedDetails = detailsRows.find(
        row => row.dataset.expenseDetails === expenseId
    );

    if (!selectedDetails) return;

    const shouldOpen = selectedDetails.hidden;

    detailsRows.forEach(row => {
        row.hidden = true;
    });

    expenseTableContainer
        .querySelectorAll("[data-expense-toggle]")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
        });

    if (shouldOpen) {
        selectedDetails.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    }
});

function renderCreditCardStatements() {
    if (!creditCardStatementsContainer) {
        return;
    }

    const selectedPeriod =
    `${getDashboardYear()}-${getDashboardMonth()}-`;

const actualCardExpenses = expenses.filter(
    expense =>
        expense.paymentMethod === "card" &&
        expense.creditCardId &&
        expense.statementCutoffDate &&
        expense.statementDueDate &&
        expense.statementDueDate.startsWith(selectedPeriod)
);

const projectedCardExpenses =
    getProjectedFixedCardCharges(selectedPeriod);

const cardExpenses = [
    ...actualCardExpenses,
    ...projectedCardExpenses
];

    if (cardExpenses.length === 0) {
        creditCardStatementsContainer.innerHTML = `
            <div class="empty-table">
                No hay gastos registrados con tarjeta de crédito.
            </div>
        `;
        return;
    }

    const statements = new Map();

    cardExpenses.forEach(expense => {
        const key = [
            expense.creditCardId,
            expense.statementCutoffDate,
            expense.statementDueDate
        ].join("|");

        let statement = statements.get(key);

        if (!statement) {
            statement = {
                creditCardId: expense.creditCardId,
                cutoffDate: expense.statementCutoffDate,
                dueDate: expense.statementDueDate,
                totalGTQ: 0,
                projectedGTQ: 0
            };

            statements.set(key, statement);
        }

        const amountGTQ =
    Number(expense.amountGTQ) || 0;

statement.totalGTQ += amountGTQ;

if (expense.isProjected) {
    statement.projectedGTQ += amountGTQ;
}
    });

    const sortedStatements =
        [...statements.values()].sort(
            (a, b) =>
                a.dueDate.localeCompare(b.dueDate) ||
                a.cutoffDate.localeCompare(b.cutoffDate)
        );

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Tarjeta</th>
                    <th>Fecha de corte</th>
                    <th>Fecha de pago</th>
                    <th>Total a pagar (GTQ)</th>
                    <th>Previsto (GTQ)</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedStatements.forEach(statement => {
        const card = creditCards.find(
            item => item.id === statement.creditCardId
        );

        const cardName = card
            ? `${card.bank} - ${card.name}`
            : "Tarjeta de crédito";

        html += `
            <tr>
                <td>${escapeHtml(cardName)}</td>
                <td>${formatDate(statement.cutoffDate)}</td>
                <td>${formatDate(statement.dueDate)}</td>
                <td class="income-amount">
                    ${formatCurrency(statement.totalGTQ, "GTQ")}</td>
                <td>${formatCurrency(statement.projectedGTQ, "GTQ")}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    creditCardStatementsContainer.innerHTML = html;
}

// ============================================================
// EDITAR / ELIMINAR GASTOS
// ============================================================

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-expense-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.expenseAction;

        const id =
            button.dataset.expenseId;


        const expense =
            expenses.find(
                item =>
                    item.id === id
            );


        if (!expense) {
            return;
        }


        if (
            action === "edit"
        ) {

            openExpenseForm(
                expense
            );

            return;
        }


        if (
            action === "delete"
        ) {

            const confirmed =
                confirm(
                    `¿Seguro que quieres eliminar el gasto "${expense.description}"?`
                );


            if (!confirmed) {
                return;
            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const {
                    error
                } = await supabaseClient
                    .from("gastos")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


                if (error) {
                    throw error;
                }


               expenses =
    expenses.filter(
        item =>
            item.id !== id
    );

renderExpenseTable();
renderAccounts();
updateDashboard();

            } catch (error) {

                console.error(
                    "Error eliminando gasto de Supabase:",
                    error
                );


                alert(
                    "No se pudo eliminar el gasto de Supabase."
                );

            }

        }

    }
);


document.addEventListener("click", async event => {
    const button = event.target.closest("#deleteSelectedExpenses");

    if (!button) {
        return;
    }

        const ids = getVisibleSelectedIds(
        expenseTableContainer,
        ".expense-select-checkbox",
        "expenseSelectId",
        selectedExpenseIds
    );

    if (ids.length === 0) {
        alert("Selecciona al menos un gasto.");
        return;
    }

        const confirmed = confirm(
        `¿Seguro que quieres eliminar ${ids.length} gasto(s) de ${getSelectedPeriodLabel()}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        alert("No hay un usuario autenticado.");
        return;
    }

    button.disabled = true;

    const { data, error } = await supabaseClient
        .from("gastos")
        .delete()
        .in("id", ids)
        .select("id");

    if (error) {
        console.error("Error eliminando gastos seleccionados:", error);
        alert("No se pudieron eliminar los gastos seleccionados.");
        button.disabled = false;
        return;
    }

    const deletedIds = new Set(
        (data || []).map(item => String(item.id))
    );

    if (deletedIds.size === 0) {
        alert("Supabase no confirmó la eliminación de ningún gasto.");
        button.disabled = false;
        return;
    }

    expenses = expenses.filter(
        expense => !deletedIds.has(String(expense.id))
    );

    deletedIds.forEach(id => selectedExpenseIds.delete(id));

    renderExpenseTable();
    renderAccounts();
    updateDashboard();

    alert(`Se eliminaron ${deletedIds.size} gasto(s).`);
});


// ============================================================
// 14. DASHBOARD
// ============================================================

const dashboardYear =
    document.getElementById("year");

const dashboardMonth =
    document.getElementById("month");

const dashboardIncome =
    document.getElementById("dashboardIncome");

    // Referencias del formulario de tarjetas de crédito
const addCreditCardButton = document.getElementById("addCreditCard");
const creditCardFormPanel = document.getElementById("creditCardFormPanel");
const cancelCreditCardButton = document.getElementById("cancelCreditCardButton");
const creditCardForm = document.getElementById("creditCardForm");
const creditCardsList =
    document.getElementById("creditCardsList");

// Mostrar formulario para agregar una tarjeta
addCreditCardButton?.addEventListener("click", () => {
    creditCardForm.reset();

    document.getElementById("creditCardId").value = "";

    document.getElementById("creditCardFormTitle").textContent =
        "Nueva tarjeta de crédito";

    creditCardFormPanel.hidden = false;
});

// Ocultar formulario de tarjeta
cancelCreditCardButton?.addEventListener("click", () => {
    creditCardFormPanel.hidden = true;
});

// Capturar los datos del formulario de tarjeta
creditCardForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const creditCard = {

            bank:
                document
                    .getElementById("creditCardBank")
                    .value
                    .trim(),

            name:
                document
                    .getElementById("creditCardName")
                    .value
                    .trim(),

            cutoffDay:
                Number(
                    document
                        .getElementById(
                            "creditCardCutoffDay"
                        )
                        .value
                ),

            paymentDay:
                Number(
                    document
                        .getElementById(
                            "creditCardPaymentDay"
                        )
                        .value
                ),

            creditLimit:
                Number(
                    document
                        .getElementById(
                            "creditCardLimit"
                        )
                        .value
                )

        };


        // ----------------------------------------------------
        // VALIDACIONES
        // ----------------------------------------------------

        if (!creditCard.bank) {

            alert(
                "Ingresa el banco de la tarjeta."
            );

            return;

        }


        if (!creditCard.name) {

            alert(
                "Ingresa el nombre de la tarjeta."
            );

            return;

        }


        if (
            creditCard.cutoffDay < 1 ||
            creditCard.cutoffDay > 31
        ) {

            alert(
                "El día de corte debe estar entre 1 y 31."
            );

            return;

        }


        if (
            creditCard.paymentDay < 1 ||
            creditCard.paymentDay > 31
        ) {

            alert(
                "El día límite de pago debe estar entre 1 y 31."
            );

            return;

        }


        if (creditCard.creditLimit < 0) {

            alert(
                "El límite de crédito no puede ser negativo."
            );

            return;

        }


        // ----------------------------------------------------
        // OBTENER USUARIO ACTUAL
        // ----------------------------------------------------

        const user =
            await getCurrentUser();


        if (!user) {

            alert(
                "No hay un usuario autenticado."
            );

            return;

        }


        // ----------------------------------------------------
        // GUARDAR O ACTUALIZAR EN SUPABASE
        // ----------------------------------------------------

        const editingId =
            document.getElementById("creditCardId").value;

        const cardData = {
            bank: creditCard.bank,
            name: creditCard.name,
            cutoff_day: creditCard.cutoffDay,
            payment_day: creditCard.paymentDay,
            credit_limit: creditCard.creditLimit
        };

        let saveQuery =
            supabaseClient
                .from("tarjetas_credito");

        if (editingId) {
            saveQuery = saveQuery
                .update(cardData)
                .eq("id", editingId);
        } else {
            saveQuery = saveQuery
                .insert({
                    user_id: user.id,
                    ...cardData
                });
        }

        const { data, error } =
    await saveQuery
        .select(
            "id, bank, name, cutoff_day, payment_day, credit_limit, active"
        )
        .single();

        if (error) {
            console.error(
                "Error guardando tarjeta:",
                error
            );

            alert(
                "No fue posible guardar la tarjeta."
            );

            return;
        }

        if (editingId) {
            creditCards = creditCards.map(card =>
                card.id === data.id ? data : card
            );
        } else {
            creditCards.push(data);
        }

        renderCreditCards();
        populateExpenseCreditCardOptions();
        populateFixedExpenseCreditCardOptions();

        alert(
            editingId
                ? "Tarjeta actualizada correctamente."
                : "Tarjeta guardada correctamente."
        );


        // ----------------------------------------------------
        // LIMPIAR Y CERRAR FORMULARIO
        // ----------------------------------------------------

        creditCardForm.reset();

        creditCardFormPanel.hidden = true;

    }
);

// ============================================================
// TARJETAS DE CRÉDITO - CARGAR DESDE SUPABASE
// ============================================================

let creditCards = [];

function populateExpenseCreditCardOptions(selectedCardId = null) {
    if (!expenseCreditCardId) return;

    const availableCards = creditCards.filter(
        card =>
            card.active !== false ||
            card.id === selectedCardId
    );

    expenseCreditCardId.innerHTML =
        '<option value="">Selecciona una tarjeta</option>';

    availableCards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = `${card.bank} - ${card.name}`;
        expenseCreditCardId.appendChild(option);
    });
}

function populateFixedExpenseCreditCardOptions(selectedCardId = null) {
    if (!fixedExpenseCreditCardId) return;

    const availableCards = creditCards.filter(
        card =>
            card.active !== false ||
            card.id === selectedCardId
    );

    fixedExpenseCreditCardId.innerHTML =
        '<option value="">Selecciona una tarjeta</option>';

    availableCards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = `${card.bank} - ${card.name}`;
        fixedExpenseCreditCardId.appendChild(option);
    });

    fixedExpenseCreditCardId.value =
        selectedCardId || "";
}

function getCreditCardStatementDates(expenseDate, card) {
    const [yearValue, monthValue, dayValue] =
        expenseDate.split("-").map(Number);

    const cutoffDay = Number(card.cutoff_day);
    const paymentDay = Number(card.payment_day);

    let cutoffYear = yearValue;
    let cutoffMonth = monthValue;

    // Si la compra fue después del corte, pasa al corte del mes siguiente.
    if (dayValue > cutoffDay) {
        cutoffMonth += 1;

        if (cutoffMonth > 12) {
            cutoffMonth = 1;
            cutoffYear += 1;
        }
    }

    const formatDate = (year, month, day) => {
        const lastDay = new Date(
            Date.UTC(year, month, 0)
        ).getUTCDate();

        const validDay = Math.min(day, lastDay);

        return [
            year,
            String(month).padStart(2, "0"),
            String(validDay).padStart(2, "0")
        ].join("-");
    };

    let dueYear = cutoffYear;
    let dueMonth = cutoffMonth;

    // Si el día de pago es anterior o igual al día de corte,
    // el pago corresponde al mes siguiente.
    if (paymentDay <= cutoffDay) {
        dueMonth += 1;

        if (dueMonth > 12) {
            dueMonth = 1;
            dueYear += 1;
        }
    }

    return {
        statementCutoffDate:
            formatDate(cutoffYear, cutoffMonth, cutoffDay),

        statementDueDate:
            formatDate(dueYear, dueMonth, paymentDay)
    };
}

async function initializeCreditCards() {

    if (!creditCardsList) {
        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar tarjetas."
        );

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("tarjetas_credito")
            .select(`
                id,
                bank,
                name,
                cutoff_day,
                payment_day,
                credit_limit,
                active,
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        creditCards =
            data || [];

            populateExpenseCreditCardOptions();
            populateFixedExpenseCreditCardOptions();
            renderCreditCards();


    } catch (error) {

        console.error(
            "Error cargando tarjetas de crédito:",
            error
        );

        creditCardsList.innerHTML = `
            <p>
                No fue posible cargar las tarjetas.
            </p>
        `;

    }

}


// ============================================================
// MOSTRAR TARJETAS DE CRÉDITO
// ============================================================

let showInactiveCreditCards = false;

function renderCreditCards() {

    if (!creditCardsList) {
        return;
    }

    const activeCards =
        creditCards.filter(
            card => card.active !== false
        );

    const inactiveCards =
        creditCards.filter(
            card => card.active === false
        );

    const visibleCards =
        showInactiveCreditCards
            ? creditCards
            : activeCards;

    let html = "";

    html += `
        <div class="category-list-header">

            <span>
                ${activeCards.length} activa(s)

                ${
                    inactiveCards.length
                        ? ` · ${inactiveCards.length} inactiva(s)`
                        : ""
                }
            </span>

            ${
                inactiveCards.length
                    ? `
                        <button
                            type="button"
                            class="category-filter-button"
                            data-credit-card-filter
                        >
                            ${
                                showInactiveCreditCards
                                    ? "Ocultar inactivas"
                                    : `Mostrar inactivas (${inactiveCards.length})`
                            }
                        </button>
                    `
                    : ""
            }

        </div>
    `;

    if (visibleCards.length === 0) {

        html += `
            <div class="category-empty">
                No hay tarjetas.
            </div>
        `;

        creditCardsList.innerHTML = html;

        return;
    }

    html += `
        <div class="credit-card-list">
    `;

    visibleCards.forEach(card => {

        html += `

            <div
                class="
                    credit-card-item
                    ${
                        card.active === false
                            ? "inactive-category"
                            : ""
                    }
                "
            >

                <div class="credit-card-main">

                    <div class="category-info">

                        <span
                            class="
                                category-status
                                ${
                                    card.active === false
                                        ? "inactive"
                                        : ""
                                }
                            "
                        ></span>

                        <div class="credit-card-title">

                            <strong>
                                ${escapeHtml(card.bank)}
                            </strong>

                            <span>
                                ${escapeHtml(card.name)}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="credit-card-details">

                    <div class="credit-card-detail">

                        <span>
                            Límite de crédito
                        </span>

                        <strong>
                            ${formatCurrency(
                                card.credit_limit,
                                "GTQ"
                            )}
                        </strong>

                    </div>

                    <div class="credit-card-detail">

                        <span>
                            Día de corte
                        </span>

                        <strong>
                            ${card.cutoff_day}
                        </strong>

                    </div>

                    <div class="credit-card-detail">

                        <span>
                            Día de pago
                        </span>

                        <strong>
                            ${card.payment_day}
                        </strong>

                    </div>

                </div>

                <div class="category-actions">

                    <button
                        type="button"
                        class="category-button"
                        data-credit-card-action="edit"
                        data-credit-card-id="${card.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="category-button"
                        data-credit-card-action="toggle"
                        data-credit-card-id="${card.id}"
                    >
                        ${
                            card.active === false
                                ? "Activar"
                                : "Desactivar"
                        }
                    </button>

                    <button
                        type="button"
                        class="category-button delete"
                        data-credit-card-action="delete"
                        data-credit-card-id="${card.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });

    html += `
        </div>
    `;

    creditCardsList.innerHTML = html;
}

function editCreditCard(id) {
    const card = creditCards.find(item => item.id === id);

    if (!card) {
        return;
    }

    document.getElementById("creditCardId").value = card.id;
    document.getElementById("creditCardBank").value = card.bank;
    document.getElementById("creditCardName").value = card.name;
    document.getElementById("creditCardCutoffDay").value = card.cutoff_day;
    document.getElementById("creditCardPaymentDay").value = card.payment_day;
    document.getElementById("creditCardLimit").value = card.credit_limit;

    document.getElementById("creditCardFormTitle").textContent =
        "Editar tarjeta de crédito";

    creditCardFormPanel.hidden = false;
}

async function toggleCreditCard(id) {

    const card =
        creditCards.find(
            item => item.id === id
        );

    if (!card) {
        return;
    }

    const newActive =
        card.active === false;

    const {
        error
    } = await supabaseClient
        .from("tarjetas_credito")
        .update({
            active: newActive,
            updated_at:
                new Date().toISOString()
        })
        .eq("id", id);

    if (error) {

        console.error(
            "Error cambiando estado de tarjeta:",
            error
        );

        alert(
            "No se pudo cambiar el estado de la tarjeta."
        );

        return;
    }

    card.active =
        newActive;

    renderCreditCards();
    populateExpenseCreditCardOptions();
    populateFixedExpenseCreditCardOptions();
}


async function deleteCreditCard(id) {

    const card =
        creditCards.find(
            item => item.id === id
        );

    if (!card) {
        return;
    }

    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar la tarjeta "${card.bank} - ${card.name}"?`
        );

    if (!confirmed) {
        return;
    }

    const {
        data: deletedRows,
        error
    } = await supabaseClient
        .from("tarjetas_credito")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {

        console.error(
            "Error eliminando tarjeta:",
            error
        );

        alert(
            "No se pudo eliminar la tarjeta."
        );

        return;
    }

    if (
        !deletedRows ||
        deletedRows.length === 0
    ) {

        alert(
            "Supabase no eliminó la tarjeta. Revisa las políticas RLS de DELETE."
        );

        return;
    }

    creditCards =
        creditCards.filter(
            item => item.id !== id
        );

    renderCreditCards();
    populateExpenseCreditCardOptions();
    populateFixedExpenseCreditCardOptions();
}

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-credit-card-action]"
            );

        if (button) {

            const action =
                button.dataset.creditCardAction;

            const id =
                button.dataset.creditCardId;

            if (action === "toggle") {

                toggleCreditCard(id);

            }

            if (action === "delete") {

                deleteCreditCard(id);

            }

            if (action === "edit") {

                editCreditCard(id);

            }

            return;
        }

        const filterButton =
            event.target.closest(
                "[data-credit-card-filter]"
            );

        if (filterButton) {

            showInactiveCreditCards =
                !showInactiveCreditCards;

            renderCreditCards();

        }

    }
);

const dashboardExpenses =
    document.getElementById("dashboardExpenses");

const dashboardFixed =
    document.getElementById("dashboardFixed");

const dashboardBalance =
    document.getElementById("dashboardBalance");

    const dashboardCardPayments =
    document.getElementById("dashboardCardPayments");

const monthlyFlowChart =
    document.getElementById("monthlyFlowChart");

const expenseCategoryChart =
    document.getElementById("expenseCategoryChart");

    // ------------------------------------------------------------
// AÑOS DISPONIBLES
// ------------------------------------------------------------

function populateYearSelectors() {

        if (dashboardMonth) {
        dashboardMonth.value =
            String(new Date().getMonth() + 1).padStart(2, "0");
    }

    const yearSelectors = [
        document.getElementById("year"),
        document.getElementById("reportYear")
    ].filter(Boolean);


    const currentYear =
        new Date().getFullYear();


    const years = new Set();

    // Año actual
    years.add(currentYear);

    // Próximo año
    // Permite preparar el sistema para el siguiente año.
    years.add(currentYear + 1);


    // --------------------------------------------------------
    // AÑOS DE LOS INGRESOS
    // --------------------------------------------------------

    incomes.forEach(income => {

        if (!income.date) {
            return;
        }

        const year =
            Number(
                String(income.date).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // AÑOS DE LOS GASTOS
    // --------------------------------------------------------

    const storedExpenses =
    Array.isArray(expenses)
        ? expenses
        : [];

    storedExpenses.forEach(expense => {

        if (!expense.date) {
            return;
        }

        const year =
            Number(
                String(expense.date).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // AÑOS DE LOS PRESUPUESTOS
    // --------------------------------------------------------

    const storedBudgets =
    Array.isArray(budgets)
        ? budgets
        : [];

    storedBudgets.forEach(budget => {

        if (!budget.month) {
            return;
        }

        const year =
            Number(
                String(budget.month).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // ORDENAR DE MÁS RECIENTE A MÁS ANTIGUO
    // --------------------------------------------------------

    const sortedYears =
        Array.from(years)
            .filter(year => !isNaN(year))
            .sort((a, b) => b - a);


    // --------------------------------------------------------
    // CONSTRUIR SELECTORES
    // --------------------------------------------------------

    yearSelectors.forEach(select => {

        const currentValue =
            select.value;


        select.innerHTML = "";


        sortedYears.forEach(year => {

            const option =
                document.createElement("option");

            option.value = year;
            option.textContent = year;

            select.appendChild(option);

        });


        // Intentar conservar el año
        // que estaba seleccionado.

        if (
            sortedYears.includes(
                Number(currentValue)
            )
        ) {

            select.value =
                currentValue;

        } else {

            select.value =
                String(currentYear);

        }

    });

}


// ------------------------------------------------------------
// OBTENER AÑO SELECCIONADO
// ------------------------------------------------------------

function getDashboardYear() {

    return Number(
        dashboardYear?.value ||
        new Date().getFullYear()
    );

}

// ------------------------------------------------------------
// OBTENER MES SELECCIONADO DEL DASHBOARD
// ------------------------------------------------------------

function getDashboardMonth() {
    return String(
        dashboardMonth?.value ||
        new Date().getMonth() + 1
    ).padStart(2, "0");
}

/* ============================================================
   BUSCADOR TEMPORAL DE GASTOS
   Filtra la tabla principal mientras se escribe.
   Solo lectura: no modifica gastos ni datos de Supabase.
   Respeta el mes y año seleccionados.
   ============================================================ */

expenseAuditSearch?.addEventListener("input", () => {
    renderExpenseTable();
});

// Refrescar el buscador cuando cambie el mes o se carguen gastos.



// ------------------------------------------------------------
// VERIFICAR SI UNA FECHA PERTENECE AL AÑO
// ------------------------------------------------------------

function belongsToYear(
    date,
    year
) {

    if (!date) {
        return false;
    }


    return String(date).startsWith(
        String(year)
    );

}


// ------------------------------------------------------------
// CALCULAR INGRESOS DEL AÑO
// ------------------------------------------------------------

function getDashboardIncome(
    year
) {

    return incomes.reduce(
        (total, income) => {

            if (
                !belongsToYear(
                    income.date,
                    year
                )
            ) {
                return total;
            }


            const amount =
                parseFloat(
                    income.amountGTQ
                ) || 0;


            return total + amount;

        },
        0
    );

}


// ------------------------------------------------------------
// CALCULAR GASTOS DEL AÑO
// ------------------------------------------------------------

function getDashboardExpenses(
    year
) {

    const storedExpenses =
    Array.isArray(expenses)
        ? expenses
        : [];


    return storedExpenses.reduce(
        (total, expense) => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return total;
            }


            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            return total + amount;

        },
        0
    );

}

// ------------------------------------------------------------
function getCurrentMonthInputValue() {
    const now = new Date();

    return (
        String(now.getFullYear()) +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0")
    );
}

function getFixedExpenseStartMonth(expense) {
    const storedMonth =
        String(
            expense?.startMonth ||
            expense?.purchaseDate ||
            expense?.createdAt ||
            ""
        ).slice(0, 7);

    return /^\d{4}-(0[1-9]|1[0-2])$/.test(storedMonth)
        ? storedMonth
        : getCurrentMonthInputValue();
}

function isFixedExpenseStartedByMonth(expense, selectedDate) {
    if (expense?.expenseType !== "recurring") {
        return true;
    }

    const selectedMonth =
        String(selectedDate.getFullYear()) +
        "-" +
        String(selectedDate.getMonth() + 1).padStart(2, "0");

    return getFixedExpenseStartMonth(expense) <= selectedMonth;
}

function formatFixedExpenseStartMonth(value) {
    const monthValue =
        String(value || "").slice(0, 7);

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(monthValue)) {
        return "Sin definir";
    }

    const [year, month] =
        monthValue.split("-").map(Number);

    return new Intl.DateTimeFormat(
        "es-GT",
        {
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(year, month - 1, 1)
    );
}

// CALCULAR GASTOS FIJOS DEL MES SELECCIONADO
// ------------------------------------------------------------

function getDashboardFixedExpenses(
    year,
    month
) {

    const selectedDate =
        new Date(
            Number(year),
            Number(month) - 1,
            1
        );

        const storedFixedExpenses =
    Array.isArray(fixedExpenses)
        ? fixedExpenses
        : [];


    return storedFixedExpenses.reduce(
        (total, expense) => {

            if (
                expense.active === false
            ) {
                return total;
            }


            if (!isFixedExpenseStartedByMonth(expense, selectedDate)) {
                return total;
            }

            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            // CUOTAS

            if (
                expense.expenseType ===
                    "installment"
            ) {

                const progress =
                    getFixedExpenseInstallmentProgressForMonth(
                        expense,
                        selectedDate
                    );


                if (!progress) {
                    return total;
                }


                return total + getFixedExpenseMonthlyAmount(expense);

            }


            // GASTOS RECURRENTES

            switch (
                expense.frequency
            ) {

                case "weekly":
                    return total +
                        (
                            amount *
                            52 /
                            12
                        );

                case "biweekly":
                    return total +
                        (
                            amount *
                            26 /
                            12
                        );

                case "yearly":
                    return total +
                        (
                            amount /
                            12
                        );

                case "monthly":
                default:
                    return total +
                        amount;

            }

        },
        0
    );

}

// ------------------------------------------------------------
// ACTUALIZAR TARJETAS DEL DASHBOARD
// ------------------------------------------------------------

function updateDashboardCards() {

    const year =
        getDashboardYear();

    const month =
        getDashboardMonth();

    const selectedPeriod =
        `${year}-${month}`;


    // --------------------------------------------------------
    // VARIABLES PRINCIPALES DEL DASHBOARD
    // --------------------------------------------------------

    let totalIncome = 0;

    let totalExpenses = 0;

    let monthlyFixedExpenses = 0;


    // --------------------------------------------------------
    // INGRESOS DEL MES SELECCIONADO
    // --------------------------------------------------------
            const sumForSelectedPeriod = records =>
    records.reduce((total, record) => {
        const recordPeriod =
            String(record.date || "").slice(0, 7);

        if (recordPeriod !== selectedPeriod) {
            return total;
        }

        return total +
            (Number(record.amountGTQ) || 0);
    }, 0);

totalIncome = sumForSelectedPeriod(incomes);
totalExpenses = sumForSelectedPeriod(expenses);
    // --------------------------------------------------------
    // GASTOS FIJOS DEL MES SELECCIONADO
    // --------------------------------------------------------

    monthlyFixedExpenses =
        getDashboardFixedExpenses(
            year,
            month
        );


    // --------------------------------------------------------
    // DISPONIBLE
    // --------------------------------------------------------

    const balance =
        totalIncome -
        totalExpenses -
        monthlyFixedExpenses;


    // --------------------------------------------------------
    // MOSTRAR INGRESOS
    // --------------------------------------------------------

    if (dashboardIncome) {

        dashboardIncome.textContent =
            formatCurrency(
                totalIncome,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR GASTOS
    // --------------------------------------------------------

    if (dashboardExpenses) {

        dashboardExpenses.textContent =
            formatCurrency(
                totalExpenses,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR GASTOS FIJOS
    // --------------------------------------------------------

    if (dashboardFixed) {

        dashboardFixed.textContent =
            formatCurrency(
                monthlyFixedExpenses,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR DISPONIBLE
    // --------------------------------------------------------

    if (dashboardBalance) {

        dashboardBalance.textContent =
            formatCurrency(
                balance,
                "GTQ"
            );

    }


    const insightCard = document.getElementById("dashboardFinancialInsight");
    const insightPeriod = document.getElementById("dashboardInsightPeriod");
    const insightTitle = document.getElementById("dashboardInsightTitle");
    const insightDescription = document.getElementById("dashboardInsightDescription");
    const savingRateLabel = document.getElementById("dashboardInsightRateLabel");
    const savingRateValue = document.getElementById("dashboardSavingRate");
    const savingRateBar = document.getElementById("dashboardSavingRateBar");
    const selectedMonthDate = new Date(Number(year), Number(month) - 1, 1);
    const periodLabel = new Intl.DateTimeFormat("es-GT", {
        month: "long",
        year: "numeric"
    }).format(selectedMonthDate);
    const hasIncome = totalIncome > 0;
    const hasExpenses = totalExpenses + monthlyFixedExpenses > 0;
    const savingRate = hasIncome ? (balance / totalIncome) * 100 : null;

    if (insightCard) {
        insightCard.dataset.tone = balance < 0 ? "warning" : hasIncome ? "positive" : "neutral";
        insightCard.dataset.incomeStatus = hasIncome ? "available" : "missing";
    }
    if (savingRateLabel) savingRateLabel.textContent = "Porción disponible";
    if (insightPeriod) insightPeriod.textContent = periodLabel;
    if (savingRateValue) savingRateValue.textContent = savingRate === null ? "Pendiente" : Math.round(savingRate) + "%";
    if (savingRateBar) {
        const barWidth = savingRate === null ? 0 : Math.min(100, Math.max(0, savingRate));
        savingRateBar.style.width = barWidth + "%";
    }

    if (insightTitle && insightDescription) {
        if (!hasIncome && !hasExpenses) {
            insightTitle.textContent = "Tu panel está listo para empezar";
            insightDescription.textContent = "Registra un ingreso o gasto para ver cómo se mueve tu dinero este mes.";
        } else if (!hasIncome) {
            insightTitle.textContent = "Falta registrar ingresos del mes";
            insightDescription.textContent = "Ya aparecen " + formatCurrency(totalExpenses + monthlyFixedExpenses, "GTQ") + " entre gastos y compromisos.";
        } else if (balance < 0) {
            insightTitle.textContent = "El flujo del mes está en negativo";
            insightDescription.textContent = "Los gastos registrados superan los ingresos. Revisa el detalle antes de conciliar el estado.";
        } else if (balance === 0) {
            insightTitle.textContent = "Ingresos y salidas están equilibrados";
            insightDescription.textContent = "El balance disponible para este mes es Q 0.00.";
        } else {
            insightTitle.textContent = "Mantienes dinero disponible este mes";
            insightDescription.textContent = "Después de gastos variables y recurrentes conservas " + formatCurrency(balance, "GTQ") + ".";
        }
    }
}

// ------------------------------------------------------------
// DATOS MENSUALES
// ------------------------------------------------------------

function getMonthlyDashboardData(
    year
) {

    const storedExpenses =
    Array.isArray(expenses)
        ? expenses
        : [];

    const months =
        Array.from(
            { length: 12 },
            () => ({
                income: 0,
                expense: 0
            })
        );


    incomes.forEach(
        income => {

            if (
                !belongsToYear(
                    income.date,
                    year
                )
            ) {
                return;
            }


            const month =
                Number(
                    income.date.substring(
                        5,
                        7
                    )
                ) - 1;


            if (
                month >= 0 &&
                month < 12
            ) {

                months[month].income +=
                    parseFloat(
                        income.amountGTQ
                    ) || 0;

            }

        }
    );


    storedExpenses.forEach(
        expense => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return;
            }


            const month =
                Number(
                    expense.date.substring(
                        5,
                        7
                    )
                ) - 1;


            if (
                month >= 0 &&
                month < 12
            ) {

                months[month].expense +=
                    parseFloat(
                        expense.amountGTQ
                    ) || 0;

            }

        }
    );


    return months;

}


// ------------------------------------------------------------
// RENDERIZAR FLUJO MENSUAL
// ------------------------------------------------------------

function renderMonthlyFlowChart() {

    if (!monthlyFlowChart) {
        return;
    }


    const year =
        getDashboardYear();


    const months =
        getMonthlyDashboardData(
            year
        );


    const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
    ];


    const maxValue =
        Math.max(
            ...months.flatMap(
                month => [
                    month.income,
                    month.expense
                ]
            ),
            0
        );


    if (maxValue === 0) {

        monthlyFlowChart.innerHTML = `
            <div class="dashboard-empty">
                Todavía no hay movimientos registrados
                para ${year}.
            </div>
        `;

        return;

    }


    let html = "";


    months.forEach(
        (month, index) => {

            const incomeHeight =
                maxValue > 0
                    ? (month.income / maxValue) * 100
                    : 0;


            const expenseHeight =
                maxValue > 0
                    ? (month.expense / maxValue) * 100
                    : 0;


            html += `

                <div
                    class="month-chart-item"
                    title="${monthNames[index]} ${year}"
                >

                    <div class="month-bars">

                        <div
                            class="month-bar income"
                            style="height: ${Math.max(incomeHeight, 1)}%"
                            title="Ingresos: ${formatCurrency(month.income, "GTQ")}"
                        ></div>


                        <div
                            class="month-bar expense"
                            style="height: ${Math.max(expenseHeight, 1)}%"
                            title="Gastos: ${formatCurrency(month.expense, "GTQ")}"
                        ></div>

                    </div>


                    <span class="month-label">

                        ${monthNames[index]}

                    </span>

                </div>

            `;

        }
    );


    monthlyFlowChart.innerHTML = `

        ${html}

        <div class="chart-legend">

            <div class="legend-item">

                <span
                    class="legend-dot income"
                ></span>

                Ingresos

            </div>


            <div class="legend-item">

                <span
                    class="legend-dot expense"
                ></span>

                Gastos

            </div>

        </div>

    `;

}


// ------------------------------------------------------------
// GASTOS POR CATEGORÍA
// ------------------------------------------------------------

function getExpenseCategoryData(
    year
) {

    const storedExpenses =
    Array.isArray(expenses)
        ? expenses
        : [];

    const totals = {};


    storedExpenses.forEach(
        expense => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return;
            }


            const categoryId =
                expense.categoryId;


            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        categoryId
                );


            const categoryName =
                category?.name ||
                expense.categoryName ||
                "Categoría eliminada";


            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            if (!totals[categoryId]) {

                totals[categoryId] = {
                    name:
                        categoryName,
                    amount: 0
                };

            }


            totals[categoryId].amount +=
                amount;

        }
    );


    return Object.values(
        totals
    ).sort(
        (a, b) =>
            b.amount -
            a.amount
    );

}


// ------------------------------------------------------------
// RENDERIZAR GASTOS POR CATEGORÍA
// ------------------------------------------------------------

function renderExpenseCategoryChart() {

    if (!expenseCategoryChart) {
        return;
    }


    const year =
        getDashboardYear();


    const categoryData =
        getExpenseCategoryData(
            year
        );


    if (
        categoryData.length === 0
    ) {

        expenseCategoryChart.innerHTML = `
            <div class="dashboard-empty">
                No hay gastos registrados
                para ${year}.
            </div>
        `;

        return;

    }


    const maxAmount =
        Math.max(
            ...categoryData.map(
                item =>
                    item.amount
            ),
            0
        );


    let html = "";


    categoryData.forEach(
        item => {

            const percentage =
                maxAmount > 0
                    ? (item.amount / maxAmount) * 100
                    : 0;


            html += `

                <div
                    class="category-chart-row"
                >

                    <div
                        class="category-chart-name"
                        title="${escapeHtml(item.name)}"
                    >

                        ${escapeHtml(
                            item.name
                        )}

                    </div>


                    <div
                        class="category-chart-bar-container"
                    >

                        <div
                            class="category-chart-bar"
                            style="
                                width: ${percentage}%;
                                background: #6366f1;
                            "
                        ></div>

                    </div>


                    <div
                        class="category-chart-amount"
                    >

                        ${formatCurrency(
                            item.amount,
                            "GTQ"
                        )}

                    </div>

                </div>

            `;

        }
    );


    expenseCategoryChart.innerHTML =
        html;

}


// ------------------------------------------------------------
// ACTUALIZAR TODO EL DASHBOARD
// ------------------------------------------------------------

function updateDashboard() {
    updateDashboardCards();
    renderMonthlyFlowChart();
    renderExpenseCategoryChart();
    renderDashboardCardPayments();
    renderCreditCardStatements();
}

function getProjectedFixedCardCharges(selectedPeriod) {
    const selectedYear =
        Number(selectedPeriod.slice(0, 4));

    const selectedMonthIndex =
        Number(selectedPeriod.slice(5, 7)) - 1;

    const selectedMonthDate =
        new Date(selectedYear, selectedMonthIndex, 1);

    const projectedCharges = [];

    const formatDate = (year, monthIndex, day) => {
        const lastDay =
            new Date(year, monthIndex + 1, 0).getDate();

        const validDay =
            Math.min(Number(day), lastDay);

        return [
            year,
            String(monthIndex + 1).padStart(2, "0"),
            String(validDay).padStart(2, "0")
        ].join("-");
    };

    fixedExpenses.forEach(expense => {
        if (
            expense.active === false ||
            expense.paymentMethod !== "card" ||
            !expense.creditCardId
        ) {
            return;
        }

        const card = creditCards.find(
            item =>
                String(item.id) ===
                String(expense.creditCardId)
        );

        if (!card) {
            return;
        }

        // Las cuotas se agregan solo durante los meses que corresponden.
        if (expense.expenseType === "installment") {
            const progress =
                getFixedExpenseInstallmentProgressForMonth(
                    expense,
                    selectedMonthDate
                );

            if (!progress) {
                return;
            }

            const alreadyRegistered = expenses.some(
                registeredExpense =>
                    registeredExpense.paymentMethod === "card" &&
                    String(registeredExpense.creditCardId) ===
                        String(expense.creditCardId) &&
                    registeredExpense.statementDueDate &&
                    registeredExpense.statementDueDate.startsWith(
                        selectedPeriod
                    ) &&
                    String(registeredExpense.description || "")
                        .trim()
                        .toLowerCase() ===
                    String(expense.name || "")
                        .trim()
                        .toLowerCase()
            );

            if (alreadyRegistered) {
                return;
            }

            const installmentAmountGTQ =
                Number(expense.amountGTQ) /
                Number(expense.totalInstallments);

            const cardCutoffDay =
    Number(card.cutoff_day || expense.cutoffDay);

const cardPaymentDay =
    Number(card.payment_day || expense.dueDay);

const cutoffMonthDate =
    new Date(selectedYear, selectedMonthIndex - 1, 1);

projectedCharges.push({
    creditCardId: expense.creditCardId,
    statementCutoffDate: buildISODate(cutoffMonthDate.getFullYear(), cutoffMonthDate.getMonth(), cardCutoffDay),
<<<<<<< HEAD
    statementDueDate: buildISODate(selectedYear, selectedMonthIndex - 1, cardPaymentDay),
=======
    statementDueDate: buildISODate(selectedYear, selectedMonthIndex, cardPaymentDay),
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    amountGTQ: installmentAmountGTQ,
    isProjected: true
});

            return;
        }

        // Los cargos recurrentes mensuales conservan su cálculo actual.
        if (
            expense.expenseType !== "recurring" ||
            expense.frequency !== "monthly" ||
            !expense.chargeDay
        ) {
            return;
        }

        for (let monthsBack = 0; monthsBack <= 2; monthsBack++) {
            const occurrenceMonth = new Date(
                selectedYear,
                selectedMonthIndex - monthsBack,
                1
            );

            const year =
                occurrenceMonth.getFullYear();

            const monthIndex =
                occurrenceMonth.getMonth();

            if (!isFixedExpenseStartedByMonth(expense, occurrenceMonth)) {
                continue;
            }

            const lastDayOfMonth =
                new Date(year, monthIndex + 1, 0).getDate();

            const chargeDay =
                Math.min(
                    Number(expense.chargeDay),
                    lastDayOfMonth
                );

            const chargeDate = [
                year,
                String(monthIndex + 1).padStart(2, "0"),
                String(chargeDay).padStart(2, "0")
            ].join("-");

            const statementDates =
                getCreditCardStatementDates(chargeDate, card);

            if (
                !statementDates.statementDueDate.startsWith(
                    selectedPeriod
                )
            ) {
                continue;
            }

            const alreadyRegistered = expenses.some(
                registeredExpense =>
                    registeredExpense.paymentMethod === "card" &&
                    String(registeredExpense.creditCardId) ===
                        String(expense.creditCardId) &&
                    registeredExpense.date === chargeDate &&
                    String(registeredExpense.description || "")
                        .trim()
                        .toLowerCase() ===
                    String(expense.name || "")
                        .trim()
                        .toLowerCase()
            );

            if (alreadyRegistered) {
                continue;
            }

            const amountGTQ =
                Number(expense.amountGTQ) ||
                Number(expense.amount) *
                    Number(expense.exchangeRate || 1);

            projectedCharges.push({
                creditCardId: expense.creditCardId,
                statementCutoffDate:
                    statementDates.statementCutoffDate,
                statementDueDate:
                    statementDates.statementDueDate,
                amountGTQ,
                isProjected: true
            });
        }
    });

    return projectedCharges;
}

function renderDashboardCardPayments() {
    if (!dashboardCardPayments) {
        return;
    }

    const selectedPeriod =
        `${getDashboardYear()}-${getDashboardMonth()}-`;

    const actualDueExpenses = expenses.filter(
    expense =>
        expense.paymentMethod === "card" &&
        expense.creditCardId &&
        expense.statementCutoffDate &&
        expense.statementDueDate &&
        expense.statementDueDate.startsWith(selectedPeriod)
);

const projectedDueExpenses =
    getProjectedFixedCardCharges(selectedPeriod);

const dueExpenses = [
    ...actualDueExpenses,
    ...projectedDueExpenses
];

    if (dueExpenses.length === 0) {
        dashboardCardPayments.innerHTML = `
            <div class="empty-table">
                No hay pagos de tarjetas programados para este mes.
            </div>
        `;
        return;
    }

    const payments = new Map();

    dueExpenses.forEach(expense => {
        const key = [
            expense.creditCardId,
            expense.statementCutoffDate,
            expense.statementDueDate
        ].join("|");

        let payment = payments.get(key);

        if (!payment) {
            payment = {
    creditCardId: expense.creditCardId,
    cutoffDate: expense.statementCutoffDate,
    dueDate: expense.statementDueDate,
    totalGTQ: 0,
    projectedGTQ: 0
};

            payments.set(key, payment);
        }

        const amountGTQ =
    Number(expense.amountGTQ) || 0;

payment.totalGTQ += amountGTQ;

if (expense.isProjected) {
    payment.projectedGTQ += amountGTQ;
}
    });

    const monthlyPayments =
        [...payments.values()].map(payment => {
            const paidGTQ = cardPayments
                .filter(item =>
                    String(item.creditCardId) === String(payment.creditCardId) &&
                    item.statementCutoffDate === payment.cutoffDate &&
                    item.statementDueDate === payment.dueDate
                )
                .reduce((sum, item) => sum + (Number(item.amountGTQ) || 0), 0);

            return {
                ...payment,
                paidGTQ,
                totalGTQ: Math.max(0, payment.totalGTQ - paidGTQ)
            };
        }).sort(
            (a, b) => a.dueDate.localeCompare(b.dueDate)
        );

    const visibleMonthlyPayments = monthlyPayments.filter(
        payment => payment.totalGTQ > 0.009 || payment.projectedGTQ > 0.009
    );

    const totalDue = visibleMonthlyPayments.reduce(
        (total, payment) => total + payment.totalGTQ,
        0
    );

    let html = `
        <div class="dashboard-payment-summary">
    <span>Total estimado a pagar este mes</span>
    <strong>${formatCurrency(totalDue, "GTQ")}</strong>
</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>Tarjeta</th>
                    <th>Fecha de corte</th>
                    <th>Fecha de pago</th>
                    <th>Pendiente (GTQ)</th>
                    <th>Previsto (GTQ)</th>
                </tr>
            </thead>
            <tbody>
    `;

    visibleMonthlyPayments.forEach(payment => {
        const card = creditCards.find(
            item => item.id === payment.creditCardId
        );

        const cardName = card
            ? `${card.bank} - ${card.name}`
            : "Tarjeta de crédito";

        html += `
            <tr>
                <td>${escapeHtml(cardName)}</td>
                <td>${formatDate(payment.cutoffDate)}</td>
                <td>${formatDate(payment.dueDate)}</td>
                <td class="income-amount">
                   ${formatCurrency(payment.totalGTQ, "GTQ")}
                           </td>
                     <td>
    ${formatCurrency(payment.projectedGTQ, "GTQ")}
</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    dashboardCardPayments.innerHTML = html;
}


// ------------------------------------------------------------
// ACTUALIZAR DASHBOARD AL CAMBIAR EL AÑO
// ------------------------------------------------------------

if (dashboardYear) {
    dashboardYear.addEventListener(
        "change",
        () => {
            updateDashboard();
            renderIncomeTable();
            renderExpenseTable();
        }
    );
}


// ------------------------------------------------------------
// ACTUALIZAR DASHBOARD AL CAMBIAR EL MES
// ------------------------------------------------------------

if (dashboardMonth) {
    dashboardMonth.addEventListener(
        "change",
        () => {
            updateDashboard();
            renderIncomeTable();
            renderExpenseTable();
        }
    );
}


// ------------------------------------------------------------
// INICIALIZAR AÑOS
// ------------------------------------------------------------

populateYearSelectors();
// Selectores propios para los periodos; los selects nativos quedan como
// fuente de datos para los cálculos y los eventos existentes.
const periodPickerRefreshers = new WeakMap();

function initializePeriodPicker(selectId, buttonId, valueId, optionsId) {
    const select = document.getElementById(selectId);
    const button = document.getElementById(buttonId);
    const value = document.getElementById(valueId);
    const listbox = document.getElementById(optionsId);
    const field = button?.closest(".period-field");

    if (!select || !button || !value || !listbox || !field) {
        return;
    }

    const existingRefresh = periodPickerRefreshers.get(select);
    if (existingRefresh) {
        existingRefresh();
        return;
    }

    const syncSelection = () => {
        const selectedOption = select.options[select.selectedIndex];
        value.textContent = selectedOption?.textContent.trim() || "Seleccionar";

        listbox.querySelectorAll(".period-option").forEach(optionButton => {
            const isSelected = optionButton.dataset.value === select.value;
            optionButton.setAttribute("aria-selected", String(isSelected));
        });
    };

    const close = (restoreFocus = false) => {
        listbox.hidden = true;
        scrollTrack.hidden = true;
        listbox.classList.remove("has-custom-scrollbar");
        button.setAttribute("aria-expanded", "false");
        if (restoreFocus) button.focus();
    };

    const open = () => {
        document.querySelectorAll(".period-trigger[aria-expanded='true']").forEach(openButton => {
            if (openButton !== button) {
                openButton.setAttribute("aria-expanded", "false");
                const otherListbox = document.getElementById(openButton.getAttribute("aria-controls"));
                if (otherListbox) {
                    otherListbox.hidden = true;
                    otherListbox.classList.remove("has-custom-scrollbar");
                    const otherTrack = otherListbox.parentElement.querySelector(".period-scrollbar");
                    if (otherTrack) otherTrack.hidden = true;
                }
            }
        });

        listbox.hidden = false;
        button.setAttribute("aria-expanded", "true");
        requestAnimationFrame(updateCustomScrollbar);
        listbox.querySelector("[aria-selected='true']")?.focus();
    };

    const scrollTrack = document.createElement("div");
    scrollTrack.className = "period-scrollbar";
    scrollTrack.setAttribute("aria-hidden", "true");
    scrollTrack.setAttribute("role", "presentation");
    scrollTrack.hidden = true;

    const scrollThumb = document.createElement("div");
    scrollThumb.className = "period-scroll-thumb";
    scrollTrack.appendChild(scrollThumb);
    const scrollContainer = listbox.parentElement;
    scrollContainer?.appendChild(scrollTrack);

    const refreshOptions = () => {
        listbox.replaceChildren();
        [...select.options].forEach(option => {
            const optionButton = document.createElement("button");
            optionButton.type = "button";
            optionButton.className = "period-option";
            optionButton.setAttribute("role", "option");
            optionButton.dataset.value = option.value;
            optionButton.textContent = option.textContent.trim();
            optionButton.setAttribute("aria-selected", String(option.value === select.value));

            optionButton.addEventListener("click", () => {
                const changed = select.value !== option.value;
                select.value = option.value;
                if (changed) {
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                } else {
                    syncSelection();
                }
                close(true);
            });

            listbox.appendChild(optionButton);
        });
        syncSelection();
        if (!listbox.hidden) requestAnimationFrame(updateCustomScrollbar);
    };
    periodPickerRefreshers.set(select, refreshOptions);
    refreshOptions();

    let scrollDrag = null;
    const updateCustomScrollbar = () => {
        if (listbox.hidden) {
            scrollTrack.hidden = true;
            listbox.classList.remove("has-custom-scrollbar");
            return;
        }

        const scrollRange = listbox.scrollHeight - listbox.clientHeight;
        const trackHeight = Math.max(0, listbox.clientHeight - 16);
        const isScrollable = scrollRange > 1 && trackHeight > 0;
        scrollTrack.hidden = !isScrollable;
        listbox.classList.toggle("has-custom-scrollbar", isScrollable);
        if (!isScrollable) return;

        const listBounds = listbox.getBoundingClientRect();
        const containerBounds = scrollContainer.getBoundingClientRect();
        scrollTrack.style.top = `${listBounds.top - containerBounds.top + 8}px`;
        scrollTrack.style.left = `${listBounds.right - containerBounds.left - 13}px`;
        scrollTrack.style.height = `${trackHeight}px`;
        const thumbHeight = Math.max(
            28,
            Math.min(trackHeight, trackHeight * listbox.clientHeight / listbox.scrollHeight)
        );
        const thumbRange = Math.max(0, trackHeight - thumbHeight);
        const thumbTop = scrollRange > 0
            ? (listbox.scrollTop / scrollRange) * thumbRange
            : 0;
        scrollThumb.style.height = `${thumbHeight}px`;
        scrollThumb.style.transform = `translateY(${thumbTop}px)`;
    };

    const finishScrollDrag = () => {
        scrollDrag = null;
        scrollThumb.classList.remove("is-dragging");
    };

    scrollThumb.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        scrollDrag = { startY: event.clientY, startScrollTop: listbox.scrollTop };
        scrollThumb.classList.add("is-dragging");
        scrollThumb.setPointerCapture(event.pointerId);
    });
    scrollThumb.addEventListener("pointermove", event => {
        if (!scrollDrag) return;
        const thumbRange = scrollTrack.clientHeight - scrollThumb.offsetHeight;
        const scrollRange = listbox.scrollHeight - listbox.clientHeight;
        if (thumbRange <= 0 || scrollRange <= 0) return;
        listbox.scrollTop = scrollDrag.startScrollTop +
            ((event.clientY - scrollDrag.startY) / thumbRange) * scrollRange;
    });
    scrollThumb.addEventListener("pointerup", finishScrollDrag);
    scrollThumb.addEventListener("pointercancel", finishScrollDrag);
    scrollThumb.addEventListener("lostpointercapture", finishScrollDrag);
    scrollTrack.addEventListener("pointerdown", event => {
        if (event.target !== scrollTrack || event.button !== 0) return;
        const bounds = scrollTrack.getBoundingClientRect();
        const scrollRange = listbox.scrollHeight - listbox.clientHeight;
        const ratio = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        listbox.scrollTop = Math.max(0, ratio * scrollRange - listbox.clientHeight / 2);
    });
    listbox.addEventListener("scroll", updateCustomScrollbar, { passive: true });
    window.addEventListener("resize", updateCustomScrollbar, { passive: true });

    button.addEventListener("click", () => {
        if (button.getAttribute("aria-expanded") === "true") {
            close();
        } else {
            open();
        }
    });

    button.addEventListener("keydown", event => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            if (button.getAttribute("aria-expanded") !== "true") open();
        } else if (event.key === "Escape") {
            close();
        }
    });

    listbox.addEventListener("keydown", event => {
        const options = [...listbox.querySelectorAll(".period-option")];
        const currentIndex = options.indexOf(document.activeElement);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, options.length - 1);
        else if (event.key === "ArrowUp") nextIndex = Math.max(currentIndex - 1, 0);
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = options.length - 1;
        else if (event.key === "Escape") {
            event.preventDefault();
            close(true);
            return;
        } else {
            return;
        }

        event.preventDefault();
        options[nextIndex]?.focus();
    });

    document.addEventListener("click", event => {
        if (!field.contains(event.target)) close();
    });

    select.addEventListener("change", syncSelection);
    syncSelection();
}

initializePeriodPicker("month", "monthPickerButton", "monthPickerValue", "monthPickerOptions");
initializePeriodPicker("year", "yearPickerButton", "yearPickerValue", "yearPickerOptions");
initializePeriodPicker("reportYear", "reportYearPickerButton", "reportYearPickerValue", "reportYearPickerOptions");
initializePeriodPicker("reportMonth", "reportMonthPickerButton", "reportMonthPickerValue", "reportMonthPickerOptions");

// ============================================================
// 13. GASTOS FIJOS
// ============================================================

let fixedExpenses = [];

const selectedFixedExpenseIds = new Set();

// ------------------------------------------------------------
// INICIALIZAR DASHBOARD
// ------------------------------------------------------------

updateDashboard();


const newFixedExpenseButton =
    document.getElementById("newFixedExpenseButton");

const fixedExpenseFormPanel =
    document.getElementById("fixedExpenseFormPanel");

const fixedExpenseForm =
    document.getElementById("fixedExpenseForm");

const fixedExpenseId =
    document.getElementById("fixedExpenseId");

const fixedExpenseName =
    document.getElementById("fixedExpenseName");

const fixedExpenseCategory =
    document.getElementById("fixedExpenseCategory");

const fixedExpenseCurrency =
    document.getElementById("fixedExpenseCurrency");

const fixedExpenseAmount =
    document.getElementById("fixedExpenseAmount");

const fixedExpensePaymentMethod =
    document.getElementById("fixedExpensePaymentMethod");

const fixedExpenseCreditCardGroup =
    document.getElementById("fixedExpenseCreditCardGroup");

const fixedExpenseCreditCardId =
    document.getElementById("fixedExpenseCreditCardId");

const fixedExpenseChargeDayGroup =
    document.getElementById("fixedExpenseChargeDayGroup");

const fixedExpenseChargeDay =
    document.getElementById("fixedExpenseChargeDay");

const fixedExpenseExchangeGroup =
    document.getElementById("fixedExpenseExchangeGroup");

const fixedExpenseExchangeRate =
    document.getElementById("fixedExpenseExchangeRate");

const refreshFixedExpenseExchangeRate =
    document.getElementById(
        "refreshFixedExpenseExchangeRate"
    );

const fixedExpenseExchangeStatus =
    document.getElementById(
        "fixedExpenseExchangeStatus"
    );

const fixedExpenseType =
    document.getElementById(
        "fixedExpenseType"
    );

const installmentFields =
    document.getElementById(
        "installmentFields"
    );

const fixedExpensePurchaseDate =
    document.getElementById(
        "fixedExpensePurchaseDate"
    );

const fixedExpenseCutoffDay =
    document.getElementById(
        "fixedExpenseCutoffDay"
    );

const fixedExpenseTotalInstallments =
    document.getElementById(
        "fixedExpenseTotalInstallments"
    );

const fixedExpenseFrequency =
    document.getElementById(
        "fixedExpenseFrequency"
    );

const fixedExpenseDueDay =
    document.getElementById(
        "fixedExpenseDueDay"
    );

const fixedExpenseStartMonthGroup =
    document.getElementById(
        "fixedExpenseStartMonthGroup"
    );

const fixedExpenseStartMonth =
    document.getElementById(
        "fixedExpenseStartMonth"
    );

const fixedExpenseStartMonthMonth =
    document.getElementById("fixedExpenseStartMonthMonth");

const fixedExpenseStartMonthYear =
    document.getElementById("fixedExpenseStartMonthYear");

function updateFixedExpenseStartMonthFromPeriods() {
    if (
        fixedExpenseStartMonth &&
        fixedExpenseStartMonthMonth?.value &&
        fixedExpenseStartMonthYear?.value
    ) {
        fixedExpenseStartMonth.value =
            `${fixedExpenseStartMonthYear.value}-${fixedExpenseStartMonthMonth.value}`;
    }
}

function populateFixedExpenseStartYears() {
    if (!fixedExpenseStartMonthYear) return;

    const currentYear = new Date().getFullYear();
    const sourceYear = String(fixedExpenseStartMonth?.value || "").slice(0, 4);
    const selectedYear = sourceYear || fixedExpenseStartMonthYear.value || String(currentYear);
    const years = new Set();

    for (let year = currentYear + 10; year >= currentYear - 30; year--) {
        years.add(year);
    }
    const parsedSourceYear = Number(sourceYear);
    if (Number.isInteger(parsedSourceYear) && parsedSourceYear > 0) {
        years.add(parsedSourceYear);
    }

    fixedExpenseStartMonthYear.replaceChildren(...[...years]
        .sort((a, b) => b - a)
        .map(year => {
            const option = document.createElement("option");
            option.value = String(year);
            option.textContent = String(year);
            return option;
        }));

    fixedExpenseStartMonthYear.value = selectedYear;
}

function syncFixedExpenseStartMonthPeriods() {
    if (
        !fixedExpenseStartMonth?.value ||
        !fixedExpenseStartMonthMonth ||
        !fixedExpenseStartMonthYear
    ) return;

    const [year, month] = fixedExpenseStartMonth.value.split("-");
    if (!year || !month) return;

    if (![...fixedExpenseStartMonthYear.options].some(option => option.value === year)) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        fixedExpenseStartMonthYear.appendChild(option);
    }

    fixedExpenseStartMonthYear.value = year;
    fixedExpenseStartMonthMonth.value = month;
    fixedExpenseStartMonthYear.dispatchEvent(new Event("change", { bubbles: true }));
    fixedExpenseStartMonthMonth.dispatchEvent(new Event("change", { bubbles: true }));
}

fixedExpenseStartMonthMonth?.addEventListener(
    "change",
    updateFixedExpenseStartMonthFromPeriods
);
fixedExpenseStartMonthYear?.addEventListener(
    "change",
    updateFixedExpenseStartMonthFromPeriods
);

function closeFixedExpensePickerMenus() {
    fixedExpenseFormPanel?.querySelectorAll(".period-trigger[aria-expanded='true']")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
            const listbox = document.getElementById(button.getAttribute("aria-controls"));
            if (!listbox) return;
            listbox.hidden = true;
            listbox.classList.remove("has-custom-scrollbar");
            const track = listbox.parentElement?.querySelector(".period-scrollbar");
            if (track) track.hidden = true;
        });
}

function updateFixedExpenseTypeVisibility() {
    const isInstallment =
        fixedExpenseType?.value === "installment";

    const isRecurring =
        fixedExpenseType?.value === "recurring";

    const isCard =
        fixedExpensePaymentMethod?.value === "card";

    if (installmentFields) {
        installmentFields.style.display =
            isInstallment ? "contents" : "none";
    }

    if (fixedExpenseCreditCardGroup) {
        fixedExpenseCreditCardGroup.hidden = !isCard;
    }

    if (fixedExpenseChargeDayGroup) {
        fixedExpenseChargeDayGroup.hidden =
            !(isCard && isRecurring);
    }

    if (fixedExpenseStartMonthGroup) {
        fixedExpenseStartMonthGroup.hidden = !isRecurring;
    }

    if (fixedExpenseStartMonth) {
        fixedExpenseStartMonth.required = isRecurring;
    }
}

fixedExpenseType?.addEventListener(
    "change",
    updateFixedExpenseTypeVisibility
);

fixedExpensePaymentMethod?.addEventListener(
    "change",
    updateFixedExpenseTypeVisibility
);

updateFixedExpenseTypeVisibility();

const fixedExpenseActive =
    document.getElementById(
        "fixedExpenseActive"
    );

const fixedExpenseNotes =
    document.getElementById(
        "fixedExpenseNotes"
    );

const cancelFixedExpenseButton =
    document.getElementById(
        "cancelFixedExpenseButton"
    );

const fixedExpenseTableContainer =
    document.getElementById(
        "fixedExpenseTableContainer"
    );

// ============================================================
// SUPABASE - GASTOS FIJOS
// ============================================================

async function initializeFixedExpenses() {

    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar gastos fijos."
        );

        renderFixedExpenseTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("gastos_fijos")
            .select(`
    id,
    name,
    category_id,
    category_name,
    currency,
    amount,
    exchange_rate,
    amount_gtq,
    expense_type,
    purchase_date,
    cutoff_day,
    total_installments,
    frequency,
    due_day,
    payment_method,
    credit_card_id,
    charge_day,
    active,
    notes,
    created_at,
    updated_at
`)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


                if (error) {
            throw error;
        }

        const supabaseFixedExpenses =
            data || [];

        fixedExpenses =
            supabaseFixedExpenses.map(
                expense => ({

                    id:
                        expense.id,

                    name:
                        expense.name,

                    categoryId:
                        expense.category_id,

                    categoryName:
                        expense.category_name,

                    currency:
                        expense.currency,

                    amount:
                        Number(
                            expense.amount
                        ),

                    exchangeRate:
                        Number(
                            expense.exchange_rate
                        ),

                                        amountGTQ:
                        Number(
                            expense.amount_gtq
                        ),

                    expenseType: 
                        expense.expense_type,

                    startMonth:
                        expense.expense_type === "recurring"
                            ? String(
                                expense.purchase_date ||
                                expense.created_at ||
                                getCurrentMonthInputValue()
                            ).slice(0, 7)
                            : null,

                    purchaseDate:
                        expense.expense_type === "installment"
                            ? expense.purchase_date
                            : null,
                    
                    cutoffDay: 
                        expense.cutoff_day,
                         
                    totalInstallments: 
                        expense.total_installments,

                    frequency:
                        expense.frequency,

                    dueDay:
                        expense.due_day,

                    paymentMethod:
                        expense.payment_method || "cash",

                    creditCardId:
                        expense.credit_card_id || null,

                    chargeDay:
                        expense.charge_day || null,

                    active:
                        expense.active !== false,

                    notes:
                        expense.notes ||
                        "",

                    createdAt:
                        expense.created_at,

                    updatedAt:
                        expense.updated_at

                })
            );

        renderFixedExpenseTable();


        if (
            typeof updateDashboard ===
            "function"
        ) {

            updateDashboard();

        }


        console.log(
            "Gastos fijos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando gastos fijos con Supabase:",
            error
        );

        renderFixedExpenseTable();

    }

}

function populateFixedExpenseCategories() {

    if (!fixedExpenseCategory) return;

    const activeCategories =
        categories.expense.filter(
            category => category.active !== false
        );

    fixedExpenseCategory.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;

    activeCategories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        fixedExpenseCategory.appendChild(option);

    });

}


// ------------------------------------------------------------
// CALCULAR EQUIVALENTE MENSUAL DEL GASTO FIJO
// ------------------------------------------------------------

function getFixedExpenseMonthlyAmount(expense) {

    const amount =
        parseFloat(
            expense.amountGTQ
        ) || 0;


    // --------------------------------------------------------
    // GASTOS POR CUOTAS
    // --------------------------------------------------------

    if (
        expense.expenseType ===
            "installment" &&
        expense.totalInstallments > 0
    ) {

        return (
            amount /
            Number(
                expense.totalInstallments
            )
        );

    }


    // --------------------------------------------------------
    // GASTOS RECURRENTES
    // --------------------------------------------------------

    switch (expense.frequency) {

        case "weekly":

            return (
                amount *
                52 /
                12
            );


        case "biweekly":

            return (
                amount *
                26 /
                12
            );


        case "yearly":

            return (
                amount /
                12
            );


        case "monthly":
        default:

            return amount;

    }

}


function formatFixedExpenseFrequency(frequency) {

    switch (frequency) {

        case "weekly":
            return "Semanal";

        case "biweekly":
            return "Quincenal";

        case "yearly":
            return "Anual";

        case "monthly":
        default:
            return "Mensual";

    }

}

function getFixedExpenseInstallmentProgress(expense) {
    if (
        expense.expenseType !== "installment" ||
        !expense.purchaseDate ||
        !expense.cutoffDay ||
        !expense.dueDay ||
        !expense.totalInstallments
    ) {
        return null;
    }

    const purchaseDate =
        new Date(
            expense.purchaseDate + "T00:00:00"
        );

    const cutoffDay =
        Number(expense.cutoffDay);

    const paymentDay =
        Number(expense.dueDay);

    const total =
        Number(expense.totalInstallments);

    // Determinar el mes del estado de cuenta
    let statementYear =
        purchaseDate.getFullYear();

    let statementMonth =
        purchaseDate.getMonth();

    /*
     * Si la compra ocurrió después del día de corte,
     * pasa al siguiente estado de cuenta.
     *
     * Ejemplo:
     * Compra: 26/04
     * Corte: 20
     * Estado de cuenta: mayo
     * Pago: 13/06
     */
    if (
        purchaseDate.getDate() >
        cutoffDay
    ) {
        statementMonth++;

        if (statementMonth > 11) {
            statementMonth = 0;
            statementYear++;
        }
    }

    /*
     * La primera cuota se paga en el mes
     * siguiente al estado de cuenta.
     */
    let firstPaymentYear =
        statementYear;

    let firstPaymentMonth =
        statementMonth + 1;

    if (firstPaymentMonth > 11) {
        firstPaymentMonth = 0;
        firstPaymentYear++;
    }

    const firstPaymentDate =
        new Date(
            firstPaymentYear,
            firstPaymentMonth,
            paymentDay
        );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (today < firstPaymentDate) {
        return {
            current: 0,
            total
        };
    }

    const monthsElapsed =
        (
            today.getFullYear() -
            firstPaymentDate.getFullYear()
        ) * 12 +
        (
            today.getMonth() -
            firstPaymentDate.getMonth()
        );

    let current =
        monthsElapsed + 1;

    /*
     * Si todavía no hemos llegado al día
     * de pago del mes actual, ese pago aún
     * no cuenta como realizado.
     */
    if (
        today.getDate() <
        paymentDay
    ) {
        current--;
    }

    current =
        Math.min(
            Math.max(current, 1),
            total
        );

    return {
        current,
        total
    };
}

// ------------------------------------------------------------
// CALCULAR CUOTA CORRESPONDIENTE A UN MES ESPECÍFICO
// ------------------------------------------------------------

function getFixedExpenseInstallmentProgressForMonth(
    expense,
    selectedDate
) {

    if (
        expense.expenseType !==
            "installment" ||
        !expense.purchaseDate ||
        !expense.cutoffDay ||
        !expense.dueDay ||
        !expense.totalInstallments
    ) {
        return null;
    }


    const purchaseDate =
        new Date(
            expense.purchaseDate +
            "T00:00:00"
        );


    const cutoffDay =
        Number(
            expense.cutoffDay
        );


    const paymentDay =
        Number(
            expense.dueDay
        );


    const total =
        Number(
            expense.totalInstallments
        );


    let statementYear =
        purchaseDate.getFullYear();


    let statementMonth =
        purchaseDate.getMonth();


    if (
        purchaseDate.getDate() >
        cutoffDay
    ) {

        statementMonth++;

        if (
            statementMonth > 11
        ) {

            statementMonth = 0;
            statementYear++;

        }

    }


    let firstPaymentYear =
        statementYear;


    let firstPaymentMonth =
        statementMonth + 1;


    if (
        firstPaymentMonth > 11
    ) {

        firstPaymentMonth = 0;
        firstPaymentYear++;

    }


    const firstPaymentDate =
        new Date(
            firstPaymentYear,
            firstPaymentMonth,
            paymentDay
        );


    const selectedYear =
        selectedDate.getFullYear();


    const selectedMonth =
        selectedDate.getMonth();


    const monthsElapsed =
        (
            selectedYear -
            firstPaymentDate.getFullYear()
        ) * 12 +
        (
            selectedMonth -
            firstPaymentDate.getMonth()
        );


    if (
        monthsElapsed < 0 ||
        monthsElapsed >= total
    ) {
        return null;
    }


    return {
        current:
            monthsElapsed + 1,

        total
    };

}

function openFixedExpenseForm(expense = null) {

    if (!fixedExpenseFormPanel) return;

    closeFixedExpensePickerMenus();
    populateFixedExpenseCategories();

    fixedExpenseForm.reset();

    populateFixedExpenseCreditCardOptions(
    expense?.creditCardId || null
);

    fixedExpenseId.value =
        expense?.id || "";

    if (expense) {

        fixedExpenseName.value =
            expense.name || "";

        fixedExpenseCategory.value =
            expense.categoryId || "";

        fixedExpenseCurrency.value =
            expense.currency || "GTQ";

        fixedExpenseAmount.value =
            expense.amount || "";

        fixedExpenseType.value =
            expense.expenseType || "recurring";

        fixedExpensePurchaseDate.value =
            expense.purchaseDate || "";

        fixedExpenseStartMonth.value =
            expense.startMonth ||
            (expense.createdAt
                ? String(expense.createdAt).slice(0, 7)
                : getCurrentMonthInputValue());

        fixedExpenseCutoffDay.value =
            expense.cutoffDay || "";

        fixedExpenseTotalInstallments.value =
           expense.totalInstallments || "";

        fixedExpenseExchangeRate.value =
            expense.exchangeRate || "";

        fixedExpenseFrequency.value =
            expense.frequency || "monthly";

        fixedExpenseDueDay.value =
    expense.dueDay || "";

fixedExpensePaymentMethod.value =
    expense.paymentMethod || "cash";

fixedExpenseCreditCardId.value =
    expense.creditCardId || "";

fixedExpenseChargeDay.value =
    expense.chargeDay || "";

        fixedExpenseActive.value =
            String(
                expense.active !== false
            );

        fixedExpenseNotes.value =
            expense.notes || "";

    } else {

    fixedExpenseCurrency.value = "GTQ";

    fixedExpenseType.value =
        "recurring";

    fixedExpensePurchaseDate.value =
    "";

    fixedExpenseStartMonth.value =
        getCurrentMonthInputValue();

fixedExpenseCutoffDay.value =
    "";

fixedExpenseTotalInstallments.value =
    "";

    fixedExpenseFrequency.value =
        "monthly";

    fixedExpenseActive.value =
        "true";

}

    populateFixedExpenseStartYears();
    initializePeriodPicker(
        "fixedExpenseStartMonthMonth",
        "fixedExpenseStartMonthMonthButton",
        "fixedExpenseStartMonthMonthValue",
        "fixedExpenseStartMonthMonthOptions"
    );
    initializePeriodPicker(
        "fixedExpenseStartMonthYear",
        "fixedExpenseStartMonthYearButton",
        "fixedExpenseStartMonthYearValue",
        "fixedExpenseStartMonthYearOptions"
    );
    syncFixedExpenseStartMonthPeriods();
    // Si el registro es histórico, refresca la lista con el año que se añadió.
    initializePeriodPicker(
        "fixedExpenseStartMonthYear",
        "fixedExpenseStartMonthYearButton",
        "fixedExpenseStartMonthYearValue",
        "fixedExpenseStartMonthYearOptions"
    );

    updateFixedExpenseExchangeVisibility();
    updateFixedExpenseTypeVisibility();

    refreshDatePicker("fixedExpensePurchaseDate");
    fixedExpenseFormPanel.hidden = false;

    fixedExpenseFormPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeFixedExpenseForm() {

    if (!fixedExpenseFormPanel) return;

    closeFixedExpensePickerMenus();
    fixedExpenseForm.reset();

    fixedExpenseId.value = "";

    fixedExpenseFormPanel.hidden = true;

}


function updateFixedExpenseExchangeVisibility() {

    if (!fixedExpenseExchangeGroup) return;

    if (
        fixedExpenseCurrency.value === "USD"
    ) {

        fixedExpenseExchangeGroup.hidden = false;

        if (
            !fixedExpenseExchangeRate.value
        ) {

            fixedExpenseExchangeRate.value =
                "";

        }

    } else {

        fixedExpenseExchangeGroup.hidden = true;

        fixedExpenseExchangeRate.value =
            "";

    }

}


function getFixedExpenseExchangeRate() {

    const rate =
        parseFloat(
            fixedExpenseExchangeRate.value
        );

    return rate > 0 ? rate : null;

}


async function refreshFixedExpenseRate() {
    if (!refreshFixedExpenseExchangeRate) return;

    refreshFixedExpenseExchangeRate.disabled = true;
    if (fixedExpenseExchangeStatus) {
        fixedExpenseExchangeStatus.textContent = "Consultando referencia del Banco de Guatemala…";
    }

    try {
        const quote = await getBanguatReferenceRate();
        fixedExpenseExchangeRate.value = quote.rate.toFixed(5);
        if (fixedExpenseExchangeStatus) {
            fixedExpenseExchangeStatus.textContent = `Referencia Banguat${quote.date ? ` · ${quote.date}` : ""}.`;
        }
    } catch (error) {
        console.error("No se pudo consultar el tipo de cambio de Banguat:", error);
        if (fixedExpenseExchangeStatus) {
            fixedExpenseExchangeStatus.textContent = "No se pudo consultar Banguat. Ingresa la tasa manualmente o despliega la función de conexión.";
        }
    } finally {
        refreshFixedExpenseExchangeRate.disabled = false;
    }
}

function getFixedExpenseCategoryName(
    categoryId
) {

    const category =
        categories.expense.find(
            item => item.id === categoryId
        );

    return (
        category?.name ||
        "Categoría eliminada"
    );

}


if (newFixedExpenseButton) {

    newFixedExpenseButton.addEventListener(
        "click",
        () => openFixedExpenseForm()
    );

}


if (cancelFixedExpenseButton) {

    cancelFixedExpenseButton.addEventListener(
        "click",
        closeFixedExpenseForm
    );

}


if (fixedExpenseCurrency) {

    fixedExpenseCurrency.addEventListener(
        "change",
        updateFixedExpenseExchangeVisibility
    );

}


if (refreshFixedExpenseExchangeRate) {

    refreshFixedExpenseExchangeRate.addEventListener(
        "click",
        refreshFixedExpenseRate
    );

}


if (fixedExpenseForm) {

    fixedExpenseForm.addEventListener(
    "submit",
    async event => {

            event.preventDefault();

            const name =
                fixedExpenseName.value.trim();

            const categoryId =
                fixedExpenseCategory.value;

            const currency =
                fixedExpenseCurrency.value;

            const amount =
                parseFloat(
                    fixedExpenseAmount.value
                );

            const frequency =
                fixedExpenseFrequency.value;

                const expenseType =
    fixedExpenseType.value;

    const paymentMethod =
    fixedExpensePaymentMethod.value || "cash";

const creditCardId =
    paymentMethod === "card"
        ? fixedExpenseCreditCardId.value
        : null;

const chargeDay =
    paymentMethod === "card" &&
    expenseType === "recurring" &&
    fixedExpenseChargeDay.value
        ? Number(fixedExpenseChargeDay.value)
        : null;

const selectedFixedExpenseCard =
    creditCards.find(
        card =>
            String(card.id) === String(creditCardId) &&
            card.active !== false
    );

const purchaseDate =
    fixedExpensePurchaseDate.value ||
    null;

const startMonth =
    expenseType === "recurring"
        ? fixedExpenseStartMonth.value
        : null;

const cutoffDay =
    fixedExpenseCutoffDay.value
        ? Number(fixedExpenseCutoffDay.value)
        : null;

const totalInstallments =
    fixedExpenseTotalInstallments.value
        ? Number(
            fixedExpenseTotalInstallments.value
        )
        : null;

            const dueDay =
                fixedExpenseDueDay.value
                    ? Number(
                        fixedExpenseDueDay.value
                    )
                    : null;

            const active =
                fixedExpenseActive.value === "true";

            const notes =
                fixedExpenseNotes.value.trim();


            if (!name) {

                alert(
                    "Ingresa el nombre del gasto fijo."
                );

                return;

            }

            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;

            }

            if (!amount || amount <= 0) {

                alert(
                    "Ingresa un monto válido."
                );

                return;

            }

            if (expenseType === "recurring" && !startMonth) {
    alert("Selecciona el mes de inicio del gasto recurrente.");
    return;
}

if (
    paymentMethod === "card" &&
    !selectedFixedExpenseCard
) {
    alert("Selecciona una tarjeta de crédito activa.");
    return;
}

if (
    paymentMethod === "card" &&
    expenseType === "recurring" &&
    (!chargeDay || chargeDay < 1 || chargeDay > 31)
) {
    alert("Ingresa el día mensual en que se realiza el cargo.");
    return;
}

            if (
    expenseType === "installment" &&
    (
        !purchaseDate ||
        !cutoffDay ||
        cutoffDay < 1 ||
        cutoffDay > 31 ||
        !totalInstallments ||
        totalInstallments <= 0
    )
) {

    alert(
        "Ingresa la fecha de compra, el día de corte y el número de cuotas."
    );

    return;
}

            let exchangeRate = 1;

            if (currency === "USD") {

                exchangeRate =
                    getFixedExpenseExchangeRate();

                if (!exchangeRate) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;

                }

            }

            const amountGTQ =
                currency === "USD"
                    ? amount * exchangeRate
                    : amount;

            const existingId =
                fixedExpenseId.value;

            const existingExpense =
                fixedExpenses.find(
                    item => item.id === existingId
                );

            const fixedExpense = {

                id:
                    existingId ||
                    Date.now().toString(),

                name,

                categoryId,

                categoryName:
                    getFixedExpenseCategoryName(
                        categoryId
                    ),
                currency,
                amount,
                exchangeRate,
                amountGTQ,
                expenseType,
                startMonth,
                purchaseDate: expenseType === "installment" ? purchaseDate : null,
                cutoffDay,
                totalInstallments,
               frequency,
               dueDay,
paymentMethod,
creditCardId,
chargeDay,
active,
                notes,
                createdAt:
                    existingExpense?.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

                        };


            const user = await getCurrentUser();

            if (!user) {

                alert(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );

                return;

            }


            const databaseData = {

                id:
                    fixedExpense.id,

                user_id:
                    user.id,

                name:
                    fixedExpense.name,

                category_id:
                    fixedExpense.categoryId,

                category_name:
                    fixedExpense.categoryName,

                currency:
                    fixedExpense.currency,

                amount:
                    fixedExpense.amount,

                exchange_rate:
                    fixedExpense.exchangeRate,

                amount_gtq:
                    fixedExpense.amountGTQ,

                expense_type:
                    fixedExpense.expenseType,

                // Recurrentes reutilizan purchase_date para guardar su mes de inicio.
                purchase_date:
                    fixedExpense.expenseType === "recurring"
                        ? fixedExpense.startMonth + "-01"
                        : fixedExpense.purchaseDate,

                cutoff_day: 
                    fixedExpense.cutoffDay,

                total_installments: 
                    fixedExpense.totalInstallments,

                frequency:
                    fixedExpense.frequency,

                due_day:
    fixedExpense.dueDay,

payment_method:
    fixedExpense.paymentMethod,

credit_card_id:
    fixedExpense.creditCardId,

charge_day:
    fixedExpense.chargeDay,

active:
    fixedExpense.active,

                notes:
                    fixedExpense.notes,

                created_at:
                    fixedExpense.createdAt,

                updated_at:
                    fixedExpense.updatedAt

            };


            const { error } =
                await supabaseClient
                    .from("gastos_fijos")
                    .upsert(databaseData);


            if (error) {

                console.error(
                    "Error guardando gasto fijo en Supabase:",
                    error
                );

                alert(
                    "No se pudo guardar el gasto fijo."
                );

                return;

            }


            if (existingId) {

                const index =
                    fixedExpenses.findIndex(
                        item =>
                            item.id === existingId
                    );

                if (index !== -1) {

                    fixedExpenses[index] =
                        fixedExpense;

                }

            } else {

                fixedExpenses.push(
                    fixedExpense
                );

            }

            renderFixedExpenseTable();

            closeFixedExpenseForm();

            if (
                typeof updateDashboard ===
                "function"
            ) {

                updateDashboard();

            }

        }
    );

}

function renderFixedExpenseTable() {

    if (!fixedExpenseTableContainer) {
        return;
    }

    if (fixedExpenses.length === 0) {

        fixedExpenseTableContainer.innerHTML = `

            <div class="fixed-expense-empty">

                <strong>
                    No hay gastos fijos registrados
                </strong>

                <span>
                    Agrega tu primer gasto recurrente
                    para comenzar.
                </span>

            </div>

        `;

        return;

    }


    const sortedExpenses =
        [...fixedExpenses].sort(
            (a, b) => {

                if (
                    a.active !== b.active
                ) {

                    return a.active ? -1 : 1;

                }

                return a.name.localeCompare(
                    b.name
                );

            }
        );


    let html = `

<div class="fixed-expense-table-wrapper">

    <div class="fixed-expense-bulk-actions">
<label class="bulk-select-all-mobile">
    <input
        type="checkbox"
        id="selectAllFixedExpensesMobile"
        aria-label="Seleccionar todos los gastos fijos">
    Todos
</label>
        <span id="selectedFixedExpenseCount">
            ${selectedFixedExpenseIds.size} seleccionados
        </span>

        <button
            type="button"
            id="deleteSelectedFixedExpenses"
            class="table-action-button delete"
            ${selectedFixedExpenseIds.size === 0 ? "disabled" : ""}>
            Eliminar seleccionados
        </button>
    </div>

    <table class="fixed-expense-table compact-table">

        <thead>

            <tr>

                <th>
                    <input
                        type="checkbox"
                        id="selectAllFixedExpenses"
                        aria-label="Seleccionar todos los gastos fijos">
                    Nombre
                </th>

                <th>Categoría</th>

                <th>Monto</th>

                <th>Frecuencia</th>

                <th>Equivalente mensual</th>

                <th>Día</th>

                <th>Estado</th>

                <th>Acciones</th>

            </tr>

        </thead>

        <tbody>
    `;


    sortedExpenses.forEach(expense => {

        const monthlyAmount =
            getFixedExpenseMonthlyAmount(
                expense
            );

        const installmentProgress =
            getFixedExpenseInstallmentProgress(
                expense
            );

        const installmentFinished =
            expense.expenseType === "installment" &&
            installmentProgress &&
            installmentProgress.current >=
                installmentProgress.total;

        const statusClass =
            installmentFinished
                ? "inactive"
                : expense.active
                    ? "active"
                    : "inactive";

        const statusText =
            installmentFinished
                ? "Finalizado"
                : expense.active
                    ? "Activo"
                    : "Inactivo";

        const categoryText =
            expense.categoryName ||
            getFixedExpenseCategoryName(
                expense.categoryId
            );

        const frequencyText =
            expense.expenseType === "installment"
                ? `${formatFixedExpenseFrequency(
                    expense.frequency
                )} · ${
                    installmentProgress
                        ? `${installmentProgress.current} de ${installmentProgress.total}`
                        : "Sin iniciar"
                }`
                : formatFixedExpenseFrequency(
                    expense.frequency
                ) +
                    " · Desde " +
                    formatFixedExpenseStartMonth(
                        getFixedExpenseStartMonth(expense)
                    );

        const dayText =
            expense.expenseType === "recurring" &&
            expense.paymentMethod === "card"
                ? expense.chargeDay
                    ? `Día ${expense.chargeDay}`
                    : "—"
                : expense.dueDay
                    ? `Día ${expense.dueDay}`
                    : "—";

        const isSelected =
            selectedFixedExpenseIds.has(
                String(expense.id)
            );


        html += `

            <tr class="compact-main-row">

                <td>

                    <label>
                        <input
                            type="checkbox"
                            class="fixed-expense-select-checkbox"
                            data-fixed-expense-select-id="${expense.id}"
                            aria-label="Seleccionar gasto fijo"
                            ${isSelected ? "checked" : ""}
                        >

                        <div class="fixed-expense-name">
                            ${escapeHtml(expense.name)}
                        </div>
                    </label>

                </td>

                <td>
                    <div class="fixed-expense-category">
                        ${escapeHtml(categoryText)}
                    </div>
                </td>

                <td>
                    <div class="fixed-expense-amount">
                        ${formatCurrency(
                            expense.amount,
                            expense.currency
                        )}
                    </div>
                </td>

                <td>
                    <div class="fixed-expense-frequency">
                        ${frequencyText}
                    </div>
                </td>

                <td>
                    <div class="fixed-expense-monthly">
                        ${formatCurrency(
                            monthlyAmount,
                            "GTQ"
                        )}
                    </div>
                </td>

                <td>
                    ${dayText}
                </td>

                <td>
                    <span
                        class="fixed-expense-status ${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <div class="fixed-expense-actions">

                        <button
                            type="button"
                            class="fixed-expense-action-button edit"
                            data-action="edit"
                            data-id="${expense.id}">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="fixed-expense-action-button delete"
                            data-action="delete"
                            data-id="${expense.id}">
                            Eliminar
                        </button>

                    </div>
                </td>

                <td class="compact-summary-cell" colspan="8">
                    <input
                        type="checkbox"
                        class="fixed-expense-select-checkbox compact-select-checkbox"
                        data-fixed-expense-select-id="${expense.id}"
                        aria-label="Seleccionar gasto fijo"
                        ${isSelected ? "checked" : ""}>

                    <button
                        type="button"
                        class="compact-toggle"
                        data-fixed-expense-toggle="${expense.id}"
                        aria-expanded="false">
                        <span class="compact-lead">
                            <span class="fixed-expense-status ${statusClass}">
                                ${statusText}
                            </span>
                        </span>
                        <span class="compact-title">${escapeHtml(expense.name)}</span>
                        <span class="compact-amount">
                            ${formatCurrency(monthlyAmount, "GTQ")}
                        </span>
                        <span class="compact-chevron" aria-hidden="true">⌄</span>
                    </button>
                </td>

            </tr>

            <tr
                class="compact-details-row"
                data-fixed-expense-details="${expense.id}"
                hidden>
                <td colspan="8">
                    <div class="compact-details-panel">

                        <div class="compact-detail-group">
                            <div class="compact-detail-item">
                                <span>Categoría</span>
                                <strong>${escapeHtml(categoryText)}</strong>
                            </div>

                            <div class="compact-detail-item">
                                <span>Frecuencia</span>
                                <strong>${frequencyText}</strong>
                            </div>

                            <div class="compact-detail-item">
                                <span>Monto</span>
                                <strong>
                                    ${formatCurrency(expense.amount, expense.currency)}
                                </strong>
                            </div>

                            <div class="compact-detail-item">
                                <span>Equivalente mensual</span>
                                <strong>
                                    ${formatCurrency(monthlyAmount, "GTQ")}
                                </strong>
                            </div>

                            <div class="compact-detail-item">
                                <span>Día</span>
                                <strong>${dayText}</strong>
                            </div>
                        </div>

                        ${
                            expense.notes
                                ? `
                                    <div class="compact-detail-item compact-detail-box">
                                        <span>Notas</span>
                                        <strong>${escapeHtml(expense.notes)}</strong>
                                    </div>
                                `
                                : ""
                        }

                        <div class="fixed-expense-actions compact-details-actions">
                            <button
                                type="button"
                                class="fixed-expense-action-button edit"
                                data-action="edit"
                                data-id="${expense.id}">
                                Editar
                            </button>

                            <button
                                type="button"
                                class="fixed-expense-action-button delete"
                                data-action="delete"
                                data-id="${expense.id}">
                                Eliminar
                            </button>
                        </div>

                    </div>
                </td>
            </tr>

        `;

    });


    html += `

        </tbody>

    </table>

</div>

    `;


    fixedExpenseTableContainer.innerHTML =
        html;

}


bindBulkSelection({
    container: fixedExpenseTableContainer,
    checkboxSelector: ".fixed-expense-select-checkbox",
    selectAllId: "selectAllFixedExpenses",
    idKey: "fixedExpenseSelectId",
    selectedIds: selectedFixedExpenseIds,
    counterId: "selectedFixedExpenseCount",
    deleteButtonId: "deleteSelectedFixedExpenses"
});

bindAccordion({
    container: fixedExpenseTableContainer,
    toggleAttr: "data-fixed-expense-toggle",
    detailsAttr: "data-fixed-expense-details"
});


if (fixedExpenseTableContainer) {

    fixedExpenseTableContainer.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;

            const id =
                button.dataset.id;

            const action =
                button.dataset.action;

            const expense =
                fixedExpenses.find(
                    item => item.id === id
                );

            if (!expense) return;


            if (action === "edit") {

                openFixedExpenseForm(
                    expense
                );

                return;

            }


            if (action === "delete") {

    const confirmed =
        confirm(
            `¿Eliminar el gasto fijo "${expense.name}"?`
        );

    if (!confirmed) return;

    const user =
        await getCurrentUser();

    if (!user) {

        alert(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
        );

        return;
    }

    const {
        error
    } = await supabaseClient
        .from("gastos_fijos")
        .delete()
        .eq(
            "id",
            id
        )
        .eq(
            "user_id",
            user.id
        );

    if (error) {

        console.error(
            "Error eliminando gasto fijo:",
            error
        );

        alert(
            "No se pudo eliminar el gasto fijo."
        );

        return;
    }

    fixedExpenses =
        fixedExpenses.filter(
            item =>
                item.id !== id
        );

    renderFixedExpenseTable();

    if (
        typeof updateDashboard ===
        "function"
    ) {

        updateDashboard();

    }

}

        }
    );

}


document.addEventListener("click", async event => {
    const button = event.target.closest("#deleteSelectedFixedExpenses");

    if (!button) return;

    console.log("IDs seleccionados:", [...selectedFixedExpenseIds]);
console.log("IDs de gastos fijos:", fixedExpenses.map(expense => expense.id));
console.log("Tipos de IDs:", fixedExpenses.map(expense => typeof expense.id));

    const ids = [...selectedFixedExpenseIds].filter(id =>
        fixedExpenses.some(expense => String(expense.id) === String(id))
    );

    if (ids.length === 0) {
        alert("Selecciona al menos un gasto fijo.");
        return;
    }

    const confirmed = confirm(
        `¿Seguro que quieres eliminar ${ids.length} gasto(s) fijo(s) seleccionado(s)? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    const user = await getCurrentUser();

    if (!user) {
        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
        return;
    }

    button.disabled = true;

    try {
        const { data, error } = await supabaseClient
            .from("gastos_fijos")
            .delete()
            .in("id", ids)
            .eq("user_id", user.id)
            .select("id");

        if (error) throw error;

        const deletedIds = new Set(
            (data || []).map(item => String(item.id))
        );

        if (deletedIds.size === 0) {
            alert(
                "No se eliminó ningún gasto fijo. Revisa los permisos de DELETE en Supabase."
            );
            button.disabled = false;
            return;
        }

        fixedExpenses = fixedExpenses.filter(
            expense => !deletedIds.has(String(expense.id))
        );

        deletedIds.forEach(id => selectedFixedExpenseIds.delete(id));

        renderFixedExpenseTable();

        if (typeof updateDashboard === "function") {
            updateDashboard();
        }

        alert(`${deletedIds.size} gasto(s) fijo(s) eliminado(s).`);

    
} catch (error) {
    console.error(
        "Error eliminando gastos fijos seleccionados:",
        error
    );

    alert(
        `Error al eliminar gastos fijos: ${
            error.message || JSON.stringify(error)
        }`
    );

    button.disabled = false;
}

});

populateFixedExpenseCategories();

renderFixedExpenseTable();

// ============================================================
// 13. REPORTES
// ============================================================

const reportYear =
    document.getElementById("reportYear");

const reportMonth =
    document.getElementById("reportMonth");

const reportIncome =
    document.getElementById("reportIncome");

const reportExpenses =
    document.getElementById("reportExpenses");

const reportBalance =
    document.getElementById("reportBalance");

const reportFixed =
    document.getElementById("reportFixed");

const reportBudgetContainer =
    document.getElementById(
        "reportBudgetContainer"
    );

const reportCategoryContainer =
    document.getElementById(
        "reportCategoryContainer"
    );

const reportMonthlyContainer =
    document.getElementById(
        "reportMonthlyContainer"
    );


function getReportYear() {

    return Number(
        reportYear?.value ||
        new Date().getFullYear()
    );

}


function getReportMonth() {

    return reportMonth?.value || "all";

}


function reportDateMatches(
    date,
    year,
    month
) {

    if (!date) {
        return false;
    }

    const value =
        String(date);

    if (
        !value.startsWith(
            String(year)
        )
    ) {
        return false;
    }

    if (month === "all") {
        return true;
    }

    return value.substring(5, 7) === month;

}

function getReportExpenses() {

    return Array.isArray(expenses)
        ? expenses
        : [];

}

function getReportFixedExpenses() {

    return Array.isArray(fixedExpenses)
        ? fixedExpenses
        : [];

}

function getReportBudgets() {

    return Array.isArray(budgets)
        ? budgets
        : [];

}


function getReportIncomeTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    return incomes.reduce(
        (total, income) => {

            if (
                !reportDateMatches(
                    income.date,
                    year,
                    month
                )
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        income.amountGTQ
                    ) || 0
                );

        },
        0
    );

}


function getReportExpenseTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    return getReportExpenses().reduce(
        (total, expense) => {

            if (
                !reportDateMatches(
                    expense.date,
                    year,
                    month
                )
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        expense.amountGTQ
                    ) || 0
                );

        },
        0
    );

}


function getReportFixedMonthlyTotal() {

    const fixedExpenses =
        getReportFixedExpenses();

    const reportYear = getReportYear();
    const reportMonth = getReportMonth();
    const reportPeriodEnd = new Date(
        reportYear,
        reportMonth === "all" ? 11 : Number(reportMonth) - 1,
        1
    );

    return fixedExpenses.reduce(
        (total, expense) => {

            if (
                expense.active === false
            ) {
                return total;
            }


            if (!isFixedExpenseStartedByMonth(expense, reportPeriodEnd)) {
                return total;
            }

            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;

            if (expense.expenseType === "installment") {
    return total + getFixedExpenseMonthlyAmount(expense);
}    

            switch (
                expense.frequency
            ) {

                case "weekly":
                    return total +
                        (
                            amount * 52 / 12
                        );

                case "biweekly":
                    return total +
                        (
                            amount * 26 / 12
                        );

                case "yearly":
                    return total +
                        (
                            amount / 12
                        );

                case "monthly":
                default:
                    return total + amount;

            }

        },
        0
    );

}


function updateReportSummary() {

    const income =
        getReportIncomeTotal();

    const expenses =
        getReportExpenseTotal();

    const balance =
        income - expenses;

    const fixed =
        getReportFixedMonthlyTotal();


    if (reportIncome) {

        reportIncome.textContent =
            formatCurrency(
                income,
                "GTQ"
            );

    }


    if (reportExpenses) {

        reportExpenses.textContent =
            formatCurrency(
                expenses,
                "GTQ"
            );

    }


    if (reportBalance) {

        reportBalance.textContent =
            formatCurrency(
                balance,
                "GTQ"
            );

        reportBalance.classList.toggle(
            "report-positive",
            balance > 0
        );

        reportBalance.classList.toggle(
            "report-negative",
            balance < 0
        );

    }


    if (reportFixed) {

        reportFixed.textContent =
            formatCurrency(
                fixed,
                "GTQ"
            );

    }

}


function getReportBudgetTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    const budgets =
        getReportBudgets();

    if (month === "all") {

        return budgets.reduce(
            (total, budget) => {

                if (
                    !String(
                        budget.month
                    ).startsWith(
                        String(year)
                    )
                ) {
                    return total;
                }

                return total +
                    (
                        parseFloat(
                            budget.amount
                        ) || 0
                    );

            },
            0
        );

    }


    const targetMonth =
        `${year}-${month}`;

    return budgets.reduce(
        (total, budget) => {

            if (
                budget.month !==
                targetMonth
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        budget.amount
                    ) || 0
                );

        },
        0
    );

}


function renderReportBudget() {

    if (!reportBudgetContainer) {
        return;
    }

    const budget =
        getReportBudgetTotal();

    const expenses =
        getReportExpenseTotal();


    if (
        budget === 0 &&
        expenses === 0
    ) {

        reportBudgetContainer.innerHTML = `

            <div class="report-empty">
                No hay presupuesto ni gastos
                registrados para el período seleccionado.
            </div>

        `;

        return;

    }


    const percentage =
        budget > 0
            ? (expenses / budget) * 100
            : 0;

    const visiblePercentage =
        Math.min(
            percentage,
            100
        );

    let progressClass =
        "normal";

    if (percentage > 100) {

        progressClass =
            "danger";

    } else if (percentage >= 80) {

        progressClass =
            "warning";

    }


    let statusText =
        "Dentro del presupuesto.";

    if (percentage > 100) {

        statusText =
            "Presupuesto excedido.";

    } else if (percentage >= 80) {

        statusText =
            "Cerca del límite.";

    }


    reportBudgetContainer.innerHTML = `

        <div class="report-table-wrapper">

            <table class="report-table">

                <thead>

                    <tr>

                        <th>
                            Presupuesto
                        </th>

                        <th>
                            Gasto real
                        </th>

                        <th>
                            Disponible
                        </th>

                        <th>
                            Uso
                        </th>

                        <th>
                            Estado
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td class="report-table-number">

                            ${formatCurrency(
                                budget,
                                "GTQ"
                            )}

                        </td>


                        <td class="report-table-number">

                            ${formatCurrency(
                                expenses,
                                "GTQ"
                            )}

                        </td>


                        <td class="
                            report-table-number
                            ${
                                budget - expenses >= 0
                                    ? "report-positive"
                                    : "report-negative"
                            }
                        ">

                            ${formatCurrency(
                                budget - expenses,
                                "GTQ"
                            )}

                        </td>


                        <td>

                            <div class="report-progress-container">

                                <div
                                    class="
                                        report-progress
                                        ${progressClass}
                                    "
                                    style="
                                        width:
                                        ${visiblePercentage}%;
                                    ">
                                </div>

                            </div>

                            <span class="report-period-label">

                                ${percentage.toFixed(1)}%

                            </span>

                        </td>


                        <td>

                            ${statusText}

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


function renderReportCategories() {

    if (!reportCategoryContainer) {
        return;
    }

    const year =
        getReportYear();

    const month =
        getReportMonth();

    const expenses =
        getReportExpenses();

    const totals = {};


    expenses.forEach(expense => {

        if (
            !reportDateMatches(
                expense.date,
                year,
                month
            )
        ) {
            return;
        }

        const categoryId =
            expense.categoryId ||
            "unknown";

        const category =
            categories.expense.find(
                item =>
                    item.id ===
                    categoryId
            );

        const categoryName =
            category?.name ||
            expense.categoryName ||
            "Categoría eliminada";

        const amount =
            parseFloat(
                expense.amountGTQ
            ) || 0;


        if (!totals[categoryId]) {

            totals[categoryId] = {

                name: categoryName,

                amount: 0

            };

        }


        totals[categoryId].amount +=
            amount;

    });


    const data =
        Object.values(
            totals
        ).sort(
            (a, b) =>
                b.amount - a.amount
        );


    if (data.length === 0) {

        reportCategoryContainer.innerHTML = `

            <div class="report-empty">

                No hay gastos registrados
                para el período seleccionado.

            </div>

        `;

        return;

    }


    const maxAmount =
        Math.max(
            ...data.map(
                item => item.amount
            ),
            0
        );


    let html =
        `<div class="report-category-list">`;


    data.forEach(item => {

        const percentage =
            maxAmount > 0
                ? (
                    item.amount /
                    maxAmount
                ) * 100
                : 0;


        html += `

            <div class="report-category-row">

                <div
                    class="report-category-name"
                    title="${escapeHtml(
                        item.name
                    )}">

                    ${escapeHtml(
                        item.name
                    )}

                </div>


                <div class="report-category-bar-container">

                    <div
                        class="report-category-bar"
                        style="
                            width:
                            ${percentage}%;
                        ">
                    </div>

                </div>


                <div class="report-category-amount">

                    ${formatCurrency(
                        item.amount,
                        "GTQ"
                    )}

                </div>

            </div>

        `;

    });


    html += `</div>`;


    reportCategoryContainer.innerHTML =
        html;

}


function renderReportMonthly() {

    if (!reportMonthlyContainer) {
        return;
    }

    const year =
        getReportYear();

    const expenses =
        getReportExpenses();


    const monthlyData =
        Array.from(
            { length: 12 },
            () => ({
                income: 0,
                expense: 0
            })
        );


    incomes.forEach(income => {

        if (
            !reportDateMatches(
                income.date,
                year,
                "all"
            )
        ) {
            return;
        }

        const month =
            Number(
                String(
                    income.date
                ).substring(5, 7)
            ) - 1;


        if (
            month >= 0 &&
            month < 12
        ) {

            monthlyData[
                month
            ].income +=
                parseFloat(
                    income.amountGTQ
                ) || 0;

        }

    });


    expenses.forEach(expense => {

        if (
            !reportDateMatches(
                expense.date,
                year,
                "all"
            )
        ) {
            return;
        }

        const month =
            Number(
                String(
                    expense.date
                ).substring(5, 7)
            ) - 1;


        if (
            month >= 0 &&
            month < 12
        ) {

            monthlyData[
                month
            ].expense +=
                parseFloat(
                    expense.amountGTQ
                ) || 0;

        }

    });


    const monthNames = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    const hasData =
        monthlyData.some(
            item =>
                item.income > 0 ||
                item.expense > 0
        );


    if (!hasData) {

        reportMonthlyContainer.innerHTML = `

            <div class="report-empty">

                No hay movimientos registrados
                para ${year}.

            </div>

        `;

        return;

    }


    let html = `

        <div class="report-table-wrapper">

            <table class="report-table">

                <thead>

                    <tr>

                        <th>
                            Mes
                        </th>

                        <th>
                            Ingresos
                        </th>

                        <th>
                            Gastos
                        </th>

                        <th>
                            Balance
                        </th>

                    </tr>

                </thead>

                <tbody>

    `;


    monthlyData.forEach(
        (item, index) => {

            const balance =
                item.income -
                item.expense;


            html += `

                <tr>

                    <td>

                        ${monthNames[index]}

                    </td>


                    <td class="report-table-number">

                        ${formatCurrency(
                            item.income,
                            "GTQ"
                        )}

                    </td>


                    <td class="report-table-number">

                        ${formatCurrency(
                            item.expense,
                            "GTQ"
                        )}

                    </td>


                    <td
                        class="
                            report-table-number
                            ${
                                balance >= 0
                                    ? "report-positive"
                                    : "report-negative"
                            }
                        ">

                        ${formatCurrency(
                            balance,
                            "GTQ"
                        )}

                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    reportMonthlyContainer.innerHTML =
        html;

}


function updateReports() {

    updateReportSummary();

    renderReportBudget();

    renderReportCategories();

    renderReportMonthly();

}


if (reportYear) {

    reportYear.addEventListener(
        "change",
        updateReports
    );

}


if (reportMonth) {

    reportMonth.addEventListener(
        "change",
        updateReports
    );

}


updateReports();

// ============================================================
// 14. UTILIDADES
// ============================================================

function formatCurrency(
    amount,
    currency
) {

    const value =
        Number(amount) || 0;


    return new Intl.NumberFormat(
        "es-GT",
        {

            style: "currency",

            currency:
                currency === "USD"
                    ? "USD"
                    : "GTQ",

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        }
    ).format(value);

}


const DATE_FORMAT_STORAGE_KEY = "finanzas_personales.date_format";
const datePickerInstances = new Map();

function getDateFormatPreference() {
    const allowed = new Set(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]);
    try {
        const saved = localStorage.getItem(DATE_FORMAT_STORAGE_KEY);
        if (saved === "DD-MM-YYYY") return "DD/MM/YYYY"; // Migra la preferencia anterior.
        return allowed.has(saved) ? saved : "DD/MM/YYYY";
    } catch (error) {
        return "DD/MM/YYYY";
    }
}

function toISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function buildISODate(year, monthIndex, day) {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const validDay = Math.min(Math.max(Number(day) || 1, 1), lastDay);
    return toISODate(new Date(year, monthIndex, validDay));
}

function getTodayISO() {
    return toISODate(new Date());
}

function formatDate(dateString) {
    if (!dateString) return "";

    const datePart = String(dateString).slice(0, 10);
    const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return String(dateString);

    const [, year, month, day] = match;
    const format = getDateFormatPreference();

    if (format === "MM/DD/YYYY") return `${month}/${day}/${year}`;
    if (format === "YYYY-MM-DD") return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
}

function initializeSpanishDatePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input || datePickerInstances.has(inputId)) return;

    const field = document.createElement("div");
    field.className = "date-picker-field";
    input.classList.add("date-value-hidden");
    input.removeAttribute("required");
    input.parentNode.insertBefore(field, input);
    field.appendChild(input);

    const button = document.createElement("button");
    button.id = `${inputId}PickerButton`;
    button.type = "button";
    button.className = "date-picker-trigger";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `${inputId}Calendar`);
    button.innerHTML = `<span class="date-picker-value"></span><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="5" width="14" height="12" rx="2"/><path d="M6.5 3.5v3M13.5 3.5v3M3 9h14"/></svg>`;

    const calendar = document.createElement("div");
    calendar.id = `${inputId}Calendar`;
    calendar.className = "date-calendar";
    calendar.setAttribute("role", "dialog");
    calendar.setAttribute("aria-label", "Selecciona una fecha");
    calendar.hidden = true;
    calendar.innerHTML = `
        <div class="date-calendar-header">
            <button type="button" class="date-calendar-nav" data-calendar-shift="-1" aria-label="Mes anterior">‹</button>
            <strong class="date-calendar-title"></strong>
            <button type="button" class="date-calendar-nav" data-calendar-shift="1" aria-label="Mes siguiente">›</button>
        </div>
        <div class="date-calendar-weekdays" aria-hidden="true">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
        </div>
        <div class="date-calendar-grid" role="grid"></div>
        <div class="date-calendar-footer">
            <button type="button" class="date-calendar-action" data-calendar-action="clear">Limpiar</button>
            <button type="button" class="date-calendar-action" data-calendar-action="today">Hoy</button>
        </div>`;

    field.append(button, calendar);
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (label) label.htmlFor = button.id;

    const valueLabel = button.querySelector(".date-picker-value");
    const title = calendar.querySelector(".date-calendar-title");
    const grid = calendar.querySelector(".date-calendar-grid");
    const state = { visibleMonth: new Date() };

    const selectedDate = () => {
        const match = String(input.value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
    };

    const refreshButton = () => {
        valueLabel.textContent = formatDate(input.value) || "Selecciona una fecha";
        button.setAttribute("aria-label", input.value ? `Fecha: ${formatDate(input.value)}` : "Seleccionar fecha");
    };

    const renderCalendar = () => {
        const year = state.visibleMonth.getFullYear();
        const month = state.visibleMonth.getMonth();
        const monthTitle = new Intl.DateTimeFormat("es-GT", { month: "long", year: "numeric" })
            .format(new Date(year, month, 1))
            .replace(/\s+de\s+/i, " ");
        title.textContent = monthTitle.charAt(0).toLocaleUpperCase("es-GT") + monthTitle.slice(1);
        grid.replaceChildren();

        const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
        const selected = input.value;
        const today = getTodayISO();

        // Seis semanas mantienen una cuadrícula estable e incluyen los días
        // contiguos de los meses anterior y siguiente.
        for (let cell = 0; cell < 42; cell++) {
            const dateValue = new Date(year, month, cell - firstDayOffset + 1);
            const date = toISODate(dateValue);
            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "date-calendar-day";
            dayButton.textContent = String(dateValue.getDate());
            if (dateValue.getMonth() !== month) dayButton.classList.add("is-outside-month");
            dayButton.dataset.date = date;
            dayButton.setAttribute("role", "gridcell");
            dayButton.setAttribute("aria-label", formatDate(date));
            if (date === selected) {
                dayButton.classList.add("is-selected");
                dayButton.setAttribute("aria-selected", "true");
            } else {
                dayButton.setAttribute("aria-selected", "false");
            }
            if (date === today) dayButton.classList.add("is-today");
            grid.appendChild(dayButton);
        }
    };

    const closeCalendar = restoreFocus => {
        calendar.hidden = true;
        button.setAttribute("aria-expanded", "false");
        field.classList.remove("is-open");
        if (restoreFocus) button.focus();
    };

    const openCalendar = () => {
        document.querySelectorAll(".date-picker-field.is-open").forEach(openField => {
            if (openField !== field) {
                openField.classList.remove("is-open");
                const otherCalendar = openField.querySelector(".date-calendar");
                const otherButton = openField.querySelector(".date-picker-trigger");
                if (otherCalendar) otherCalendar.hidden = true;
                if (otherButton) otherButton.setAttribute("aria-expanded", "false");
            }
        });

        const current = selectedDate() || new Date();
        state.visibleMonth = new Date(current.getFullYear(), current.getMonth(), 1);
        renderCalendar();
        calendar.classList.remove("align-right", "opens-up");
        calendar.hidden = false;
        button.setAttribute("aria-expanded", "true");
        field.classList.add("is-open");

        const calendarBounds = calendar.getBoundingClientRect();
        const fieldBounds = field.getBoundingClientRect();
        if (calendarBounds.right > window.innerWidth - 12) {
            calendar.classList.add("align-right");
        }
        if (
            calendarBounds.bottom > window.innerHeight - 12 &&
            fieldBounds.top > calendarBounds.height + 12
        ) {
            calendar.classList.add("opens-up");
        }

        const focusDate = input.value || getTodayISO();
        grid.querySelector(`[data-date="${focusDate}"]`)?.focus();
    };

    const setDate = value => {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        refreshButton();
        renderCalendar();
        closeCalendar(true);
    };

    button.addEventListener("click", () => {
        if (button.getAttribute("aria-expanded") === "true") closeCalendar(false);
        else openCalendar();
    });
    button.addEventListener("keydown", event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (calendar.hidden) openCalendar();
        } else if (event.key === "Escape") {
            closeCalendar(false);
        }
    });

    calendar.querySelectorAll("[data-calendar-shift]").forEach(navButton => {
        navButton.addEventListener("click", () => {
            state.visibleMonth = new Date(
                state.visibleMonth.getFullYear(),
                state.visibleMonth.getMonth() + Number(navButton.dataset.calendarShift),
                1
            );
            renderCalendar();
        });
    });

    calendar.addEventListener("click", event => {
        const dayButton = event.target.closest("[data-date]");
        if (dayButton) {
            setDate(dayButton.dataset.date);
            return;
        }

        const action = event.target.closest("[data-calendar-action]")?.dataset.calendarAction;
        if (action === "today") setDate(getTodayISO());
        if (action === "clear") setDate("");
    });

    grid.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeCalendar(true);
            return;
        }

        const currentButton = event.target.closest("[data-date]");
        if (!currentButton) return;
        const current = selectedDateFromISO(currentButton.dataset.date);
        let offset = 0;
        if (event.key === "ArrowLeft") offset = -1;
        else if (event.key === "ArrowRight") offset = 1;
        else if (event.key === "ArrowUp") offset = -7;
        else if (event.key === "ArrowDown") offset = 7;
        else if (event.key === "Home") offset = -((current.getDay() + 6) % 7);
        else if (event.key === "End") offset = 6 - ((current.getDay() + 6) % 7);
        else if (event.key === "PageUp" || event.key === "PageDown") {
            event.preventDefault();
            state.visibleMonth = new Date(state.visibleMonth.getFullYear(), state.visibleMonth.getMonth() + (event.key === "PageUp" ? -1 : 1), 1);
            const focusedDate = new Date(current.getFullYear(), current.getMonth() + (event.key === "PageUp" ? -1 : 1), current.getDate());
            renderCalendar();
            grid.querySelector(`[data-date="${toISODate(focusedDate)}"]`)?.focus();
            return;
        } else return;

        event.preventDefault();
        const nextDate = new Date(current.getFullYear(), current.getMonth(), current.getDate() + offset);
        if (nextDate.getMonth() !== state.visibleMonth.getMonth()) {
            state.visibleMonth = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
            renderCalendar();
        }
        grid.querySelector(`[data-date="${toISODate(nextDate)}"]`)?.focus();
    });

    input.addEventListener("input", () => {
        refreshButton();
        renderCalendar();
    });
    input.addEventListener("change", () => {
        refreshButton();
        renderCalendar();
    });
    document.addEventListener("click", event => {
        if (!field.contains(event.target)) closeCalendar(false);
    });

    refreshButton();
    renderCalendar();
    datePickerInstances.set(inputId, {
        refresh() { refreshButton(); renderCalendar(); },
        focus() { button.focus(); }
    });
}

function selectedDateFromISO(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function refreshDatePicker(inputId) {
    datePickerInstances.get(inputId)?.refresh();
}

function focusDatePicker(inputId) {
    datePickerInstances.get(inputId)?.focus();
}

function initializeDateFormatPreference() {
    const options = [...document.querySelectorAll('input[name="dateFormatPreference"]')];
    if (!options.length) return;

    const selectedFormat = getDateFormatPreference();
    options.forEach(option => {
        option.checked = option.value === selectedFormat;
        option.addEventListener("change", () => {
            if (!option.checked) return;
            try {
                localStorage.setItem(DATE_FORMAT_STORAGE_KEY, option.value);
            } catch (error) {
                console.warn("No se pudo guardar el formato de fecha en este navegador.", error);
            }

            datePickerInstances.forEach(picker => picker.refresh());
            if (typeof renderIncomeTable === "function") renderIncomeTable();
            if (typeof renderExpenseTable === "function") renderExpenseTable();
            if (typeof renderDashboardCardPayments === "function") renderDashboardCardPayments();
            if (typeof renderCreditCardStatements === "function") renderCreditCardStatements();
            if (typeof updateReports === "function") updateReports();
        });
    });
}

initializeDateFormatPreference();
initializeSpanishDatePicker("incomeDate");
initializeSpanishDatePicker("expenseDate");
initializeSpanishDatePicker("fixedExpensePurchaseDate");
initializeSpanishDatePicker("accountOpeningDate");
initializeSpanishDatePicker("transferDate");
<<<<<<< HEAD
=======
initializeSpanishDatePicker("cardPaymentDate");
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

// ============================================================
// SELECCIÓN LIMITADA A LO QUE SE ESTÁ VIENDO (mes, año y búsqueda)
// ============================================================
 
// Quita de la selección los registros que ya no se muestran
function keepOnlyVisibleSelection(selectedIds, visibleIds) {
    const visible = new Set(visibleIds.map(String));
 
    [...selectedIds].forEach(id => {
        if (!visible.has(String(id))) {
            selectedIds.delete(id);
        }
    });
}
 
// Ids seleccionados que están en pantalla en este momento
function getVisibleSelectedIds(container, checkboxSelector, idKey, selectedIds) {
    const visible = new Set(
        [...container.querySelectorAll(checkboxSelector)].map(
            item => String(item.dataset[idKey])
        )
    );
 
    return [...selectedIds].filter(id => visible.has(String(id)));
}
 
// Texto del periodo seleccionado, por ejemplo "Octubre 2026"
function getSelectedPeriodLabel() {
    const monthText =
        dashboardMonth?.selectedOptions?.[0]?.textContent?.trim() || "";
 
    return `${monthText} ${dashboardYear?.value || ""}`.trim();
}

// ============================================================
// SELECCIÓN MÚLTIPLE Y ACORDEÓN (compartidos)
// ============================================================

// Sincroniza la casilla de escritorio y la móvil del mismo registro.
// "Seleccionar todos" tiene dos casillas: la del encabezado (escritorio,
// id = selectAllId) y la de la barra (móvil, id = selectAllId + "Mobile").
function bindBulkSelection({
    container,
    checkboxSelector,
    selectAllId,
    idKey,
    selectedIds,
    counterId,
    deleteButtonId
}) {
    const selectAllIds = [selectAllId, `${selectAllId}Mobile`];

    container?.addEventListener("change", event => {
        const checkbox = event.target;
        const isSelectAll = selectAllIds.includes(checkbox.id);

        if (!isSelectAll && !checkbox.matches(checkboxSelector)) {
            return;
        }

        const checkboxes = [
            ...container.querySelectorAll(checkboxSelector)
        ];

        checkboxes.forEach(item => {
            if (
                isSelectAll ||
                item.dataset[idKey] === checkbox.dataset[idKey]
            ) {
                item.checked = checkbox.checked;
            }
        });

        checkboxes.forEach(item => {
            const id = String(item.dataset[idKey]);

            if (item.checked) {
                selectedIds.add(id);
            } else {
                selectedIds.delete(id);
            }
        });

        const visibleIds = new Set(
            checkboxes.map(item => String(item.dataset[idKey]))
        );

        const selectedCount = [...visibleIds].filter(
            id => selectedIds.has(id)
        ).length;

        selectAllIds.forEach(id => {
            const selectAll = container.querySelector(`#${id}`);

            if (selectAll) {
                selectAll.checked =
                    visibleIds.size > 0 &&
                    selectedCount === visibleIds.size;

                selectAll.indeterminate =
                    selectedCount > 0 &&
                    selectedCount < visibleIds.size;
            }
        });

        const counter = container.querySelector(`#${counterId}`);
        const deleteButton = container.querySelector(`#${deleteButtonId}`);

        if (counter) {
            counter.textContent = `${selectedIds.size} seleccionados`;
        }

        if (deleteButton) {
            deleteButton.disabled = selectedIds.size === 0;
        }
    });
}


// Abre/cierra el detalle de un registro (solo uno abierto a la vez)
function bindAccordion({
    container,
    toggleAttr,
    detailsAttr
}) {
    container?.addEventListener("click", event => {
        const toggle = event.target.closest(`[${toggleAttr}]`);

        if (!toggle || !container.contains(toggle)) {
            return;
        }

        const id = toggle.getAttribute(toggleAttr);

        const rows = [
            ...container.querySelectorAll(`[${detailsAttr}]`)
        ];

        const target = rows.find(
            row => row.getAttribute(detailsAttr) === id
        );

        if (!target) {
            return;
        }

        const shouldOpen = target.hidden;

        rows.forEach(row => {
            row.hidden = true;
        });

        container
            .querySelectorAll(`[${toggleAttr}]`)
            .forEach(button => {
                button.setAttribute("aria-expanded", "false");
            });

        if (shouldOpen) {
            target.hidden = false;
            toggle.setAttribute("aria-expanded", "true");
        }
    });
}

// Abre/cierra el detalle de un registro (solo uno abierto a la vez)
function bindAccordion({
    container,
    toggleAttr,
    detailsAttr
}) {
    container?.addEventListener("click", event => {
        const toggle = event.target.closest(`[${toggleAttr}]`);

        if (!toggle || !container.contains(toggle)) {
            return;
        }

        const id = toggle.getAttribute(toggleAttr);

        const rows = [
            ...container.querySelectorAll(`[${detailsAttr}]`)
        ];

        const target = rows.find(
            row => row.getAttribute(detailsAttr) === id
        );

        if (!target) {
            return;
        }

        const shouldOpen = target.hidden;

        rows.forEach(row => {
            row.hidden = true;
        });

        container
            .querySelectorAll(`[${toggleAttr}]`)
            .forEach(button => {
                button.setAttribute("aria-expanded", "false");
            });

        if (shouldOpen) {
            target.hidden = false;
            toggle.setAttribute("aria-expanded", "true");
        }
    });
}


// ============================================================
// 15. INICIALIZACIÓN
// ============================================================

let appDataInitializedForUserId = null;
let appDataInitializationPromise = null;

async function initializeAppData() {
    if (appDataInitializationPromise) {
        return appDataInitializationPromise;
    }

    appDataInitializationPromise = (async () => {
        const user = await getCurrentUser();
        if (!user) return false;
        if (appDataInitializedForUserId === user.id) return true;

        const accountsReady = await initializeAccounts();
        const creditCardsLoad = initializeCreditCards();
        const categoriesReady = await initializeCategories();
        const budgetsLoad = initializeBudgets();

        await Promise.all([
            initializeIncomes(),
            initializeExpenses(),
            initializeFixedExpenses(),
            creditCardsLoad
        ]);

<<<<<<< HEAD
        renderExpenseTable();
        renderIncomeTable();
        renderAccounts();
        updateDashboard();

        await budgetsLoad;
        renderBudgetTable();
        if (categoriesReady) appDataInitializedForUserId = user.id;
        return true;
    })();

=======
        await initializeCardPayments();
        populateCardPaymentCardOptions();
        populateCardPaymentAccountOptions();
        populateCardPaymentStatementOptions();

        renderExpenseTable();
        renderIncomeTable();
        renderAccounts();
        updateDashboard();

        await budgetsLoad;
        renderBudgetTable();
        if (categoriesReady) appDataInitializedForUserId = user.id;
        return true;
    })();

>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
    try {
        return await appDataInitializationPromise;
    } finally {
        appDataInitializationPromise = null;
    }
}

// Iniciar únicamente cuando exista una sesión autenticada.
initializeAppData().catch(error => {
    console.error("No se pudieron cargar los datos de la aplicación:", error);
});

// ============================================================
// FIN
// ============================================================
// API local para integrar el importador de estados de cuenta sin duplicar
// las reglas de guardado que usa el resto de la aplicación.
window.FinanzasPersonalesImport = {
    getState() {
        return { categories, expenses, incomes, creditCards, accounts: bankAccounts, accountsReady: accountsSchemaReady };
    },

    async ensureReady() {
        const ready = await initializeAppData();
        if (ready && categoryLoadError) {
            throw new Error("No se pudieron cargar las categorías desde la base de datos. Revisa tu conexión e inténtalo de nuevo.");
        }
        return ready;
    },

    async importStatementRows(rows, settings) {
        const user = await getCurrentUser();
        if (!user) throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");

        const currency = settings.currency === "USD" ? "USD" : "GTQ";
        const exchangeRate = currency === "USD" ? Number(settings.exchangeRate) : 1;
        if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
            throw new Error("Ingresa un tipo de cambio válido para los movimientos en USD.");
        }

        const paymentMethod = settings.paymentMethod === "card" ? "card" : "cash";
        const creditCard = paymentMethod === "card"
            ? creditCards.find(card => card.id === settings.creditCardId && card.active !== false)
            : null;
        if (paymentMethod === "card" && !creditCard) {
            throw new Error("Selecciona una tarjeta de crédito activa.");
        }
        const selectedAccount = paymentMethod === "cash" && accountsSchemaReady
            ? bankAccounts.find(account => String(account.id) === String(settings.accountId) && account.isActive !== false)
            : null;
        if (paymentMethod === "cash" && accountsSchemaReady && (!selectedAccount || selectedAccount.currency !== currency)) {
            throw new Error("Selecciona una cuenta bancaria activa que use la misma moneda del estado de cuenta.");
        }
        const accountId = paymentMethod === "cash" ? selectedAccount?.id || null : null;

        const now = new Date().toISOString();
        const incomeBatch = [];
        const expenseBatch = [];

        for (const row of rows) {
            const type = row.type === "income" ? "income" : "expense";
            const sourceList = type === "income" ? incomes : expenses;
            const existingRecord = row.existingId
                ? sourceList.find(item => String(item.id) === String(row.existingId))
                : null;
            if (row.existingId && !existingRecord) {
                throw new Error(`El registro que se iba a actualizar ya no está disponible: “${row.description}”.`);
            }

            const category = categories[type].find(item => item.id === row.categoryId && item.active !== false);
            const amount = Number(row.amount);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !row.description?.trim() || !Number.isFinite(amount) || amount <= 0) {
                throw new Error("Hay un movimiento con fecha, descripción o monto inválido. Corrígelo antes de importar.");
            }
            if (!category) {
                throw new Error(`Selecciona una categoría válida para “${row.description}”.`);
            }

            const id = existingRecord?.id || createId(type);
            const amountGTQ = amount * exchangeRate;
            const notes = existingRecord?.notes
                || (paymentMethod === "card"
                    ? "Importado desde estado de cuenta PDF (tarjeta de crédito)."
                    : "Importado desde estado de cuenta PDF (cuenta bancaria/débito).");
            const common = {
                id,
                date: row.date,
                description: row.description.trim(),
                categoryId: category.id,
                categoryName: category.name,
                currency,
                amount,
                exchangeRate,
                amountGTQ,
                exchangeRateSource: currency === "USD" ? "Importación PDF/Manual" : "N/A",
                notes,
                accountId,
                createdAt: existingRecord?.createdAt || now,
                updatedAt: now
            };

            if (type === "income") {
                incomeBatch.push({
                    clientKey: row.clientKey,
                    isUpdate: Boolean(existingRecord),
                    memory: common,
                    database: {
                        id,
                        user_id: user.id,
                        date: common.date,
                        description: common.description,
                        category_id: common.categoryId,
                        category_name: common.categoryName,
                        currency,
                        amount,
                        exchange_rate: exchangeRate,
                        amount_gtq: amountGTQ,
                        exchange_rate_source: common.exchangeRateSource,
                        notes: common.notes,
                        ...(accountsSchemaReady ? { account_id: accountId } : {}),
                        created_at: common.createdAt,
                        updated_at: now
                    }
                });
                continue;
            }

            const statementDates = creditCard
                ? getCreditCardStatementDates(row.date, creditCard)
                : { statementCutoffDate: null, statementDueDate: null };
            const memory = {
                ...common,
                paymentMethod,
                creditCardId: creditCard?.id || null,
                accountId: paymentMethod === "card" ? null : accountId,
                statementCutoffDate: statementDates.statementCutoffDate,
                statementDueDate: statementDates.statementDueDate
            };
            expenseBatch.push({
                clientKey: row.clientKey,
                isUpdate: Boolean(existingRecord),
                memory,
                database: {
                    id,
                    user_id: user.id,
                    date: memory.date,
                    description: memory.description,
                    category_id: memory.categoryId,
                    category_name: memory.categoryName,
                    currency,
                    amount,
                    exchange_rate: exchangeRate,
                    amount_gtq: amountGTQ,
                    exchange_rate_source: common.exchangeRateSource,
                    notes: common.notes,
                    payment_method: paymentMethod,
                    credit_card_id: memory.creditCardId,
                    ...(accountsSchemaReady ? { account_id: memory.accountId } : {}),
                    statement_cutoff_date: memory.statementCutoffDate,
                    statement_due_date: memory.statementDueDate,
                    created_at: common.createdAt,
                    updated_at: now
                }
            });
        }

        const batches = [];
        if (expenseBatch.length) batches.push({ type: "expense", table: "gastos", rows: expenseBatch });
        if (incomeBatch.length) batches.push({ type: "income", table: "ingresos", rows: incomeBatch });

        const outcomes = await Promise.all(batches.map(async batch => {
            try {
                const { data, error } = await supabaseClient
                    .from(batch.table)
                    .upsert(batch.rows.map(item => item.database))
                    .select();
                return { ...batch, data: data || [], error };
            } catch (error) {
                return { ...batch, data: [], error };
            }
        }));

        let updated = 0;
        let inserted = 0;
        const errors = [];
        const savedClientKeys = [];
        for (const outcome of outcomes) {
            if (outcome.error) {
                console.error(`Error importando ${outcome.type}:`, outcome.error);
                errors.push(outcome.type === "expense" ? "gastos" : "ingresos");
                continue;
            }

            const savedIds = new Set(outcome.data.map(item => String(item.id)));
            const savedRows = outcome.rows.filter(item =>
                savedIds.size === 0 || savedIds.has(String(item.memory.id))
            );
            for (const item of savedRows) {
                savedClientKeys.push(String(item.clientKey));
                if (outcome.type === "expense") {
                    const index = expenses.findIndex(entry => String(entry.id) === String(item.memory.id));
                    if (index >= 0) {
                        expenses[index] = item.memory;
                        updated++;
                    } else {
                        expenses.push(item.memory);
                        inserted++;
                    }
                } else {
                    const index = incomes.findIndex(entry => String(entry.id) === String(item.memory.id));
                    if (index >= 0) {
                        incomes[index] = item.memory;
                        updated++;
                    } else {
                        incomes.push(item.memory);
                        inserted++;
                    }
                }
            }
        }

        renderExpenseTable();
        renderIncomeTable();
        renderCreditCardStatements();
        renderAccounts();
        updateDashboard();
        updateReports();

        return {
            imported: updated + inserted,
            updated,
            inserted,
            errors,
            savedClientKeys
        };
    }
};
// Evita que la rueda del mouse incremente o reduzca montos por accidente.
// Al quitar el foco, la rueda conserva el desplazamiento normal de la página.
document.addEventListener("wheel", event => {
    const numberInput = event.target.closest?.('input[type="number"]');
    if (numberInput && document.activeElement === numberInput) {
        numberInput.blur();
    }
}, { capture: true, passive: true });
<<<<<<< HEAD
=======

/* Dropdown personalizado reutilizable: replica el selector de mes/año. */
(() => {
    const enhancedSelects = new WeakMap();

    function enhanceSelect(select) {
        if (!select || enhancedSelects.has(select) || select.multiple || select.classList.contains('period-native-select')) return;
        if (select.closest('.custom-select-shell')) return;

        const shell = document.createElement('div');
        shell.className = 'custom-select-shell';
        const parent = select.parentNode;
        parent.insertBefore(shell, select);
        shell.appendChild(select);
        select.classList.add('custom-select-native');

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'period-trigger custom-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        const label = document.createElement('span');
        const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chevron.setAttribute('viewBox', '0 0 16 16');
        chevron.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'm4 6 4 4 4-4');
        chevron.appendChild(path);
        trigger.append(label, chevron);

        const list = document.createElement('div');
        list.className = 'period-options custom-select-options';
        list.setAttribute('role', 'listbox');
        list.hidden = true;
        const listId = `custom-select-${Math.random().toString(36).slice(2, 10)}`;
        list.id = listId;
        trigger.setAttribute('aria-controls', listId);
        shell.append(trigger, list);

        const sync = () => {
            const selected = select.options[select.selectedIndex];
            label.textContent = selected?.textContent.trim() || 'Seleccionar';
            trigger.disabled = select.disabled;
            trigger.setAttribute('aria-expanded', String(!list.hidden));
            [...list.children].forEach(item => {
                item.setAttribute('aria-selected', String(item.dataset.value === select.value));
                item.disabled = item.dataset.disabled === 'true';
                const mark = item.querySelector('.custom-select-check');
                if (mark) mark.textContent = item.dataset.value === select.value ? '✓' : '';
            });
        };

        const refresh = () => {
            list.replaceChildren();
            [...select.options].forEach(option => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'period-option custom-select-option';
                item.setAttribute('role', 'option');
                item.dataset.value = option.value;
                item.dataset.disabled = String(option.disabled);
                const text = document.createElement('span');
                text.textContent = option.textContent.trim();
                const check = document.createElement('span');
                check.className = 'custom-select-check';
                item.append(text, check);
                item.addEventListener('click', () => {
                    if (option.disabled) return;
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    close(true);
                    sync();
                });
                list.appendChild(item);
            });
            sync();
        };

        const close = (focus = false) => {
            list.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            if (focus) trigger.focus();
        };
        const open = () => {
            if (select.disabled) return;
            document.querySelectorAll('.custom-select-options:not([hidden])').forEach(other => {
                if (other !== list) {
                    other.hidden = true;
                    other.previousElementSibling?.setAttribute('aria-expanded', 'false');
                }
            });
            list.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            const selected = list.querySelector('[aria-selected="true"]');
            selected?.scrollIntoView({ block: 'nearest' });
        };

        trigger.addEventListener('click', () => list.hidden ? open() : close());
        trigger.addEventListener('keydown', event => {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
                event.preventDefault(); open();
                const options = [...list.querySelectorAll('.period-option:not(:disabled)')];
                (event.key === 'ArrowUp' ? options.at(-1) : options[0])?.focus();
            } else if (event.key === 'Escape') close();
        });
        list.addEventListener('keydown', event => {
            const options = [...list.querySelectorAll('.period-option:not(:disabled)')];
            const index = options.indexOf(document.activeElement);
            let next = index;
            if (event.key === 'ArrowDown') next = Math.min(index + 1, options.length - 1);
            else if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
            else if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = options.length - 1;
            else return;
            event.preventDefault(); options[next]?.focus();
        });
        document.addEventListener('click', event => { if (!shell.contains(event.target)) close(); });
        select.addEventListener('change', sync);
        const observer = new MutationObserver(refresh);
        observer.observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        enhancedSelects.set(select, { refresh, sync });
        refresh();
    }

    function scan(root = document) {
        root.querySelectorAll?.('select:not(.period-native-select):not([multiple])').forEach(enhanceSelect);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan());
    else scan();
    const pageObserver = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches?.('select')) enhanceSelect(node);
                scan(node);
            }
        }));
    });
    pageObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
>>>>>>> 1da84a9 (feat: improve credit card payments and UI)
