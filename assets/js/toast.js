document
  .querySelectorAll(".btn-adicionar-bebida")
  .forEach((button) => {
    button.addEventListener("click", function () {
      const produtoCard = this.closest(".produto");
      const nome = produtoCard
        ? produtoCard.querySelector("h3").textContent
        : this.getAttribute("data-nome");

      toast.textContent = `${nome} adicionado ao carrinho!`;
      toast.classList.remove("hidden");

      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    });
  });

  document.querySelectorAll(".submit-modal")
