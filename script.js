
const sheetID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const sheetName = "Temperature";
const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const table = document.getElementById("temperatureTable");
    const loading = document.getElementById("loading");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    if (data.length === 0) {
      loading.textContent = "Nessun dato disponibile.";
      return;
    }

    loading.style.display = "none";
    table.classList.remove("hidden");

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach((row) => {
      const tr = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = row[header];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  })
  .catch((error) => {
    document.getElementById("loading").textContent = "Errore nel caricamento dati.";
    console.error("Errore:", error);
  });
