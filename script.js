document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const table = document.getElementById("temperatureTable");

  // Simulazione caricamento (da sostituire con fetch dei dati reali)
  setTimeout(() => {
    loading.style.display = "none";
    table.classList.remove("hidden");

    const headers = ["Data", "Frigo 1", "Frigo 2"];
    const rows = [
      ["28/03/2025", "4.1°C", "3.7°C"],
      ["29/03/2025", "4.0°C", "3.6°C"]
    ];

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    const headerRow = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    rows.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

  }, 1000);
});
