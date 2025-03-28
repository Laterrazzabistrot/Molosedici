window.onload = function () {
  const sheetId = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
  const sheetName = "Temperature";
  const url = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById("temperatureTable");
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      const loading = document.getElementById("loading");

      if (data.length === 0) {
        loading.textContent = "Nessun dato disponibile.";
        return;
      }

      const headers = Object.keys(data[0]);
      const headerRow = document.createElement("tr");
      headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
          const td = document.createElement("td");
          td.textContent = row[header];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.classList.remove("hidden");
      loading.style.display = "none";
    })
    .catch(error => {
      console.error("Errore durante il caricamento dei dati:", error);
      document.getElementById("loading").textContent = "Errore nel caricamento.";
    });
};
