/**
 * config.js — Frontend API base URL configuration
 *
 * In development  (served by the Express server locally):
 *   API_BASE_URL = "" — relative paths like /api/problem work fine.
 *
 * In production (frontend on Vercel, backend on Azure App Service):
 *   API_BASE_URL = "https://<your-app>.azurewebsites.net"
 *   Set this via the NEXT_PUBLIC_ or window._env_ pattern below.
 *
 * HOW TO USE:
 *   All fetch calls should use: `${API_BASE_URL}/api/...`
 *
 * HOW TO SET FOR PRODUCTION:
 *   In your Vercel project settings, add an Environment Variable:
 *     Name:  VITE_API_BASE_URL  (or inject via build script)
 *   Then add this to your HTML before loading other scripts:
 *     <script>window._HEYMINE_API_BASE = "https://your-app.azurewebsites.net";</script>
 *   OR: set it here directly if you know the URL at deploy time.
 */

(function () {
  'use strict';

  // Priority 1: Injected at build time via HTML <script> block (recommended for Vercel)
  // Priority 2: Falls back to empty string (relative URLs) — works for local dev
  const base = (window._HEYMINE_API_BASE || '').replace(/\/$/, '');

  window.API_BASE_URL = base;
})();
