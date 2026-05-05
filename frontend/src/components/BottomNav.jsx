import { Link, useLocation } from 'react-router-dom';

const navIcons = {
  home: <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z" />,
};

function NavIcon({ icon, label }) {
  return (
    <>
      <span className="bottom-nav__glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation">
          {navIcons[icon]}
        </svg>
      </span>
      <span className="bottom-nav__label">{label}</span>
    </>
  );
}

export default function BottomNav() {
  const location = useLocation();

  return (
    <div
      className="bottom-nav-shell"
      aria-label="Primary navigation"
    >
      <div className="bottom-nav-trigger" aria-hidden="true" />
      <nav className="bottom-nav" aria-label="Primary">
        <Link
          className={`bottom-nav__item${location.pathname === '/home' ? ' active' : ''}`}
          to="/home"
        >
          <NavIcon icon="home" label="home" />
        </Link>
        <Link
          className={`bottom-nav__item${location.pathname === '/saved' ? ' active' : ''}`}
          to="/saved"
        >
          <NavIcon icon="bookmark" label="saved" />
        </Link>
      </nav>
    </div>
  );
}
