import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import './PillNavbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const location = useLocation();

    const navigate = useNavigate();

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Apply theme changes
    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="pill-nav-wrapper">
            <nav className="pill-navbar">
                {/* Left: Brand Logo */}
                <div className="pill-nav-left">
                    <Link to="/" className="pill-logo-link">
                        <img src="/Frame 1352.png" alt="MediRAG Logo" className="pill-logo-img" style={{ height: '52px', width: 'auto' }} />
                    </Link>
                </div>

                {/* Center: Main Navigation */}
                <div className="pill-nav-center">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'pill-nav-link active' : 'pill-nav-link'}>Home</NavLink>
                    <NavLink to="/console" className={({ isActive }) => (isActive || location.pathname==='/evaluate' || location.pathname==='/dashboard') ? 'pill-nav-link active' : 'pill-nav-link'}>Console</NavLink>
                    <NavLink to="/api-agent" className={({ isActive }) => isActive ? 'pill-nav-link active' : 'pill-nav-link'}>Safety Agent</NavLink>
                    <NavLink to="/implementation" className={({ isActive }) => isActive ? 'pill-nav-link active' : 'pill-nav-link'}>Integration</NavLink>
                    <NavLink to="/api-docs" className={({ isActive }) => isActive ? 'pill-nav-link active' : 'pill-nav-link'}>Docs</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'pill-nav-link active' : 'pill-nav-link'}>About</NavLink>
                </div>

                {/* Right: Actions */}
                <div className="pill-nav-right">
                    <button onClick={toggleTheme} className="pill-theme-toggle" title="Toggle Theme">
                        {theme === 'dark' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>

                    <button className="pill-chat-btn" onClick={() => navigate('/chat')}>
                        Chat Now
                    </button>
                    
                    {/* Mobile Toggle */}
                    <button 
                        className="pill-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>

                    <div className={`copied-toast ${isCopied ? 'visible' : ''}`}>
                        Copied!
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`pill-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/" end className="pill-mob-link">Home</NavLink>
                    <NavLink to="/console" className="pill-mob-link">Console</NavLink>
                    <NavLink to="/api-agent" className="pill-mob-link">Safety Agent</NavLink>
                    <NavLink to="/implementation" className="pill-mob-link">Integration</NavLink>
                    <NavLink to="/api-docs" className="pill-mob-link">Docs</NavLink>
                    <NavLink to="/about" className="pill-mob-link">About</NavLink>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

