const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
const authForm = document.getElementById("authForm");
const nameField = document.getElementById("nameField");
const nameInput = document.getElementById("name");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitButton = document.getElementById("submitButton");
const switchCopy = document.getElementById("switchCopy");
const switchButton = document.getElementById("switchButton");
const message = document.getElementById("message");

let mode = "login";

function setMessage(text, success = false) {
  message.textContent = text;
  message.className = success ? "message success" : "message";
}

function setMode(nextMode) {
  mode = nextMode;
  const registering = mode === "register";
  nameField.hidden = !registering;
  nameInput.required = registering;
  loginTab.classList.toggle("active", !registering);
  registerTab.classList.toggle("active", registering);
  formTitle.textContent = registering ? "Create your account" : "Welcome back";
  formSubtitle.textContent = registering
    ? "Enter your details to get started."
    : "Enter your details to access your account.";
  submitButton.innerHTML = registering ? 'Create account <span>→</span>' : 'Log in <span>→</span>';
  switchCopy.firstChild.textContent = registering ? "Already have an account? " : "New here? ";
  switchButton.textContent = registering ? "Log in" : "Create an account";
  document.getElementById("password").autocomplete = registering ? "new-password" : "current-password";
  setMessage("");
}

loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));
switchButton.addEventListener("click", () => setMode(mode === "login" ? "register"));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");
  submitButton.disabled = true;
  const payload = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };
  if (mode === "register") payload.name = nameInput.value.trim();

  try {
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Something went wrong.");
    if (mode === "register") {
      setMessage(data.message, true);
      setMode("login");
      document.getElementById("email").value = payload.email;
    } else {
      await loadProfile();
    }
  } catch (error) {
    setMessage(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

async function loadProfile() {
  const response = await fetch("/api/profile", { credentials: "same-origin" });
  if (!response.ok) throw new Error("Please log in to continue.");
  const data = await response.json();
  document.getElementById("profileName").textContent = data.user.name;
  document.getElementById("profileEmail").textContent = data.user.email;
  document.getElementById("profileDate").textContent =
    new Date(data.user.created_at).toLocaleDateString();
  authView.hidden = true;
  dashboardView.hidden = false;
}

document.getElementById("logoutButton").addEventListener("click", async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin"
  });
  const data = await response.json();
  dashboardView.hidden = true;
  authView.hidden = false;
  authForm.reset();
  setMode("login");
  setMessage(data.message, true);
});

(async function checkExistingSession() {
  try {
    await loadProfile();
  } catch {
    authView.hidden = false;
    dashboardView.hidden = true;
  }
})();
