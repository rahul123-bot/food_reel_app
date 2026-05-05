import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'app.theme.override';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {
      // Ignore storage failures in restricted browser modes.
    }
  }, [theme]);

  const toggle = () => setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button className="btn ghost" type="button" onClick={toggle} aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
        {theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.8 1.79L6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zM17.24 19.16l1.79 1.8 1.79-1.8-1.79-1.79-1.79 1.79zM20 11v2h3v-2h-3zM6.76 19.16l-1.8 1.79 1.8 1.79 1.79-1.79-1.79-1.79zM4.22 6.34L2.43 4.55 1 6.98l1.79 1.79L4.22 6.34zM12 6a6 6 0 100 12 6 6 0 000-12z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
