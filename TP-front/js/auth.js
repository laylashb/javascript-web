document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authMessage = document.getElementById('auth-message');

  function showLogin() {
    tabLogin.classList.add('bg-slate-800', 'text-slate-100');
    tabLogin.classList.remove('text-slate-400');
    tabRegister.classList.remove('bg-slate-800', 'text-slate-100');
    tabRegister.classList.add('text-slate-400');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    authMessage.textContent = '';
  }

  function showRegister() {
    tabRegister.classList.add('bg-slate-800', 'text-slate-100');
    tabRegister.classList.remove('text-slate-400');
    tabLogin.classList.remove('bg-slate-800', 'text-slate-100');
    tabLogin.classList.add('text-slate-400');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    authMessage.textContent = '';
  }

  tabLogin?.addEventListener('click', showLogin);
  tabRegister?.addEventListener('click', showRegister);

  showLogin();

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = 'Connexion en cours...';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      // data attendu : { token, user }
      setAuth(data.token, data.user);
      authMessage.textContent = 'Connexion réussie, redirection...';
      authMessage.classList.remove('text-slate-400');
      authMessage.classList.add('text-emerald-400');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (err) {
      authMessage.textContent = err.data?.message || 'Email ou mot de passe incorrect.';
      authMessage.classList.remove('text-emerald-400');
      authMessage.classList.add('text-rose-400');
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = 'Création du compte...';
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: { email, password },
      });

      // Option : se connecter directement après inscription
      authMessage.textContent = 'Compte créé, connexion...';
      const loginData = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setAuth(loginData.token, loginData.user);

      authMessage.classList.remove('text-slate-400');
      authMessage.classList.add('text-emerald-400');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (err) {
      authMessage.textContent = err.data?.message || 'Erreur lors de la création du compte.';
      authMessage.classList.remove('text-emerald-400');
      authMessage.classList.add('text-rose-400');
    }
  });
});
