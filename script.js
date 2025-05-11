// script.js – refactor 11‑05‑2025

document.addEventListener('DOMContentLoaded', init);

async function init () {
  const { fileUrl, label } = currentMonthFile();
  document.getElementById('current-month-label').textContent = label;

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Impossibile caricare ${fileUrl} – ${res.status}`);
    const data = await res.json();

    renderTable(data);
    renderCharts(data);
  } catch (e) {
    console.error(e);
    document.getElementById('error').textContent = e.message;
  }
}

function currentMonthFile () {
  const now  = new Date();
  const y    = now.getFullYear();
  const m    = ('0' + (now.getMonth() + 1)).slice(-2);
  const file = `temps-${y}-${m}.json`;
  const lab  = now.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  return { fileUrl: file, label: lab };
}

// Qui sotto rimangono le tue funzioni esistenti
function renderTable (rows) {
  /* ... */
}
function renderCharts (rows) {
  /* ... */
}
