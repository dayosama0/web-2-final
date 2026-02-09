const TOKEN_KEY = "ge_token";
const USER_KEY = "ge_user";

function showError(msg) {
  const el = document.getElementById("authError");
  el.textContent = msg || "Error";
  el.classList.remove("d-none");
  document.getElementById("authSuccess").classList.add("d-none");
}

function showSuccess(msg) {
  const el = document.getElementById("authSuccess");
  el.textContent = msg || "Success";
  el.classList.remove("d-none");
  document.getElementById("authError").classList.add("d-none");
}

function clearAlerts() {
  document.getElementById("authError").classList.add("d-none");
  document.getElementById("authSuccess").classList.add("d-none");
}

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  let user = null;
  try { user = JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch {}
  return { token, user };
}

function redirectByRole(role) {
  if (role === "admin") window.location.href = "/index.html";
  else window.location.href = "/regular-users.html";
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  showSuccess("Logged out.");
}

document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("regRole");
  const adminKeyGroup = document.getElementById("adminKeyGroup");
  const logoutBtn = document.getElementById("logoutBtn");

  const { token, user } = getSession();
  if (token && user?.email) {
    showSuccess(`You are logged in as ${user.email} (${user.role}). You can logout or continue.`);
  }

  // show/hide adminKey
  roleSelect?.addEventListener("change", () => {
    const isAdmin = roleSelect.value === "admin";
    adminKeyGroup.classList.toggle("d-none", !isAdmin);
  });

  // logout button
  logoutBtn?.addEventListener("click", () => {
    logout();
  });

  document.getElementById("authSuccess")?.addEventListener("click", () => {
    const s = getSession();
    if (s.token && s.user?.role) redirectByRole(s.user.role);
  });

  // LOGIN
  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return showError(data?.error || "Login failed.");

      saveSession(data.token, data.user);
      showSuccess("Login successful. Click this message to continue.");
    } catch {
      showError("Network error. Check server.");
    }
  });

  // REGISTER
  document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;
    const adminKey = document.getElementById("adminKey")?.value;

    const payload = { email, password, role };
    if (role === "admin") payload.adminKey = adminKey;

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return showError(data?.error || "Register failed.");

      saveSession(data.token, data.user);
      showSuccess("Registration successful. Click this message to continue.");
    } catch {
      showError("Network error. Check server.");
    }
  });
});
