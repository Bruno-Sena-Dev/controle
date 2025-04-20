document.addEventListener("DOMContentLoaded", () => {  //verifica que a pagina html foi carregada
    const cadastroForm = document.getElementById("cadastroForm"); //verifica se o formulario de cadastro existe
  
    if (cadastroForm) { 
      cadastroForm.addEventListener("submit", async (event) => {  //verifica se o formulario foi enviado e cria o evento
        event.preventDefault(); //nao deixa a pagina recarregar
  
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value; 
        const senha = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        if (senha.length < 6) {
          alert("A senha precisa ter pelo menos 6 caracteres."); //redundancia de segurança "ja existe no html a verificacao"
          return;
        }
        if (senha !== confirmPassword) {
          alert("As senhas não coincidem."); 
          return;
        }

        let usuarios = JSON.parse(localStorange.getItem("usuarios")) || []; //verifica se existe usuarios cadastrados no localStorage
        if (usuarios.some((user) => user.email === email)) {
          alert("Email já cadastrado!");
          return;
        }
  
        const senhaHash = await hashPassword(senha);
        const novoUsuario = { nome, email, senha: senhaHash };
        usuarios.push(novoUsuario);
  
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html";
      });
    }
    function hashPassword(password) {
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = (hash << 5) - hash + char; // Operação bitwise para gerar o hash
        hash = hash & hash; // Converte para um número de 32 bits
      }
      return hash.toString(16); // Converte o hash para hexadecimal
    }
  
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const senhaHash = await hashPassword(senha); //hash da senha digitada pelo usuario
  
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []; //busca os usuarios cadastrados e se nao tiver volta null
        const usuario = usuarios.find(
          (user) => user.email === email && user.senha === senhaHash
        );
        if (!usuario) {
          alert("Credenciais inválidas!");
          return;
        }
        localStorage.setItem("loggedUser", JSON.stringify(usuario));
        alert("Login realizado com sucesso!");
        window.location.href = "dashboard.html";
      });
    }
  });