import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import ThemeToggle from './ThemeToggle';

export default function AuthNav() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const brandTo = isHome ? '/home' : '/';
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return !window.matchMedia('(pointer: fine)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDesktopOpen = isOpen;

  return (
    <div className={`auth-nav-shell${isHome ? ' auth-nav-shell--home' : ' auth-nav-shell--floating'}`}>
      <div
        className="auth-nav-trigger"
        aria-hidden="true"
        onMouseEnter={() => setIsOpen(true)}
      />
      <nav
        className={`auth-nav${isHome ? ' auth-nav--home' : ' auth-nav--floating'}${isDesktopOpen ? ' auth-nav--open' : ''}${isMobileMenuOpen ? ' auth-nav--menu-open' : ''}`}
        role="navigation"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="auth-nav__inner">
          <Link to={brandTo} className="brand">QuickBite</Link>

          <div className="nav-links">
            <div className="nav-group">
              <Link className="nav-link" to="/user/register">User Register</Link>
              <Link className="nav-link" to="/user/login">User Login</Link>
            </div>

            <div className="nav-group">
              <Link className="nav-link" to="/food-partner/register">FoodPartner Register</Link>
              <Link className="nav-link" to="/food-partner/login">FoodPartner Login</Link>
            </div>
          </div>

          <div className="nav-right">
            <ThemeToggle />
            <button
              type="button"
              className="auth-nav__toggle"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
