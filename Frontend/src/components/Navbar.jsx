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
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-1.21-1.21V20c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-7.31l-1.21 1.21a.75.75 0 11-1.06-1.06l8.99-9z"></path></svg>
            </NavLink>
            <NavLink to="/console" className={({ isActive }) => (isActive || location.pathname==='/evaluate' || location.pathname==='/dashboard' ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4C3 2.9 3.9 2 5 2H9C10.1 2 11 2.9 11 4V10C11 11.1 10.1 12 9 12H5C3.9 12 3 11.1 3 10V4ZM3 14C3 12.9 3.9 12 5 12H9C10.1 12 11 12.9 11 14V20C11 21.1 10.1 22 9 22H5C3.9 22 3 21.1 3 20V14ZM13 4C13 2.9 13.9 2 15 2H19C20.1 2 21 2.9 21 4V8C21 9.1 20.1 10 19 10H15C13.9 10 13 9.1 13 8V4ZM13 12C13 10.9 13.9 10 15 10H19C20.1 10 21 10.9 21 12V20C21 21.1 20.1 22 19 22H15C13.9 22 13 21.1 13 20V12Z"></path></svg>
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <div className="m-nav-action-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '22px', height: '22px' }}><path d="M2 11.25C2 5.92 6.55 1.5 12 1.5C17.45 1.5 22 5.92 22 11.25C22 16.58 17.45 21 12 21C10.45 21 9.02 20.61 7.78 19.92L3 21L4.08 16.22C3.39 14.98 2 13.55 2 11.25z"></path></svg>
                </div>
            </NavLink>
            <NavLink to="/api-docs" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4C4 2.9 4.9 2 6 2H10.5C11.3 2 12 2.7 12 3.5V19.5C12 19.5 7.5 17 6 17C4.9 17 4 16.1 4 15V4ZM20 4C20 2.9 19.1 2 18 2H13.5C12.7 2 12 2.7 12 3.5V19.5C12 19.5 16.5 17 18 17C19.1 17 20 16.1 20 15V4Z"></path></svg>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'm-nav-item active' : 'm-nav-item')}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
            </NavLink>
        </div>
        </>
    );
};


export default Navbar;
