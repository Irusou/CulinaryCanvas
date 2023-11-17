function irParaHomePage() {
  // Redirecionar para a home page
  window.location.href = "/frontend/index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const mesasContainer = document.getElementById("mesas-container");
  const mesasLink = document.getElementById("mesas-link");

  mesasLink.addEventListener("click", function () {
      exibirMesasLayout();
  });

  function exibirMesasLayout() {
      mesasContainer.innerHTML = ""; // Limpar o conteúdo anterior

      const totalMesas = 10;

      for (let i = 1; i <= totalMesas; i++) {
          const mesa = document.createElement("div");
          mesa.classList.add("mesa");
          mesa.textContent = `Mesa ${i}`;
          mesa.dataset.numeroMesa = i;

          mesa.addEventListener("click", function () {
              selecionarMesa(mesa);
          });

          mesasContainer.appendChild(mesa);
      }
  }

  function selecionarMesa(mesaSelecionada) {
      const mesas = document.querySelectorAll(".mesa");

      mesas.forEach(mesa => mesa.classList.remove("selecionada", "aberta"));

      if (mesaSelecionada.classList.contains("fechada")) {
          mesaSelecionada.classList.add("selecionada");
      } else {
          mesaSelecionada.classList.add("aberta");
      }
  }
});

