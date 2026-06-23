// ============================================================
// main.js — Landing page & global theme management
// ============================================================

(function () {
  "use strict";

  const THEME_KEY = "heymine-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const icon = document.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      const span = toggle.querySelector(".theme-icon");
      if (span) span.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  }

  const initial = getPreferredTheme();
  setTheme(initial);

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleTheme);
    }

    const learnBtn = document.getElementById("learnMoreBtn");
    if (learnBtn) {
      learnBtn.addEventListener("click", function () {
        const features = document.querySelector(".features");
        if (features)
          features.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Scroll shadow on navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 10
          ? 'var(--shadow-md)' : '';
      }, { passive: true });
    }

    // Smooth scroll for all anchor links starting with #
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

  window.HeyMine = window.HeyMine || {};
  window.HeyMine.theme = {
    get: getPreferredTheme,
    set: setTheme,
    toggle: toggleTheme,
  };
})();
