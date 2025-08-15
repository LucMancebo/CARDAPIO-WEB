document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM - usando todas as classes e IDs do seu HTML
  const modalAdicionais = document.getElementById("modal-adicionais");
  const modalCarrinho = document.getElementById("modal-carrinho");
  const btnAdicionar = document.querySelectorAll(".btn-adicionar");
  const btnFecharAdicionais = document.querySelector(
    "#modal-adicionais .fechar"
  );
  const btnFecharCarrinho = document.querySelector("#modal-carrinho .fechar");
  const cartButton = document.querySelector(".cart");
  const cartCounter = document.querySelector(".cart-counter"); // Usando a classe que já existe no seu HTML
  const itensCarrinho = document.getElementById("itens-carrinho");
  const formAdicionais = document.querySelector("#modal-adicionais form");
  const finalizarPedidoBtn = document.getElementById("finalizar-pedido");
  const enderecoInput = document.getElementById("endereco");
  const pagamentoSelect = document.getElementById("pagamento");
  const customAlert = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  const alertOkBtn = document.getElementById("alert-ok-btn");

  verificarStatus();
  configurarCategorias();

  function verificarStatus() {
    const statusLoja = document.querySelector(".status");
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();

    let aberto = false;

    if (dia === 5 || dia === 6) {
      aberto = hora >= 18 && hora < 24;
    } else if (dia === 0) {
      aberto = hora >= 21 && hora < 24;
    } else if (dia === 1) {
      aberto =
        (hora > 18 || (hora === 18 && minutos >= 0)) &&
        (hora < 4 || (hora === 24 && minutos <= 0));
    }

    if (statusLoja) {
      if (aberto) {
        statusLoja.textContent = "Aberto agora";
        statusLoja.style.backgroundColor = "#28a745";
      } else {
        statusLoja.textContent = "Fechado no momento";
        statusLoja.style.backgroundColor = "#dc3545";
      }
    }
  }

  setInterval(() => {
    verificarStatus();
  }, 60000);

  // ----------------------------
  // Categoria dinâmica (adaptado ao seu HTML)
  // ----------------------------
  function configurarCategorias() {
    const botoes = document.querySelectorAll(".categorias button");
    const secoes = document.querySelectorAll(".categoria"); // pega todas as <section class="categoria">

    function mostrarCategoria(categoria) {
      secoes.forEach((secao) => {
        secao.style.display = secao.id === categoria ? "block" : "none";
      });

      botoes.forEach((botao) => {
        botao.classList.toggle("ativo", botao.dataset.categoria === categoria);
      });
    }

    // Mostra inicialmente a seção "burgers"
    mostrarCategoria("burgers");

    botoes.forEach((botao) => {
      botao.addEventListener("click", () => {
        const categoria = botao.dataset.categoria;
        mostrarCategoria(categoria);
      });
    });
  }

  function showAlert(message) {
    alertMessage.textContent = message;
    customAlert.classList.remove("hidden");

    // Focar no botão OK para acessibilidade
    setTimeout(() => {
      alertOkBtn.focus();
    }, 100);
  }

  // Fechar o alerta
  alertOkBtn.addEventListener("click", () => {
    customAlert.classList.add("hidden");
  });

  // Fechar ao pressionar Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !customAlert.classList.contains("hidden")) {
      customAlert.classList.add("hidden");
    }
  });

  // Variáveis de estado
  let produtoAtual = null;
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Função para formatar preço no formato R$ XX,XX
  function formatarPreco(valor) {
    // Converte para número garantidamente
    const numero = Number(valor);

    // Formata com 2 casas decimais, zero à esquerda e substitui ponto por vírgula
    return (
      "R$ " +
      numero.toLocaleString("pt-BR", {
        minimumIntegerDigits: 2,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  //efeito animação botões nav
  // Para o botão adicionar
  document
    .querySelector(".btn-adicionar")
    .addEventListener("click", function () {
      this.focus(); // Ativa o efeito ripple

      // Sua lógica de adicionar item aqui
      const nome = this.getAttribute("data-nome");
      const preco = this.getAttribute("data-preco");
      console.log(`Adicionado: ${nome} - R$${preco}`);
    });

  // Para os botões de navegação (mantendo seu estilo selecionado)
  document.querySelectorAll("nav.categorias button").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove ativo de todos os botões
      document.querySelectorAll("nav.categorias button").forEach((b) => {
        b.classList.remove("ativo");
      });

      // Adiciona ao clicado
      this.classList.add("ativo");
      this.focus();
    });
  });

  // Função para atualizar o contador do carrinho
  function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce(
      (total, item) => total + item.quantidade,
      0
    );
    cartCounter.textContent = totalItens;

    // Adiciona/remove classe active baseado na quantidade
    if (totalItens > 0) {
      cartCounter.classList.add("active");
    } else {
      cartCounter.classList.remove("active");
    }
  }

  // Função para fechar ao clicar fora
  function setupModalCloseOutside(modal) {
    modal.addEventListener("click", function (e) {
      // Verifica se o clique foi no overlay (fora do conteúdo)
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Versão otimizada com touch
  function setupModalCloseOutside(modal) {
    let startY;

    modal.addEventListener(
      "touchstart",
      function (e) {
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    modal.addEventListener(
      "touchend",
      function (e) {
        const endY = e.changedTouches[0].clientY;
        // Verifica se foi um toque simples (não swipe)
        if (Math.abs(endY - startY) < 10 && e.target === modal) {
          modal.classList.add("hidden");
        }
      },
      { passive: true }
    );

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Aplicar a todos os modais
  document.querySelectorAll(".modal").forEach((modal) => {
    setupModalCloseOutside(modal);

    // Adicionar também o fechamento com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  });

  // Função para abrir modal com animação
  function abrirModalAdicionais(produtoCard, button) {
    produtoAtual = {
      nome: produtoCard.querySelector("h3").textContent,
      nomeKey: button.dataset.nome,
      precoBase: parseFloat(button.dataset.preco),
      quantidade: 1,
      adicionais: [],
      molho: "",
      observacoes: "",
    };

    // Reseta o formulário de adicionais
    formAdicionais.reset();

    // Remove a classe hidden e força o reflow para iniciar a animação
    modalAdicionais.classList.remove("hidden");
    void modalAdicionais.offsetWidth; // Isso força o reflow

    // Adiciona classe para animação
    modalAdicionais.classList.add("visible");
  }

  // Função para fechar modal com animação
  function fecharModalAdicionais() {
    // Remove a classe visible para iniciar animação de saída
    modalAdicionais.classList.remove("visible");

    // Espera a animação terminar antes de adicionar hidden
    setTimeout(() => {
      modalAdicionais.classList.add("hidden");
    }, 300); // Tempo deve corresponder à duração da animação CSS
  }

  // Atualize os event listeners
  btnAdicionar.forEach((button) => {
    button.addEventListener("click", function () {
      const produtoCard = this.closest(".produto");
      abrirModalAdicionais(produtoCard, this);
    });
  });

  //adicionar bebidas direto no carrinho sem abrir modal
  document.querySelectorAll(".btn-adicionar-bebida").forEach((button) => {
    button.addEventListener("click", function () {
      // Pega o nome do produto do card, não do data attribute
      const produtoCard = this.closest(".produto");
      const nome = produtoCard ? produtoCard.querySelector("h3").textContent : this.getAttribute("data-nome");
      const preco = parseFloat(this.getAttribute("data-preco"));
      const nomeKey = this.getAttribute("data-nome");

      // Verifica se já existe bebida igual no carrinho
      const itemExistenteIndex = carrinho.findIndex(
        (item) => item.nomeKey === nomeKey && (!item.adicionais || item.adicionais.length === 0) && !item.molho
      );

      if (itemExistenteIndex >= 0) {
        carrinho[itemExistenteIndex].quantidade++;
      } else {
        carrinho.push({
          nome,
          nomeKey,
          precoBase: preco,
          precoTotal: preco,
          quantidade: 1,
          adicionais: [],
          molho: "",
          observacoes: "",
        });
      }

      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      atualizarCarrinho();

      // Feedback visual
      cartButton.classList.add("animate-bounce");
      setTimeout(() => cartButton.classList.remove("animate-bounce"), 500);
    });
  });

  // Fechar modais com animação
  btnFecharAdicionais.addEventListener("click", fecharModalAdicionais);
  btnFecharCarrinho.addEventListener("click", () => {
    // Se quiser animação no carrinho também, crie uma função similar
    modalCarrinho.classList.add("hidden");
  });

  

  // Adicionar ao carrinho
  formAdicionais.addEventListener("submit", function (e) {
    e.preventDefault();

    // Captura adicionais
    const adicionaisSelecionados = [];
    document
      .querySelectorAll('.adicionais input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        adicionaisSelecionados.push({
          nome: checkbox.value,
          preco: parseFloat(checkbox.dataset.preco),
        });
      });

    // Captura molho
    const molhoSelecionado = document.querySelector(
      '.molhos input[name="molho"]:checked'
    );

    // Atualiza produto atual
    produtoAtual.adicionais = adicionaisSelecionados;
    produtoAtual.molho = molhoSelecionado ? molhoSelecionado.value : "";
    produtoAtual.observacoes = document.querySelector(
      "#modal-adicionais textarea"
    ).value;
    produtoAtual.precoTotal =
      produtoAtual.precoBase +
      adicionaisSelecionados.reduce(
        (total, adicional) => total + adicional.preco,
        0
      );

    // Verifica se já existe item igual no carrinho
    const itemExistenteIndex = carrinho.findIndex(
      (item) =>
        item.nomeKey === produtoAtual.nomeKey &&
        JSON.stringify(item.adicionais) ===
          JSON.stringify(produtoAtual.adicionais) &&
        item.molho === produtoAtual.molho
    );

    if (itemExistenteIndex >= 0) {
      carrinho[itemExistenteIndex].quantidade++;
    } else {
      carrinho.push(produtoAtual);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    modalAdicionais.classList.add("hidden");
    atualizarCarrinho();

    // Feedback visual
    cartButton.classList.add("animate-bounce");
    setTimeout(() => cartButton.classList.remove("animate-bounce"), 500);
  });

  // Abrir carrinho
  cartButton.addEventListener("click", function () {
    if (carrinho.length === 0) {
      showAlert("Seu carrinho está vazio!");
      return;
    }
    atualizarCarrinho();
    modalCarrinho.classList.remove("hidden");
  });

  // Função para atualizar a exibição do carrinho
  function atualizarCarrinho() {
    // Limpa o conteúdo atual do carrinho
    itensCarrinho.innerHTML = "";

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
      itensCarrinho.innerHTML = '<p class="carrinho-vazio">Carrinho vazio</p>';
      atualizarContadorCarrinho();
      return;
    }

    let total = 0;

    // Itera sobre cada item no carrinho
    carrinho.forEach((item, index) => {
      // Cria o elemento principal do item
      const itemElement = document.createElement("div");
      itemElement.className = "item-carrinho";

      // Cria o cabeçalho do item (nome e preço)
      const itemHeader = document.createElement("div");
      itemHeader.className = "item-header";

      // Adiciona informações básicas do produto
      const itemInfo = document.createElement("div");
      itemInfo.className = "item-info";
      itemInfo.innerHTML = `
          <h4 class="item-nome">${item.nome}</h4>
          <span class="item-preco">${formatarPreco(item.precoBase)}</span>
      `;

      // Cria container para controle de quantidade
      const itemQuantidade = document.createElement("div");
      itemQuantidade.className = "item-quantidade";

      // Monta a estrutura do item
      itemHeader.appendChild(itemInfo);
      itemHeader.appendChild(itemQuantidade);
      itemElement.appendChild(itemHeader);

      // Adiciona os adicionais se houver
      if (item.adicionais.length > 0) {
        const adicionaisElement = document.createElement("div");
        adicionaisElement.className = "item-adicionais";
        adicionaisElement.innerHTML = `
              <p class="adicional-titulo">Adicionais: </p>
              <ul class="lista-adicionais">
                  ${item.adicionais
                    .map(
                      (adicional) => `
                      <li class="adicional-item">
                          ${
                            adicional.nome
                          } <span class="adicional-preco">${formatarPreco(
                        adicional.preco
                      )}</span>
                      </li>
                  `
                    )
                    .join("")}
              </ul>
          `;
        itemElement.appendChild(adicionaisElement);
      }

      // Adiciona o molho se selecionado
      if (item.molho && item.molho !== "naoObrigado") {
        const molhoElement = document.createElement("div");
        molhoElement.className = "item-molho";
        molhoElement.innerHTML = `<p class="molho-texto">Molho: ${item.molho
          .replace("maionese", "Maionese")
          .replace("ketchup", "Ketchup")
          .replace("mostarda", "Mostarda")}</p>`;
        itemElement.appendChild(molhoElement);
      }

      // Adiciona observações se houver
      if (item.observacoes) {
        const obsElement = document.createElement("div");
        obsElement.className = "item-obs";
        obsElement.innerHTML = `<p class="obs-texto">Obs: ${item.observacoes}</p>`;
        itemElement.appendChild(obsElement);
      }

      // Adiciona botão para remover item
      const btnRemover = document.createElement("button");
      btnRemover.className = "btn-remover";
      btnRemover.textContent = "Remover";
      btnRemover.dataset.index = index;
      itemElement.appendChild(btnRemover);

      // Adiciona o item ao carrinho e atualiza o total
      itensCarrinho.appendChild(itemElement);
      total += item.precoTotal * item.quantidade;
    });

    const taxaSelect = document.getElementById("taxa");
    const enderecoTextarea = document.getElementById("endereco"); // Certifique-se que este ID existe no seu HTML
    const taxaSelecionada = taxaSelect.options[taxaSelect.selectedIndex];
    let taxaEntrega = 0;

    // Verifica se é retirada e atualiza o campo de endereço
    if (taxaSelecionada && taxaSelecionada.value) {
      if (taxaSelecionada.value === "retirada") {
        enderecoTextarea.disabled = true;
        enderecoTextarea.required = false;
        enderecoTextarea.value = "";
        enderecoTextarea.classList.add("campo-desabilitado");
      } else {
        enderecoTextarea.disabled = false;
        enderecoTextarea.required = true;
        enderecoTextarea.classList.remove("campo-desabilitado");
      }

      // Calcula a taxa de entrega
      if (!isNaN(parseFloat(taxaSelecionada.dataset.preco))) {
        taxaEntrega = parseFloat(taxaSelecionada.dataset.preco);
      }
    }

   let totalFinal = total + taxaEntrega;

   if (pagamentoSelect.value === "sodexo") {
      // Adiciona 12% de taxa para pagamento com Sodexo
      totalFinal *= 1.12;
      total += total * 0.12; // Adiciona a taxa de 12% ao total
    } 

    //listener para atualizar o total quando o pagamento mudar
    pagamentoSelect.addEventListener("change", function () {
      if (this.value === "sodexo") {
        totalFinal = (total + taxaEntrega) * 1.12; // Aplica 12% de taxa
      } else {
        totalFinal = total + taxaEntrega; // Remove a taxa se não for Sodexo
      }
      atualizarCarrinho(); // Atualiza a exibição do carrinho
    });

    const totalElement = document.createElement("div");
    totalElement.className = "carrinho-total";
    let taxaSodexo = 0;

    if (pagamentoSelect.value === "sodexo") {
      taxaSodexo = (total + taxaEntrega) * 0.12;
    }

    totalElement.innerHTML = `
    <div class="container-total">
      <div class="total-container">
      <span class="total-texto">Taxa:</span>
      <span class="total-valor">${formatarPreco(taxaEntrega)}</span>
      </div>
      ${
      taxaSodexo > 0
        ? `<div class="total-container">
          <span class="total-texto">Taxa Sodexo (12%):</span>
          <span class="total-valor">${formatarPreco(taxaSodexo)}</span>
        </div>`
        : ""
      }
      <div class="total-container">
      <span class="total-texto">Total:</span>
      <span class="total-valor">${formatarPreco(totalFinal)}</span>
      </div>
    </div>`;

    itensCarrinho.appendChild(totalElement);

    // 6. Adicione um listener para atualizar quando a taxa mudar
    taxaSelect.addEventListener("change", function () {
      const isRetirada = this.value === "retirada";

      // Atualiza o campo de endereço
      enderecoTextarea.disabled = isRetirada;
      enderecoTextarea.required = !isRetirada;
      if (isRetirada) {
        enderecoTextarea.value = "";
        enderecoTextarea.classList.add("campo-desabilitado");
      } else {
        enderecoTextarea.classList.remove("campo-desabilitado");
      }
      // Atualiza o carrinho
      atualizarCarrinho();
    });

    // Configura eventos dos botões de quantidade
    document.querySelectorAll(".btn-quantidade").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        if (this.classList.contains("menos")) {
          if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
          } else {
            carrinho.splice(index, 1);
          }
        } else {
          carrinho[index].quantidade++;
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarCarrinho();
      });
    });

    // Configura eventos dos botões de remover
    document.querySelectorAll(".btn-remover").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarCarrinho();
      });
    });

    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
  }

  // Evento para finalizar pedido via WhatsApp
  finalizarPedidoBtn.addEventListener("click", function () {
    // Valida se há itens no carrinho
    if (carrinho.length === 0) {
      showAlert("Adicione itens ao carrinho antes de finalizar!");
      return;
    }

    // Valida se a taxa de entrega foi selecionada
    const taxaSelect = document.getElementById("taxa");
    if (!taxaSelect.value) {
      showAlert("Por favor, selecione a região de entrega!");
      return;
    }

    // Obtém os valores do formulário
    const endereco = enderecoInput.value.trim();
    const pagamento = pagamentoSelect.value;
    const taxaSelecionada = taxaSelect.options[taxaSelect.selectedIndex];
    const taxaEntrega = parseFloat(taxaSelecionada.dataset.preco);

    // Valida endereço e pagamento
    const isRetirada = document.getElementById("taxa").value === "retirada";

    if (!pagamento) {
      showAlert("Por favor, selecione a forma de pagamento!");
      return;
    }
    if (!isRetirada && !endereco) {
      showAlert("Por favor, preencha o endereço de entrega!");
      return;
    }
    // Monta a mensagem do pedido
    let mensagem = "*PEDIDO - ICARUS HAMBURGUERIA*\n\n";
    mensagem += "ITENS DO PEDIDO:\n";
    mensagem += "-----------------------------------\n";

    let subtotal = 0;
    carrinho.forEach((item) => {
      mensagem += `*${item.quantidade}x ${item.nome}* - ${formatarPreco(
        item.precoTotal
      )}\n`;

      // Adiciona informações sobre adicionais
      if (item.adicionais.length > 0) {
        mensagem += `Adicionais: \n${item.adicionais
          .map((a) => `- ${a.nome} +${formatarPreco(a.preco)}`)
          .join("\n")}\n`;
      }

      // Adiciona informação sobre molho
      if (item.molho && item.molho !== "naoObrigado") {
        mensagem += `Molho: ${item.molho}\n`;
      }

      // Adiciona observações se houver
      if (item.observacoes) {
        mensagem += `Observações: ${item.observacoes}\n`;
      }

      mensagem += "\n";
      subtotal += item.precoTotal * item.quantidade;
    });

    // Adiciona taxa Sodexo se necessário
    let taxaSodexo = 0;
    if (pagamento === "sodexo") {
      taxaSodexo = (subtotal + taxaEntrega) * 0.12; // 12% de taxa
    }

    // Calcula o total incluindo taxa de entrega e Sodexo
    const total = subtotal + taxaEntrega + taxaSodexo;

    // Adiciona totais e informações de entrega
    mensagem += "------------------------------------\n";
    mensagem += `Subtotal: ${formatarPreco(subtotal)}\n`;
    mensagem += `Taxa de entrega: ${formatarPreco(taxaEntrega)}\n`;
    if (taxaSodexo > 0) {
      mensagem += `Taxa Sodexo (12%): ${formatarPreco(taxaSodexo)}\n`;
    }
    mensagem += `*TOTAL: ${formatarPreco(total)}*\n`;
    mensagem += `*REGIÃO:* ${taxaSelecionada.text}\n`;
    mensagem += `*ENDEREÇO:* ${isRetirada ? "Retirada no local" : endereco}\n`;
    mensagem += `*PAGAMENTO:* ${pagamento}\n\n`;
    mensagem += "Obrigado por pedir no ICARUS!\n";

    // Prepara e abre o link do WhatsApp
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/5522998470719?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, "_blank");

    // Limpa o carrinho e reseta o formulário
    carrinho = [];
    localStorage.removeItem("carrinho");
    atualizarCarrinho();
    modalCarrinho.classList.add("hidden");
    enderecoInput.value = "";
    pagamentoSelect.selectedIndex = 0;
    taxaSelect.selectedIndex = 0;
  });

  // Inicialização
  atualizarContadorCarrinho();
});
