import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const location = useLocation();

    // Close menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Apply theme changes
    React.useEffect(() => {
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
        <>
        {/* Desktop & Top Mobile Navbar */}
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <svg className="pulse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="logo-text">
                            <span className="logo-white">MediRAG</span><span className="logo-green">-Eval</span>
                        </div>
                    </Link>
                    <div className="tagline">Hallucination Detection for Medical AI</div>
                </div>

                {/* Desktop Nav */}
                <div className="nav-center hidden-mobile">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>Home</NavLink>
                    <NavLink to="/console" className={({ isActive }) => (isActive || location.pathname==='/evaluate' || location.pathname==='/dashboard' ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>Console</NavLink>
                    <NavLink to="/api-docs" className={({ isActive }) => (isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>API Docs</NavLink>
                    <NavLink to="/api-agent" className={({ isActive }) => (isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>API Agent</NavLink>
                    <NavLink to="/research" className={({ isActive }) => (isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>Research</NavLink>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor')}>About</NavLink>
                    <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-link active target-cursor' : 'nav-link target-cursor'} style={({ isActive }) => ({
                        background: isActive ? 'rgba(0,200,150,0.15)' : 'rgba(0,200,150,0.08)',
                        border: '1px solid rgba(0,200,150,0.25)',
                        borderRadius: '20px',
                        padding: '5px 14px',
                        color: '#00C896',
                        fontWeight: 700,
                        fontSize: '13px'
                    })}>💬 Chat</NavLink>
                </div>

                <div className="nav-right">
                    <button onClick={toggleTheme} className="theme-toggle-btn target-cursor" style={{ background: 'none', border: 'none', color: 'var(--text-white)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '8px' }} title="Toggle Theme">
                        {theme === 'dark' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon" style={{width: '20px', height: '20px'}}>
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon" style={{width: '20px', height: '20px', color: '#111827'}}>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>
                    <a href="https://github.com/JoyTheSloth/MediRAG" className="github-btn target-cursor hidden-mobile" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                    <Link to="/console" className="hidden-mobile">
                        <button className="primary-btn target-cursor">Run Evaluation &rarr;</button>
                    </Link>
                </div>
            </div>
        </nav>

        {/* Mobile Floating Bottom Nav */}
        <div className="mobile-floating-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </NavLink>
            <NavLink to="/console" className={({ isActive }) => (isActive || location.pathname==='/evaluate' || location.pathname==='/dashboard' ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <div className="m-nav-action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
            </NavLink>
            <NavLink to="/api-docs" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </NavLink>
            <NavLink to="/api-agent" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </NavLink>
            <NavLink to="/research" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </NavLink>
        </div>
        </>
    );
};


export default Navbar;
