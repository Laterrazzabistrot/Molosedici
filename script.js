
function mostraTabella(id) {
  document.querySelectorAll('.tabella').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(id).style.display = 'block';
}
