document.addEventListener("DOMContentLoaded", () => {
  const userNome = document.getElementById("userNome");
  const logoutBtn = document.getElementById("logoutBtn");
  const despesaForm = document.getElementById("despesaForm");
  const filtroForm = document.getElementById("filtroForm");
  const listaDespesas = document.querySelector("#listaDespesas tbody");
  const totalMes = document.getElementById("totalMes");

  function obterDespesas() {
      return JSON.parse(localStorage.getItem("despesas")) || [];
  }

  function salvarDespesas(despesas) {
      localStorage.setItem("despesas", JSON.stringify(despesas));
  }

  let despesas = obterDespesas();

  function exibirUsuarioLogado() {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (loggedUser) {
          userNome.textContent = loggedUser.nome;
      } else {
          window.location.href = "login.html";
      }
  }

  function atualizarTotalMes() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Obtendo despesas atualizadas
    despesas = obterDespesas();

    const total = despesas.reduce((acc, d) => {
        const data = new Date(d.data);
        if (!isNaN(data)) { 
            return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
                ? acc + d.valor
                : acc;
        }
        return acc;
    }, 0);

    totalMes.textContent = `R$ ${total.toFixed(2)}`;
}

  function renderizarTabela(filtro = null) {
      listaDespesas.innerHTML = "";
      const despesasFiltradas = filtro ? filtro(despesas) : despesas;

      despesasFiltradas.forEach((despesa, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${despesa.titulo}</td>
              <td>R$ ${despesa.valor.toFixed(2)}</td>
              <td>${despesa.categoria}</td>
              <td>${despesa.data}</td>
              <td>
                  <button onclick="removerDespesa(${index})">Excluir</button>
              </td>
          `;
          listaDespesas.appendChild(row);
      });
  }

  function obterValoresFormulario(formulario) {
      return {
          titulo: formulario.titulo.value,
          valor: parseFloat(formulario.valor.value),
          data: formulario.data.value,
          categoria: formulario.categoria.value,
          observacao: formulario.observacao.value
      };
  }

  despesaForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const novaDespesa = obterValoresFormulario(despesaForm);

      if (novaDespesa.valor <= 0) {
          alert("O valor deve ser positivo.");
          return;
      }

      despesas.push(novaDespesa);
      salvarDespesas(despesas);

      despesaForm.reset();
      atualizarTotalMes();
      renderizarTabela();
  });

  function removerDespesa(index) {
    if (confirm("Deseja realmente excluir esta despesa?")) {
        despesas.splice(index, 1); // Remove do array
        salvarDespesas(despesas); // Atualiza o localStorage
        atualizarTotalMes(); // Atualiza o total do mês
        renderizarTabela(); // Re-renderiza a tabela
    }
}
window.removerDespesa = removerDespesa;

  function filtrarDespesas({ titulo = "", categoria = "", dataInicio, dataFim } = {}) {
      return despesas.filter(d => {
          const data = new Date(d.data);
          return (
              (!titulo || d.titulo.toLowerCase().includes(titulo.toLowerCase())) &&
              (!categoria || d.categoria === categoria) &&
              (!dataInicio || new Date(dataInicio) <= data) &&
              (!dataFim || new Date(dataFim) >= data)
          );
      });
  }

  filtroForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const filtro = filtrarDespesas({
          titulo: document.getElementById("filtroTitulo").value,
          categoria: document.getElementById("filtroCategoria").value,
          dataInicio: document.getElementById("filtroDataInicio").value,
          dataFim: document.getElementById("filtroDataFim").value
      });

      renderizarTabela(() => filtro);
  });

  exibirUsuarioLogado();
  atualizarTotalMes();
  renderizarTabela();
});