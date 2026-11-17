(()=> {
"use strict";

const section = document.getElementById("deudas");
if (!section) return;

const panel = document.getElementById("debtFormPanel");
const form = document.getElementById("debtForm");
const type = document.getElementById("debtType");
const notice = document.getElementById("debtFormNotice");
const list = document.getElementById("debtsList");
const cardSelect = document.getElementById("debtCreditCard");
const search = document.getElementById("debtsSearch");
const statusFilter = document.getElementById("debtsStatusFilter");
const typeFilter = document.getElementById("debtsTypeFilter");

let debts = [];
let debtPayments = [];
let loading = false;
let editingDebtId = null;

const regular = [
  "debtNameField", "debtInstitutionField", "debtOriginalAmountField",
  "debtInitialBalanceField", "debtInterestField", "debtInstallmentField",
  "debtFrequencyField"
];

const byId = id => document.getElementById(id);
const value = id => byId(id)?.value?.trim() || "";
const money = (amount, currency) => formatCurrency(Number(amount) || 0, currency || "GTQ");
const escape = input => String(input ?? "").replace(/[&<>"']/g, char => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
}[char]));

function setNotice(message, isError = false) {
  notice.textContent = message;
  notice.dataset.state = isError ? "error" : "success";
}

function setupCustomSelect(select) {
  const shell = select.closest(".custom-select-shell");
  if (!shell || shell.dataset.ready === "true") return;
  shell.dataset.ready = "true";
  select.classList.add("custom-select-native");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", select.getAttribute("aria-label") || "Seleccionar");
  const label = document.createElement("span");
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("viewBox", "0 0 16 16");
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML = '<path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
  trigger.append(label, arrow);
  const menu = document.createElement("div");
  menu.className = "custom-select-menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;
  menu.id = select.id + "Options";
  trigger.setAttribute("aria-controls", menu.id);

  function sync() {
    label.textContent = select.options[select.selectedIndex]?.textContent || "Seleccionar";
    menu.querySelectorAll('[role="option"]').forEach(option => {
      const active = option.dataset.value === select.value;
      option.setAttribute("aria-selected", String(active));
      option.classList.toggle("is-selected", active);
    });
  }

  Array.from(select.options).forEach(option => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "custom-select-option";
    item.setAttribute("role", "option");
    item.dataset.value = option.value;
    const text = document.createElement("span");
    text.className = "custom-select-option-label";
    text.textContent = option.textContent;
    const check = document.createElement("span");
    check.className = "custom-select-option-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";
    item.append(text, check);
    item.addEventListener("click", () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    });
    menu.append(item);
  });

  trigger.addEventListener("click", () => {
    const opening = menu.hidden;
    document.querySelectorAll(".custom-select-menu").forEach(other => {
      other.hidden = true;
      other.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
    if (opening) menu.querySelector('[aria-selected="true"]')?.focus();
  });
  menu.addEventListener("keydown", event => {
    const items = Array.from(menu.querySelectorAll(".custom-select-option"));
    const index = items.indexOf(document.activeElement);
    if (event.key === "Escape") {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }
  });
  select.addEventListener("change", sync);
  shell.append(trigger, menu);
  sync();
}

document.querySelectorAll(".debts-filters select").forEach(setupCustomSelect);
document.addEventListener("click", event => {
  if (!event.target.closest(".custom-select-shell")) {
    document.querySelectorAll(".custom-select-menu").forEach(menu => {
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
  }
});

function toggleFields() {
  const isCard = type.value === "card";
  byId("debtCardField").hidden = !isCard;
  regular.forEach(id => { byId(id).hidden = isCard; });
  cardSelect.required = isCard;
  byId("debtName").required = !isCard;
  byId("debtOriginalAmount").required = !isCard;
  byId("debtInitialBalance").required = !isCard;
  byId("debtStartDate").required = !isCard;
}

function openForm() {
  editingDebtId = null;
  form.reset();
  byId("debtFormTitle").textContent = "Nueva deuda";
  form.querySelector('button[type="submit"]').textContent = "Guardar deuda";
  toggleFields();
  setNotice("Completa los datos para registrar el préstamo o financiamiento.");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  byId("debtName")?.focus();
}

function closeForm() {
  panel.hidden = true;
  editingDebtId = null;
  form.reset();
  toggleFields();
}

function openEditForm(debtId) {
  const debt = debts.find(item => String(item.id) === String(debtId));
  if (!debt) return;
  editingDebtId = String(debt.id);
  form.reset();
  type.value = debt.type;
  byId("debtName").value = debt.name || "";
  byId("debtInstitution").value = debt.institution || "";
  byId("debtCurrency").value = debt.currency || "GTQ";
  byId("debtOriginalAmount").value = debt.original_amount ?? "";
  byId("debtInitialBalance").value = debt.current_balance ?? "";
  byId("debtInterestRate").value = debt.interest_rate ?? 0;
  byId("debtInstallment").value = debt.installment_amount ?? "";
  byId("debtFrequency").value = debt.frequency || "monthly";
  byId("debtStartDate").value = debt.start_date || "";
  byId("debtFirstPaymentDate").value = debt.first_due_date || "";
  byId("debtNotes").value = debt.notes || "";
  const hasPayments = debtPayments.some(payment => String(payment.debt_id) === String(debt.id));
  ["debtCurrency","debtOriginalAmount","debtInitialBalance"].forEach(id => {
    byId(id).disabled = hasPayments;
  });
  byId("debtInitialBalance").value = hasPayments ? debt.current_balance : debt.initial_balance;
  byId("debtFormTitle").textContent = "Editar deuda";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  toggleFields();
  panel.hidden = false;
  setNotice(hasPayments
    ? "Puedes editar los datos y condiciones. La moneda y los saldos quedan bloqueados porque ya existen pagos registrados."
    : "Actualiza la información de esta deuda.");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  byId("debtName").focus();
}

function populateCards() {
  if (typeof creditCards === "undefined") return;
  const activeCards = creditCards.filter(card => card.active !== false);
  cardSelect.replaceChildren(new Option("Selecciona una tarjeta", ""));
  activeCards.forEach(card => {
    cardSelect.add(new Option(`${card.bank} · ${card.name}`, String(card.id)));
  });
}

function getCardBalances() {
  if (typeof creditCards === "undefined" || typeof expenses === "undefined" || typeof cardPayments === "undefined") return [];
  return creditCards.filter(card => card.active !== false).map(card => {
    const statements = getCardStatementBalances(card.id);
    return {
      id: String(card.id),
      name: `${card.bank} · ${card.name}`,
      balance: statements.reduce((sum, item) => sum + item.outstandingGTQ, 0),
      currency: "GTQ",
      type: "card",
      active: true,
      nextDue: statements[0]?.dueDate || null
    };
  });
}

function render() {
  const cards = getCardBalances();
  const all = [
    ...debts.map(debt => ({ ...debt, type: debt.type })),
    ...cards
  ];
  const term = (search?.value || "").trim().toLowerCase();
  const filtered = all.filter(item => {
    const matchesTerm = !term || `${item.name} ${item.institution || ""}`.toLowerCase().includes(term);
    const matchesType = !typeFilter || typeFilter.value === "all" || item.type === typeFilter.value;
    const isPaid = Number(item.current_balance ?? item.balance) <= 0.009;
    const matchesStatus = !statusFilter || statusFilter.value === "all" ||
      (statusFilter.value === "paid" ? isPaid : statusFilter.value === "active" ? !isPaid : false);
    return matchesTerm && matchesType && matchesStatus;
  });

  const sumByCurrency = (rows, amountOf) => {
    const totals = new Map();
    rows.forEach(item => {
      const currency = item.currency || "GTQ";
      totals.set(currency, (totals.get(currency) || 0) + (Number(amountOf(item)) || 0));
    });
    return [...totals.entries()].map(([currency, amount]) => money(amount, currency)).join(" · ") || money(0, "GTQ");
  };
  const activeDebts = all.filter(item => item.is_active !== false && Number(item.current_balance ?? item.balance) > 0.009);
  const monthlyRows = debts.filter(item => item.is_active && Number(item.installment_amount) > 0).map(item => {
    const factor = item.frequency === "weekly" ? 52/12 : item.frequency === "biweekly" ? 26/12 : item.frequency === "quarterly" ? 1/3 : item.frequency === "yearly" ? 1/12 : 1;
    return { currency: item.currency || "GTQ", monthlyAmount: Number(item.installment_amount) * factor };
  });
  const now = new Date();
  const debtCurrencyById = new Map(debts.map(item => [String(item.id), item.currency || "GTQ"]));
  const paidRows = debtPayments.filter(payment => {
    const date = String(payment.payment_date || "");
    return date.startsWith(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-`);
  }).map(payment => ({
    ...payment,
    currency: debtCurrencyById.get(String(payment.debt_id)) || "GTQ"
  }));

  byId("debtsTotalBalance").textContent = sumByCurrency(activeDebts, item => item.current_balance ?? item.balance);
  byId("debtsMonthlyPayments").textContent = sumByCurrency(monthlyRows, item => item.monthlyAmount);
  byId("debtsActiveCount").textContent = String(activeDebts.length);
  byId("debtsPaidThisMonth").textContent = sumByCurrency(paidRows, item => item.total_amount);

  if (!filtered.length) {
    list.className = "debts-empty-state";
    list.innerHTML = all.length
      ? '<p>No hay resultados para los filtros seleccionados.</p>'
      : '<div class="debts-empty-icon">₲</div><h3>Aún no tienes deudas registradas</h3><p>Registra tu primer préstamo o financiamiento. Las tarjetas se vincularán desde las que ya tienes registradas.</p><button type="button" class="primary-button" id="debtEmptyNewButton">Registrar primera deuda</button>';
    byId("debtEmptyNewButton")?.addEventListener("click", openForm);
  } else {
    list.className = "debts-list";
    list.innerHTML = filtered.map(item => {
      const balance = Number(item.current_balance ?? item.balance) || 0;
      const currency = item.currency || "GTQ";
      const label = item.type === "card" ? "Tarjeta de crédito" : item.type === "loan" ? "Préstamo" : "Financiamiento";
      const due = item.nextDue || item.first_due_date;
      return `<article class="debt-item">
        <div class="debt-item-main"><span class="debt-item-type">${label}</span><h3>${escape(item.name)}</h3><p>${escape(item.institution || (item.type === "card" ? "Tarjeta registrada" : ""))}</p></div>
        <div class="debt-item-balance"><span>Saldo pendiente</span><strong>${money(balance, currency)}</strong>${due ? `<small>Próximo vencimiento: ${escape(due)}</small>` : ""}</div>
        ${item.type === "card" ? "" : `<div class="debt-item-actions"><button type="button" class="secondary-button" data-debt-edit="${escape(item.id)}">Editar</button><button type="button" class="secondary-button debt-pay-button" data-debt-pay="${escape(item.id)}">Registrar pago</button></div>`}
      </article>`;
    }).join("");
  }

  const upcoming = all.filter(item => item.is_active !== false && (item.nextDue || item.first_due_date))
    .sort((a,b) => String(a.nextDue || a.first_due_date).localeCompare(String(b.nextDue || b.first_due_date)))
    .slice(0,5);
  byId("debtsUpcomingList").innerHTML = upcoming.length
    ? upcoming.map(item => `<div class="debt-upcoming-row"><span>${escape(item.name)}</span><strong>${escape(item.nextDue || item.first_due_date)}</strong></div>`).join("")
    : "No hay vencimientos programados.";
}

async function loadDebts() {
  if (loading) return;
  loading = true;
  try {
    const { data, error } = await supabaseClient
      .from("deudas")
      .select("id,type,name,institution,currency,original_amount,initial_balance,current_balance,interest_rate,installment_amount,frequency,start_date,first_due_date,notes,is_active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    debts = data || [];
    const { data: paymentRows, error: paymentError } = await supabaseClient
      .from("deuda_pagos")
      .select("id,debt_id,payment_date,principal_amount,interest_amount,charges_amount,total_amount,expense_id");
    if (paymentError) throw paymentError;
    debtPayments = paymentRows || [];
    render();
    populateCards();
  } catch (error) {
    console.error("Error cargando deudas:", error);
    list.className = "debts-empty-state";
    list.innerHTML = "<p>No se pudieron cargar las deudas. Verifica que hayas ejecutado las migraciones de Deudas en Supabase.</p>";
  } finally {
    loading = false;
  }
}

function openPaymentForm(debtId) {
  const debt = debts.find(item => String(item.id) === String(debtId));
  if (!debt) return;
  const categoriesList = (typeof categories !== "undefined" ? categories.expense : []).filter(item => item.active !== false);
  const accountsList = (typeof bankAccounts !== "undefined" ? bankAccounts : []).filter(item => item.isActive && item.currency === debt.currency);
  const overlay = byId("debtPaymentPanel");
  overlay.innerHTML = `
    <div class="debt-payment-card" role="dialog" aria-modal="true" aria-labelledby="debtPaymentTitle">
      <div class="debt-payment-header"><div><span class="debt-item-type">Abono a deuda</span><h3 id="debtPaymentTitle">${escape(debt.name)}</h3><p>Saldo actual: <strong>${money(debt.current_balance, debt.currency)}</strong></p></div><button type="button" class="debt-payment-close" aria-label="Cerrar">×</button></div>
      <form id="debtPaymentForm">
        <div class="form-grid">
          <div class="form-group"><label for="debtPayDate">Fecha del pago</label><input id="debtPayDate" type="date" value="${new Date().toISOString().slice(0,10)}" required></div>
          <div class="form-group"><label for="debtPayCategory">Categoría de gasto</label><select id="debtPayCategory" required><option value="">Selecciona una categoría</option>${categoriesList.map(item=>`<option value="${escape(item.id)}">${escape(item.name)}</option>`).join("")}</select></div>
          <div class="form-group"><label for="debtPayPrincipal">Abono a capital (${debt.currency})</label><input id="debtPayPrincipal" type="number" min="0.01" step="0.01" max="${Number(debt.current_balance)}" required></div>
          <div class="form-group"><label for="debtPayInterest">Intereses (${debt.currency})</label><input id="debtPayInterest" type="number" min="0" step="0.01" value="0" required></div>
          <div class="form-group"><label for="debtPayCharges">Otros cargos (${debt.currency})</label><input id="debtPayCharges" type="number" min="0" step="0.01" value="0" required></div>
          ${debt.currency === "USD" ? `<div class="form-group"><label for="debtPayRate">Tipo de cambio (GTQ por USD)</label><input id="debtPayRate" type="number" min="0.0001" step="0.0001" value="1" required></div>` : ""}
          <div class="form-group"><label for="debtPayAccount">Cuenta de pago (opcional)</label><select id="debtPayAccount"><option value="">Efectivo / sin cuenta</option>${accountsList.map(item=>`<option value="${escape(item.id)}">${escape(item.name)}</option>`).join("")}</select></div>
          <div class="form-group debts-form-full"><label for="debtPayNotes">Notas (opcional)</label><textarea id="debtPayNotes" rows="2" maxlength="1000"></textarea></div>
        </div>
        <p class="debt-payment-total" id="debtPayTotal">Total del pago: ${money(0,debt.currency)}</p>
        <p class="debts-form-notice" id="debtPayNotice" role="status"></p>
        <div class="debts-form-actions"><button type="button" class="secondary-button debt-payment-cancel">Cancelar</button><button type="submit" class="primary-button">Guardar pago</button></div>
      </form>
    </div>`;
  overlay.hidden = false;
  const paymentForm = byId("debtPaymentForm");
  const periodsPerYear = debt.frequency === "weekly" ? 52 : debt.frequency === "biweekly" ? 26 : debt.frequency === "quarterly" ? 4 : debt.frequency === "yearly" ? 1 : 12;
  const estimatedInterest = Math.round((Number(debt.current_balance) * (Number(debt.interest_rate) / 100) / periodsPerYear) * 100) / 100;
  const scheduledPayment = Number(debt.installment_amount) || 0;
  const suggestedPrincipal = Math.max(0, Math.min(Number(debt.current_balance), Math.round((scheduledPayment - estimatedInterest) * 100) / 100));
  byId("debtPayPrincipal").value = suggestedPrincipal > 0 ? suggestedPrincipal.toFixed(2) : "";
  byId("debtPayInterest").value = estimatedInterest.toFixed(2);
  const amountFields = ["debtPayPrincipal","debtPayInterest","debtPayCharges"];
  const total = () => amountFields.reduce((sum,id)=>sum+(Number(byId(id).value)||0),0);
  if (scheduledPayment > 0 && suggestedPrincipal === 0) {
    byId("debtPayNotice").textContent = "La cuota establecida no cubre los intereses estimados del período. Revisa el monto de la cuota.";
  }
  const updateTotal = () => { byId("debtPayTotal").textContent = "Total del pago: " + money(total(),debt.currency); };
  amountFields.forEach(id=>byId(id).addEventListener("input",updateTotal));
  const close = () => { overlay.hidden = true; overlay.replaceChildren(); };
  overlay.querySelector(".debt-payment-close").addEventListener("click",close);
  overlay.querySelector(".debt-payment-cancel").addEventListener("click",close);
  paymentForm.addEventListener("submit", async event => {
    event.preventDefault();
    const principal = Number(byId("debtPayPrincipal").value);
    const interest = Number(byId("debtPayInterest").value);
    const charges = Number(byId("debtPayCharges").value);
    const amount = principal + interest + charges;
    const rate = debt.currency === "USD" ? Number(byId("debtPayRate").value) : 1;
    const categoryId = byId("debtPayCategory").value;
    const accountId = byId("debtPayAccount").value || null;
    const paymentDate = byId("debtPayDate").value;
    const payNotice = byId("debtPayNotice");
    if (![principal,interest,charges,amount,rate].every(Number.isFinite) || principal <= 0 || interest < 0 || charges < 0 || amount <= 0 || rate <= 0 || principal > Number(debt.current_balance) + 0.00001) {
      payNotice.textContent = "Verifica los montos y el tipo de cambio. El abono a capital no puede superar el saldo pendiente.";
      return;
    }
    if (!categoryId || !paymentDate) { payNotice.textContent = "Selecciona una categoría y fecha válida."; return; }
    if (accountId && !accountsList.some(item=>String(item.id)===accountId)) { payNotice.textContent = "La cuenta seleccionada no corresponde a la moneda de esta deuda."; return; }
    const button = paymentForm.querySelector('button[type="submit"]');
    button.disabled = true;
    payNotice.textContent = "Registrando pago…";
    const paymentId = createId("debt-payment");
    const expenseId = createId("expense");
    try {
      const { data, error } = await supabaseClient.rpc("registrar_pago_deuda", {
        p_payment_id: paymentId,
        p_expense_id: expenseId,
        p_debt_id: debt.id,
        p_payment_date: paymentDate,
        p_principal_amount: principal,
        p_interest_amount: interest,
        p_charges_amount: charges,
        p_total_amount: amount,
        p_category_id: categoryId,
        p_currency: debt.currency,
        p_amount: amount,
        p_exchange_rate: rate,
        p_amount_gtq: amount * rate,
        p_payment_method: "cash",
        p_account_id: accountId,
        p_notes: valueFrom("debtPayNotes"),
        p_exchange_rate_source: debt.currency === "USD" ? "Manual" : "N/A"
      });
      if (error) throw error;
      await loadDebts();
      if (typeof initializeExpenses === "function") await initializeExpenses();
      if (typeof renderExpenseTable === "function") renderExpenseTable();
      if (typeof renderAccounts === "function") renderAccounts();
      if (typeof updateDashboard === "function") updateDashboard();
      if (typeof updateReports === "function") updateReports();
      close();
      showToast("Pago registrado correctamente.");
    } catch (error) {
      console.error("Error registrando pago de deuda:",error);
      payNotice.textContent = error.message || "No se pudo registrar el pago.";
      button.disabled = false;
    }
  });
}
function valueFrom(id) { return byId(id)?.value?.trim() || ""; }

async function saveDebt(event) {
  event.preventDefault();
  if (type.value === "card") {
    setNotice("Las tarjetas ya se calculan desde tus compras y pagos registrados. No se crea un registro duplicado.", true);
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    setNotice("Tu sesión expiró. Inicia sesión nuevamente.", true);
    return;
  }

  const original = Number(value("debtOriginalAmount"));
  const balance = Number(value("debtInitialBalance"));
  const interest = Number(value("debtInterestRate") || 0);
  const installment = Number(value("debtInstallment") || 0);
  const currency = value("debtCurrency") || "GTQ";
  const startDate = value("debtStartDate");
  const firstDue = value("debtFirstPaymentDate") || null;

  if (!Number.isFinite(original) || original <= 0 || !Number.isFinite(balance) || balance <= 0 || balance > original) {
    setNotice("Revisa los montos: el saldo inicial debe ser mayor que cero y no superar el monto original.", true);
    return;
  }
  if (!startDate) {
    setNotice("Selecciona la fecha de inicio de la deuda.", true);
    return;
  }

  const payload = {
    type: type.value,
    name: value("debtName"),
    institution: value("debtInstitution") || null,
    interest_rate: interest,
    installment_amount: installment,
    frequency: value("debtFrequency") || "monthly",
    start_date: startDate,
    first_due_date: firstDue,
    notes: value("debtNotes") || ""
  };
  if (!editingDebtId) {
    Object.assign(payload, {
      id: createId("debt"),
      user_id: user.id,
      currency,
      original_amount: original,
      initial_balance: balance,
      current_balance: balance,
      is_active: balance > 0
    });
  } else {
    const hasPayments = debtPayments.some(payment => String(payment.debt_id) === editingDebtId);
    if (!hasPayments) Object.assign(payload, {
      currency,
      original_amount: original,
      initial_balance: balance,
      current_balance: balance,
      is_active: balance > 0
    });
  }

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const query = editingDebtId
      ? supabaseClient.from("deudas").update(payload).eq("id", editingDebtId)
      : supabaseClient.from("deudas").insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    if (editingDebtId) {
      debts = debts.map(item => String(item.id) === editingDebtId ? data : item);
    } else {
      debts.unshift(data);
    }
    render();
    closeForm();
    showToast(editingDebtId ? "Deuda actualizada correctamente." : "Deuda registrada correctamente.");
  } catch (error) {
    console.error("Error guardando deuda en Supabase:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      error
    });
    const message = error?.message || "Error desconocido al guardar la deuda.";
    const code = error?.code ? ` [${error.code}]` : "";
    const details = error?.details ? ` Detalle: ${error.details}` : "";
    const hint = error?.hint ? ` Sugerencia: ${error.hint}` : "";
    setNotice(`Supabase: ${message}${code}${details}${hint}`, true);
  } finally {
    submit.disabled = false;
  }
}

list.addEventListener("click", event => {
  const editButton = event.target.closest("[data-debt-edit]");
  if (editButton) { openEditForm(editButton.dataset.debtEdit); return; }
  const payButton = event.target.closest("[data-debt-pay]");
  if (payButton) openPaymentForm(payButton.dataset.debtPay);
});
byId("debtNewButton")?.addEventListener("click", openForm);
byId("debtEmptyNewButton")?.addEventListener("click", openForm);
byId("debtFormClose")?.addEventListener("click", closeForm);
byId("debtFormCancel")?.addEventListener("click", closeForm);
type?.addEventListener("change", toggleFields);
form?.addEventListener("submit", saveDebt);
search?.addEventListener("input", render);
statusFilter?.addEventListener("change", render);
typeFilter?.addEventListener("change", render);
document.querySelectorAll('[data-debts-view="calendar"]').forEach(button => button.addEventListener("click", () => {
  byId("debtsUpcomingList").scrollIntoView({ behavior: "smooth", block: "center" });
}));
toggleFields();
window.addEventListener("finanzas:data-ready", () => {
  loadDebts();
  populateCards();
});
if (typeof initializeAppData === "function") {
  initializeAppData().then(loadDebts).catch(error => console.error("No se pudo inicializar Deudas:", error));
} else {
  loadDebts();
}
})();