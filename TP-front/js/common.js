const API_BASE_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('mpc_token') || null;
}

function getUser() {
  const raw = localStorage.getItem('mpc_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setAuth(token, user) {
  if (token) localStorage.setItem('mpc_token', token);
  if (user) localStorage.setItem('mpc_user', JSON.stringify(user));
  updateAuthLabel();
}

function clearAuth() {
  localStorage.removeItem('mpc_token');
  localStorage.removeItem('mpc_user');
  updateAuthLabel();
}

function updateAuthLabel() {
  const label = document.getElementById('auth-label');
  const user = getUser();
  if (!label) return;
  if (user) {
    label.textContent = user.email || 'Mon compte';
  } else {
    label.textContent = 'Se connecter';
  }
}

async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON
  }

  if (!res.ok) {
    const error = new Error(data?.message || 'Erreur API');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthLabel();
});
