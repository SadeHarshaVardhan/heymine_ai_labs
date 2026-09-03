/**
 * config.js — Frontend API base URL configuration
 *
 * In development (served by the Express server locally):
 *   API_BASE_URL = "" — relative paths like /api/problem work fine.
 *
 * In production (frontend on Vercel, backend on Azure Container Apps):
 *   Set window._HEYMINE_API_BASE before this script loads:
 *     <script>window._HEYMINE_API_BASE = "https://heymine-api.<hash>.eastasia.azurecontainerapps.io";</script>
 *   OR set it in localStorage under 'heymine_api_url' for dev overrides.
 *
 * All fetch calls use: `${API_BASE_URL}/api/...`
 */

(function () {
  'use strict';

  // Priority 1: Injected via window._HEYMINE_API_BASE in HTML <head> or build script
  // Priority 2: Stored in localStorage under 'heymine_api_url' (useful for dev override)
  // Priority 3: Empty string (relative paths like /api/problem — works for local Express server)
  const customUrl = window._HEYMINE_API_BASE || (typeof localStorage !== 'undefined' ? localStorage.getItem('heymine_api_url') : null);
  const base = (customUrl || '').trim().replace(/\/$/, '');

  window.API_BASE_URL = base;
})();
