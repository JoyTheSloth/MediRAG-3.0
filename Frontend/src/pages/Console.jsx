import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Evaluate from './Evaluate';
import Dashboard from './Dashboard';
import Governance from './Governance';
import PatientExperience from './PatientExperience';
import './Console.css';

const Console = ({ engineConfig, setEngineConfig }) => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Initial section based on route or state
    useEffect(() => {
        if (location.pathname.includes('dashboard')) {
            setActiveSection('dashboard');
        } else if (location.pathname.includes('governance')) {
            setActiveSection('governance');
        }
    }, [location]);

    const handleNav = (section) => {
        setActiveSection(section);
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

                    <div className="console-nav-group">
                        <div className="console-nav-label">SYSTEM</div>
                        <button 
                            className={`console-nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNav('dashboard')}
                        >
                            <span className="console-nav-icon">📊</span>
                            System Dashboard
                        </button>
                        <button 
                            className={`console-nav-link ${activeSection === 'governance' ? 'active' : ''}`}
                            onClick={() => handleNav('governance')}
                        >
                            <span className="console-nav-icon">🛡️</span>
                            AI Governance System
                        </button>
                    </div>

                    <div className="engine-settings-panel" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '16px' }}>⚙️</span>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Evaluation Engine</h3>
                        </div>

                        <div className="settings-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-gray-light)', marginBottom: '8px' }}>API URL</label>
                            <input 
                                type="text" 
                                value={engineConfig.apiUrl}
                                onChange={(e) => setEngineConfig({...engineConfig, apiUrl: e.target.value})}
                                style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 12px', color: 'white', fontSize: '12px' }}
                            />
                        </div>

                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: 'white' }}>LLM Settings</h4>
                        
                        <div className="settings-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-gray-light)', marginBottom: '8px' }}>Provider</label>
                            <select 
                                value={engineConfig.provider}
                                onChange={(e) => {
                                    const p = e.target.value;
                                    setEngineConfig({
                                        ...engineConfig, 
                                        provider: p,
                                        model: p === 'OpenAI' ? 'gpt-4o' : p === 'Mistral' ? 'mistral-large-latest' : 'gemini-1.5-flash'
                                    });
                                }}
                                style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 12px', color: 'white', fontSize: '12px' }}
                            >
                                <option value="Gemini">Gemini</option>
                                <option value="OpenAI">OpenAI</option>
                                <option value="Mistral">Mistral AI</option>
                                <option value="Ollama">Ollama (Local)</option>
                            </select>
                        </div>

                        {['Gemini', 'OpenAI', 'Mistral'].includes(engineConfig.provider) && (
                            <>
                                <div className="settings-group" style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-gray-light)' }}>{engineConfig.provider} API Key</label>
                                        <span style={{ fontSize: '11px', color: 'var(--text-gray)', cursor: 'help' }}>❔</span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="password"
                                            value={engineConfig.apiKey}
                                            onChange={(e) => setEngineConfig({...engineConfig, apiKey: e.target.value})}
                                            placeholder="sk-... or AIza..."
                                            style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 32px 8px 12px', color: 'white', fontSize: '12px' }}
                                        />
                                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)', fontSize: '14px', cursor: 'pointer' }}>👁</span>
                                    </div>
                                </div>

                                <div className="settings-group" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-gray-light)', marginBottom: '8px' }}>Model</label>
                                    <select 
                                        value={engineConfig.model}
                                        onChange={(e) => setEngineConfig({...engineConfig, model: e.target.value})}
                                        style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 12px', color: 'white', fontSize: '12px' }}
                                    >
                                        {engineConfig.provider === 'Gemini' ? (
                                            <>
                                                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                                                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
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
                        
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: 'white' }}>Retrieval Settings</h4>

                        <div className="settings-group" style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>Top-K Chunks</label>
                                <span style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: 800 }}>{engineConfig.topK}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="10" 
                                value={engineConfig.topK}
                                onChange={(e) => setEngineConfig({...engineConfig, topK: parseInt(e.target.value)})}
                                style={{ width: '100%', accentColor: '#ff4d4f' }}
                            />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'white', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={engineConfig.runRagas}
                                onChange={(e) => setEngineConfig({...engineConfig, runRagas: e.target.checked})}
                                style={{ accentColor: '#ff4d4f', background: 'transparent' }}
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

                    {activeSection === 'governance' && (
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
