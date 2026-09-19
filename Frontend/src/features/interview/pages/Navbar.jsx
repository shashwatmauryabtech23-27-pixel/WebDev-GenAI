import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../style/navbar.scss';
import { useTheme } from '../../auth/hooks/useTheme';
import { useAuth } from '../../auth/hooks/useAuth';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, handleLogout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar__container">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </span>
                    WebDev<span className="navbar__logo-accent">GenAI</span>
                </Link>

                <div className="navbar__links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    >
                        AI Workspace
                    </NavLink>
                </div>

                {/* Right Actions */}
                <div className="navbar__actions">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="navbar__theme-toggle"
                        aria-label="Toggle theme"
                        type="button"
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <>
                            <span className="navbar__user">Hi, {user.username}</span>
                            <button className="navbar__signup-btn" onClick={handleLogout} type="button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__link navbar__link--login">Login</Link>
                            <Link to="/register" className="navbar__signup-btn">Get started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
