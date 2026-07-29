import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
    }`;
  const isActive = (path) => (location.pathname === path ? 'page' : undefined);

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            SB
          </span>
          <span className="text-lg font-bold text-gray-900">SkillBridge</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {user ? (
            <>
              <Link to="/dashboard" aria-current={isActive('/dashboard')} className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-secondary !py-1.5 !px-3 text-sm">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" aria-current={isActive('/login')} className={linkClass('/login')}>
                Log In
              </Link>
              <Link to="/signup" className="btn-primary !py-1.5 !px-3.5 text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-3 sm:hidden animate-fade-in-up">
          {user ? (
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" aria-current={isActive('/dashboard')} onClick={() => setMenuOpen(false)} className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-secondary w-full">Log Out</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" aria-current={isActive('/login')} onClick={() => setMenuOpen(false)} className={linkClass('/login')}>
                Log In
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}