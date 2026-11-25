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
const financingCardSelect = byId("debtFinancingCreditCard");
const financingCategorySelect = byId("debtFinancingCategory");
const expenseCategorySelect = byId("debtExpenseCategory");
const linkFinancingCard = byId("debtLinkCreditCard");
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
  const isFinancing = type.value === "financing";
  byId("debtFinancingCardToggleField").hidden = !isFinancing;
  toggleFinancingCardFields();
  byId("debtCardField").hidden = !isCard;
  regular.forEach(id => { byId(id).hidden = isCard; });
  cardSelect.required = isCard;
  byId("debtName").required = !isCard;
  byId("debtOriginalAmount").required = !isCard;
  byId("debtInitialBalance").required = !isCard;
  byId("debtStartDate").required = !isCard;
}

function toggleFinancingCardFields() {
  const linked = type.value === "financing" && Boolean(linkFinancingCard?.checked);
  byId("debtFinancingCardField").hidden = !linked;
  byId("debtFinancingCategoryField").hidden = !linked;
  byId("debtFinancingRateField").hidden = !linked || value("debtCurrency") !== "USD";
  byId("debtExpenseCategoryField").hidden = linked || Boolean(editingDebtId);
  byId("debtExpenseRateField").hidden = linked || Boolean(editingDebtId) || value("debtCurrency") !== "USD";
  financingCardSelect.required = linked;
  financingCategorySelect.required = linked;
  expenseCategorySelect.required = !editingDebtId && !linked && type.value !== "card";
}

function openForm() {
  editingDebtId = null;
  ["debtCurrency","debtOriginalAmount","debtInitialBalance"].forEach(id => { byId(id).disabled = false; });
  form.reset();
  populateFinancingCategories();
  toggleDefaultPaymentFields();
  if (linkFinancingCard) linkFinancingCard.checked = false;
  if (financingCardSelect) financingCardSelect.disabled = false;
  toggleFinancingCardFields();
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
  if (linkFinancingCard) linkFinancingCard.disabled = false;
  if (financingCategorySelect) financingCategorySelect.disabled = false;
  ["debtCurrency","debtOriginalAmount","debtInitialBalance"].forEach(id => { byId(id).disabled = false; });
  form.reset();
  toggleFields();
  toggleDefaultPaymentFields();
}

function openEditForm(debtId) {
  const debt = debts.find(item => String(item.id) === String(debtId));
  if (!debt) return;
  editingDebtId = String(debt.id);
  form.reset();
  populateFinancingCategories();
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
  if (linkFinancingCard) linkFinancingCard.checked = Boolean(debt.credit_card_id);
  if (financingCardSelect) financingCardSelect.value = debt.credit_card_id ? String(debt.credit_card_id) : "";
  if (financingCardSelect) financingCardSelect.disabled = Boolean(debt.initial_expense_id);
  byId("debtDefaultPaymentMethod").value = debt.default_payment_method || "cash";
  populateDefaultPaymentCards(debt.default_credit_card_id);
  const hasPayments = debtPayments.some(payment => String(payment.debt_id) === String(debt.id));
  const hasInitialCardExpense = Boolean(debt.initial_expense_id);
  ["debtCurrency","debtOriginalAmount","debtInitialBalance"].forEach(id => {
    byId(id).disabled = hasPayments || (hasInitialCardExpense && ["debtCurrency","debtOriginalAmount"].includes(id));
  });
  byId("debtInitialBalance").value = hasPayments ? debt.current_balance : debt.initial_balance;
  byId("debtFormTitle").textContent = "Editar deuda";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  toggleFields();
  toggleDefaultPaymentFields();
  toggleFinancingCardFields();
  if (debt.initial_expense_id) {
    linkFinancingCard.disabled = true;
    financingCategorySelect.disabled = true;
    setNotice("Este financiamiento ya generó su compra en la tarjeta. La tarjeta y el monto original quedan protegidos para evitar duplicados.");
  } else if (linkFinancingCard) {
    linkFinancingCard.disabled = false;
  }
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
  if (financingCardSelect) {
    const selected = financingCardSelect.value;
    financingCardSelect.replaceChildren(new Option("Selecciona una tarjeta", ""));
    activeCards.forEach(card => financingCardSelect.add(new Option(`${card.bank} · ${card.name}`, String(card.id))));
    financingCardSelect.value = selected;
  }
  populateFinancingCategories();
  populateDefaultPaymentCards();
}

function populateFinancingCategories(selectedId = null) {
  const options = (typeof categories !== "undefined" ? categories.expense : []).filter(item => item.active !== false);
  [financingCategorySelect, expenseCategorySelect].forEach(select => {
    if (!select) return;
    select.replaceChildren(new Option("Selecciona una categoría", ""));
    options.forEach(item => select.add(new Option(item.name, String(item.id))));
    if (select === financingCategorySelect && selectedId) select.value = String(selectedId);
  });
}

function populateDefaultPaymentCards(selectedId = null) {
  const select = byId("debtDefaultCreditCard");
  if (!select) return;
  const cards = (typeof creditCards !== "undefined" ? creditCards : []).filter(card => card.active !== false);
  select.replaceChildren(new Option("Selecciona una tarjeta", ""));
  cards.forEach(card => select.add(new Option(`${card.bank} · ${card.name}`, String(card.id))));
  if (selectedId) select.value = String(selectedId);
}

function toggleDefaultPaymentFields() {
  const byCard = byId("debtDefaultPaymentMethod")?.value === "card";
  byId("debtDefaultCardField").hidden = !byCard;
  byId("debtDefaultCreditCard").required = byCard;
}

