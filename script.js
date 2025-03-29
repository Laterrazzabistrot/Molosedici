
const SHEET_ID = "1QpY1sSVC7MSs8Iwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";

const columnsMap = {
  frigo_10: [1, 3, 5, 7, 9, 11, 13, 15],
  frigo_16: [2, 4, 6, 8, 10, 12, 14, 16],
  congel_10: [17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
  congel_16: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
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
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";
      data.forEach((row) => {
        indices.forEach((index) => {
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

window.onload = () => filterData("frigo_10");
