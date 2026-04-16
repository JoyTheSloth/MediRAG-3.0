import React, { useState, useEffect, useRef } from 'react';

const ProjectGuide = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am the MediRAG Project Guide. Ask me anything about our architecture, safety features, or implementation details.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // SYSTEM PROMPT: THE ENCYCLOPEDIA OF MEDIRAG 2.0
    const SYSTEM_PROMPT = `
    You are the "MediRAG project Guide", an expert AI assistant dedicated to explaining the MediRAG 2.0 ecosystem.
    
    PROJECT OVERVIEW:
    MediRAG 2.0 is a clinical-grade Retrieval-Augmented Generation (RAG) platform designed for healthcare. Its primary mission is "Safety Over Speed."

    CORE MODULES:
    1. RESEARCHER / AI TRAINER (THE LAB):
       - Features "Side-by-side A/B Prompt Testing" where researchers compare Persona A vs Persona B.
       - Uses RAGAS metrics (Faithfulness, Relevancy) and a proprietary "Health Risk Score" (HRS).
       - Supports custom System Prompt overrides for granular clinical tuning.

    2. MEDIAPI AGENT (TRAFFIC CONTROL):
       - A developer-centric middleware automation interface.
       - "Real-Time Traffic Control" visualization: Shows a live feed of API requests being sanitized, authorized, or blocked in real-time.
       - Rules-based safety engine (If-This-Then-That styles for clinical data).

    3. PATIENT EXPERIENCE:
       - A consumer-facing UI built with glassmorphism and focus on safe, grounded medical answers.

    4. GOVERNANCE & AUDIT:
       - Tracks every generation for hallucination detection and audit compliance.

    ADVANCED MIDDLEWARE FEATURES:
    - PRIVACY SHIELD: Automatic PHI (Protected Health Information) redaction.
    - CLINICAL CONSENSUS: A pipeline where multiple LLM nodes must agree on a medical fact before it reaches the user.
    - ENTITY VERIFIER: Cross-checks drug dosages and medication names against medical databases.

    TECH STACK:
    - Backend: FastAPI (Python)
    - Frontend: React with glassmorphic CSS
    - Vector Engine: ChromaDB / FAISS
    - LLMs supported: Gemini 2.0 Flash, Mistral, Groq (for speed)

    IDENTITY:
    Always be professional, concise, and highly informative about technical details. If asked about how to use a feature, explain it concisely.
    `;

    const GROQ_API_KEY = '';

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const endpoint = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/project-guide`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system_prompt: SYSTEM_PROMPT,
                    messages: [
                        ...messages.slice(1), // Remove the initial assistant greeting to prevent overlap if backend adds it
                        userMsg
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Backend error');
            }

            const data = await response.json();
            const aiMsg = { role: 'assistant', content: data.choices[0].message.content };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Groq Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to Groq. Please check your connection.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            {/* FLOATING BUTTON */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00C896, #4dabf7)',
                    border: 'none',
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0, 200, 150, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1) rotate(15deg)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0)'}
            >
                {isOpen ? '×' : '?'}
            </button>

            {/* CHAT WINDOW */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '380px',
                    height: '550px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                        .custom-scroll::-webkit-scrollbar { width: 4px; }
                        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                    `}</style>
                    
                    {/* Header */}
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '10px', height: '10px', background: '#00C896', borderRadius: '50%', boxShadow: '0 0 10px #00C896' }}></div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>MediRAG Project Guide</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Powered by Groq • Mixtral-8x7b</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="custom-scroll" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ 
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                background: msg.role === 'user' ? 'rgba(77, 171, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: msg.role === 'user' ? '#4dabf7' : 'rgba(255,255,255,0.9)',
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                border: `1px solid ${msg.role === 'user' ? 'rgba(77, 171, 247, 0.2)' : 'rgba(255,255,255,0.05)'}`
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '0 16px 16px 16px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div className="dot" style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                    <div className="dot" style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                                    <div className="dot" style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about MediRAG features..."
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    paddingRight: '46px',
                                    color: 'white',
                                    fontSize: '13px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(0, 200, 150, 0.4)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                            <button 
                                onClick={handleSendMessage}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#00C896',
                                    border: 'none',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectGuide;
