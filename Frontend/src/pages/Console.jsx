import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Evaluate from './Evaluate';
import Dashboard from './Dashboard';
import Governance from './Governance';
import PatientExperience from './PatientExperience';
import './Console.css';
import './home-mobile.css';

const Console = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [activeSubSection, setActiveSubSection] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Global settings for Evaluate / Patient
    const [engineConfig, setEngineConfig] = useState(() => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        provider: 'Mistral',
        apiKey: sessionStorage.getItem('medirag_api_key') || import.meta.env.VITE_MISTRAL_API_KEY || '',
        model: 'mistral-large-latest',
        topK: 5,
        runRagas: false
    }));

    useEffect(() => {
        if (engineConfig.apiKey) {
            sessionStorage.setItem('medirag_api_key', engineConfig.apiKey);
        } else {
            sessionStorage.removeItem('medirag_api_key');
        }
    }, [engineConfig.apiKey]);

    // Initial section based on route or state
    useEffect(() => {
        if (location.pathname.includes('dashboard')) {
            setActiveSection('dashboard');
        } else if (location.pathname.includes('evaluate')) {
            setActiveSection('evaluate');
            setActiveSubSection('researcher'); 
        } else if (location.pathname === '/console') {
            setActiveSection('evaluate');
            setActiveSubSection('researcher');
        }
    }, [location]);

    const handleNav = (section, sub = null) => {
        setActiveSection(section);
        setActiveSubSection(sub);
        setIsSidebarOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <div className="console-page">
            <div className={`console-layout ${isSidebarOpen ? 'overlay-active' : ''}`}>
                
                {/* --- MOBILE OVERLAY --- */}
                {isSidebarOpen && <div className="con-mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

                {/* --- SIDEBAR --- */}
                <aside className={`console-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="console-sidebar-header-mobile">
                        <span>MENU</span>
                        <button className="con-close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
                    </div>

                    <div className="console-status-block">
                        <div className="status-dot-pulse"></div>
                        <div className="status-info">
                            <span className="status-label">ENGINE STATUS</span>
                            <span className="status-value">OPERATIONAL</span>
                        </div>
                    </div>

                    <div className="console-nav-group">
                        <div className="console-nav-label">EVALUATE</div>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'researcher' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'researcher')}
                        >
                            <span className="console-nav-icon">🔍</span>
                            Researcher Lab
                        </button>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'patient' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'patient')}
                        >
                            <span className="console-nav-icon">📁</span>
                            Data Upload Zone
                        </button>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'governance' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'governance')}
                        >
                            <span className="console-nav-icon">⚖️</span>
                            Safety Governance
                        </button>
                    </div>

                    <div className="console-nav-group">
                        <div className="console-nav-label">ANALYTICS</div>
                        <button 
                            className={`console-nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNav('dashboard')}
                        >
                            <span className="console-nav-icon">📈</span>
                            Performance Metrics
                        </button>
                    </div>

                    <div className="engine-settings-panel">
                        <div className="settings-header">
                            <span className="settings-header-icon">⚙️</span>
                            <h3 className="settings-header-title">Evaluation Engine</h3>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">API URL</label>
                            <input 
                                type="text" 
                                className="settings-input"
                                value={engineConfig.apiUrl}
                                onChange={(e) => setEngineConfig({...engineConfig, apiUrl: e.target.value})}
                            />
                        </div>

                        <h4 className="settings-section-title">Core Inference</h4>
                        
                        <div className="settings-group">
                            <label className="settings-label">Model Provider</label>
                            <select 
                                className="settings-select"
                                value={engineConfig.provider}
                                onChange={(e) => {
                                    const p = e.target.value;
                                    setEngineConfig({
                                        ...engineConfig, 
                                        provider: p,
                                        model: p === 'OpenAI' ? 'gpt-4o' : p === 'Mistral' ? 'mistral-large-latest' : 'gemini-2.0-flash'
                                    });
                                }}
                            >
                                <option value="Gemini">Gemini</option>
                                <option value="OpenAI">OpenAI</option>
                                <option value="Mistral">Mistral AI</option>
                                <option value="Ollama">Ollama (Local)</option>
                            </select>
                        </div>

                        {['Gemini', 'OpenAI', 'Mistral'].includes(engineConfig.provider) && (
                            <>
                                <div className="settings-group">
                                    <div className="settings-label-row">
                                        <label className="settings-label">API Key</label>
                                        <span className="settings-help-icon">❔</span>
                                    </div>
                                    <div className="settings-input-wrapper">
                                        <input 
                                            type="password"
                                            className="settings-input"
                                            value={engineConfig.apiKey}
                                            onChange={(e) => setEngineConfig({...engineConfig, apiKey: e.target.value})}
                                            placeholder={`Enter ${engineConfig.provider} API Key`}
                                        />
                                        <span className="settings-toggle-eye">👁</span>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <label className="settings-label">Model</label>
                                    <select 
                                        className="settings-select"
                                        value={engineConfig.model}
                                        onChange={(e) => setEngineConfig({...engineConfig, model: e.target.value})}
                                    >
                                        {engineConfig.provider === 'Gemini' ? (
                                            <>
                                                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                                            </>
                                        ) : engineConfig.provider === 'Mistral' ? (
                                            <>
                                                <option value="mistral-large-latest">mistral-large-latest</option>
                                                <option value="mistral-small-latest">mistral-small-latest</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="gpt-4o">gpt-4o</option>
                                                <option value="gpt-4o-mini">gpt-4o-mini</option>
                                                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </>
                        )}
                        
                        <h4 className="settings-section-title">Retrieval Settings</h4>

                        <div className="settings-group">
                            <div className="settings-label-row">
                                <label className="settings-label">Top-K Chunks</label>
                                <span className="settings-value-pill">{engineConfig.topK}</span>
                            </div>
                            <input 
                                type="range" 
                                className="settings-range"
                                min="1" max="10" 
                                value={engineConfig.topK}
                                onChange={(e) => setEngineConfig({...engineConfig, topK: parseInt(e.target.value)})}
                            />
                        </div>

                        <label className="settings-checkbox-label">
                            <input 
                                type="checkbox" 
                                className="settings-checkbox"
                                checked={engineConfig.runRagas}
                                onChange={(e) => setEngineConfig({...engineConfig, runRagas: e.target.checked})}
                            />
                            Run RAGAS (slower)
                        </label>
                    </div>
                </aside>

                <main className="console-main">
                    {/* --- MOBILE HEADER TOGGLE --- */}
                    <div className="con-mobile-header">
                        <button className="con-hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <div className="con-mobile-title">Console</div>
                    </div>

                    {activeSection === 'evaluate' && activeSubSection === 'researcher' && (
                        <div className="console-view-wrapper">
                            <Evaluate embedded={true} mode={activeSubSection} engineConfig={engineConfig} setEngineConfig={setEngineConfig} />
                        </div>
                    )}

                    {activeSection === 'evaluate' && activeSubSection === 'patient' && (
                        <div className="console-view-wrapper">
                            <div className="console-view-header glass-header">
                                <div className="con-brand-block">
                                    <div className="con-wordmark">MediRAG <span style={{ color: 'var(--gov-teal)' }}>Integrate</span></div>
                                    <div className="con-tagline">Clinical App Safety Evaluation</div>
                                </div>
                                <div className="con-header-info">
                                    <span className="con-mode-badge clinical">SaMD Class B Sandbox</span>
                                    <p className="con-header-desc">Simulate patient interactions for healthcare platforms (Apollo 247, Tata 1mg) and verify AI reliability.</p>
                                </div>
                            </div>
                            <PatientExperience engineConfig={engineConfig} setEngineConfig={setEngineConfig} />
                        </div>
                    )}

                    {activeSection === 'evaluate' && activeSubSection === 'governance' && (
                        <div className="console-view-wrapper">
                            <Governance />
                        </div>
                    )}

                    {activeSection === 'dashboard' && (
                        <div className="console-view-wrapper">
                            <Dashboard embedded={true} />
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default Console;
