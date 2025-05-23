
const SHEET_ID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";

const sectionNames = {
  frigo_10: "Frigo - Rilevamento ore 10:00",
  frigo_16: "Frigo - Rilevamento ore 16:00",
  congel_10: "Congelatori - Rilevamento ore 10:00",
  congel_16: "Congelatori - Rilevamento ore 16:00",
};

function isFridge(name) {
  const n = name.toLowerCase();
  return n.includes("frigo") || n.includes("cella");
}

function isFreezer(name) {
  return name.toLowerCase().includes("congel");
}

function filterData(type) {
  document.getElementById("sectionTitle").textContent = sectionNames[type];

  const is10 = type.includes("10");
  const isFrigo = type.includes("frigo");

  fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";

      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">Nessun dato disponibile</td></tr>`;
        return;
      }

      data.forEach(row => {
        const dataRilevamento = row["Data"] || row["data"];
        Object.entries(row).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          const orario = lowerKey.includes("10:00") ? "10" :
                         lowerKey.includes("16:00") ? "16" : "";

          if (
            value &&
            ((isFrigo && isFridge(key)) || (!isFrigo && isFreezer(key))) &&
            orario === (is10 ? "10" : "16")
          ) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${dataRilevamento}</td>
              <td>${key}</td>
              <td>${value}°C</td>
            `;
            tbody.appendChild(tr);
          }
        });
      });
    })
    .catch(error => {
      console.error("Errore nel caricamento dei dati:", error);
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = `<tr><td colspan="3">Errore nel caricamento dei dati</td></tr>`;
    });
}

window.onload = () => filterData("frigo_10");
