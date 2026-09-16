(function () {
  "use strict";

  const SESSION_KEY = "heymine_session";
  const PROFILE_KEY = "heymine_profile";

  function $(selector) {
    return document.querySelector(selector);
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveSession(session, user) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (user) localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }

  function authHeaders() {
    const session = getSession();
    return {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    };
  }

  async function api(path, body, options = {}) {
    const url = `${window.API_BASE_URL || ''}${path}`;
    const resp = await fetch(url, {
      method: options.method || "POST",
      headers: options.auth ? authHeaders() : { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.success === false) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  function setMessage(text, type = "") {
    const el = $("#authMessage");
    if (!el) return;
    el.textContent = text || "";
    el.className = `auth-message ${type}`.trim();
  }

  function bindLogin() {
    const form = $("#loginForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setMessage("Signing in...");
      try {
        const data = await api("/api/auth/login", {
          email: $("#email").value.trim(),
          password: $("#password").value,
        });
        saveSession(data.session, data.user);
        window.location.href = "/compiler";
      } catch (error) {
        setMessage(error.message, "error");
      }
    });
  }

  function bindRegister() {
    const form = $("#registerForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if ($("#password").value !== $("#confirmPassword").value) {
        setMessage("Passwords do not match", "error");
        return;
      }
      setMessage("Creating account...");
      try {
        const data = await api("/api/auth/register", {
          username: $("#username").value.trim(),
          email: $("#email").value.trim(),
          password: $("#password").value,
        });
        saveSession(data.session, data.user);
        if (data.session) window.location.href = "/compiler";
        else setMessage(data.message || "Check your email to confirm your account", "success");
      } catch (error) {
        setMessage(error.message, "error");
      }
    });
  }

  function bindForgot() {
    const form = $("#forgotForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setMessage("Sending reset link...");
      try {
        const data = await api("/api/auth/forgot-password", {
          email: $("#email").value.trim(),
        });
        setMessage(data.message || "Reset link sent to your email", "success");
      } catch (error) {
        setMessage(error.message, "error");
      }
    });
  }

  function bindReset() {
    const form = $("#resetForm");
    if (!form) return;

    // Helper to extract access_token from location hash or query params
    const getAccessToken = () => {
      const hashStr = window.location.hash ? window.location.hash.slice(1) : "";
      const searchStr = window.location.search ? window.location.search.slice(1) : "";
      const params = new URLSearchParams(hashStr || searchStr);
      return params.get("access_token");
    };

    const initialToken = getAccessToken();
    if (!initialToken) {
      setMessage("Reset token missing or expired. Please request a new link from the forgot password page.", "error");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if ($("#password").value !== $("#confirmPassword").value) {
        setMessage("Passwords do not match", "error");
        return;
      }
      const token = getAccessToken();
      if (!token) {
        setMessage("Reset token missing. Open the link from your email again.", "error");
        return;
      }
      setMessage("Updating password...");
      try {
        await api("/api/auth/reset-password", {
          accessToken: token,
          password: $("#password").value,
        });
        clearSession();
        setMessage("Password updated successfully! Redirecting to login...", "success");
        setTimeout(() => { window.location.href = "/login"; }, 1200);
      } catch (error) {
        setMessage(error.message, "error");
      }
    });
  }

  async function bindSettings() {
    const form = $("#settingsForm");
    if (!form) return;
    const session = getSession();
    if (!session?.access_token) {
      window.location.href = "/login";
      return;
    }

    try {
      const data = await api("/api/user/me", null, { method: "GET", auth: true });
      $("#profileEmail").textContent = data.profile.email || "";
      $("#profileUsername").textContent = data.profile.username || "";
      $("#useOwnKey").checked = Boolean(data.profile.useOwnKey);
      $("#keyStatus").textContent = data.profile.hasGroqKey ? "Saved" : "Not set";
    } catch (error) {
      setMessage(error.message, "error");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setMessage("Saving API key...");
      try {
        const data = await api("/api/user/apikey", {
          groqApiKey: $("#groqApiKey").value.trim(),
          useOwnKey: $("#useOwnKey").checked,
        }, { auth: true });
        $("#keyStatus").textContent = data.profile.hasGroqKey ? "Saved" : "Not set";
        setMessage("API key saved securely", "success");
      } catch (error) {
        setMessage(error.message, "error");
      }
    });

    $("#useOwnKey").addEventListener("change", async (event) => {
      try {
        await api("/api/user/toggle-key", { useOwnKey: event.target.checked }, { auth: true });
      } catch (error) {
        setMessage(error.message, "error");
      }
    });

    $("#logoutBtn").addEventListener("click", () => {
      clearSession();
      window.location.href = "/login";
    });
  }

  window.HeyMineAuth = {
    SESSION_KEY,
    PROFILE_KEY,
    getSession,
    clearSession,
    authHeaders,
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindLogin();
    bindRegister();
    bindForgot();
    bindReset();
    bindSettings();
  });
})();
