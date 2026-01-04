document.addEventListener("DOMContentLoaded", () => {
  // URL API
  const API_URL = 'http://localhost:8080/api/auth';

  const showLoginBtn = document.getElementById("showLoginBtn");
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginMessage = document.getElementById("loginMessage");
  const registerMessage = document.getElementById("registerMessage");

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", () => {
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
      showLoginBtn.classList.add("active");
      showRegisterBtn.classList.remove("active");
    });
  }

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", () => {
      registerForm.classList.add("active");
      loginForm.classList.remove("active");
      showRegisterBtn.classList.add("active");
      showLoginBtn.classList.remove("active");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginMessage.textContent = "";
      const email = document.getElementById("login-email").value;
      const senha = document.getElementById("login-password").value;
      try {
        const response = await axios.post(`${API_URL}/login`, { email, senha });
        localStorage.setItem("jwtToken", response.data.token);
        loginMessage.textContent = "Login bem-sucedido! Redirecionando...";
        loginMessage.className = "form-message success";
        setTimeout(() => {
          window.location.href = "/index.html"; 
        }, 1500);
      } catch (error) {
        loginMessage.textContent = "E-mail ou senha inválidos.";
        loginMessage.className = "form-message error";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      registerMessage.textContent = "";
      const nome = document.getElementById("register-name").value;
      const cpf = "000.000.000-00"; 
      const email = document.getElementById("register-email").value;
      const senha = document.getElementById("register-password").value;
      try {
        await axios.post(`${API_URL}/registro`, { nome, cpf, email, senha });
        registerMessage.textContent = "Registo bem-sucedido! Pode fazer login agora.";
        registerMessage.className = "form-message success";
        registerForm.reset();
        setTimeout(() => {
          showLoginBtn.click();
        }, 2000);
      } catch (error) {
        registerMessage.textContent = "Erro ao registar. Verifique os dados.";
        registerMessage.className = "form-message error";
      }
    });
  }

  // Lógica do Modal "Esqueci Senha"
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const forgotMessage = document.getElementById("forgotMessage");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.add("active");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      forgotPasswordModal.classList.remove("active");
    });
  }

  if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener("click", (e) => {
      if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove("active");
      }
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      forgotMessage.textContent = "Enviando...";
      forgotMessage.className = "form-message";
      const email = document.getElementById("forgot-email").value;
      try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        forgotMessage.textContent = response.data.message;
        forgotMessage.className = "form-message success";
      } catch (error) {
        forgotMessage.textContent = error.response?.data?.error || "Erro ao enviar e-mail.";
        forgotMessage.className = "form-message error";
      }
    });
  }

  // ===============================================
  // LÓGICA DO CANVAS DE FUNDO (PARTÍCULAS ROXAS)
  // ===============================================
  const canvas = document.getElementById("background-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 70;

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      draw() {
        // COR ROXA DAS BOLINHAS
        ctx.fillStyle = "rgba(157, 78, 221, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function handleParticles() {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            // COR ROXA DAS LINHAS
            ctx.strokeStyle = `rgba(157, 78, 221, ${1 - distance / 100})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
      setCanvasSize();
      init();
    });

    setCanvasSize();
    init();
    animate();
  }
});