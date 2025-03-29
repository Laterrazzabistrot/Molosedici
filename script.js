
const SHEET_ID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";

const columnsMap = {
  frigo_10: [1, 3, 5, 7, 9, 11],
  frigo_16: [2, 4, 6, 8, 10, 12],
  congel_10: [13, 15, 17, 19, 21, 23, 25, 27],
  congel_16: [14, 16, 18, 20, 22, 24, 26, 28],
};

const sectionNames = {
  frigo_10: "Frigo - Rilevamento ore 10:00",
  frigo_16: "Frigo - Rilevamento ore 16:00",
  congel_10: "Congelatori - Rilevamento ore 10:00",
  congel_16: "Congelatori - Rilevamento ore 16:00",
};

function filterData(type) {
  document.getElementById("sectionTitle").textContent = sectionNames[type];
  const indices = columnsMap[type];
  fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";
      data.forEach(row => {
        indices.forEach(index => {
          const keys = Object.keys(row);
          const name = keys[index];
          const value = row[name];
          if (value) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${row[keys[0]]}</td>
              <td>${name}</td>
              <td>${value}°C</td>
            `;
            tbody.appendChild(tr);
          }
        });
      });
    });
}

// Carica Frigo 10:00 all'avvio
window.onload = () => filterData("frigo_10");
