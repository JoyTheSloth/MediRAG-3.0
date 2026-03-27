import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <Link to="/" className="logo">
                        <svg className="pulse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="logo-text">
                            <span className="logo-white">MediRAG</span><span className="logo-green">-Eval</span>
                        </div>
                    </Link>
                    <div className="tagline">Hallucination Detection for Medical AI</div>
                    <div className="footer-credits">
                        Built by MediRAG Team &mdash; Amity University Kolkata<br />
                        B.Tech CSE 2026
                    </div>
                </div>
                
                <div className="footer-center">
                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <a href="/#evaluate">Evaluate</a>
                        <a href="/#dashboard">Dashboard</a>
                        <a href="/#api">API Docs</a>
                        <Link to="/about">About</Link>
                    </div>
                </div>

                <div className="footer-right">
                    <a href="https://github.com/medirag/medirag-eval" className="github-link" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                    </a>
                    <div className="license">Open Source &middot; MIT License</div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-copyright">&copy; {new Date().getFullYear()} MediRAG-Eval &middot; Amity University Kolkata &middot; India Innovates 2026</div>
                <div className="footer-warning">Not for clinical use</div>
            </div>
        </footer>
    );
};

export default Footer;
