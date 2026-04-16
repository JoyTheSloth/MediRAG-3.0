import React, { useState } from 'react';
import './MediApiAgent.css';

const MediApiAgent = () => {
    const [trigger, setTrigger] = useState('PRESCRIPTION_ADDED');
    const [condition, setCondition] = useState('DRUG_INTERACTION');
    const [action, setAction] = useState('BLOCK_AND_ALERT');
    const [consensusEnabled, setConsensusEnabled] = useState(true);
    const [privacyEnabled, setPrivacyEnabled] = useState(true);

    const [activeRules, setActiveRules] = useState([
        { id: 1, name: 'Block unsafe prescriptions', trigger: 'Prescription added', action: 'Block & alert', active: true },
        { id: 2, name: 'Alert on high glucose', trigger: 'Lab report fetched', action: 'Add warning to response', active: true },
        { id: 3, name: 'Flag missing patient consent', trigger: 'API request made', action: 'Log for audit', active: false }
    ]);
    
    const [activeDemoStep, setActiveDemoStep] = useState(0);

    const [, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`POST https://mediapi.yourdomain.com/safe_execute`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleRule = (id) => {
        setActiveRules(rules => rules.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));
    };

    const handleSaveRule = () => {
        const triggerMap = {
            'API_REQUEST_MADE': 'API request made',
            'PRESCRIPTION_ADDED': 'Prescription added',
            'LAB_REPORT_FETCHED': 'Lab report fetched'
        };
        const conditionMap = {
            'DRUG_INTERACTION': 'Drug interaction detected',
            'ABNORMAL_LAB': 'Abnormal lab value',
            'MISSING_CONSENT': 'Missing patient consent',
            'CUSTOM_RULE': 'Custom rule'
        };
        const actionMap = {
            'BLOCK_AND_ALERT': 'Block & alert',
            'ADD_WARNING': 'Add warning to response',
            'NOTIFY_SYSTEM': 'Notify system',
            'LOG_AUDIT': 'Log for audit'
        };

        const newRule = {
            id: Date.now(),
            name: conditionMap[condition] || 'Custom security rule',
            trigger: triggerMap[trigger] || 'Event triggered',
            action: actionMap[action] || 'Perform action',
            active: true
        };

        setActiveRules([newRule, ...activeRules]);
    };

    return (
        <div className="agent-container reveal-up">
            {/* HEADER */}
            <div className="agent-header">
                <h1>MediAPI Agent</h1>
                <p>Automate safety and intelligence across your healthcare APIs</p>
            </div>

            <div className="agent-layout">
                {/* LEFT COLUMN */}
                <div className="agent-col">
                    
                    {/* 1. QUICK INTEGRATION */}
                    <section className="agent-section shadow-sm">
                        <div className="section-title">
                            <span className="sc-icon">🔌</span> Quick Integration
                        </div>
                        <p className="section-desc">Instantly plug MediAPI into your existing systems to enforce medical safety.</p>
                        
                        <div className="code-window">
                            <div className="code-header">
                                <span className="method">POST</span>
                                <span className="endpoint">/safe_execute</span>
                                <button className="copy-btn" onClick={handleCopy}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                            <pre className="code-content">
{`{
  "source_app": "Apollo247",
  "request_type": "CHECK_CONSENSUS",
  "data": {
    "question": "Can I take aspirin with Warfarin?",
    "use_consensus": ${consensusEnabled}
  }
}`}
                            </pre>
                        </div>
                    </section>

                    {/* 1.5 GLOBAL SAFETY CONFIG (OPTION 2) */}
                    <section className="agent-section glow-panel">
                        <div className="section-title">
                            <span className="sc-icon">⚖️</span> Safety Global Configuration
                        </div>
                        <p className="section-desc">Advanced middleware gates that apply across all connected healthcare apps.</p>
                        
                        <div className="rule-card is-active" style={{marginTop: '10px'}}>
                            <div className="rule-info">
                                <div className="rule-name">Multi-Model Consensus Engine</div>
                                <div className="rule-summary">
                                    <span>Cross-check 3+ models for clinical agreement</span>
                                </div>
                            </div>
                            <div className="rule-toggle">
                                <label className="switch">
                                    <input type="checkbox" checked={consensusEnabled} onChange={() => setConsensusEnabled(!consensusEnabled)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <div className="rule-card is-active" style={{marginTop: '10px'}}>
                            <div className="rule-info">
                                <div className="rule-name">PHI Privacy Shield</div>
                                <div className="rule-summary">
                                    <span>Redact patient names/IDs before cloud API calls</span>
                                </div>
                            </div>
                            <div className="rule-toggle">
                                <label className="switch">
                                    <input type="checkbox" checked={privacyEnabled} onChange={() => setPrivacyEnabled(!privacyEnabled)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {(consensusEnabled || privacyEnabled) && (
                            <div className="log-meta" style={{marginTop: '12px', color: '#00C896', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span>✔</span> Active: {consensusEnabled ? 'Consensus' : ''} {consensusEnabled && privacyEnabled ? '&' : ''} {privacyEnabled ? 'Privacy Sanitizer' : ''}
                            </div>
                        )}
                    </section>

                    {/* 2. AGENT AUTOMATION CONFIG */}
                    <section className="agent-section">
                        <div className="section-title">
                            <span className="sc-icon">🧠</span> Create Custom Safety Rule
                        </div>
                        <p className="section-desc">If-this-then-that automation for medical safety and governance.</p>

                        <p className="section-desc">If-this-then-that automation for medical safety and governance.</p>

                        <div className="premium-rule-builder">
                            <style>{`
                                .premium-rule-builder {
                                    display: flex;
                                    flex-direction: column;
                                    gap: 16px;
                                    margin-top: 24px;
                                }
                                .prb-node {
                                    background: rgba(15, 23, 42, 0.6);
                                    border: 1px solid rgba(255, 255, 255, 0.1);
                                    border-radius: 12px;
                                    padding: 16px;
                                    display: flex;
                                    align-items: center;
                                    gap: 16px;
                                    position: relative;
                                    z-index: 1;
                                    transition: all 0.2s ease;
                                }
                                .prb-node:hover {
                                    border-color: rgba(0, 200, 150, 0.4);
                                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                                    transform: translateX(4px);
                                }
                                .prb-connector {
                                    position: absolute;
                                    left: 36px;
                                    top: 100%;
                                    width: 2px;
                                    height: 16px;
                                    background: linear-gradient(to bottom, rgba(0, 200, 150, 0.5), rgba(0, 200, 150, 0.1));
                                    z-index: 0;
                                }
                                .prb-icon {
                                    width: 42px;
                                    height: 42px;
                                    border-radius: 10px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 18px;
                                    font-weight: bold;
                                    flex-shrink: 0;
                                }
                                .icon-when { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
                                .icon-if   { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
                                .icon-then { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
                                
                                .prb-content { flex-grow: 1; }
                                .prb-label {
                                    font-size: 11px;
                                    font-weight: 800;
                                    color: rgba(255,255,255,0.4);
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                    margin-bottom: 6px;
                                }
                                .prb-select {
                                    width: 100%;
                                    background: rgba(0,0,0,0.3) !important;
                                    border: 1px solid rgba(255,255,255,0.1) !important;
                                    color: white !important;
                                    font-size: 14px !important;
                                    padding: 10px 14px !important;
                                    border-radius: 8px !important;
                                    cursor: pointer;
                                    appearance: none;
                                    outline: none;
                                    transition: border-color 0.2s;
                                }
                                .prb-select:focus { border-color: #00c896 !important; }
                                .prb-select option { background: #0f172a; color: white; }
                                
                                .monaco-preview {
                                    background: #0d1117;
                                    border: 1px solid #30363d;
                                    border-radius: 8px;
                                    padding: 16px;
                                    font-family: 'Fira Code', 'Courier New', monospace;
                                    font-size: 13px;
                                    margin-top: 10px;
                                    position: relative;
                                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
                                    overflow: hidden;
                                }
                                .monaco-header {
                                    position: absolute;
                                    top: 0; left: 0; right: 0;
                                    background: #161b22;
                                    padding: 6px 16px;
                                    font-size: 11px;
                                    color: #8b949e;
                                    border-bottom: 1px solid #30363d;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                                .monaco-body {
                                    margin-top: 18px;
                                    margin-bottom: 0;
                                    color: #c9d1d9;
                                    white-space: pre-wrap;
                                    line-height: 1.6;
                                }
                                .syntax-key { color: #7ee787; }
                                .syntax-val { color: #a5d6ff; }
                                .syntax-punct { color: #8b949e; }
                            `}</style>

                            <div className="prb-node">
                                <div className="prb-icon icon-when">⚡</div>
                                <div className="prb-content">
                                    <div className="prb-label">Trigger Event</div>
                                    <select className="prb-select" value={trigger} onChange={e => setTrigger(e.target.value)}>
                                        <option value="API_REQUEST_MADE">API Request Initiated</option>
                                        <option value="PRESCRIPTION_ADDED">Prescription Added</option>
                                        <option value="LAB_REPORT_FETCHED">Lab Report Fetched</option>
                                    </select>
                                </div>
                                <div className="prb-connector"></div>
                            </div>
                            
                            <div className="prb-node">
                                <div className="prb-icon icon-if">❓</div>
                                <div className="prb-content">
                                    <div className="prb-label">Condition Context</div>
                                    <select className="prb-select" value={condition} onChange={e => setCondition(e.target.value)}>
                                        <option value="DRUG_INTERACTION">Drug-Drug Interaction Detected</option>
                                        <option value="PHI_DETECTED">PHI/PII Detected in Payload</option>
                                        <option value="ABNORMAL_LAB">Abnormal Lab Value Outside Range</option>
                                        <option value="MISSING_CONSENT">Missing Patient Consent Token</option>
                                    </select>
                                </div>
                                <div className="prb-connector"></div>
                            </div>
                            
                            <div className="prb-node">
                                <div className="prb-icon icon-then">🛡️</div>
                                <div className="prb-content">
                                    <div className="prb-label">Automated Action</div>
                                    <select className="prb-select" value={action} onChange={e => setAction(e.target.value)}>
                                        <option value="BLOCK_AND_ALERT">Intercept Request & Alert Clinician</option>
                                        <option value="REDACT_DATA">Auto-Redact Sensitive Fields</option>
                                        <option value="ADD_WARNING">Append Warning Metadata to Header</option>
                                        <option value="LOG_AUDIT">Forward to Audit Log Database</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button className="add-rule-btn" style={{ 
                                    background: 'linear-gradient(135deg, #00C896, #008765)', 
                                    padding: '12px 28px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    color: 'white', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 4px 15px rgba(0, 200, 150, 0.3)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }} onClick={handleSaveRule}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <span>Deploy Rule</span> 🚀
                                </button>
                            </div>

                            <div className="monaco-preview reveal-up">
                                <div className="monaco-header">
                                    <span>rule_definition.json</span>
                                    <span>JSON</span>
                                </div>
                                <pre className="monaco-body">
{<span className="syntax-punct">{`{\n`}</span>}
{`  `}<span className="syntax-key">"id"</span><span className="syntax-punct">: </span><span className="syntax-val">"rule_safeguard_v2"</span><span className="syntax-punct">,</span>{`\n`}
{`  `}<span className="syntax-key">"trigger"</span><span className="syntax-punct">: </span><span className="syntax-val">"{trigger}"</span><span className="syntax-punct">,</span>{`\n`}
{`  `}<span className="syntax-key">"condition"</span><span className="syntax-punct">: </span><span className="syntax-val">"{condition}"</span><span className="syntax-punct">,</span>{`\n`}
{`  `}<span className="syntax-key">"action"</span><span className="syntax-punct">: </span><span className="syntax-val">"{action}"</span>{`\n`}
{<span className="syntax-punct">{`}`}</span>}
                                </pre>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="agent-col">
                    
                    {/* 4. LIVE FLOW PREVIEW */}
                    <section className="agent-section flow-section">
                        <div className="section-title">
                            <span className="sc-icon">⚙️</span> Real-time Pipeline Flow
                        </div>
                        <div className="pipeline-container">
                            <div className="pipeline-track"></div>
                            
                            <div className="pipeline-node">
                                <div className="node-icon bg-gray">📱</div>
                                <div className="node-text">
                                    <div className="node-title">Source App</div>
                                    <div className="node-sub">Patient Request</div>
                                </div>
                            </div>

                            <div className="pipeline-node">
                                <div className="node-icon bg-green pulse-glow">🧠</div>
                                <div className="node-text">
                                    <div className="node-title agent-text">MediAPI Agent</div>
                                    <div className="node-sub">Intercepts Call</div>
                                </div>
                            </div>

                            {privacyEnabled && (
                                <div className="pipeline-node">
                                    <div className="node-icon bg-gray" style={{background: 'rgba(100, 116, 139, 0.1)', borderColor: '#64748B'}}>🔒</div>
                                    <div className="node-text">
                                        <div className="node-title enhanced-text">Privacy Gate</div>
                                        <div className="node-sub">PHI Redacted</div>
                                    </div>
                                </div>
                            )}

                            {consensusEnabled && (
                                <div className="pipeline-node">
                                    <div className="node-icon bg-blue" style={{background: 'rgba(56, 189, 248, 0.2)', borderColor: '#38BDF8'}}>⚖️</div>
                                    <div className="node-text">
                                        <div className="node-title enhanced-text">Consensus Judge</div>
                                        <div className="node-sub">Model Agreement (98%)</div>
                                    </div>
                                </div>
                            )}

                            <div className="pipeline-node">
                                <div className="node-icon bg-amber">⚡</div>
                                <div className="node-text">
                                    <div className="node-title risk-text">Risk Validation</div>
                                    <div className="node-sub">Checking Rules</div>
                                </div>
                            </div>

                            <div className="pipeline-node">
                                <div className="node-icon bg-blue">🛡️</div>
                                <div className="node-text">
                                    <div className="node-title enhanced-text">Safe Response</div>
                                    <div className="node-sub">Returned to App</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. ACTIVE AGENTS / RULES */}
                    <section className="agent-section">
                        <div className="section-title">
                            <span className="sc-icon">⚡</span> Configured Agents
                        </div>
                        <div className="rules-list">
                            {activeRules.map(rule => (
                                <div className={`rule-card ${rule.active ? 'is-active' : ''}`} key={rule.id}>
                                    <div className="rule-info">
                                        <div className="rule-name">{rule.name}</div>
                                        <div className="rule-summary">
                                            <span>{rule.trigger}</span>
                                            <span className="arrow">→</span>
                                            <span className="action">{rule.action}</span>
                                        </div>
                                    </div>
                                    <div className="rule-toggle">
                                        <label className="switch">
                                            <input type="checkbox" checked={rule.active} onChange={() => toggleRule(rule.id)} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. AGENT ACTIVITY LOG */}
                    <section className="agent-section">
                        <div className="section-title">
                            <span className="sc-icon">📋</span> Middleware Activity Log
                        </div>
                        <div className="activity-log">
                            {privacyEnabled && (
                                <div className="log-item success">
                                    <span className="log-icon" style={{color: '#64748B'}}>🔒</span>
                                    <span className="log-text">Privacy Sanitized: <span style={{color: '#64748B'}}>3 PHI Items Found</span> <span className="log-meta">(Redacted • 1s ago)</span></span>
                                </div>
                            )}
                            {consensusEnabled && (
                                <div className="log-item success">
                                    <span className="log-icon" style={{color: '#38BDF8'}}>⚖️</span>
                                    <span className="log-text">Consensus Check: <span style={{color: '#00C896'}}>98% Agreement</span> <span className="log-meta">(Gemini, Llama3 • 2s ago)</span></span>
                                </div>
                            )}
                            <div className="log-item success">
                                <span className="log-icon">✔</span>
                                <span className="log-text">Prescription checked <span className="log-meta">(Apollo247 • 12s ago)</span></span>
                            </div>
                            <div className="log-item warning">
                                <span className="log-icon">⚠</span>
                                <span className="log-text">Risk detected: Mild drug interaction <span className="log-meta">(Tata1mg • 4m ago)</span></span>
                            </div>
                            <div className="log-item error">
                                <span className="log-icon">🚫</span>
                                <span className="log-text">Request blocked: Missing patient consent <span className="log-meta">(Practo • 14m ago)</span></span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            {/* INTEGRATION PREVIEW SECTION (from previous design) */}
            <div style={{ gridColumn: '1 / -1', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#00C896', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Live Integration Preview</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-white)', margin: 0 }}>MediRAG in Third-Party Apps</h2>
                    <p style={{ color: 'var(--text-gray)', marginTop: '8px', fontSize: '14px' }}>How leading healthcare brands protect their patients using our governance layer</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
                    
                    {/* Flow Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                        {[
                            { step: '01', title: 'User uploads PDF', desc: 'Patient shares their lab report or prescription with the AI assistant.' },
                            { step: '02', title: 'AI reads & answers', desc: 'Standard LLM generates a response based on the document content.' },
                            { step: '03', title: 'MediRAG checks it', desc: 'Our system audits the claim in real-time before the user sees it.' },
                            { step: '04', title: 'Brand gets protection', desc: 'Hallucinations are blocked or flagged, ensuring clinical safety.' }
                        ].map((s, i) => (
                            <div 
                                key={i} 
                                onClick={() => setActiveDemoStep(i)}
                                style={{ 
                                    display: 'flex', gap: '20px', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s',
                                    background: i === activeDemoStep ? 'rgba(43, 89, 255, 0.05)' : 'transparent', 
                                    border: i === activeDemoStep ? '1px solid rgba(43, 89, 255, 0.2)' : '1px solid transparent' 
                                }}
                            >
                                <div style={{ fontSize: '14px', fontWeight: 900, color: i === activeDemoStep ? '#4dabf7' : '#333' }}>{s.step}</div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: i === activeDemoStep ? 'var(--text-white)' : 'var(--text-gray)' }}>{s.title}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-gray-dim)', marginTop: '4px' }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Mockup */}
                    <div style={{ 
                        width: '320px', 
                        height: '540px', 
                        background: 'var(--gov-card, #121826)', 
                        borderRadius: '32px', 
                        border: '8px solid rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        {/* Status Bar */}
                        <div style={{ height: '30px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>
                            <span>9:41</span>
                            <div style={{ display: 'flex', gap: '4px' }}><span>📶</span><span>🔋</span></div>
                        </div>

                        {/* App Header */}
                        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e53e3e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white' }}>Ap</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-white)', margin: 0 }}>Apollo 247</div>
                                <div style={{ fontSize: '11px', color: '#00C896', margin: 0 }}>Health assistant</div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeDemoStep === 0 && (
                                <>
                                    <div style={{ border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                        <div style={{ color: '#4dabf7', marginBottom: '8px' }}>📤</div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-white)' }}>Upload your health document</div>
                                        <div style={{ fontSize: '9px', color: 'var(--text-gray-dim)' }}>Lab report, prescription, discharge summary</div>
                                    </div>

                                    <div style={{ fontSize: '9px', textAlign: 'center', color: 'var(--text-gray-dim)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)' }}></div>
                                        <span style={{ background: 'var(--gov-card)', padding: '0 8px', position: 'relative' }}>or try an example</span>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ background: '#e53e3e22', color: '#e53e3e', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>PDF</div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-white)' }}>Discharge_Summary_Rajan.pdf</div>
                                            <div style={{ fontSize: '9px', color: 'var(--text-gray-dim)' }}>Apollo Hospitals • 3 pages • 124 KB</div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px', fontSize: '12px', lineHeight: '1.4', textAlign: 'left', color: 'var(--text-white)' }}>
                                        My doctor mentioned metoprolol 25mg twice daily. Is this a normal dose for me?
                                    </div>

                                    <button style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-white)', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                        Ask Apollo AI →
                                    </button>
                                </>
                            )}
                            
                            {activeDemoStep > 0 && (
                                <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px', fontSize: '12px', lineHeight: '1.4', textAlign: 'left', color: 'var(--text-white)' }}>
                                    My doctor mentioned metoprolol 25mg twice daily. Is this a normal dose for me?
                                </div>
                            )}

                            {activeDemoStep === 1 && (
                                <div style={{ fontSize: '11px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', alignSelf: 'flex-start', color: 'var(--text-white)' }}>
                                    <span>...</span> Generative AI is typing...
                                </div>
                            )}

                            {activeDemoStep === 2 && (
                                <>
                                    <div style={{ fontSize: '12px', lineHeight: '1.5', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', textAlign: 'left', color: 'var(--text-white)' }}>
                                        Yes, generating 25mg twice daily is a completely normal dosage to begin with for hypertension...
                                    </div>
                                    <div style={{ marginTop: '-8px', alignSelf: 'center', background: 'rgba(43, 89, 255, 0.1)', border: '1px solid #4dabf7', borderRadius: '20px', padding: '8px 16px', fontSize: '10px', fontWeight: 700, color: '#4dabf7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px' }}>🛡️</span> MediRAG Eval: Scanning output...
                                    </div>
                                </>
                            )}

                            {activeDemoStep === 3 && (
                                <>
                                    <div style={{ fontSize: '12px', lineHeight: '1.5', padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'left', color: 'var(--text-white)' }}>
                                        <div style={{ color: '#EF4444', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>⚠️</span> Clinical Error Detected
                                        </div>
                                        Yes, generating 25mg twice daily is a completely normal dosage to begin with for hypertension...
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(239, 68, 68, 0.2)', color: 'var(--text-gray-dim)', fontSize: '10px' }}>
                                            <strong style={{color: '#EF4444'}}>MediRAG Audit:</strong> The uploaded document specifies 12.5mg twice daily, not 25mg. Response blocked for patient safety.
                                        </div>
                                    </div>
                                    <button style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Connect to Human Doctor</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MediApiAgent;
