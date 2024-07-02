// Seleção dos elementos do DOM
const nav = document.querySelector(".nav");
const btnMenu = document.querySelector(".btn-menu");
const menu = document.querySelector(".menu");
const updatesDialog = document.getElementById('updatesDialog');
const openUpdatesBtn = document.getElementById('openUpdatesBtn');

// Função para lidar com o clique no botão do menu
function handleButtonClick(event) {
  if (event.type === "touchstart") {
    event.preventDefault();
  }
  event.stopPropagation();

  // Alternar a classe 'active' no menu de navegação
  nav.classList.toggle("active");

  // Atualizar o status do menu no localStorage
  updateLastMenuStatus(nav.classList.contains("off"));

  // Lidar com cliques fora do menu para fechar o menu se aberto
  handleClickOutside(menu, () => {
    nav.classList.remove("active");
    setAria();
    updateLastMenuStatus(false); // Define como fechado quando clicar fora do menu
  });

  // Atualizar atributos ARIA do botão do menu
  setAria();
}

// Função para lidar com cliques fora do elemento alvo
function handleClickOutside(targetElement, callback) {
  const html = document.documentElement;

  function handleHTMLClick(event) {
    if (!targetElement.contains(event.target)) {
      targetElement.removeAttribute("data-target");
      html.removeEventListener("click", handleHTMLClick);
      html.removeEventListener("touchstart", handleHTMLClick);
      callback();
    }
  }

  if (!targetElement.hasAttribute("data-target")) {
    html.addEventListener("click", handleHTMLClick);
    html.addEventListener("touchstart", handleHTMLClick);
    targetElement.setAttribute("data-target", "");
  }
}

// Função para atualizar atributos ARIA do botão do menu
function setAria() {
  const isActive = nav.classList.contains("active");
  btnMenu.setAttribute("aria-expanded", isActive);
  btnMenu.setAttribute("aria-label", isActive ? "Fechar Menu" : "Abrir Menu");
}

// Função para atualizar o status do menu no localStorage
function updateLastMenuStatus(active) {
  const lastMenuStatus = active ? "aberto" : "fechado";
  localStorage.setItem("lastMenuStatus", lastMenuStatus);
}

// Verificar e aplicar o status do menu ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const lastMenuStatus = localStorage.getItem("lastMenuStatus");
  if (lastMenuStatus === "aberto") {
    nav.classList.add("active");
    setAria();
  } else {
    nav.classList.remove("active");
    setAria();
  }
});

// Adicionar event listener para o clique no botão do menu
btnMenu.addEventListener("click", handleButtonClick);
btnMenu.addEventListener("touchstart", handleButtonClick);

// Lidar com a caixa de diálogo de últimas atualizações
openUpdatesBtn.addEventListener('click', abrirDialog);

// Função para abrir a caixa de diálogo
function abrirDialog() {
  updatesDialog.style.display = 'block';
}

// Função para fechar a caixa de diálogo
function fecharDialog() {
  updatesDialog.style.display = 'none';
}

// Event listener para fechar a caixa de diálogo ao clicar no botão de fechar
document.querySelector('.close').addEventListener('click', fecharDialog);

// Event listener para fechar a caixa de diálogo ao clicar fora dela
window.addEventListener('click', (event) => {
  if (event.target === updatesDialog) {
    fecharDialog();
  }
});

// Event listener para lidar com a tecla 'Esc' para fechar a caixa de diálogo
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && updatesDialog.style.display === 'block') {
    fecharDialog();
  }
});
