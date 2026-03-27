import React, { useState, useRef, useEffect } from 'react';
import './MediChat.css';

const POPULAR_TOPICS = [
    { icon: '🩸', label: 'Blood Pressure Tips' },
    { icon: '🔬', label: 'Lab Result Guide' },
    { icon: '💊', label: 'Medication Safety' },
    { icon: '🫀', label: 'Heart Health FAQ' },
];

const INITIAL_TOPICS = [
    'Can you explain the long-term effects of Metformin?',
    'What are the warning signs of kidney disease?',
    'Is ibuprofen safe for daily use?',
    'What does a high HbA1c level indicate?',
];

function getRiskBadge(risk_band) {
    const rb = (risk_band || '').toUpperCase();
    if (rb === 'LOW') return { label: 'SAFE TO READ', cls: 'safe', color: '#00C896' };
    if (rb === 'MODERATE') return { label: 'USE CAUTION', cls: 'moderate', color: '#ffc832' };
    if (rb === 'HIGH' || rb === 'CRITICAL') return { label: 'HIGH RISK', cls: 'high', color: '#ff6432' };
    return { label: 'ANALYZING', cls: 'safe', color: '#00C896' };
}

function FormattedAnswer({ text }) {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim() !== '');
    return (
        <div style={{ lineHeight: 1.78, fontSize: '14px', color: 'rgba(255,255,255,0.88)' }}>
            {lines.map((line, i) => {
                const t = line.trim();
                if (/^[-*\u2022]\s/.test(t)) {
                    return (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '7px', paddingLeft: '4px' }}>
                            <span style={{ color: '#00C896', marginTop: '2px', flexShrink: 0 }}>&#9658;</span>
                            <span>{t.replace(/^[-*\u2022]\s/, '')}</span>
                        </div>
                    );
                }
                if (/^\d+\.\s/.test(t)) {
                    const num = t.match(/^(\d+)\./)?.[1];
                    return (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '7px', paddingLeft: '4px' }}>
                            <span style={{ color: '#00C896', fontWeight: 700, minWidth: '18px', flexShrink: 0 }}>{num}.</span>
                            <span>{t.replace(/^\d+\.\s/, '')}</span>
                        </div>
                    );
                }
                if (/^\*\*(.+)\*\*$/.test(t) || /^#+\s/.test(t)) {
                    const clean = t.replace(/^\*\*|\*\*$|^#+\s/g, '');
                    return <div key={i} style={{ fontWeight: 700, color: 'white', margin: '14px 0 6px', fontSize: '13.5px' }}>{clean}</div>;
                }
                return <p key={i} style={{ margin: '0 0 10px 0' }}>{t}</p>;
            })}
        </div>
    );
}

