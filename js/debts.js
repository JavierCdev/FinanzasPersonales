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
let loading = false;

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
  form.reset();
  toggleFields();
  setNotice("Completa los datos para registrar el préstamo o financiamiento.");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  byId("debtName")?.focus();
}

function closeForm() {
  panel.hidden = true;
  form.reset();
  toggleFields();
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

  const totalGTQ = all.reduce((sum, item) => sum + (item.currency === "GTQ" ? Number(item.current_balance ?? item.balance) || 0 : 0), 0);
  const monthly = debts.filter(item => item.is_active).reduce((sum, item) => {
    const amount = Number(item.installment_amount) || 0;
    const factor = item.frequency === "weekly" ? 52/12 : item.frequency === "biweekly" ? 26/12 : item.frequency === "quarterly" ? 1/3 : item.frequency === "yearly" ? 1/12 : 1;
    return sum + amount * factor;
  }, 0);
  const paidThisMonth = 0;

  byId("debtsTotalBalance").textContent = money(totalGTQ, "GTQ");
  byId("debtsMonthlyPayments").textContent = money(monthly, "GTQ");
  byId("debtsActiveCount").textContent = String(all.filter(item => item.is_active !== false && Number(item.current_balance ?? item.balance) > 0.009).length);
  byId("debtsPaidThisMonth").textContent = money(paidThisMonth, "GTQ");

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
    id: createId("debt"),
    user_id: user.id,
    type: type.value,
    name: value("debtName"),
    institution: value("debtInstitution") || null,
    currency,
    original_amount: original,
    initial_balance: balance,
    current_balance: balance,
    interest_rate: interest,
    installment_amount: installment,
    frequency: value("debtFrequency") || "monthly",
    start_date: startDate,
    first_due_date: firstDue,
    notes: value("debtNotes") || null,
    is_active: balance > 0
  };

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const { data, error } = await supabaseClient.from("deudas").insert(payload).select().single();
    if (error) throw error;
    debts.unshift(data);
    render();
    closeForm();
    setNotice("Deuda guardada correctamente.");
    showToast("Deuda registrada correctamente.");
  } catch (error) {
    console.error("Error guardando deuda:", error);
    setNotice(error.message?.includes("currency") ? "La base de datos aún no tiene la columna currency. Ejecuta la migración 20261116_deudas_currency.sql." : "No se pudo guardar la deuda. Revisa la migración y las políticas de Supabase.", true);
  } finally {
    submit.disabled = false;
  }
}

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