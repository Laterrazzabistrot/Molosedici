
const SHEET_ID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";

const sectionNames = {
  frigo_10: "Frigo - Rilevamento ore 10:00",
  frigo_16: "Frigo - Rilevamento ore 16:00",
  congel_10: "Congelatori - Rilevamento ore 10:00",
  congel_16: "Congelatori - Rilevamento ore 16:00",
};

function filterData(type) {
  document.getElementById("sectionTitle").textContent = sectionNames[type];
  fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";

      data.forEach(row => {
        const data = row["Data"];
        Object.keys(row).forEach(key => {
          if (key === "Data" || row[key] === "") return;

          const isCongelatore = key.includes("Congelatore");
          const isFrigo = !isCongelatore;

          const ora10 = key.includes("(10:00)");
          const ora16 = key.includes("(16:00)");

          if ((type === "frigo_10" && isFrigo && ora10) ||
              (type === "frigo_16" && isFrigo && ora16) ||
              (type === "congel_10" && isCongelatore && ora10) ||
              (type === "congel_16" && isCongelatore && ora16)) {

            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${data}</td>
              <td>${key}</td>
              <td>${row[key]}°C</td>`;
            tbody.appendChild(tr);
          }
        });
      });
    });
}

window.onload = () => filterData("frigo_10");
