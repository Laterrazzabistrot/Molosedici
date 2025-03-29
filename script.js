const SHEET_ID = "1QpY1sSVC7MSs8lwgxjnpr2Jpzq-ZbVwFdr6Genrul5E";
const SHEET_NAME = "Temperature";

const sectionNames = {
  frigo_10: "Frigo - Rilevamento ore 10:00",
  frigo_16: "Frigo - Rilevamento ore 16:00",
  congel_10: "Congelatori - Rilevamento ore 10:00",
  congel_16: "Congelatori - Rilevamento ore 16:00",
};

function isFridge(name) {
  return (
    name.toLowerCase().includes("frigo") ||
    name.toLowerCase().includes("cella")
  );
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

      data.forEach(row => {
        Object.entries(row).forEach(([device, value]) => {
          const ora = device.includes("(10:00)") ? "10" : device.includes("(16:00)") ? "16" : "";
          const dataRilevamento = row["Data"];

          if (
            value &&
            ((isFrigo && isFridge(device)) || (!isFrigo && isFreezer(device))) &&
            ora === (is10 ? "10" : "16")
          ) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${dataRilevamento}</td>
              <td>${device}</td>
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
