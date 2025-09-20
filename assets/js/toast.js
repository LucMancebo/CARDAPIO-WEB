const toast = document.getElementById("toast");
const botaoAdicionar = document.getElementById("submit");

function mostrarToast(mensagem) {

  toast.textContent = mensagem;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

botaoAdicionar.addEventListener("click", (event) => {
  mostrarToast("Produto adicionado ao carrinho!");
});
