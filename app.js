const app = document.getElementById('app');

const routes = {
  '/': loginPage,
  '/signup': signupPage,
  '/home': homeFeed
};

function loginPage() {
  app.innerHTML = `
    <form id="loginForm">
      <h2>Login</h2>
      <input type="text" id="loginUser" placeholder="Usuário" required />
      <input type="password" id="loginPass" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
  `;

  document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.hash = '#/home';
    } else {
      alert('Erro ao fazer login');
    }
  };
}

function signupPage() {
  app.innerHTML = `
    <form id="signupForm">
      <h2>Cadastro</h2>
      <input type="text" id="signupUser" placeholder="Usuário" required />
      <input type="password" id="signupPass" placeholder="Senha" required />
      <button type="submit">Cadastrar</button>
    </form>
  `;

  document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUser').value;
    const password = document.getElementById('signupPass').value;

    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      alert('Conta criada! Faça login.');
      window.location.hash = '#/';
    } else {
      alert('Erro ao cadastrar');
    }
  };
}

function homeFeed() {
  app.innerHTML = `
    <div>
      <h1>Bem-vindo ao M!</h1>
      <p>Feed de postagens aqui...</p>
    </div>
  `;
}

function router() {
  const hash = window.location.hash.replace('#', '') || '/';
  const page = routes[hash] || loginPage;
  page();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
