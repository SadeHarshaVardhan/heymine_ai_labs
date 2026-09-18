(function () {
  "use strict";

  const SESSION_KEY = "heymine_session";
  const PROFILE_KEY = "heymine_profile";

  /* ── Utilities ─────────────────────────────── */
  function $(sel) { return document.querySelector(sel); }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  }

  function saveSession(session, user) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (user)    localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
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

  /* ── API helper ─────────────────────────────── */
  async function api(path, body, options = {}) {
    const url = `${window.API_BASE_URL || ""}${path}`;
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

  /* ── Message ────────────────────────────────── */
  function setMessage(text, type = "") {
    const el = $("#authMessage");
    if (!el) return;
    el.textContent = text || "";
    el.className = `auth-message${type ? " " + type : ""}`;
  }

  /* ── Button loading state ───────────────────── */
  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.classList.add("loading");
      btn._originalText = btn.textContent;
    } else {
      btn.disabled = false;
      btn.classList.remove("loading");
      if (btn._originalText) btn.textContent = btn._originalText;
    }
  }

  /* ── Password toggle ────────────────────────── */
  function bindPasswordToggle(toggleId, inputId) {
    const toggle = $(toggleId);
    const input  = $(inputId);
    if (!toggle || !input) return;
    toggle.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggle.textContent = show ? "🙈" : "👁";
    });
  }

  /* ── Password strength meter ────────────────── */
  function bindStrengthMeter(inputId) {
    const input = $(inputId);
    const fill  = $("#strengthFill");
    if (!input || !fill) return;
    input.addEventListener("input", () => {
      const v = input.value;
      let score = 0;
      if (v.length >= 6)  score++;
      if (v.length >= 10) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const pct   = (score / 5) * 100;
      const color = pct <= 20  ? "#e17055"
                  : pct <= 40  ? "#f39c12"
                  : pct <= 60  ? "#fdcb6e"
                  : pct <= 80  ? "#00b894"
                  : "#00d2a0";
      fill.style.width      = `${pct}%`;
      fill.style.background = color;
    });
  }

  /* ── LOGIN ──────────────────────────────────── */
  function bindLogin() {
    const form = $("#loginForm");
    if (!form) return;

    bindPasswordToggle("#togglePassword", "#password");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("#loginBtn");
      setLoading(btn, true);
      setMessage("Signing in…", "info");
      try {
        const data = await api("/api/auth/login", {
          email:    $("#email").value.trim(),
          password: $("#password").value,
        });
        saveSession(data.session, data.user);
        setMessage("Signed in! Redirecting…", "success");
        setTimeout(() => { window.location.href = "/compiler"; }, 500);
      } catch (err) {
        setMessage(err.message, "error");
        setLoading(btn, false);
      }
    });
  }

  /* ── REGISTER ───────────────────────────────── */
  function bindRegister() {
    const form = $("#registerForm");
    if (!form) return;

    bindPasswordToggle("#togglePassword", "#password");
    bindPasswordToggle("#toggleConfirm",  "#confirmPassword");
    bindStrengthMeter("#password");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if ($("#password").value !== $("#confirmPassword").value) {
        setMessage("Passwords do not match", "error");
        return;
      }
      const btn = $("#registerBtn");
      setLoading(btn, true);
      setMessage("Creating your account…", "info");
      try {
        const data = await api("/api/auth/register", {
          username: $("#username").value.trim(),
          email:    $("#email").value.trim(),
          password: $("#password").value,
        });
        saveSession(data.session, data.user);
        if (data.session) {
          setMessage("Account created! Redirecting…", "success");
          setTimeout(() => { window.location.href = "/compiler"; }, 600);
        } else {
          setMessage(
            "✅ Account created — check your email and click the confirmation link to activate your account.",
            "success"
          );
          setLoading(btn, false);
        }
      } catch (err) {
        setMessage(err.message, "error");
        setLoading(btn, false);
      }
    });
  }

  /* ── FORGOT PASSWORD ────────────────────────── */
  function bindForgot() {
    const form = $("#forgotForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("#forgotBtn");
      setLoading(btn, true);
      setMessage("Sending reset link…", "info");
      try {
        // Pass redirectToUrl from the current frontend origin
        const redirectToUrl = `${window.location.origin}/reset-password`;
        const data = await api("/api/auth/forgot-password", {
          email: $("#email").value.trim(),
          redirectToUrl,
        });
        setMessage(
          "📬 " + (data.message || "Reset link sent — check your email inbox (and spam folder)."),
          "success"
        );
        setLoading(btn, false);
      } catch (err) {
        setMessage(err.message, "error");
        setLoading(btn, false);
      }
    });
  }

  /* ── RESET PASSWORD ─────────────────────────── */
  function bindReset() {
    const form = $("#resetForm");
    if (!form) return;

    bindPasswordToggle("#togglePassword", "#password");
    bindPasswordToggle("#toggleConfirm",  "#confirmPassword");
    bindStrengthMeter("#password");

    // Extract token from hash or query
    const getAccessToken = () => {
      const hash   = window.location.hash   ? window.location.hash.slice(1)   : "";
      const search = window.location.search ? window.location.search.slice(1) : "";
      const params = new URLSearchParams(hash || search);
      return params.get("access_token");
    };

    if (!getAccessToken()) {
      setMessage(
        "Reset link missing or expired. Please request a new one.",
        "error"
      );
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if ($("#password").value !== $("#confirmPassword").value) {
        setMessage("Passwords do not match", "error");
        return;
      }
      const token = getAccessToken();
      if (!token) {
        setMessage("Reset token is missing. Please open the link from your email.", "error");
        return;
      }
      const btn = $("#resetBtn");
      setLoading(btn, true);
      setMessage("Updating password…", "info");
      try {
        await api("/api/auth/reset-password", {
          accessToken: token,
          password: $("#password").value,
        });
        clearSession();
        setMessage("🎉 Password updated! Redirecting to sign in…", "success");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      } catch (err) {
        setMessage(err.message, "error");
        setLoading(btn, false);
      }
    });
  }

  /* ── SETTINGS ───────────────────────────────── */
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
      const p = data.profile;
      const emailEl    = $("#profileEmail");
      const usernameEl = $("#profileUsername");
      const avatarEl   = $("#profileAvatar");
      if (emailEl)    emailEl.textContent    = p.email    || "";
      if (usernameEl) usernameEl.textContent = p.username || "";
      if (avatarEl)   avatarEl.textContent   = (p.username || p.email || "U")[0].toUpperCase();

      const ownKeyEl  = $("#useOwnKey");
      const statusEl  = $("#keyStatus");
      if (ownKeyEl) ownKeyEl.checked     = Boolean(p.useOwnKey);
      if (statusEl) statusEl.textContent = p.hasGroqKey ? "✓ Saved" : "Not set";
    } catch (err) {
      setMessage(err.message, "error");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const keyVal = ($("#groqApiKey").value || "").trim();
      if (!keyVal) {
        setMessage("Please paste your Groq API key first.", "error");
        return;
      }
      const btn = $("#saveKeyBtn");
      setLoading(btn, true);
      setMessage("Saving…", "info");
      try {
        // Route is PUT /api/user/apikey
        const data = await api("/api/user/apikey", {
          groqApiKey: keyVal,
          useOwnKey:  $("#useOwnKey") ? $("#useOwnKey").checked : true,
        }, { method: "PUT", auth: true });
        const statusEl = $("#keyStatus");
        if (statusEl) statusEl.textContent = data.profile.hasGroqKey ? "✓ Saved" : "Not set";
        // Clear the input after saving for security
        if ($("#groqApiKey")) $("#groqApiKey").value = "";
        setMessage("🔑 API key saved securely! AI sessions will now use your key.", "success");
      } catch (err) {
        setMessage(err.message, "error");
      }
      setLoading(btn, false);
    });

    const toggleKey = $("#useOwnKey");
    if (toggleKey) {
      toggleKey.addEventListener("change", async (e) => {
        try {
          // Route is PUT /api/user/toggle-key
          await api("/api/user/toggle-key", { useOwnKey: e.target.checked }, { method: "PUT", auth: true });
          setMessage(
            e.target.checked ? "✓ Now using your own Groq key" : "Switched to shared key",
            "success"
          );
        } catch (err) {
          setMessage(err.message, "error");
        }
      });
    }

    const logoutBtn = $("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        clearSession();
        window.location.href = "/login";
      });
    }
  }

  /* ── Public API ─────────────────────────────── */
  window.HeyMineAuth = { SESSION_KEY, PROFILE_KEY, getSession, clearSession, authHeaders };

  /* ── Init ───────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    bindLogin();
    bindRegister();
    bindForgot();
    bindReset();
    bindSettings();
  });
})();
