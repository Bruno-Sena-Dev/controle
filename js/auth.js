document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.getElementById("cadastroForm");
  
    if (cadastroForm) {
      cadastroForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const nome = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        if (senha.length < 6) {
          alert("A senha precisa ter pelo menos 6 caracteres.");
          return;
        }
  
        if (senha !== confirmPassword) {
          alert("As senhas não coincidem.");
          return;
        }
  
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
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
  
    async function hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return hashHex;
    }
  
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const senhaHash = await hashPassword(senha);
  
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
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