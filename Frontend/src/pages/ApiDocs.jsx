import React, { useEffect, useState, useRef } from 'react';
import './ApiDocs.css';

// All sections tracked by the scroll-spy
const NAV_SECTIONS = [
    { id: 'quickstart',       label: 'Quickstart',        group: 'intro' },
    { id: 'auth',             label: 'Authentication',    group: 'intro' },
    { id: 'rate-limits',      label: 'Rate Limits',       group: 'intro' },
    { id: 'post-query',       label: 'POST /query',       group: 'endpoints' },
    { id: 'post-evaluate',    label: 'POST /evaluate',    group: 'endpoints' },
    { id: 'get-metrics',      label: 'GET /metrics',      group: 'endpoints' },
    { id: 'metrics-explained',label: 'Metrics Explained', group: 'reference' },
    { id: 'risk-bands',       label: 'Risk Bands',        group: 'reference' },
    { id: 'error-codes',      label: 'Error Codes',       group: 'reference' },
    { id: 'performance',      label: 'Performance',       group: 'reference' },
];

const ApiDocs = () => {
    const [activeTab, setActiveTab] = useState('python');
    const [activeSection, setActiveSection] = useState('post-evaluate');
    const observerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Scroll-spy: watch all section anchors
    useEffect(() => {
        const sectionEls = NAV_SECTIONS
            .map(s => document.getElementById(s.id))
            .filter(Boolean);

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the topmost visible section
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                }
            },
            { rootMargin: '-80px 0px -50% 0px', threshold: 0 }
        );

        sectionEls.forEach(el => observerRef.current.observe(el));
        return () => observerRef.current?.disconnect();
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const linkClass = (id) => {
        if (id === 'post-evaluate') {
            return activeSection === id ? 'api-nav-link active-box' : 'api-nav-link';
        }
        return activeSection === id ? 'api-nav-link active' : 'api-nav-link';
    };

    return (
        <div className="api-page">
            <div className="api-layout">

                {/* --- LEFT SIDEBAR NAV --- */}
                <div className="api-sidebar">
                    <div className="api-nav-section">
                        <div className="api-nav-label">INTRODUCTION</div>
                        <button onClick={() => scrollTo('quickstart')} className={linkClass('quickstart')}>
                            <span className="api-nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                            Quickstart
                        </button>
                        <button onClick={() => scrollTo('auth')} className={linkClass('auth')}>
                            <span className="api-nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                            Authentication
                        </button>
                        <button onClick={() => scrollTo('rate-limits')} className={linkClass('rate-limits')}>
                            <span className="api-nav-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                            Rate Limits
                        </button>
                    </div>

                    <div className="api-nav-section">
                        <div className="api-nav-label">ENDPOINTS</div>
                        <button onClick={() => scrollTo('post-query')} className={linkClass('post-query')}>
                            POST /query
                            <span className="api-nav-badge" style={{background:'rgba(0,200,150,0.2)',color:'#00C896'}}>MAIN</span>
                        </button>
                        <button onClick={() => scrollTo('post-evaluate')} className={linkClass('post-evaluate')}>
                            POST /evaluate
                            <span className="api-nav-badge">V1</span>
                        </button>
                        <button onClick={() => scrollTo('get-metrics')} className={linkClass('get-metrics')}>GET /metrics</button>
                    </div>

                    <div className="api-nav-section">
                        <div className="api-nav-label">REFERENCE</div>
                        <button onClick={() => scrollTo('metrics-explained')} className={linkClass('metrics-explained')}>Metrics Explained</button>
                        <button onClick={() => scrollTo('risk-bands')} className={linkClass('risk-bands')}>Risk Bands</button>
                        <button onClick={() => scrollTo('error-codes')} className={linkClass('error-codes')}>Error Codes</button>
                        <button onClick={() => scrollTo('performance')} className={linkClass('performance')}>Performance</button>
                    </div>
                </div>

                {/* --- CENTER MAIN BODY --- */}
                <div className="api-main">

                    <div id="quickstart" style={{height:0, marginTop:'-1px'}}></div>

                    {/* POST /query — PRIMARY ENDPOINT */}
                    <div className="api-header" id="post-query">
                        <div className="api-title-row">
                            <span className="api-method-badge" style={{background:'rgba(0,200,150,0.2)',color:'#00C896',border:'1px solid rgba(0,200,150,0.3)'}}>POST</span>
                            <h1 className="api-title">/query</h1>
                        </div>
                        <p className="api-desc">
                            The primary endpoint used by the MediRAG Chat interface. Takes a user question, runs hybrid FAISS+BM25 retrieval from the medical dataset, generates an LLM answer, and runs the full safety evaluation pipeline — returning both the answer and all safety scores.
                        </p>
                        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', marginBottom: '8px'}}>
                            <div className="api-latency">
                                <span className="api-latency-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
                                BASE URL: <span className="api-latency-green">http://localhost:8000/query</span>
                            </div>
                        </div>
                    </div>

                    <div className="api-inner-grid">
                        <div>
                            <div className="api-section-title">Request Body — /query</div>
                            {[
                                ['question', 'STRING | REQUIRED', 'Natural language medical question from the user.'],
                                ['top_k', 'INT | OPTIONAL', 'Number of FAISS chunks to retrieve. Default: 5.'],
                                ['run_ragas', 'BOOL | OPTIONAL', 'Run RAGAS faithfulness/relevancy metrics (slower). Default: false.'],
                                ['llm_provider', 'STRING | OPTIONAL', '"gemini" or "ollama". Default: "gemini".'],
                                ['llm_model', 'STRING | OPTIONAL', 'Model name e.g. "gemini-2.5-flash-lite".'],
                                ['llm_api_key', 'STRING | OPTIONAL', 'Gemini API key. Falls back to server env.'],
                            ].map(([name, meta, desc]) => (
                                <div key={name} className="api-param-card">
                                    <div className="ap-header"><span className="ap-name">{name}</span><span className="ap-meta"><span className="req">{meta.split('|')[0]}</span>|{meta.split('|')[1]}</span></div>
                                    <div className="ap-desc">{desc}</div>
                                </div>
                            ))}

                            <div className="api-section-title" style={{marginTop:'24px', marginBottom:'16px'}}>Example Request — /query</div>
                            <div className="api-code-window" style={{marginBottom:'40px'}}>
                                <div className="ac-header"><span>REQUEST.JSON</span></div>
                                <div className="ac-body">
                                    <div className="ac-code-line"><span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">  <span className="sc-string">"question"</span>: <span className="sc-string-green">"What are the side effects of Metformin?"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"top_k"</span>: <span className="sc-num">5</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"run_ragas"</span>: <span className="sc-num">false</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"llm_provider"</span>: <span className="sc-string-green">"openai"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"llm_model"</span>: <span className="sc-string-green">"gpt-4o"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"llm_api_key"</span>: <span className="sc-string-green">"sk-..."</span></div>
                                    <div className="ac-code-line"><span className="sc-obj">{'}'}</span></div>
                                </div>
                            </div>
                            <p style={{fontSize:'12px', color:'var(--text-gray)', marginTop:'-24px', marginBottom:'40px'}}>
                                💡 <b>llm_provider</b> supports <code>openai</code>, <code>gemini</code>, or <code>ollama</code>. <b>llm_api_key</b> accepts any valid key for the chosen provider.
                            </p>
                        </div>

                        <div>
                            <div className="api-code-window">
                                <div className="ac-header" style={{background: '#161F32'}}>
                                    <span>RESPONSE JSON — /query</span>
                                    <div className="ac-mac-dots"><div className="ac-dot r"></div><div className="ac-dot y"></div><div className="ac-dot g"></div></div>
                                </div>
                                <div className="ac-body" style={{background: '#0c101c', fontSize:'11px'}}>
                                    <div className="ac-code-line"><span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">  <span className="sc-string">"generated_answer"</span>: <span className="sc-string-green">"Metformin commonly causes..."</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"hrs"</span>: <span className="sc-num">22</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"risk_band"</span>: <span className="sc-string-green">"LOW"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"composite_score"</span>: <span className="sc-num">0.91</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"intervention_applied"</span>: <span className="sc-num">false</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"retrieved_chunks"</span>: [<span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">    <span className="sc-string">"title"</span>: <span className="sc-string-green">"Metformin adverse effects — NEJM"</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"text"</span>: <span className="sc-string-green">"GI side effects are most common..."</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"similarity_score"</span>: <span className="sc-num">0.87</span></div>
                                    <div className="ac-code-line">  <span className="sc-obj">{'}'}</span>],</div>
                                    <div className="ac-code-line">  <span className="sc-string">"module_results"</span>: <span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">    <span className="sc-string">"faithfulness"</span>: <span className="sc-obj">{'{'}</span><span className="sc-string">"score"</span>: <span className="sc-num">0.94</span><span className="sc-obj">{'}'}</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"source_credibility"</span>: <span className="sc-obj">{'{'}</span><span className="sc-string">"score"</span>: <span className="sc-num">0.88</span><span className="sc-obj">{'}'}</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"contradiction"</span>: <span className="sc-obj">{'{'}</span><span className="sc-string">"score"</span>: <span className="sc-num">0.08</span><span className="sc-obj">{'}'}</span></div>
                                    <div className="ac-code-line">  <span className="sc-obj">{'}'}</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"total_pipeline_ms"</span>: <span className="sc-num">3241</span></div>
                                    <div className="ac-code-line"><span className="sc-obj">{'}'}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HORIZONTAL DIVIDER */}
                    <div style={{borderTop:'1px solid rgba(255,255,255,0.05)', margin:'40px 0'}}></div>

                    {/* POST /evaluate */}
                    <div className="api-header" id="post-evaluate">
                        <div className="api-title-row">
                            <span className="api-method-badge">POST</span>
                            <h1 className="api-title">/evaluate</h1>
                        </div>
                        <p className="api-desc">
                            Evaluate a pre-generated medical response (BYOA — bring your own answer). Use this when your app already has an LLM answer and retrieval context, and only needs the safety scoring layer.
                        </p>
                        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', marginBottom: '8px'}}>
                            <div className="api-latency">
                                <span className="api-latency-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
                                LATENCY: <span className="api-latency-green">&lt; 30s on CPU</span> | <span className="sc-obj">&lt; 10s on GPU</span>
                            </div>
                        </div>
                    </div>

                    <div className="api-inner-grid">

                        {/* LEFT INNER */}
                        <div>
                            {/* REQUEST BODY */}
                            <div className="api-section-title">Request Body</div>

                            <div className="api-param-card">
                                <div className="ap-header">
                                    <span className="ap-name">query</span>
                                    <span className="ap-meta"><span className="req">STRING | </span>REQUIRED</span>
                                </div>
                                <div className="ap-desc">The original user medical query to be evaluated against the retrieved context.</div>
                            </div>

                            <div className="api-param-card">
                                <div className="ap-header">
                                    <span className="ap-name">retrieved_chunks</span>
                                    <span className="ap-meta"><span className="req">ARRAY&lt;STRING&gt; | </span>REQUIRED</span>
                                </div>
                                <div className="ap-desc">Context chunks retrieved from your RAG system. Optimized for top-k = 5 retrieval for best accuracy.</div>
                            </div>

                            <div className="api-param-card" style={{marginBottom: '40px'}}>
                                <div className="ap-header">
                                    <span className="ap-name">generated_answer</span>
                                    <span className="ap-meta"><span className="req">STRING | </span>REQUIRED</span>
                                </div>
                                <div className="ap-desc">The LLM-generated clinical response to be evaluated for hallucination risk.</div>
                            </div>

                            {/* REQUEST EXAMPLE */}
                            <div className="api-section-title" style={{marginBottom: '16px'}}>Example Request</div>
                            <div className="api-code-window" style={{marginBottom: '40px'}}>
                                <div className="ac-header">
                                    <span>REQUEST.JSON</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </div>
                                <div className="ac-body">
                                    <div className="ac-code-line"><span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">  <span className="sc-string">"query"</span>: <span className="sc-string-green">"What is the recommended dosage of Metformin for type 2 diabetes?"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"retrieved_chunks"</span>: [</div>
                                    <div className="ac-code-line">    <span className="sc-string-green">"Metformin is typically initiated at 500 mg once daily."</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string-green">"The dose may be increased weekly based on tolerance."</span></div>
                                    <div className="ac-code-line">  ],</div>
                                    <div className="ac-code-line">  <span className="sc-string">"generated_answer"</span>: <span className="sc-string-green">"Metformin is usually started at 500 mg once daily and increased gradually."</span></div>
                                    <div className="ac-code-line"><span className="sc-obj">{'}'}</span></div>
                                </div>
                            </div>

                            {/* METRICS EXPLANATION */}
                            <div className="api-section-title" id="metrics-explained">Metrics Breakdown</div>
                            <div style={{marginBottom: '40px'}}>
                                {[
                                    { name: 'Faithfulness', desc: 'How well the generated answer aligns with the retrieved context chunks. Uses cross-encoder NLI scoring.', color: 'var(--green-accent)' },
                                    { name: 'Entity Accuracy', desc: 'Correctness of medical entities — drugs, dosages, conditions, procedures — compared to reference context.', color: '#00C2FF' },
                                    { name: 'Source Credibility', desc: 'Quality and authority of supporting sources across 5 credibility tiers (RCT → Grey Literature).', color: 'var(--amber-accent)' },
                                    { name: 'Contradiction Risk', desc: 'Detects internal inconsistency in the response. Lower is better. Scores above 0.4 trigger HIGH alert.', color: '#FF6B6B' },
                                ].map((m, i) => (
                                    <div key={i} className="api-param-card" style={{borderLeft: `3px solid ${m.color}`, marginBottom:'12px'}}>
                                        <div style={{fontFamily:'var(--font-mono)', color: m.color, fontSize:'13px', fontWeight:700, marginBottom:'8px'}}>{m.name}</div>
                                        <div className="ap-desc">{m.desc}</div>
                                    </div>
                                ))}
                            </div>

                            {/* RISK BANDS */}
                            <div className="api-section-title" id="risk-bands">Risk Bands (HRS: 0–100)</div>
                            <div className="api-code-window" style={{marginBottom:'40px'}}>
                                <div className="ac-header"><span>RISK BAND TABLE</span></div>
                                <div className="ac-body" style={{padding:'0'}}>
                                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font-mono)'}}>
                                        <thead>
                                            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.05)', background:'#0c101c'}}>
                                                <th style={{padding:'12px 20px', textAlign:'left', color:'var(--text-gray)', fontWeight:600}}>SCORE RANGE</th>
                                                <th style={{padding:'12px 20px', textAlign:'left', color:'var(--text-gray)', fontWeight:600}}>LABEL</th>
                                                <th style={{padding:'12px 20px', textAlign:'left', color:'var(--text-gray)', fontWeight:600}}>INTERPRETATION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                                                <td style={{padding:'12px 20px', color:'var(--green-accent)'}}>0 – 30</td>
                                                <td style={{padding:'12px 20px'}}><span style={{background:'rgba(0,200,150,0.1)', color:'var(--green-accent)', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>LOW RISK</span></td>
                                                <td style={{padding:'12px 20px', color:'var(--text-gray)'}}>Clinically safe output</td>
                                            </tr>
                                            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                                                <td style={{padding:'12px 20px', color:'var(--amber-accent)'}}>31 – 60</td>
                                                <td style={{padding:'12px 20px'}}><span style={{background:'rgba(245,166,35,0.1)', color:'var(--amber-accent)', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>MODERATE RISK</span></td>
                                                <td style={{padding:'12px 20px', color:'var(--text-gray)'}}>Review recommended</td>
                                            </tr>
                                            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                                                <td style={{padding:'12px 20px', color:'#F97316'}}>61 – 85</td>
                                                <td style={{padding:'12px 20px'}}><span style={{background:'rgba(249,115,22,0.1)', color:'#F97316', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>HIGH RISK</span></td>
                                                <td style={{padding:'12px 20px', color:'var(--text-gray)'}}>Clinical verification required</td>
                                            </tr>
                                            <tr>
                                                <td style={{padding:'12px 20px', color:'#FF6B6B'}}>86 – 100</td>
                                                <td style={{padding:'12px 20px'}}><span style={{background:'rgba(239,68,68,0.1)', color:'#FF6B6B', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>CRITICAL RISK</span></td>
                                                <td style={{padding:'12px 20px', color:'var(--text-gray)'}}>Do not use — escalate immediately</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SDK USAGE — TABBED */}
                            <div className="api-section-title orange">SDK Usage</div>
                            <div className="api-code-window" style={{marginBottom: '40px'}}>
                                <div className="ac-header" style={{padding:0, display:'block'}}>
                                    <div style={{display:'flex', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                        {['python', 'curl', 'javascript'].map(t => (
                                            <button key={t} onClick={() => setActiveTab(t)} style={{background: activeTab===t ? '#1B2433' : 'transparent', border:'none', color: activeTab===t ? 'var(--text-white)' : 'var(--text-gray)', padding:'10px 20px', fontSize:'11px', fontFamily:'var(--font-mono)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom: activeTab===t ? '2px solid var(--green-accent)' : '2px solid transparent'}}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {activeTab === 'python' && (
                                    <div className="ac-body">
                                        <div className="ac-code-line"><span className="sc-keyword">import</span> requests</div>
                                        <br/>
                                        <div className="ac-code-line">url <span className="sc-keyword">=</span> <span className="sc-string-green">"http://localhost:8000/query"</span></div>
                                        <br/>
                                        <div className="ac-code-line">payload <span className="sc-keyword">=</span> <span className="sc-obj">{'{'}</span></div>
                                        <div className="ac-code-line">    <span className="sc-string">"question"</span>: <span className="sc-string-green">"Side effects of Metformin?"</span>,</div>
                                        <div className="ac-code-line">    <span className="sc-string">"top_k"</span>: <span className="sc-num">5</span>,</div>
                                        <div className="ac-code-line">    <span className="sc-string">"llm_provider"</span>: <span className="sc-string-green">"gemini"</span>,</div>
                                        <div className="ac-code-line">    <span className="sc-string">"llm_api_key"</span>: <span className="sc-string-green">"AIza..."</span></div>
                                        <div className="ac-code-line"><span className="sc-obj">{'}'}</span></div>
                                        <br/>
                                        <div className="ac-code-line">response <span className="sc-keyword">=</span> requests.<span className="sc-func">post</span>(url, json=payload)</div>
                                        <div className="ac-code-line"><span className="sc-func">print</span>(response.<span className="sc-func">json</span>())</div>
                                    </div>
                                )}

                                {activeTab === 'curl' && (
                                    <div className="ac-body">
                                        <div className="ac-code-line"><span className="sc-func">curl</span> -X POST http://localhost:8000/evaluate \</div>
                                        <div className="ac-code-line">  -H <span className="sc-string-green">"Content-Type: application/json"</span> \</div>
                                        <div className="ac-code-line">  -d <span className="sc-string-green">'{`{`}</span></div>
                                        <div className="ac-code-line"><span className="sc-string-green">    "query": "Dosage for Metformin?",</span></div>
                                        <div className="ac-code-line"><span className="sc-string-green">    "retrieved_chunks": ["Metformin initial dose is 500 mg"],</span></div>
                                        <div className="ac-code-line"><span className="sc-string-green">    "generated_answer": "Start with 500 mg daily"</span></div>
                                        <div className="ac-code-line"><span className="sc-string-green">  {`}`}'</span></div>
                                    </div>
                                )}

                                {activeTab === 'javascript' && (
                                    <div className="ac-body">
                                        <div className="ac-code-line"><span className="sc-func">fetch</span>(<span className="sc-string-green">"http://localhost:8000/evaluate"</span>, <span className="sc-obj">{'{'}</span></div>
                                        <div className="ac-code-line">  method: <span className="sc-string-green">"POST"</span>,</div>
                                        <div className="ac-code-line">  headers: <span className="sc-obj">{'{'}</span> <span className="sc-string">"Content-Type"</span>: <span className="sc-string-green">"application/json"</span> <span className="sc-obj">{'}'}</span>,</div>
                                        <div className="ac-code-line">  body: <span className="sc-func">JSON.stringify</span>(<span className="sc-obj">{'{'}</span></div>
                                        <div className="ac-code-line">    query: <span className="sc-string-green">"Dosage for Metformin?"</span>,</div>
                                        <div className="ac-code-line">    retrieved_chunks: [<span className="sc-string-green">"Metformin initial dose is 500 mg"</span>],</div>
                                        <div className="ac-code-line">    generated_answer: <span className="sc-string-green">"Start with 500 mg daily"</span></div>
                                        <div className="ac-code-line">  <span className="sc-obj">{'}'}</span>)</div>
                                        <div className="ac-code-line"><span className="sc-obj">{'}'}</span>)</div>
                                        <div className="ac-code-line">.<span className="sc-func">then</span>(res <span className="sc-keyword">=&gt;</span> res.<span className="sc-func">json</span>())</div>
                                        <div className="ac-code-line">.<span className="sc-func">then</span>(data <span className="sc-keyword">=&gt;</span> console.<span className="sc-func">log</span>(data));</div>
                                    </div>
                                )}
                            </div>

                            {/* PERFORMANCE */}
                            <div id="get-metrics" style={{height:0}}></div>
                            <div id="post-batch" style={{height:0}}></div>
                            <div className="api-section-title" id="performance">Performance</div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'40px'}}>
                                {[
                                    { label:'CPU Latency', val:'< 30s', sub:'Standard evaluation' },
                                    { label:'GPU Latency', val:'< 10s', sub:'With CUDA acceleration' },
                                    { label:'Top-K Retrieval', val:'5 chunks', sub:'Optimal context window' },
                                ].map((p, i) => (
                                    <div key={i} style={{background:'#111827', border:'1px solid rgba(255,255,255,0.03)', borderRadius:'var(--radius-sm)', padding:'16px'}}>
                                        <div style={{fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-gray)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.1em'}}>{p.label}</div>
                                        <div style={{fontSize:'20px', fontWeight:800, color:'var(--green-accent)', marginBottom:'4px'}}>{p.val}</div>
                                        <div style={{fontSize:'11px', color:'var(--text-gray)'}}>{p.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* NOTES */}
                            <div style={{background:'rgba(0,200,150,0.03)', border:'1px solid rgba(0,200,150,0.1)', borderRadius:'var(--radius-sm)', padding:'24px', marginBottom:'40px'}}>
                                <div style={{fontSize:'11px', fontWeight:700, color:'var(--green-accent)', letterSpacing:'0.1em', marginBottom:'12px'}}>IMPORTANT NOTES</div>
                                <ul style={{margin:0, padding:'0 0 0 20px', color:'var(--text-gray-light)', fontSize:'13px', lineHeight:2}}>
                                    <li>This API is for <strong>evaluation only</strong>, not medical advice</li>
                                    <li>Works with any RAG-based medical QA system</li>
                                    <li>All scores are normalized between <strong>0.0 – 1.0</strong> before aggregation</li>
                                </ul>
                                <div style={{marginTop:'16px', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'16px', fontStyle:'italic', color:'var(--green-accent)', fontSize:'13px'}}>
                                    "Making AI in healthcare safer, one evaluation at a time."
                                </div>
                            </div>
                        </div>

                        {/* RIGHT INNER */}
                        <div>
                            <div className="api-code-window">
                                <div className="ac-header" style={{background: '#161F32'}}>
                                    <span>RESPONSE JSON</span>
                                    <div className="ac-mac-dots">
                                        <div className="ac-dot r"></div>
                                        <div className="ac-dot y"></div>
                                        <div className="ac-dot g"></div>
                                    </div>
                                </div>
                                <div className="ac-body" style={{background: '#0c101c', fontSize:'11px'}}>
                                    <div className="ac-code-line"><span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">  <span className="sc-string">"hallucination_risk_score"</span>: <span className="sc-num">24</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"risk_band"</span>: <span className="sc-string-green">"LOW RISK"</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"faithfulness"</span>: <span className="sc-num">0.92</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"entity_accuracy"</span>: <span className="sc-num">0.88</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"source_credibility"</span>: <span className="sc-num">0.85</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"contradiction_risk"</span>: <span className="sc-num">0.10</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"clause_annotations"</span>: [<span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">    <span className="sc-string">"claim"</span>: <span className="sc-string-green">"Metformin at 500mg once daily"</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"status"</span>: <span className="sc-string-green">"ENTAILED"</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"severity"</span>: <span className="sc-string-green">"NONE"</span></div>
                                    <div className="ac-code-line">  <span className="sc-obj">{'}'}</span>],</div>
                                    <div className="ac-code-line">  <span className="sc-string">"flagged_entities"</span>: [],</div>
                                    <div className="ac-code-line">  <span className="sc-string">"source_tiers"</span>: [<span className="sc-string-green">"Tier 2"</span>, <span className="sc-string-green">"Tier 1"</span>],</div>
                                    <div className="ac-code-line">  <span className="sc-string">"ragas_scores"</span>: <span className="sc-obj">{'{'}</span></div>
                                    <div className="ac-code-line">    <span className="sc-string">"faithfulness"</span>: <span className="sc-num">0.90</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"answer_relevancy"</span>: <span className="sc-num">0.93</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"context_precision"</span>: <span className="sc-num">0.88</span>,</div>
                                    <div className="ac-code-line">    <span className="sc-string">"context_recall"</span>: <span className="sc-num">0.85</span></div>
                                    <div className="ac-code-line">  <span className="sc-obj">{'}'}</span>,</div>
                                    <div className="ac-code-line">  <span className="sc-string">"latency_ms"</span>: <span className="sc-num">4502</span></div>
                                    <div className="ac-code-line"><span className="sc-obj">{'}'}</span></div>
                                </div>
                            </div>

                            {/* ERROR CODES */}
                            <div className="api-code-window" style={{marginTop: '24px'}}>
                                <div className="ac-header" id="error-codes"><span>ERROR CODES</span></div>
                                <div className="ac-body" style={{padding:0}}>
                                    <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font-mono)'}}>
                                        <tbody>
                                            {[
                                                { code:'400', msg:'Invalid request format', color:'rgba(239,68,68,0.2)', textColor:'#FF6B6B' },
                                                { code:'422', msg:'Missing required fields', color:'rgba(255,255,255,0.05)', textColor:'var(--text-gray-light)' },
                                                { code:'429', msg:'Rate limit reached', color:'rgba(255,255,255,0.05)', textColor:'var(--text-gray-light)' },
                                                { code:'500', msg:'Internal evaluation error', color:'rgba(239,68,68,0.15)', textColor:'#FF6B6B' },
                                            ].map((e,i) => (
                                                <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                                                    <td style={{padding:'12px 16px', width:'60px'}}>
                                                        <span style={{background: e.color, color: e.textColor, padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:700}}>{e.code}</span>
                                                    </td>
                                                    <td style={{padding:'12px 16px', color:'var(--text-gray-light)'}}>{e.msg}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* DOWNLOAD CARDS */}
                            <div className="api-dl-cards" style={{marginTop:'24px'}}>
                                <div className="api-dl-card">
                                    <div className="dl-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                                    <div><div className="dl-text-title">API spec</div><div className="dl-text-sub">OpenAPI 3.1</div></div>
                                </div>
                                <div className="api-dl-card">
                                    <div className="dl-icon blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg></div>
                                    <div><div className="dl-text-title">Postman</div><div className="dl-text-sub">Collection V2</div></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- RIGHT CONFIG SIDEBAR --- */}
                <div className="api-config">
                    <div className="config-block">
                        <div className="cb-head">CONFIGURATION</div>

                        <div className="cb-item">
                            <div className="cb-item-title" id="auth">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Authentication
                            </div>
                            <div className="cb-item-desc">
                                Include your API Key in the <span className="cb-code-inline">Authorization</span> header as a Bearer token.
                            </div>
                        </div>

                        <div className="cb-item" id="rate-limits">
                            <div className="cb-item-title">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Rate Limits
                            </div>
                            <div className="cb-item-desc">
                                Tier 1: 100 req/min. Higher limits available for institutional partners.
                            </div>
                        </div>
                    </div>

                    <div className="config-block">
                        <div className="cb-head">QUICK REFERENCE</div>
                        <div className="cb-item">
                            <div className="cb-item-desc" style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', paddingBottom:'8px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                    <span style={{color:'var(--text-gray)'}}>Method</span><span className="cb-code-inline">POST</span>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', paddingBottom:'8px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                    <span style={{color:'var(--text-gray)'}}>Base URL</span><span style={{fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--green-accent)'}}>:8000</span>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', paddingBottom:'8px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                    <span style={{color:'var(--text-gray)'}}>Content-Type</span><span style={{fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-gray-light)'}}>application/json</span>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px'}}>
                                    <span style={{color:'var(--text-gray)'}}>Version</span><span className="api-nav-badge" style={{fontSize:'9px', padding:'2px 6px'}}>V1 STABLE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="config-block">
                        <div className="cb-head">CHANGELOG</div>
                        <div className="timeline">
                            <div className="tl-item active">
                                <div className="tl-title">MAR 2026 — V2.4</div>
                                <div className="tl-desc">MediRAG Chat page added (/chat) with HRS gauge, source citations, session history, and Evaluation Engine sidebar.</div>
                            </div>
                            <div className="tl-item">
                                <div className="tl-title">MAR 2026 — V2.0</div>
                                <div className="tl-desc">Full React frontend + FastAPI backend integration. Lazy-loading for all NLP dependencies. Graceful degradation stubs.</div>
                            </div>
                            <div className="tl-item">
                                <div className="tl-title">JAN 2026 — V1.5</div>
                                <div className="tl-desc">AI Governance dashboard with audit log, compliance report, and regulatory drawer.</div>
                            </div>
                            <div className="tl-item">
                                <div className="tl-title">NOV 2025 — V1.2</div>
                                <div className="tl-desc">RAGAS integration for faithfulness + relevancy scoring.</div>
                            </div>
                            <div className="tl-item">
                                <div className="tl-title">SEP 2025 — V1.0</div>
                                <div className="tl-desc">Initial release with HRS scoring + source credibility tiers.</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ApiDocs;
