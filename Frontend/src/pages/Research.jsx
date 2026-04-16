import React, { useState, useEffect } from 'react';

const Research = () => {
    const [activeTab, setActiveTab] = useState('explorer');
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const studies = [
        { id: 1, title: "Metformin in type 2 diabetes", type: "Meta-Analysis", date: "2023", impact: "High" },
        { id: 2, title: "SGLT2 inhibitors clinical trial", type: "RCT", date: "2024", impact: "Critical" },
        { id: 3, title: "Cardiovascular outcomes in GLP-1", type: "Cohort Study", date: "2022", impact: "Medium" },
        { id: 4, title: "Hypertension management 2.0", type: "Guidelines", date: "2024", impact: "High" }
    ];

    const toggleAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 2500);
    };

    return (
        <div className="lab-page">
            <style>{`
                .lab-page {
                    min-height: 100vh;
                    padding-top: 80px; 
                    background: #0a0d14;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }
                
                /* --- Lab Header --- */
                .lab-header {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding: 16px 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 110px;
                    z-index: 100;
                }
                .lab-title-area h1 {
                    font-size: 18px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .lab-status {
                    font-size: 11px;
                    background: rgba(0, 200, 150, 0.1);
                    color: #00C896;
                    padding: 4px 10px;
                    border-radius: 4px;
                    border: 1px solid rgba(0, 200, 150, 0.2);
                    font-weight: 700;
                    text-transform: uppercase;
                }

                /* --- Layout --- */
                .lab-container {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    height: calc(100vh - 170px);
                }

                /* --- Sidebar: Library --- */
                .lab-sidebar {
                    width: 300px;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    background: #0f131d;
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-section {
                    padding: 20px;
                }
                .sidebar-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    margin-bottom: 15px;
                    display: block;
                }
                .study-item {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .study-item:hover {
                    background: rgba(255,255,255,0.03);
                }
                .study-item.active {
                    background: rgba(0, 200, 150, 0.08);
                    border-color: rgba(0, 200, 150, 0.2);
                }
                .study-title {
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: rgba(255,255,255,0.9);
                    display: block;
                }
                .study-meta {
                    font-size: 11px;
                    color: rgba(255,255,255,0.4);
                    display: flex;
                    gap: 8px;
                }

                /* --- Main Content --- */
                .lab-main {
                    flex: 1;
                    background: #0a0d14;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }

                /* --- Tabs --- */
                .lab-tabs {
                    display: flex;
                    gap: 24px;
                    padding: 0 30px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    background: #0f131d;
                }
                .lab-tab {
                    padding: 14px 0;
                    font-size: 13px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    position: relative;
                    transition: color 0.2s;
                }
                .lab-tab:hover { color: white; }
                .lab-tab.active {
                    color: #00C896;
                }
                .lab-tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #00C896;
                    box-shadow: 0 -2px 10px rgba(0, 200, 150, 0.4);
                }

                /* --- Explorer View --- */
                .explorer-view {
                    padding: 30px;
                    display: flex;
                    gap: 30px;
                }
                .explorer-chat {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .explorer-card {
                    background: rgba(30, 41, 59, 0.3);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 24px;
                }
                .explorer-card h3 {
                    font-size: 15px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* --- Review Table --- */
                .review-table-container {
                    padding: 30px;
                }
                .lab-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }
                .lab-table th {
                    text-align: left;
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.02);
                    color: rgba(255,255,255,0.4);
                    font-weight: 800;
                    text-transform: uppercase;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .lab-table td {
                    padding: 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.8);
                }
                .intensity-bar {
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                    margin-top: 6px;
                    overflow: hidden;
                }
                .intensity-fill {
                    height: 100%;
                    background: #00C896;
                }

                /* --- Right Panel: Assistant --- */
                .lab-assistant {
                    width: 320px;
                    border-left: 1px solid rgba(255,255,255,0.05);
                    background: #0f131d;
                    padding: 24px;
                }
                .assistant-panel {
                    background: rgba(0, 200, 150, 0.05);
                    border: 1px solid rgba(0, 200, 150, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .ai-thought {
                    font-size: 13px;
                    line-height: 1.6;
                    color: rgba(255,255,255,0.7);
                    font-style: italic;
                }

                /* --- Animation Helpers --- */
                .pulse-analyze {
                    animation: glow 1.5s infinite alternate;
                }
                @keyframes glow {
                    from { box-shadow: 0 0 5px rgba(0, 200, 150, 0.1); }
                    to { box-shadow: 0 0 20px rgba(0, 200, 150, 0.4); }
                }

                @media (max-width: 1100px) {
                    .lab-sidebar, .lab-assistant { display: none; }
                }
            `}</style>

            <div className="lab-header">
                <div className="lab-title-area">
                    <h1>
                        <span style={{color: '#00C896'}}>🔬</span> 
                        RESEARCHER'S LAB <span style={{opacity: 0.3, fontWeight: 400}}>| Workspace Alpha</span>
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="lab-status">● PIPELINE ACTIVE</div>
                    <button 
                        onClick={toggleAnalysis}
                        className={`primary-btn ${isAnalyzing ? 'pulse-analyze' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                        {isAnalyzing ? 'SYNTHESIZING DATA...' : 'RUN META-ANALYSIS'}
                    </button>
                </div>
            </div>

            <div className="lab-container">
                {/* Sidebar: Clinical Library */}
                <div className="lab-sidebar">
                    <div className="sidebar-section">
                        <span className="sidebar-label">Document Library</span>
                        {studies.map(s => (
                            <div 
                                key={s.id} 
                                className={`study-item ${selectedStudy === s.id ? 'active' : ''}`}
                                onClick={() => setSelectedStudy(s.id)}
                            >
                                <span className="study-title">{s.title}</span>
                                <div className="study-meta">
                                    <span>{s.type}</span>
                                    <span>•</span>
                                    <span>{s.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sidebar-section" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <span className="sidebar-label" style={{ marginBottom: '8px' }}>Storage Usage</span>
                            <div className="intensity-bar"><div className="intensity-fill" style={{ width: '42%' }} /></div>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', display: 'block' }}>2.4GB / 5.0GB</span>
                        </div>
                    </div>
                </div>

                {/* Main Lab Space */}
                <div className="lab-main">
                    <div className="lab-tabs">
                        <div className={`lab-tab ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>EVIDENCE EXPLORER</div>
                        <div className={`lab-tab ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>SYSTEMATIC REVIEW</div>
                        <div className={`lab-tab ${activeTab === 'benchmarks' ? 'active' : ''}`} onClick={() => setActiveTab('benchmarks')}>DATA ANALYSIS</div>
                    </div>

                    <div className="lab-view-content">
                        {activeTab === 'explorer' && (
                            <div className="explorer-view">
                                <div className="explorer-chat">
                                    <div className="explorer-card">
                                        <h3><span style={{color: '#00C896'}}>💬</span> Evidence Query</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                            Querying multiple clinical trials for contradicting methodologies...
                                        </p>
                                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid #00C896' }}>
                                            <strong style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#00C896' }}>SYNTHESIZED FINDING (V2.4):</strong>
                                            <span style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                Across the SGLT2 and GLP-1 datasets, we found a 14% variance in renal outcome reporting. 
                                                Evidence suggests a correlated risk factor in elderly cohorts (n=1200+) not present in early phase trials.
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="explorer-card">
                                            <h3>📚 Key Citations</h3>
                                            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '2' }}>
                                                <li>BMJ Case Reports #4421</li>
                                                <li>NEJM Clinical Evaluation (2024)</li>
                                                <li>Lancet Diabetes & Endo Vol 12</li>
                                            </ul>
                                        </div>
                                        <div className="explorer-card">
                                            <h3>⚖️ Bias Check</h3>
                                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: '#00C896' }}>NEUTRAL</div>
                                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Conflict of Interest: LOW</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'review' && (
                            <div className="review-table-container">
                                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '20px' }}>Systematic Comparison Table</h2>
                                    <button className="primary-btn" style={{ fontSize: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>EXPORT CSV</button>
                                </div>
                                <table className="lab-table">
                                    <thead>
                                        <tr>
                                            <th>STUDY NAME</th>
                                            <th>METHODOLOGY</th>
                                            <th>SAMPLE SIZE</th>
                                            <th>RELEVANCE SCORE</th>
                                            <th>VERDICT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: "SGLT2 Trial (NEJM)", method: "Double-Blind RCT", size: 4500, rel: 98, verdict: "Consensus" },
                                            { name: "Metformin Study (BMJ)", method: "Meta-Analysis", size: 12000, rel: 92, verdict: "Strong Support" },
                                            { name: "GLP-1 Outcome (Lancet)", method: "Cohort Study", size: 850, rel: 74, verdict: "Weak Conflict" },
                                            { name: "Renal Risk Factor (Nature)", method: "Pre-clinical", size: 120, rel: 40, verdict: "Outlier" }
                                        ].map((r, i) => (
                                            <tr key={i}>
                                                <td><strong>{r.name}</strong></td>
                                                <td>{r.method}</td>
                                                <td>{r.size.toLocaleString()} users</td>
                                                <td>
                                                    <span style={{ color: r.rel > 80 ? '#00C896' : '#f59e0b' }}>{r.rel}%</span>
                                                    <div className="intensity-bar"><div className="intensity-fill" style={{ width: `${r.rel}%`, background: r.rel > 80 ? '#00C896' : '#f59e0b' }} /></div>
                                                </td>
                                                <td>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', fontSize: '11px' }}>{r.verdict}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'benchmarks' && (
                             <div style={{ padding: '40px' }}>
                                <div className="explorer-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                     <h2 style={{ marginBottom: '30px' }}>System Fidelity Benchmarks</h2>
                                     <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '40px' }}>
                                         Below are the real-time RAGAS evaluations across our clinical library. We maintain a 90%+ faithfulness threshold for production release.
                                     </p>
                                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
                                        <div>
                                            <span className="sidebar-label">Faithfulness (NLI)</span>
                                            <div className="dial-value" style={{fontSize: '48px'}}>0.96</div>
                                            <div className="intensity-bar" style={{height: '8px'}}><div className="intensity-fill" style={{width: '96%'}} /></div>
                                        </div>
                                        <div>
                                            <span className="sidebar-label">Context Recall</span>
                                            <div className="dial-value" style={{fontSize: '48px'}}>0.91</div>
                                            <div className="intensity-bar" style={{height: '8px'}}><div className="intensity-fill" style={{width: '91%'}} /></div>
                                        </div>
                                     </div>
                                </div>
                             </div>
                        )}
                    </div>
                </div>

                {/* Right Assistant Panel */}
                <div className="lab-assistant">
                    <div className="assistant-panel">
                        <span className="sidebar-label" style={{ color: '#00C896' }}>Research Assistant AI</span>
                        <div style={{ marginTop: '15px' }}>
                            <p className="ai-thought">
                                "I've detected a significant overlap in the renal toxicity reports from NEJM and BMJ. Should I generate a synthesis of the conflicting patient demographics?"
                            </p>
                            <button className="primary-btn" style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '11px' }}>
                                YES, GENERATE SYNTHESIS
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <span className="sidebar-label">Active Protocols</span>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Entity Matcher (SciSpaCy)</span>
                                <span style={{ color: '#00C896' }}>ON</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Contradiction Detector</span>
                                <span style={{ color: '#00C896' }}>ON</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Source Credibility Verifier</span>
                                <span style={{ color: '#00C896' }}>ON</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Research;