function addFrequency(dateString, frequency, count = 1) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  if (frequency === "weekly") date.setDate(date.getDate() + 7 * count);
  else if (frequency === "biweekly") date.setDate(date.getDate() + 14 * count);
  else if (frequency === "quarterly") date.setMonth(date.getMonth() + 3 * count);
  else if (frequency === "yearly") date.setFullYear(date.getFullYear() + count);
  else {
    const originalDay = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + count);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(originalDay, lastDay));
  }
  return date.toISOString().slice(0, 10);
}

function getNextDebtDue(debt) {
  if (!debt.first_due_date || !debt.is_active) return null;
  const completedInstallments = debtPayments.filter(
    payment => String(payment.debt_id) === String(debt.id)
  ).length;
  return addFrequency(debt.first_due_date, debt.frequency, completedInstallments);
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

let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let calendarEvents = [];

function buildCalendarEvents(items) {
  const uniqueEvents = new Map();
  const today = new Date();
  const firstVisibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const horizon = new Date(today.getFullYear(), today.getMonth() + 18, 1);

  items.forEach(item => {
    let due = item.upcomingDate;
    if (!due) return;

    const isRecurring = item.type !== "card";
    let guard = 0;

    while (due && guard++ < 24) {
      const dueDate = new Date(`${due}T12:00:00`);
      if (Number.isNaN(dueDate.getTime())) break;

      if (dueDate >= firstVisibleMonth && dueDate < horizon) {
        // Una deuda solo puede generar un vencimiento por fecha.
        const eventKey = `${item.type}:${String(item.id)}:${due}`;
        if (!uniqueEvents.has(eventKey)) {
          uniqueEvents.set(eventKey, { ...item, date: due });
        }
      }

      if (!isRecurring || dueDate >= horizon) break;

      const nextDue = addFrequency(due, item.frequency || "monthly", 1);

      // Protección contra frecuencias inválidas que no avanzan la fecha.
      if (!nextDue || nextDue <= due) break;

      due = nextDue;
    }
  });

  return [...uniqueEvents.values()].sort((a, b) =>
    a.date.localeCompare(b.date) ||
    String(a.name).localeCompare(String(b.name))
  );
}

function formatCalendarMonth(date) {
  return new Intl.DateTimeFormat("es-GT", { month: "long", year: "numeric" }).format(date);
}

function drawCalendarGrid(grid, monthDate) {
  if (!grid) return;

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - offset);
  const byDate = new Map();

  calendarEvents.forEach(item => {
    if (!byDate.has(item.date)) byDate.set(item.date, []);
    byDate.get(item.date).push(item);
  });

  const iso = date =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const cells = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]
    .map(day => `<span class="debt-calendar-weekday">${day}</span>`);

  // Se muestran siempre seis semanas para conservar una cuadrícula estable.
  for (let index = 0; index < 42; index++) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const dateKey = iso(date);
    const dayEntries = byDate.get(dateKey) || [];
    const outsideMonth = date.getMonth() !== month;
    const names = dayEntries.map(item => item.name).join(", ");
    const selectedDate = grid.dataset.selectedDate === dateKey;

    cells.push(`
      <button
        type="button"
        class="debt-calendar-day ${outsideMonth ? "is-outside-month" : ""} ${dayEntries.length ? "has-event" : ""}"
        data-calendar-date="${dateKey}"
        aria-label="${date.getDate()} ${formatCalendarMonth(date)}${dayEntries.length ? ": " + escape(names) : ""}"
        aria-pressed="${selectedDate ? "true" : "false"}">
        <span>${date.getDate()}</span>
        ${dayEntries.length ? `<i>${dayEntries.length}</i>` : ""}
      </button>
    `);
  }

  grid.innerHTML = cells.join("");

  grid.querySelectorAll("[data-calendar-date]").forEach(button => {
    button.addEventListener("click", () => {
      grid.dataset.selectedDate = button.dataset.calendarDate;
      grid.querySelectorAll("[data-calendar-date]").forEach(item => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      const selected = byDate.get(button.dataset.calendarDate) || [];
      const target = grid.parentElement.querySelector(".debt-calendar-selection");

      if (target) {
        target.innerHTML = selected.length
          ? `<strong>${escape(new Intl.DateTimeFormat("es-GT", {
              dateStyle: "long",
              timeZone: "UTC"
            }).format(new Date(`${button.dataset.calendarDate}T12:00:00Z`)))}</strong>
            <ul>${selected.map(item => `
              <li>
                <span>${escape(item.name)}</span>
                <b>${escape(money(
                  item.installment_amount || item.balance || item.current_balance || 0,
                  item.currency || "GTQ"
                ))}</b>
              </li>`).join("")}</ul>`
          : `<span>Sin vencimientos para este día.</span>`;
      }
    });
  });
}

function renderDebtCalendar(items) {
  calendarEvents = buildCalendarEvents(items);
  const title = byId("debtsCalendarMonth");
  const grid = byId("debtsCalendarGrid");
  const empty = byId("debtsCalendarEmpty");
  if (!title || !grid) return;
  title.textContent = formatCalendarMonth(calendarMonth);
  drawCalendarGrid(grid, calendarMonth);
  if (empty) empty.textContent = "Seleccioná un día para consultar sus vencimientos.";
  const prev = byId("debtsCalendarPrev");
  const next = byId("debtsCalendarNext");
  if (prev) prev.disabled = false;
  if (next) next.disabled = false;
}

