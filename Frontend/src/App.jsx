import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
// Force all page CSS into the main bundle for Vercel production build
import './pages/Console.css';
import './pages/ApiDocs.css';
import './pages/MediApiAgent.css';
import './pages/MediChat.css';
import './pages/Evaluate.css';
import './pages/Dashboard.css';
import './pages/Governance.css';
import './pages/PatientExperience.css';
import Home from './pages/Home';
import ApiDocs from './pages/ApiDocs';
import About from './pages/About';
import EcgCanvasBg from './components/EcgCanvasBg';
import Console from './pages/Console';
import MediChat from './pages/MediChat';
import MediApiAgent from './pages/MediApiAgent';
import Research from './pages/Research';

import Footer from './components/Footer';
import ProjectGuide from './components/ProjectGuide';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
    const location = useLocation();
    
    // Only show footer on Home and About pages
    const showFooter = ['/', '/about'].includes(location.pathname);
    
    // Only show Project Guide (?) button on specific pages
    const showProjectGuide = ['/', '/about', '/api-docs'].includes(location.pathname);

    React.useEffect(() => {
        if (!apiUrl) {
            console.warn('VITE_API_URL is not configured');
        }
    }, []);

    React.useEffect(() => {
        // Observer for reveal animations
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        });

        // Find all hidden elements - re-scan every time the location changes
        const hiddenEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
        hiddenEls.forEach(el => revealObserver.observe(el));

        // Safety fallback: reveal everything after 1 second if still invisible
        const fallbackId = setTimeout(() => {
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger').forEach(el => {
                el.classList.add('reveal-active');
            });
        }, 1200);

        return () => {
            revealObserver.disconnect();
            clearTimeout(fallbackId);
        };
    }, [location.pathname]); // Trigger re-observation on each navigation

    return (
        <>
            <EcgCanvasBg />
            <Navbar />
            {showProjectGuide && <ProjectGuide />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/console" element={<Console />} />
                    <Route path="/chat" element={<MediChat />} />
                    <Route path="/api-agent" element={<MediApiAgent />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>
            {showFooter && <Footer />}
        </>
    );
};

export default App;