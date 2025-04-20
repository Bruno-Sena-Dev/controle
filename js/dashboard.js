document.addEventListener("DOMContentLoaded", () => {
    const userNome = document.getElementById("userNome");
    const logoutBtn = document.getElementById("logoutBtn");
    const despesaForm = document.getElementById("despesaForm");
    const filtroForm = document.getElementById("filtroForm");
    const listaDespesas = document.querySelector("#listaDespesas tbody");
    const totalMes = document.getElementById("totalMes");
  
    let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  
    // Exibir nome do usuário logado
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser) {
      userNome.textContent = loggedUser.nome;
    } else {
      window.location.href = "login.html";
    }
  
    // Logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });
  
    // Atualizar total do mês
    function atualizarTotalMes() {
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      const total = despesas
        .filter((d) => {
          const data = new Date(d.data);
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        })
        .reduce((acc, d) => acc + d.valor, 0);
      totalMes.textContent = `R$ ${total.toFixed(2)}`;
    }
  
    // Renderizar tabela
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
            <button onclick="editarDespesa(${index})">Editar</button>
            <button onclick="removerDespesa(${index})">Excluir</button>
          </td>
        `;
        listaDespesas.appendChild(row);
      });
    }
  
    // Adicionar despesa
    despesaForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const titulo = document.getElementById("titulo").value;
      const valor = parseFloat(document.getElementById("valor").value);
      const data = document.getElementById("data").value;
      const categoria = document.getElementById("categoria").value;
      const observacao = document.getElementById("observacao").value;
  
      if (valor <= 0) {
        alert("O valor deve ser positivo.");
        return;
      }
  
      const novaDespesa = { titulo, valor, data, categoria, observacao };
      despesas.push(novaDespesa);
      localStorage.setItem("despesas", JSON.stringify(despesas));
  
      despesaForm.reset();
      atualizarTotalMes();
      renderizarTabela();
    });
  
    // Remover despesa
    window.removerDespesa = (index) => {
      if (confirm("Deseja realmente excluir esta despesa?")) {
        despesas.splice(index, 1);
        localStorage.setItem("despesas", JSON.stringify(despesas));
        atualizarTotalMes();
        renderizarTabela();
      }
    };
  
    // Filtros
    filtroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const titulo = document.getElementById("filtroTitulo").value.toLowerCase();
      const categoria = document.getElementById("filtroCategoria").value;
      const dataInicio = document.getElementById("filtroDataInicio").value;
      const dataFim = document.getElementById("filtroDataFim").value;
  
      const filtro = (despesas) =>
        despesas.filter((d) => {
          const data = new Date(d.data);
          return (
            (!titulo || d.titulo.toLowerCase().includes(titulo)) &&
            (!categoria || d.categoria === categoria) &&
            (!dataInicio || new Date(dataInicio) <= data) &&
            (!dataFim || new Date(dataFim) >= data)
          );
        });
  
      renderizarTabela(filtro);
    });
  
    // Inicializar
    atualizarTotalMes();
    renderizarTabela();
  });