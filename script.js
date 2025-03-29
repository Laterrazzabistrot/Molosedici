
function showTable(id) {
  const sections = document.querySelectorAll('.data-table');
  sections.forEach(section => section.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// Caricamento dati simulato - da sostituire con fetch da JSON o API
document.addEventListener('DOMContentLoaded', () => {
  // Simulazione intestazioni
  const head = "<tr><th>Data</th><th>Dispositivo</th><th>Temperatura</th></tr>";
  document.querySelectorAll("thead").forEach(t => t.innerHTML = head);

  // Simulazione dati
  const rows = [
    "<tr><td>29/03/2025</td><td>Frigo 1</td><td>3.2°C</td></tr>",
    "<tr><td>29/03/2025</td><td>Frigo 2</td><td>3.4°C</td></tr>"
  ];
  document.querySelectorAll("tbody").forEach(t => t.innerHTML = rows.join(""));
});
