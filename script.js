const SHEET_ID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";
const sectionNames = {
  frigo_10: "Frigo - Rilevamento ore 10:00",
  frigo_16: "Frigo - Rilevamento ore 16:00",
  congel_10: "Congelatori - Rilevamento ore 10:00",
  congel_16: "Congelatori - Rilevamento ore 16:00"
};
const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
let rows = [];
let selectedType = "frigo_10";
let periodMode = "rolling";
let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth();
let loadError = false;

function parseSheetDate(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  const s = String(raw).trim();
  let m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})(?:\s.*)?$/);
  if (m) return validDate(+m[3], +m[2] - 1, +m[1]);
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/);
  if (m) return validDate(+m[1], +m[2] - 1, +m[3]);
  // Eventuali date numeriche seriali di Google Sheets.
  if (/^\d{5}$/.test(s)) {
    const d = new Date(Date.UTC(1899, 11, 30) + Number(s) * 86400000);
    return validDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  return null;
}
function validDate(y, m, d) {
  const date = new Date(y, m, d);
  return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d ? date : null;
}
function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
function inPeriod(date) {
  if (!date) return false;
  if (periodMode === "rolling") {
    const today = todayStart();
    const first = new Date(today);
    first.setDate(first.getDate() - 29);
    return date >= first && date <= today;
  }
  return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
}
function isFridge(name) {
  const n = name.toLowerCase();
  return n.includes("frigo") || n.includes("cella");
}
function isFreezer(name) { return name.toLowerCase().includes("congel"); }
function formatDate(date) { return date.toLocaleDateString("it-IT"); }

function updateYearOptions() {
  const select = document.getElementById("yearSelect");
  const years = rows.map(r => parseSheetDate(r["Data"] || r["data"]))
    .filter(Boolean).map(d => d.getFullYear());
  const nowYear = new Date().getFullYear();
  const min = Math.min(nowYear, selectedYear, ...years);
  const max = Math.max(nowYear, selectedYear, ...years);
  select.replaceChildren();
  for (let y = max; y >= min; y--) {
    const option = new Option(String(y), String(y));
    select.add(option);
  }
  select.value = String(selectedYear);
}
function syncControls() {
  document.getElementById("monthSelect").value = String(selectedMonth);
  document.getElementById("yearSelect").value = String(selectedYear);
  const now = todayStart();
  document.getElementById("nextMonth").disabled =
    periodMode === "month" && (selectedYear > now.getFullYear() ||
      (selectedYear === now.getFullYear() && selectedMonth >= now.getMonth()));
  const label = document.getElementById("periodLabel");
  if (periodMode === "rolling") {
    const first = new Date(now);
    first.setDate(first.getDate() - 29);
    label.textContent = `Ultimi 30 giorni: ${formatDate(first)} – ${formatDate(now)}`;
  } else {
    label.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
  }
}
function showMessage(message) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 3;
  td.textContent = message;
  tr.appendChild(td);
  document.getElementById("tableBody").appendChild(tr);
}
function render() {
  document.getElementById("sectionTitle").textContent = sectionNames[selectedType];
  document.querySelectorAll("[data-type]").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.type === selectedType));
  });
  syncControls();
  const tbody = document.getElementById("tableBody");
  tbody.replaceChildren();
  if (loadError) {
    showMessage("Errore nel caricamento dei dati. Riprova aggiornando la pagina.");
    return;
  }
  const is10 = selectedType.endsWith("_10");
  const fridge = selectedType.startsWith("frigo");
  let count = 0;
  const ordered = rows.map(r => ({
    row: r, date: parseSheetDate(r["Data"] || r["data"])
  })).filter(item => inPeriod(item.date)).sort((a, b) => b.date - a.date);
  for (const {row, date} of ordered) {
    for (const [key, value] of Object.entries(row)) {
      const lower = key.toLowerCase();
      const hour = lower.includes("10:00") ? "10" : lower.includes("16:00") ? "16" : "";
      if (value == null || String(value).trim() === "" ||
          !(fridge ? isFridge(key) : isFreezer(key)) ||
          hour !== (is10 ? "10" : "16")) continue;
      const tr = document.createElement("tr");
      for (const cell of [formatDate(date), key, `${value}°C`]) {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
      count++;
    }
  }
  if (!count) showMessage("Nessuna rilevazione disponibile per il periodo selezionato.");
  document.getElementById("dataStatus").textContent = `${count} rilevazioni visualizzate`;
}
function filterData(type) {
  if (!(type in sectionNames)) return;
  selectedType = type;
  render();
}
function chooseMonth(y, m) {
  const date = new Date(y, m, 1);
  selectedYear = date.getFullYear();
  selectedMonth = date.getMonth();
  periodMode = "month";
  updateYearOptions();
  render();
}
document.addEventListener("DOMContentLoaded", async () => {
  const months = document.getElementById("monthSelect");
  monthNames.forEach((name, index) => months.add(new Option(name, String(index))));
  document.getElementById("previousMonth").addEventListener("click", () =>
    chooseMonth(selectedYear, selectedMonth - 1));
  document.getElementById("nextMonth").addEventListener("click", () =>
    chooseMonth(selectedYear, selectedMonth + 1));
  months.addEventListener("change", () => chooseMonth(selectedYear, +months.value));
  document.getElementById("yearSelect").addEventListener("change", e =>
    chooseMonth(+e.target.value, selectedMonth));
  document.getElementById("todayButton").addEventListener("click", () => {
    const now = todayStart();
    selectedYear = now.getFullYear();
    selectedMonth = now.getMonth();
    periodMode = "rolling";
    updateYearOptions();
    render();
  });
  document.getElementById("dataStatus").textContent = "Caricamento rilevazioni…";
  updateYearOptions();
  syncControls();
  try {
    const response = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Formato dati non valido");
    rows = data;
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
    loadError = true;
  }
  updateYearOptions();
  render();
});
