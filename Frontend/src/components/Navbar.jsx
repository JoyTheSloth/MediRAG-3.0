import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <>
        {/* Desktop & Top Mobile Navbar */}
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <svg className="pulse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                <div className="nav-right hidden-mobile">
                    <a href="https://github.com/JoyTheSloth/MediRAG" className="github-btn target-cursor" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                    <Link to="/console">
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
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </NavLink>
        </div>
        </>
    );
};


export default Navbar;
