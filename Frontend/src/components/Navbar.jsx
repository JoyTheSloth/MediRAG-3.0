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
        <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`} id="navbar">
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
                <div className="nav-center">
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

                <div className="nav-right">
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

                {/* Mobile Hamburger Button */}
                <button 
                    className="mobile-menu-btn target-cursor" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isMobileMenuOpen ? (
                             <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                        ) : (
                             <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMobileMenuOpen && (
                <div className="mobile-nav-dropdown">
                    <NavLink to="/" end className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/console" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Console</NavLink>
                    <NavLink to="/api-docs" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>API Docs</NavLink>
                    <NavLink to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                    <NavLink to="/chat" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#00C896', fontWeight: 700 }}>💬 Chat</NavLink>
                    
                    <div className="mobile-nav-footer">
                        <Link to="/console" className="mobile-nav-btn primary-btn flex-center" onClick={() => setIsMobileMenuOpen(false)}>
                            Run Evaluation &rarr;
                        </Link>
                        <a href="https://github.com/JoyTheSloth/MediRAG" className="mobile-nav-link github-mobile flex-center" target="_blank" rel="noopener noreferrer">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg> View GitHub
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};


export default Navbar;