function HRSGauge({ hrs }) {
    if (hrs == null) return null;
    const color = hrs <= 30 ? '#00C896' : hrs <= 60 ? '#ffc832' : '#ff6432';
    const label = hrs <= 30 ? 'LOW HALLUCINATION RISK' : hrs <= 60 ? 'MODERATE RISK' : 'HIGH HALLUCINATION RISK';
    return (
        <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                    &#129516; Hallucination Risk Score
                </span>
                <span style={{ fontSize: '22px', fontWeight: 900, color }}>
                    {hrs}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>/100</span>
                </span>
            </div>
            <div style={{ height: '7px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${hrs}%`, background: `linear-gradient(90deg, #00C896, ${color})`, borderRadius: '99px', transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ marginTop: '5px', fontSize: '10.5px', color, fontWeight: 700, letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
}

function ModulePill({ label, score, invert }) {
    if (score == null) return null;
    const val = invert ? (1 - score) : score;
    const pct = Math.round(val * 100);
    const color = pct >= 75 ? '#00C896' : pct >= 50 ? '#ffc832' : '#ff6432';
    return (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '8px 10px', flex: '1', minWidth: '76px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '17px', fontWeight: 900, color }}>{pct}%</div>
        </div>
    );
}

function AIMessageCard({ msg }) {
    const [expanded, setExpanded] = useState(false);
    const data = msg.data;
    const badge = getRiskBadge(data?.risk_band);
    const hrs = data?.hrs;
    const chunks = data?.retrieved_chunks || [];
    const mod = data?.module_results || {};
    const isIntervened = data?.intervention_applied;
    const interventionReason = data?.intervention_reason;

    return (
        <div className="mc-ai-card">
            {/* Header */}
            <div className="mc-ai-card-header" style={{ marginBottom: '14px' }}>
                <div className={`mc-safety-badge ${badge.cls}`}>
                    <span>&#9679;</span>{badge.label}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {isIntervened && (
                        <div style={{ fontSize: '10px', color: '#ffc832', fontWeight: 700, background: 'rgba(255,200,50,0.1)', border: '1px solid rgba(255,200,50,0.2)', borderRadius: '12px', padding: '3px 9px' }}>
                            &#9889; {interventionReason === 'CRITICAL_BLOCKED' ? 'BLOCKED' : 'REGENERATED'}
                        </div>
                    )}
                    {data?.total_pipeline_ms && (
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>&#8987; {data.total_pipeline_ms}ms</span>
                    )}
                </div>
            </div>

            {/* HRS Gauge */}
            <HRSGauge hrs={hrs} />

            {/* Formatted Answer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                    &#128203; MediRAG Response — grounded from {chunks.length > 0 ? `${chunks.length} retrieved source${chunks.length > 1 ? 's' : ''}` : 'medical dataset'}
                </div>
                <FormattedAnswer text={data?.generated_answer || msg.text} />
            </div>

            {/* Module Scores */}
            {(mod.faithfulness || mod.source_credibility || mod.contradiction || mod.entity_verifier) && (
                <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        &#10004; Safety Evaluation Modules
                    </div>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                        <ModulePill label="Faithfulness" score={mod.faithfulness?.score} />
                        <ModulePill label="Src. Cred." score={mod.source_credibility?.score} />
                        <ModulePill label="Consistency" score={mod.contradiction?.score} />
                        <ModulePill label="Entity Acc." score={mod.entity_verifier?.score} />
                    </div>
                </div>
            )}

            {/* Source Citations */}
            {chunks.length > 0 ? (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    <button className="mc-expand-btn" onClick={() => setExpanded(e => !e)}>
                        {expanded ? '&#8679; Hide' : '&#8681; View'} {chunks.length} MediRAG dataset source{chunks.length > 1 ? 's' : ''}
                    </button>
                    {expanded && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {chunks.map((c, i) => (
                                <div key={i} style={{ background: 'rgba(0,200,150,0.03)', border: '1px solid rgba(0,200,150,0.1)', borderRadius: '9px', padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
                                        <div style={{ fontSize: '11.5px', color: '#00C896', fontWeight: 700 }}>
                                            [{i + 1}] {c.title || c.source || 'Medical Literature'}
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {c.pub_type && <span style={{ fontSize: '9px', background: 'rgba(0,200,150,0.12)', color: '#00C896', borderRadius: '4px', padding: '2px 7px', fontWeight: 700 }}>{c.pub_type}</span>}
                                            {c.pub_year && <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', padding: '2px 0' }}>{c.pub_year}</span>}
                                            {c.similarity_score != null && <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>sim {typeof c.similarity_score === 'number' ? c.similarity_score.toFixed(2) : c.similarity_score}</span>}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                                        {(c.text || '').slice(0, 300)}{(c.text || '').length > 300 ? '\u2026' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ fontSize: '11px', color: 'rgba(255,200,50,0.65)', marginTop: '10px', background: 'rgba(255,200,50,0.05)', borderRadius: '7px', padding: '8px 12px', border: '1px solid rgba(255,200,50,0.12)' }}>
                    &#9888; No dataset sources retrieved — ensure the FAISS index is built and the backend is running.
                </div>
            )}
        </div>
    );
}

const MediChat = ({ engineConfig }) => {
    const [sessions, setSessions] = useState([
        { id: 1, title: 'Checking Diabetes Info', messages: [] },
        { id: 2, title: 'Heart Health Overview', messages: [] },
    ]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState('');
    const [localApiKey, setLocalApiKey] = useState(engineConfig?.apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [localConfig, setLocalConfig] = useState({
        apiUrl: engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        provider: engineConfig?.provider || 'Gemini',
        model: engineConfig?.model || 'gemini-2.0-flash',
        topK: engineConfig?.topK || 5,
        runRagas: engineConfig?.runRagas || false,
    });
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const pasteFileRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const startNewChat = () => {
        const id = Date.now();
        const newSession = { id, title: 'New Chat', messages: [] };
        setSessions(prev => [newSession, ...prev]);
        setActiveSession(id);
        setMessages([]);
        setError('');
    };

    const loadSession = (session) => {
        setActiveSession(session.id);
        setMessages(session.messages);
        setError('');
    };

    const sendMessage = async (text) => {
        const q = (text || input).trim();
        if (!q || isThinking) return;

        const userMsg = { id: Date.now(), role: 'user', text: q };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);
        setError('');

        // Auto-create session if none
        let sid = activeSession;
        if (!sid) {
            sid = Date.now();
            const ns = { id: sid, title: q.slice(0, 40), messages: [] };
            setSessions(prev => [ns, ...prev]);
            setActiveSession(sid);
        }

        try {
            const endpoint = `${localConfig.apiUrl}/query`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q,
                    top_k: localConfig.topK,
                    run_ragas: localConfig.runRagas,
                    llm_provider: localConfig.provider.toLowerCase(),
                    llm_model: localConfig.model,
                    llm_api_key: localApiKey || engineConfig?.apiKey || ''
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'API error');

            const botMsg = {
                id: Date.now() + 1,
                role: 'bot',
                text: data.generated_answer,
                data
            };

            const finalMsgs = [...newMessages, botMsg];
            setMessages(finalMsgs);

            // Update session title on first real message
            setSessions(prev => prev.map(s =>
                s.id === sid
                    ? { ...s, title: q.slice(0, 42), messages: finalMsgs }
                    : s
            ));

        } catch (err) {
            const errMsg = {
                id: Date.now() + 2,
                role: 'bot',
                text: `❌ Error: ${err.message}`,
                isError: true
            };
            setMessages(prev => [...prev, errMsg]);
            setError(err.message);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (id) => {
        const d = new Date(id);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="medichat-layout">
            {/* ─── Sidebar ─── */}
            <div className="mc-sidebar">
                <div className="mc-sidebar-header">
                    <div className="mc-brand-name">MEDIRAG ASSISTANT</div>
                    <div className="mc-brand-sub">Clinical AI v2.4</div>
                </div>

                <button className="mc-new-chat-btn" onClick={startNewChat}>
                    <span style={{ fontSize: '18px', fontWeight: 900 }}>+</span>
                    NEW CHAT
                </button>

                {sessions.length > 0 && (
                    <>
                        <div className="mc-section-label" style={{ marginBottom: '4px' }}>RECENT CHATS</div>
                        {sessions.map(s => (
                            <div
                                key={s.id}
                                className={`mc-chat-item ${activeSession === s.id ? 'active' : ''}`}
                                onClick={() => loadSession(s)}
                            >
                                <span className="mc-chat-item-icon">🕐</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </>
                )}

                <div style={{ height: '20px' }} />
                <div className="mc-section-label">POPULAR HEALTH TOPICS</div>
                {POPULAR_TOPICS.map(t => (
                    <div
                        key={t.label}
                        className="mc-chat-item"
                        onClick={() => { startNewChat(); sendMessage(t.label); }}
                    >
                        <span className="mc-chat-item-icon">{t.icon}</span>
                        {t.label}
                    </div>
                ))}

                <div className="mc-sidebar-spacer" />

                {/* ── EVALUATION ENGINE PANEL ── */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                        <span style={{ fontSize: '15px' }}>⚙️</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Evaluation Engine</span>
                    </div>

                    {/* API URL */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '7px' }}>API URL</label>
                        <input
                            type="text"
                            value={localConfig.apiUrl}
                            onChange={e => setLocalConfig(c => ({ ...c, apiUrl: e.target.value }))}
                            style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 10px', color: 'white', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* LLM Settings */}
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>LLM Settings</div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '7px' }}>Provider</label>
                        <select
                            value={localConfig.provider}
                            onChange={e => {
                                const p = e.target.value;
                                setLocalConfig(c => ({ 
                                    ...c, 
                                    provider: p,
                                    model: p === 'OpenAI' ? 'gpt-4o' : 'gemini-2.0-flash'
                                }));
                            }}
                            style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 10px', color: 'white', fontSize: '12px', outline: 'none' }}
                        >
                            <option value="Gemini">Gemini</option>
                            <option value="OpenAI">OpenAI</option>
                            <option value="Ollama">Ollama (Local)</option>
                        </select>
                    </div>

                    {['Gemini', 'OpenAI'].includes(localConfig.provider) && (
                        <>
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                                        {localConfig.provider} API Key
                                    </label>
                                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', cursor: 'help' }}>❔</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={localApiKey}
                                        onChange={e => setLocalApiKey(e.target.value)}
                                        placeholder="sk-... or AIza..."
                                        style={{ width: '100%', background: '#121620', border: `1px solid ${localApiKey ? 'rgba(0,200,150,0.4)' : '#1c253b'}`, borderRadius: '6px', padding: '8px 34px 8px 10px', color: 'white', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                                    />
                                    <button onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', padding: 0 }}>
                                        👁
                                    </button>
                                </div>
                                {localApiKey && <div style={{ marginTop: '5px', fontSize: '10.5px', color: '#00C896' }}>✓ Key active</div>}
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '7px' }}>Model</label>
                                <select
                                    value={localConfig.model}
                                    onChange={e => setLocalConfig(c => ({ ...c, model: e.target.value }))}
                                    style={{ width: '100%', background: '#121620', border: '1px solid #1c253b', borderRadius: '6px', padding: '8px 10px', color: 'white', fontSize: '12px', outline: 'none' }}
                                >
                                    {localConfig.provider === 'Gemini' ? (
                                        <>
                                            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                                            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
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

                    {/* Retrieval Settings */}
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Retrieval Settings</div>

                    <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>Top-K Chunks</label>
                            <span style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: 800 }}>{localConfig.topK}</span>
                        </div>
                        <input
                            type="range" min="1" max="10"
                            value={localConfig.topK}
                            onChange={e => setLocalConfig(c => ({ ...c, topK: parseInt(e.target.value) }))}
                            style={{ width: '100%', accentColor: '#ff4d4f' }}
                        />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'white', cursor: 'pointer', marginBottom: '16px' }}>
                        <input
                            type="checkbox"
                            checked={localConfig.runRagas}
                            onChange={e => setLocalConfig(c => ({ ...c, runRagas: e.target.checked }))}
                            style={{ accentColor: '#ff4d4f' }}
                        />
                        Run RAGAS (slower)
                    </label>
                </div>
            </div>

            {/* ─── Main ─── */}
            <div className="mc-main">
                <div className="mc-chat-window">

                    {/* Welcome Screen */}
                    {activeSession === null && messages.length === 0 && (
                        <div className="mc-welcome">
                            <div className="mc-welcome-logo">🏥</div>
                            <h1>Hello, I'm your MediRAG-Eval safety assistant.</h1>
                            <p>I can help you analyze medical information for safety and accuracy. What would you like to check today?</p>
                            <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                {INITIAL_TOPICS.map(t => (
                                    <button key={t} onClick={() => sendMessage(t)} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        color: 'rgba(255,255,255,0.7)',
                                        padding: '8px 16px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => { e.target.style.background = 'rgba(0,200,150,0.1)'; e.target.style.color = '#00C896'; e.target.style.borderColor = 'rgba(0,200,150,0.3)'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'rgba(255,255,255,0.7)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map(msg => (
                        <div key={msg.id} className={`mc-msg-row ${msg.role}`}>
                            {msg.role === 'user' ? (
                                <div>
                                    <div className="mc-msg-bubble">
                                        {msg.text}
                                    </div>
                                    <div className="mc-msg-meta">YOU • {formatTime(msg.id)}</div>
                                </div>
                            ) : (
                                <div>
                                    {msg.data && !msg.isError ? (
                                        <AIMessageCard msg={msg} />
                                    ) : (
                                        <div className="mc-msg-bubble" style={{
                                            background: msg.isError ? 'rgba(255,80,80,0.08)' : '#111827',
                                            border: `1px solid ${msg.isError ? 'rgba(255,80,80,0.2)' : 'rgba(0,200,150,0.15)'}`,
                                            borderRadius: '4px 16px 16px 16px'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}
                                    <div className="mc-msg-meta">MEDIRAG • {formatTime(msg.id)}</div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Thinking dots */}
                    {isThinking && (
                        <div className="mc-thinking">
                            <div className="mc-thinking-dots">
                                <span /><span /><span />
                            </div>
                            MediRAG is analyzing...
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* ─── Input Bar ─── */}
                <div className="mc-input-area">
                    <div className="mc-input-actions">
                        <input
                            type="file"
                            ref={pasteFileRef}
                            style={{ display: 'none' }}
                            accept=".pdf,.txt,.docx"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    setInput(prev => prev + `\n[Attached: ${e.target.files[0].name}]`);
                                }
                            }}
                        />
                        <button className="mc-action-chip" onClick={() => pasteFileRef.current?.click()}>
                            📋 PASTE HEALTH INFO
                        </button>
                        <button className="mc-action-chip" onClick={() => pasteFileRef.current?.click()}>
                            📎 UPLOAD LABS
                        </button>
                    </div>

                    <div className="mc-input-row">
                        <textarea
                            ref={inputRef}
                            className="mc-input-field"
                            placeholder="Ask a health question or paste a clinical summary..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            className="mc-send-btn"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isThinking}
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediChat;