function openDebtCalendar() {
  const existing = document.getElementById("debtsCalendarDialog");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "debtsCalendarDialog";
  overlay.className = "debts-calendar-dialog";
  overlay.innerHTML = `
    <section class="debts-calendar-dialog-card" role="dialog" aria-modal="true" aria-labelledby="debtsCalendarDialogTitle">
      <header class="debts-calendar-dialog-header">
        <div><span>PLANIFICACIÓN</span><h3 id="debtsCalendarDialogTitle">Calendario de pagos</h3></div>
        <button type="button" class="debts-calendar-dialog-close" aria-label="Cerrar calendario">×</button>
      </header>
      <div class="debt-calendar-heading">
        <button type="button" class="debt-calendar-nav" data-calendar-prev aria-label="Mes anterior">‹</button>
        <strong class="debts-calendar-dialog-month"></strong>
        <button type="button" class="debt-calendar-nav" data-calendar-next aria-label="Mes siguiente">›</button>
      </div>
      <div class="debts-calendar-dialog-grid"></div>
      <div class="debt-calendar-selection">Seleccioná un día para ver los pagos.</div>
    </section>`;
  document.body.appendChild(overlay);
  const grid = overlay.querySelector(".debts-calendar-dialog-grid");
  const monthLabel = overlay.querySelector(".debts-calendar-dialog-month");
  const paint = () => {
    monthLabel.textContent = formatCalendarMonth(calendarMonth);
    drawCalendarGrid(grid, calendarMonth);
  };
  overlay.querySelector("[data-calendar-prev]").addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    paint();
  });
  overlay.querySelector("[data-calendar-next]").addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    paint();
  });
  const close = () => overlay.remove();
  overlay.querySelector(".debts-calendar-dialog-close").addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  const onEscape = event => {
    if (event.key === "Escape" && document.getElementById("debtsCalendarDialog")) {
      close();
      document.removeEventListener("keydown", onEscape);
    }
  };
  document.addEventListener("keydown", onEscape);
  paint();
  overlay.querySelector(".debts-calendar-dialog-close").focus();
}


const UP_ICON_PATHS = {
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.5"/><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7M3.5 11v4c0 1.4 2.5 2.5 5.5 2.5M15 10.5c3 0 5.5 1 5.5 2.4v4c0 1.4-2.5 2.5-5.5 2.5s-5.5-1.1-5.5-2.5v-4"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
  landmark: '<path d="M3 9h18L12 4 3 9Z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>'
};

function upIcon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UP_ICON_PATHS[name] || ""}</svg>`;
}

function renderUpcomingList(items, todayKey) {
  const target = byId("debtsUpcomingList");
  if (!target) return;

  if (!items.length) {
    target.className = "debts-inline-empty";
    target.textContent = "No hay vencimientos pendientes.";
    return;
  }
  target.className = "";

  const pad = n => String(n).padStart(2, "0");
  const [year, month] = todayKey.split("-").map(Number);
  const thisMonth = `${year}-${pad(month)}`;
  const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${pad(month + 1)}`;

  const overdueCount = items.filter(item => item.upcomingDate < todayKey).length;
  const thisMonthCount = items.filter(item => item.upcomingDate >= todayKey && item.upcomingDate.startsWith(thisMonth)).length;
  const nextMonthCount = items.filter(item => item.upcomingDate.startsWith(nextMonth)).length;

  const totals = new Map();
  items.forEach(item => {
    const amount = Number(item.installment_amount) || 0;
    if (amount > 0) {
      const currency = item.currency || "GTQ";
      totals.set(currency, (totals.get(currency) || 0) + amount);
    }
  });
  const totalLabel = totals.size
    ? [...totals.entries()].map(([currency, amount]) => money(amount, currency)).join(" · ")
    : money(0, "GTQ");

  const daysUntil = date =>
    Math.round((new Date(`${date}T12:00:00Z`) - new Date(`${todayKey}T12:00:00Z`)) / 86400000);

  const frequencyLabels = {
    weekly: "Cuota semanal", biweekly: "Cuota quincenal", quarterly: "Cuota trimestral",
    yearly: "Cuota anual", monthly: "Cuota mensual"
  };

  const rows = items.slice(0, 5).map(item => {
    const diff = daysUntil(item.upcomingDate);
    const status = diff < 0
      ? { cls: "is-overdue", label: "Vencido" }
      : diff <= 7
        ? { cls: "is-soon", label: "Próximo a vencer" }
        : { cls: "is-upcoming", label: "Próximo" };
    const kind = item.type === "card" ? "card" : item.type === "financing" ? "financing" : "loan";
    const kindLabel = kind === "card" ? "Tarjeta de crédito" : kind === "financing" ? "Financiamiento" : "Préstamo";
    const dateLabel = new Intl.DateTimeFormat("es-GT", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
      .format(new Date(`${item.upcomingDate}T12:00:00Z`)).replace(/\./g, "");
    const amount = Number(item.type === "card" ? item.balance : item.installment_amount) || 0;
    const amountLabel = item.type === "card" ? "Saldo pendiente" : "Cuota";
    const detailLabel = item.type === "card"
      ? "Fecha límite de pago"
      : `${frequencyLabels[item.frequency] || frequencyLabels.monthly}`;

    return `
      <article class="dv-row is-${kind} ${status.cls}">
        <span class="dv-row-icon">${upIcon(kind === "card" ? "card" : kind === "financing" ? "receipt" : "landmark")}</span>
        <div class="dv-row-main">
          <strong class="dv-row-name">${escape(item.name)}</strong>
          <span class="dv-row-kind">${item.type === "card" ? detailLabel : `${kindLabel} · ${detailLabel}`}</span>
        </div>
        <div class="dv-row-meta">
          <div class="dv-row-when">
            <span class="dv-badge">${status.label}</span>
            <span class="dv-date">${upIcon("calendar")}${escape(dateLabel)}</span>
          </div>
          <div class="dv-row-amount">
            <span>${amountLabel}</span>
            <strong>${amount > 0 ? escape(money(amount, item.currency || "GTQ")) : "—"}</strong>
          </div>
        </div>
      </article>`;
  }).join("");

  target.innerHTML = `
    <div class="dv-upcoming">
      <div class="dv-stats">
        <div class="dv-stat is-overdue"><span class="dv-stat-icon">${upIcon("clock")}</span><div><span>Vencidos</span><strong>${overdueCount}</strong></div></div>
        <div class="dv-stat"><span class="dv-stat-icon">${upIcon("calendar")}</span><div><span>Este mes</span><strong>${thisMonthCount}</strong></div></div>
        <div class="dv-stat"><span class="dv-stat-icon">${upIcon("calendar")}</span><div><span>Próximo mes</span><strong>${nextMonthCount}</strong></div></div>
        <div class="dv-stat is-total"><span class="dv-stat-icon">${upIcon("coins")}</span><div><span>Total pendiente</span><strong>${escape(totalLabel)}</strong></div></div>
      </div>
      <div class="dv-list">${rows}</div>
    </div>`;
}

