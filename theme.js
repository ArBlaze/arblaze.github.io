// Runs before the stylesheet to avoid flashing the wrong theme on page load.
(() => {
  const storageKey = 'arblaze-theme';
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  function isTheme(value) {
    return value === 'dark' || value === 'light';
  }

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (isTheme(savedTheme)) preference = savedTheme;
  } catch {
    // Storage may be blocked; theme switching can still work for this page.
  }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? 'dark' : 'light');
    const isDark = theme === 'dark';
    root.dataset.theme = theme;

    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(isDark));
      button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(storageKey, preference);
        } catch {
          // Keep the preference in memory when it cannot be saved.
        }
        applyTheme();
      });
    });
    applyTheme();
  });
  systemTheme.addEventListener('change', () => {
    if (!preference) applyTheme();
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      preference = isTheme(event.newValue) ? event.newValue : null;
      applyTheme();
    }
  });
})();
