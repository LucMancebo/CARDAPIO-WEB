function verificarStatus() {
    const statusLoja = document.querySelector(".status");
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
  
    let aberto = false;
  
    if (dia === 5 || dia === 6) {
      aberto = hora >= 19 && hora < 24;
    } else if (dia === 0) {
      aberto = hora >= 21 && hora < 24;
    } else if (dia === 1) {
      aberto = (hora > 19 || (hora === 19 && minutos >= 0)) &&
               (hora < 23 || (hora === 23 && minutos <= 30));
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
    const botoes = document.querySelectorAll('.categorias button');
    const secoes = document.querySelectorAll('.categoria'); // pega todas as <section class="categoria">
  
    function mostrarCategoria(categoria) {
      secoes.forEach(secao => {
        secao.style.display = secao.id === categoria ? 'block' : 'none';
      });
  
      botoes.forEach(botao => {
        botao.classList.toggle('ativo', botao.dataset.categoria === categoria);
      });
    }
  
    // Mostra inicialmente a seção "burgers"
    mostrarCategoria('burgers');
  
    botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        const categoria = botao.dataset.categoria;
        mostrarCategoria(categoria);
      });
    });
  }
  
  // ----------------------------
  // Executa ao carregar a página
  // ----------------------------
  window.addEventListener("DOMContentLoaded", () => {
    verificarStatus();
    configurarCategorias();
  });
  