function render() {
  // Las tarjetas se administran en Cuentas. Aquí solo se muestran préstamos
  // y financiamientos; sus fechas de pago siguen integradas al calendario.
  const cards = getCardBalances();
  const all = debts.filter(debt => debt.type !== "card");
  const calendarItems = [...all, ...cards];
  const term = (search?.value || "").trim().toLowerCase();
  const filtered = all.filter(item => {
    const matchesTerm = !term || `${item.name} ${item.institution || ""}`.toLowerCase().includes(term);
    const matchesType = !typeFilter || typeFilter.value === "all" || item.type === typeFilter.value;
    const isPaid = Number(item.current_balance ?? item.balance) <= 0.009;
    const todayKey = new Date().toISOString().slice(0, 10);
    const nextDue = isPaid ? null : getNextDebtDue(item);
    const isOverdue = Boolean(nextDue && nextDue < todayKey);
    const matchesStatus = !statusFilter || statusFilter.value === "all" ||
      (statusFilter.value === "paid"
        ? isPaid
        : statusFilter.value === "overdue"
          ? isOverdue
          : statusFilter.value === "active"
            ? !isPaid && !isOverdue
            : true);
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
  const monthlyRows = all.filter(item => item.is_active && Number(item.installment_amount) > 0).map(item => {
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
      : '<div class="debts-empty-icon">₲</div><h3>Aún no tienes préstamos o financiamientos</h3><p>Registra una obligación para comenzar a controlar sus cuotas y pagos. Tus tarjetas se administran desde Cuentas.</p><button type="button" class="primary-button" id="debtEmptyNewButton">Registrar primera deuda</button>';
    byId("debtEmptyNewButton")?.addEventListener("click", openForm);
  } else {
    list.className = "debts-list";
    list.innerHTML = filtered.map(item => {
      const balance = Number(item.current_balance ?? item.balance) || 0;
      const currency = item.currency || "GTQ";
      const label = item.type === "card" ? "Tarjeta de crédito" : item.type === "loan" ? "Préstamo" : "Financiamiento";
      const due = item.type === "card" ? item.nextDue : getNextDebtDue(item);
      const today = new Date().toISOString().slice(0, 10);
      const isOverdue = Boolean(due && due < today && item.type !== "card");
      const dueLabel = due
        ? `${isOverdue ? "Vencido desde" : "Próximo vencimiento"}: ${escape(due)}`
        : "Sin fecha de vencimiento";
      return `<article class="debt-item${isOverdue ? " is-overdue" : ""}">
        <div class="debt-item-main">
          <div class="debt-item-heading">
            <span class="debt-item-type">${label}</span>
            ${isOverdue ? '<span class="debt-item-status">Vencido</span>' : ""}
          </div>
          <h3>${escape(item.name)}</h3>
          <p>${escape(item.institution || (item.type === "card" ? "Tarjeta registrada" : ""))}</p>
        </div>
        <div class="debt-item-balance">
          <span>Saldo pendiente</span>
          <strong>${money(balance, currency)}</strong>
          <small class="${isOverdue ? "is-overdue" : ""}">${dueLabel}</small>
        </div>
        ${item.type === "card" ? "" : `<div class="debt-item-actions">
          <button type="button" class="secondary-button" data-debt-edit="${escape(item.id)}">Editar</button>
          <button type="button" class="secondary-button" data-debt-history="${escape(item.id)}">Pagos anteriores</button>
          <button type="button" class="secondary-button debt-pay-button" data-debt-pay="${escape(item.id)}">Registrar pago</button>
        </div>`}
      </article>`;
    }).join("");
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const dueItems = calendarItems.map(item => ({
    ...item,
    upcomingDate: item.type === "card" ? item.nextDue : getNextDebtDue(item)
  })).filter(item => item.is_active !== false && item.upcomingDate);
  const overdue = dueItems
    .filter(item => item.upcomingDate < todayKey)
    .sort((a,b) => String(a.upcomingDate).localeCompare(String(b.upcomingDate)));
  const upcoming = dueItems
    .filter(item => item.upcomingDate >= todayKey)
    .sort((a,b) => String(a.upcomingDate).localeCompare(String(b.upcomingDate)));
  const visibleDueItems = [...overdue, ...upcoming];
  renderUpcomingList(visibleDueItems, todayKey);
  renderDebtCalendar(visibleDueItems);
}

async function loadDebts() {
  if (loading) return;
  loading = true;
  try {
    const { data, error } = await supabaseClient
      .from("deudas")
      .select("id,type,name,institution,currency,original_amount,initial_balance,current_balance,interest_rate,installment_amount,frequency,start_date,first_due_date,notes,is_active,default_payment_method,default_credit_card_id,credit_card_id,initial_expense_id")
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

function mountDebtDatePicker(inputId, { min = "", max = "" } = {}) {
  const input = byId(inputId);
  if (!input || input.dataset.customDatePicker === "true") return;

  input.dataset.customDatePicker = "true";
  input.type = "hidden";
  input.required = false;

  const wrapper = document.createElement("div");
  wrapper.className = "debt-date-picker";
  wrapper.innerHTML = `
    <button type="button" class="debt-date-trigger" aria-haspopup="dialog" aria-expanded="false">
      <span class="debt-date-value">Seleccionar fecha</span>
      <span aria-hidden="true">▦</span>
    </button>
    <div class="debt-date-popover" hidden>
      <div class="debt-date-popover-head">
        <button type="button" data-date-prev aria-label="Mes anterior">‹</button>
        <strong></strong>
        <button type="button" data-date-next aria-label="Mes siguiente">›</button>
      </div>
      <div class="debt-date-popover-grid"></div>
      <div class="debt-date-popover-foot">
        <button type="button" data-date-clear>Limpiar</button>
        <button type="button" data-date-today>Hoy</button>
      </div>
    </div>`;

  input.insertAdjacentElement("afterend", wrapper);
  const trigger = wrapper.querySelector(".debt-date-trigger");
  const valueLabel = wrapper.querySelector(".debt-date-value");
  const popover = wrapper.querySelector(".debt-date-popover");
  const monthLabel = wrapper.querySelector(".debt-date-popover-head strong");
  const grid = wrapper.querySelector(".debt-date-popover-grid");
  let viewMonth = input.value
    ? new Date(input.value + "T12:00:00")
    : new Date();
  viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);

  const iso = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

  const display = value => value
    ? new Intl.DateTimeFormat("es-GT", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })
        .format(new Date(value + "T12:00:00Z"))
    : "Seleccionar fecha";

  const paint = () => {
    monthLabel.textContent = formatCalendarMonth(viewMonth);
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const cells = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"]
      .map(day => `<span class="debt-date-weekday">${day}</span>`);
    for (let i = 0; i < offset; i++) cells.push('<span class="debt-date-day is-empty"></span>');
    for (let day = 1; day <= count; day++) {
      const date = new Date(year, month, day);
      const key = iso(date);
      const disabled = (min && key < min) || (max && key > max);
      cells.push(`<button type="button" class="debt-date-day ${input.value === key ? "is-selected" : ""}" data-date-value="${key}" ${disabled ? "disabled" : ""}>${day}</button>`);
    }
    grid.innerHTML = cells.join("");
    grid.querySelectorAll("[data-date-value]").forEach(button => {
      button.addEventListener("click", () => selectDate(button.dataset.dateValue));
    });
  };

  const selectDate = value => {
    input.value = value;
    valueLabel.textContent = display(value);
    input.dispatchEvent(new Event("change", { bubbles: true }));
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    paint();
  };

  trigger.addEventListener("click", () => {
    const opening = popover.hidden;
    document.querySelectorAll(".debt-date-popover").forEach(item => item.hidden = true);
    popover.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
    if (opening) paint();
  });

  wrapper.querySelector("[data-date-prev]").addEventListener("click", () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    paint();
  });
  wrapper.querySelector("[data-date-next]").addEventListener("click", () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    paint();
  });
  wrapper.querySelector("[data-date-clear]").addEventListener("click", () => selectDate(""));
  wrapper.querySelector("[data-date-today]").addEventListener("click", () => {
    const today = iso(new Date());
    if ((!min || today >= min) && (!max || today <= max)) {
      viewMonth = new Date();
      selectDate(today);
    }
  });

  document.addEventListener("click", event => {
    if (!wrapper.contains(event.target)) {
      popover.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  valueLabel.textContent = display(input.value);
  paint();
}

function openHistoricalPaymentForm(debtId) {
  const debt = debts.find(item => String(item.id) === String(debtId));
  if (!debt) return;
  const overlay = byId("debtPaymentPanel");
  overlay.innerHTML = `
    <div class="debt-payment-card" role="dialog" aria-modal="true" aria-labelledby="debtHistoricalTitle">
      <div class="debt-payment-header"><div><span class="debt-item-type">Importar historial</span><h3 id="debtHistoricalTitle">${escape(debt.name)}</h3><p>Saldo actual: <strong>${money(debt.current_balance, debt.currency)}</strong></p></div><button type="button" class="debt-payment-close" aria-label="Cerrar">×</button></div>
      <form id="debtHistoricalForm">
        <div class="form-grid">
          <div class="form-group"><label for="debtHistoryDate">Fecha del pago anterior</label><input id="debtHistoryDate" type="date" required></div>
          <div class="form-group"><label for="debtHistoryPrincipal">Capital amortizado (${debt.currency})</label><input id="debtHistoryPrincipal" type="number" min="0.01" step="0.01" required></div>
          <div class="form-group"><label for="debtHistoryInterest">Intereses pagados (${debt.currency})</label><input id="debtHistoryInterest" type="number" min="0" step="0.01" value="0" required></div>
          <div class="form-group"><label for="debtHistoryCharges">Otros cargos (${debt.currency})</label><input id="debtHistoryCharges" type="number" min="0" step="0.01" value="0" required></div>
          <div class="form-group debts-form-full"><label for="debtHistoryNotes">Nota (opcional)</label><textarea id="debtHistoryNotes" rows="2" maxlength="1000" placeholder="Ej. Pago realizado antes de registrar la deuda"></textarea></div>
        </div>
        <p class="debt-payment-total" id="debtHistoryTotal">Total del pago: ${money(0,debt.currency)}</p>
        <p class="debts-form-notice" id="debtHistoryNotice" role="status">Este registro actualiza el saldo por el capital amortizado y no crea un gasto nuevo.</p>
        <div class="debts-form-actions"><button type="button" class="secondary-button debt-payment-cancel">Cancelar</button><button type="submit" class="primary-button">Guardar pago anterior</button></div>
      </form>
    </div>`;
  overlay.hidden = false;
  mountDebtDatePicker("debtHistoryDate", {
    min: debt.start_date || "",
    max: new Date().toISOString().slice(0, 10)
  });
  const close = () => { overlay.hidden = true; overlay.replaceChildren(); };
  overlay.querySelector(".debt-payment-close").addEventListener("click", close);
  overlay.querySelector(".debt-payment-cancel").addEventListener("click", close);
  const fields = ["debtHistoryPrincipal","debtHistoryInterest","debtHistoryCharges"];
  const updateTotal = () => {
    const total = fields.reduce((sum,id)=>sum+(Number(byId(id).value)||0),0);
    byId("debtHistoryTotal").textContent = "Total del pago: " + money(total,debt.currency);
  };
  fields.forEach(id=>byId(id).addEventListener("input",updateTotal));
  byId("debtHistoricalForm").addEventListener("submit", async event => {
    event.preventDefault();
    const principal=Number(byId("debtHistoryPrincipal").value);
    const interest=Number(byId("debtHistoryInterest").value);
    const charges=Number(byId("debtHistoryCharges").value);
    const paymentDate=byId("debtHistoryDate").value;
    const notice=byId("debtHistoryNotice");
    if(!paymentDate || ![principal,interest,charges].every(Number.isFinite) || principal<=0 || interest<0 || charges<0) {
      notice.textContent="Revisa la fecha y los importes del pago.";
      return;
    }
    if(principal>Number(debt.current_balance)+0.00001) {
      notice.textContent="El capital amortizado no puede superar el saldo pendiente.";
      return;
    }
    const button=event.currentTarget.querySelector('button[type="submit"]');
    button.disabled=true;
    notice.textContent="Guardando pago anterior…";
    try {
      const {error}=await supabaseClient.rpc("registrar_pago_historico_deuda",{
        p_payment_id:createId("debt-payment"),
        p_debt_id:debt.id,
        p_payment_date:paymentDate,
        p_principal_amount:principal,
        p_interest_amount:interest,
        p_charges_amount:charges,
        p_notes:valueFrom("debtHistoryNotes")
      });
      if(error) throw error;
      await loadDebts();
      close();
      showToast("Pago anterior registrado. El saldo se actualizó por el capital amortizado.");
    } catch(error) {
      console.error("Error registrando pago histórico:",error);
      notice.textContent=error.message || "No se pudo registrar el pago anterior.";
      button.disabled=false;
    }
  });
}

function openPaymentForm(debtId) {
  const debt = debts.find(item => String(item.id) === String(debtId));
  if (!debt) return;
  const categoriesList = (typeof categories !== "undefined" ? categories.expense : []).filter(item => item.active !== false);
  const accountsList = (typeof bankAccounts !== "undefined" ? bankAccounts : []).filter(item => item.isActive && item.currency === debt.currency);
  const availableCards = (typeof creditCards !== "undefined" ? creditCards : []).filter(item => item.active !== false);
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
          <div class="form-group"><label for="debtPayMethod">Método de pago</label><select id="debtPayMethod"><option value="cash">Efectivo / cuenta bancaria</option><option value="card">Tarjeta de crédito</option></select></div>
          <div class="form-group" id="debtPayAccountGroup"><label for="debtPayAccount">Cuenta de pago (opcional)</label><select id="debtPayAccount"><option value="">Selecciona una cuenta</option>${accountsList.map(item=>`<option value="${escape(item.id)}">${escape(item.name)}</option>`).join("")}</select></div>
          <div class="form-group" id="debtPayCardGroup" hidden><label for="debtPayCard">Tarjeta de crédito</label><select id="debtPayCard"><option value="">Selecciona una tarjeta</option>${availableCards.map(item=>`<option value="${escape(item.id)}">${escape(item.bank)} · ${escape(item.name)}</option>`).join("")}</select></div>
          <div class="form-group debts-form-full"><label for="debtPayNotes">Notas (opcional)</label><textarea id="debtPayNotes" rows="2" maxlength="1000"></textarea></div>
        </div>
        <p class="debt-payment-total" id="debtPayTotal">Total del pago: ${money(0,debt.currency)}</p>
        <p class="debts-form-notice" id="debtPayNotice" role="status"></p>
        <div class="debts-form-actions"><button type="button" class="secondary-button debt-payment-cancel">Cancelar</button><button type="submit" class="primary-button">Guardar pago</button></div>
      </form>
    </div>`;
  overlay.hidden = false;
  mountDebtDatePicker("debtPayDate", {
    min: debt.start_date || "",
    max: new Date().toISOString().slice(0, 10)
  });
  const paymentForm = byId("debtPaymentForm");
  const periodsPerYear = debt.frequency === "weekly" ? 52 : debt.frequency === "biweekly" ? 26 : debt.frequency === "quarterly" ? 4 : debt.frequency === "yearly" ? 1 : 12;
  const estimatedInterest = Math.round((Number(debt.current_balance) * (Number(debt.interest_rate) / 100) / periodsPerYear) * 100) / 100;
  const scheduledPayment = Number(debt.installment_amount) || 0;
  const suggestedPrincipal = Math.max(0, Math.min(Number(debt.current_balance), Math.round((scheduledPayment - estimatedInterest) * 100) / 100));
  byId("debtPayPrincipal").value = suggestedPrincipal > 0 ? suggestedPrincipal.toFixed(2) : "";
  byId("debtPayInterest").value = estimatedInterest.toFixed(2);
  const methodSelect = byId("debtPayMethod");
  methodSelect.value = debt.default_payment_method || "cash";
  if (debt.default_credit_card_id) byId("debtPayCard").value = String(debt.default_credit_card_id);
  const togglePaymentMethod = () => {
    const byCard = methodSelect.value === "card";
    byId("debtPayCardGroup").hidden = !byCard;
    byId("debtPayAccountGroup").hidden = byCard;
    byId("debtPayAccount").required = false;
    byId("debtPayCard").required = byCard;
  };
  methodSelect.addEventListener("change", togglePaymentMethod);
  togglePaymentMethod();
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
    const paymentMethod = byId("debtPayMethod").value;
    const accountId = paymentMethod === "card" ? null : (byId("debtPayAccount").value || null);
    const creditCardId = paymentMethod === "card" ? byId("debtPayCard").value : null;
    const paymentDate = byId("debtPayDate").value;
    const payNotice = byId("debtPayNotice");
    if (![principal,interest,charges,amount,rate].every(Number.isFinite) || principal <= 0 || interest < 0 || charges < 0 || amount <= 0 || rate <= 0 || principal > Number(debt.current_balance) + 0.00001) {
      payNotice.textContent = "Verifica los montos y el tipo de cambio. El abono a capital no puede superar el saldo pendiente.";
      return;
    }
    if (!categoryId || !paymentDate) { payNotice.textContent = "Selecciona una categoría y fecha válida."; return; }
    if (paymentMethod === "card" && !creditCardId) { payNotice.textContent = "Selecciona la tarjeta de crédito utilizada."; return; }
    if (accountId && !accountsList.some(item=>String(item.id)===accountId)) { payNotice.textContent = "La cuenta seleccionada no corresponde a la moneda de esta deuda."; return; }
    const button = paymentForm.querySelector('button[type="submit"]');
    button.disabled = true;
    payNotice.textContent = "Registrando pago…";
    const paymentId = createId("debt-payment");
    const expenseId = createId("expense");
    try {
      const commonArgs = {
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
        p_amount_gtq: amount * rate
      };
      let response;
      if (paymentMethod === "card") {
        const selectedCard = availableCards.find(card => String(card.id) === String(creditCardId));
        if (!selectedCard) throw new Error("No se encontró la tarjeta seleccionada.");
        const statementDates = getCreditCardStatementDates(paymentDate, selectedCard);
        response = await supabaseClient.rpc("registrar_pago_deuda_con_tarjeta", {
          ...commonArgs,
          p_credit_card_id: creditCardId,
          p_statement_cutoff_date: statementDates.statementCutoffDate,
          p_statement_due_date: statementDates.statementDueDate,
          p_notes: valueFrom("debtPayNotes")
        });
      } else {
        response = await supabaseClient.rpc("registrar_pago_deuda", {
          ...commonArgs,
          p_payment_method: "cash",
          p_account_id: accountId,
          p_notes: valueFrom("debtPayNotes"),
          p_exchange_rate_source: debt.currency === "USD" ? "Manual" : "N/A"
        });
      }
      const { data, error } = response;
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

  const linkedCard = type.value === "financing" && Boolean(linkFinancingCard?.checked);
  const selectedFinancingCard = linkedCard
    ? (typeof creditCards !== "undefined" ? creditCards.find(card => String(card.id) === value("debtFinancingCreditCard") && card.active !== false) : null)
    : null;
  const financingCategory = linkedCard
    ? (typeof categories !== "undefined" ? categories.expense.find(item => String(item.id) === value("debtFinancingCategory") && item.active !== false) : null)
    : null;
  const initialExpenseCategory = !editingDebtId && !linkedCard
    ? (typeof categories !== "undefined" ? categories.expense.find(item => String(item.id) === value("debtExpenseCategory") && item.active !== false) : null)
    : null;
  const exchangeRate = currency === "USD" ? Number(value(linkedCard ? "debtFinancingExchangeRate" : "debtExpenseExchangeRate")) : 1;
  if (currency === "USD" && (!Number.isFinite(exchangeRate) || exchangeRate <= 0)) {
    setNotice("Ingresa un tipo de cambio válido para convertir el gasto a quetzales.", true);
    return;
  }
  if (linkedCard && (!selectedFinancingCard || !financingCategory || !Number.isFinite(exchangeRate) || exchangeRate <= 0)) {
    setNotice("Selecciona una tarjeta, una categoría válida y un tipo de cambio correcto.", true);
    return;
  }
  if (!editingDebtId && !linkedCard && !initialExpenseCategory) {
    setNotice("Selecciona la categoría para registrar el monto original como gasto.", true);
    return;
  }
  if (editingDebtId && debts.find(item => String(item.id) === editingDebtId)?.initial_expense_id && linkedCard) {
    setNotice("Este financiamiento ya tiene una compra registrada en la tarjeta. No se puede volver a generar.", true);
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
    notes: value("debtNotes") || "",
    default_payment_method: value("debtDefaultPaymentMethod") || "cash",
    default_credit_card_id: value("debtDefaultPaymentMethod") === "card" ? (value("debtDefaultCreditCard") || null) : null
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
    let data;
    let error;
    if (!editingDebtId && linkedCard) {
      const debtId = payload.id;
      const expenseId = createId("expense");
      const statementDates = getCreditCardStatementDates(startDate, selectedFinancingCard);
      const amountGTQ = original * exchangeRate;
      const expense = {
        id: expenseId,
        date: startDate,
        description: payload.name,
        category_id: financingCategory.id,
        category_name: financingCategory.name,
        currency,
        amount: original,
        exchange_rate: exchangeRate,
        amount_gtq: amountGTQ,
        exchange_rate_source: currency === "USD" ? "Manual" : "N/A",
        notes: payload.notes || "Compra registrada desde un financiamiento vinculado a tarjeta.",
        payment_method: "card",
        credit_card_id: selectedFinancingCard.id,
        statement_cutoff_date: statementDates.statementCutoffDate,
        statement_due_date: statementDates.statementDueDate
      };
      const response = await supabaseClient.rpc("registrar_financiamiento_con_tarjeta", {
        p_debt: payload,
        p_expense: expense,
        p_credit_card_id: selectedFinancingCard.id
      });
      error = response.error;
      if (!error) {
        const result = Array.isArray(response.data) ? response.data[0] : response.data;
        data = result?.debt || result;
      }
    } else if (!editingDebtId) {
      const expenseId = createId("expense");
      const expense = {
        id: expenseId,
        date: startDate,
        description: payload.name,
        category_id: initialExpenseCategory.id,
        category_name: initialExpenseCategory.name,
        currency,
        amount: original,
        exchange_rate: exchangeRate,
        amount_gtq: original * exchangeRate,
        exchange_rate_source: currency === "USD" ? "Manual" : "N/A",
        notes: payload.notes || "Gasto generado automáticamente al registrar la deuda.",
        payment_method: "cash",
        credit_card_id: null,
        account_id: null
      };
      const response = await supabaseClient.rpc("registrar_deuda_con_gasto", {
        p_debt: payload,
        p_expense: expense
      });
      error = response.error;
      if (!error) {
        const result = Array.isArray(response.data) ? response.data[0] : response.data;
        data = result?.debt || result;
      }
    } else {
      const response = await supabaseClient.from("deudas").update(payload).eq("id", editingDebtId).select().single();
      data = response.data;
      error = response.error;
    }
    if (error) throw error;
    const wasEditing = Boolean(editingDebtId);
    if (wasEditing) {
      debts = debts.map(item => String(item.id) === editingDebtId ? { ...item, ...data } : item);
    } else {
      debts.unshift(data);
    }
    if (!wasEditing) {
      if (typeof initializeExpenses === "function") await initializeExpenses();
      if (typeof renderExpenseTable === "function") renderExpenseTable();
      if (typeof renderCreditCardStatements === "function") renderCreditCardStatements();
      if (typeof renderAccounts === "function") renderAccounts();
      if (typeof updateDashboard === "function") updateDashboard();
      if (typeof updateReports === "function") updateReports();
      await loadDebts();
    }
    render();
    closeForm();
    showToast(wasEditing ? "Deuda actualizada correctamente." : "Deuda registrada correctamente.");
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
  const historyButton = event.target.closest("[data-debt-history]");
  if (historyButton) { openHistoricalPaymentForm(historyButton.dataset.debtHistory); return; }
  const payButton = event.target.closest("[data-debt-pay]");
  if (payButton) openPaymentForm(payButton.dataset.debtPay);
});
byId("debtNewButton")?.addEventListener("click", openForm);
byId("debtEmptyNewButton")?.addEventListener("click", openForm);
byId("debtFormClose")?.addEventListener("click", closeForm);
byId("debtFormCancel")?.addEventListener("click", closeForm);
type?.addEventListener("change", toggleFields);
linkFinancingCard?.addEventListener("change", toggleFinancingCardFields);
byId("debtCurrency")?.addEventListener("change", toggleFinancingCardFields);
byId("debtDefaultPaymentMethod")?.addEventListener("change", toggleDefaultPaymentFields);
form?.addEventListener("submit", saveDebt);
search?.addEventListener("input", render);
statusFilter?.addEventListener("change", render);
typeFilter?.addEventListener("change", render);
byId("debtsCalendarPrev")?.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderDebtCalendar(calendarEvents);
});
byId("debtsCalendarNext")?.addEventListener("click", () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderDebtCalendar(calendarEvents);
});
document.querySelectorAll('[data-debts-view="calendar"]').forEach(button => {
  button.addEventListener("click", openDebtCalendar);
});
toggleFields();
toggleDefaultPaymentFields();
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