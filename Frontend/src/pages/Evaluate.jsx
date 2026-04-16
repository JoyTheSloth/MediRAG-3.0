import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Evaluate.css';
import ApiKeyModal from '../components/ApiKeyModal';

// Extracted so useState is legal (Rules of Hooks: no hooks inside loops/maps)
const SourceChunkCard = ({ chk, i, chunkDetails }) => {
    const [expanded, setExpanded] = useState(false);
    const score = chk.similarity_score ?? 0;
    const scoreColor = score > 0.5 ? '#00C896' : score > 0.2 ? '#F5A623' : 'rgba(255,255,255,0.4)';
    const tier = chunkDetails?.tier;
    const tierColor = tier === 1 ? '#00C896' : tier === 2 ? '#4dabf7' : tier === 3 ? '#F5A623' : 'rgba(255,255,255,0.3)';
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${scoreColor}30`,
            borderLeft: `3px solid ${scoreColor}`,
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                        {chk.title || chk.source || `Source ${i + 1}`}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {chk.pub_type && (
                            <span style={{ fontSize: '10px', background: 'rgba(77,171,247,0.12)', color: '#4dabf7', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                                {chk.pub_type.replace(/_/g, ' ').toUpperCase()}
                            </span>
                        )}
                        {chk.source && chk.source !== chk.title && (
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                                {chk.source}
                            </span>
                        )}
                        {chk.pub_year && (
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                                {chk.pub_year}
                            </span>
                        )}
                        {chk.chunk_id && (
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                                ID:{chk.chunk_id.slice(0, 8)}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: scoreColor, background: `${scoreColor}15`, padding: '3px 10px', borderRadius: '10px' }}>
                        {(score * 100).toFixed(1)}% match
                    </span>
                    {tier && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: tierColor, border: `1px solid ${tierColor}`, padding: '2px 8px', borderRadius: '4px' }}>
                            TIER {tier}
                        </span>
                    )}
                </div>
            </div>
            <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '12px' }}>
                <div style={{ height: '100%', width: `${score * 100}%`, background: scoreColor, borderRadius: '3px', transition: 'width 0.8s ease-out' }}></div>
            </div>
            {chk.text && (
                <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                        {expanded ? chk.text : chk.text.slice(0, 280) + (chk.text.length > 280 ? '...' : '')}
                    </div>
                    {chk.text.length > 280 && (
                        <button
                            onClick={() => setExpanded(e => !e)}
                            style={{ marginTop: '8px', background: 'none', border: 'none', color: '#00C896', fontSize: '11px', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                        >
                            {expanded ? '▲ Show less' : '▼ Show full text'}
                        </button>
                    )}
                </div>
            )}
            {chunkDetails && Object.keys(chunkDetails).length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {chunkDetails.tier_score !== undefined && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Tier score: <strong style={{color:'rgba(255,255,255,0.7)'}}>{chunkDetails.tier_score?.toFixed(3)}</strong></span>
                    )}
                    {chunkDetails.nli_score !== undefined && (
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>NLI: <strong style={{color:'rgba(255,255,255,0.7)'}}>{chunkDetails.nli_score?.toFixed(3)}</strong></span>
                    )}
                </div>
            )}
        </div>
    );
};


const Evaluate = ({ embedded = false, mode = 'researcher', engineConfig, setEngineConfig }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState(location.state?.defaultView || 'form');
    const [evalTab, setEvalTab] = useState('single'); // 'single', 'batch', 'config'
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Form states
    const [query, setQuery] = useState('');
    const [context, setContext] = useState('');
    const [answer, setAnswer] = useState('');

    // A/B Testing States
    const [isABMode, setIsABMode] = useState(false);
    const [promptA, setPromptA] = useState('You are a concise medical assistant. Answer ONLY using the context.');
    const [promptB, setPromptB] = useState('You are an expert clinical oncologist. Provide a detailed analysis based on the context and cite all sources.');
    const [resultA, setResultA] = useState(null);
    const [resultB, setResultB] = useState(null);

    const SAMPLES = {
        nsclc: {
            q: "What are the standard treatment protocols for stage II non-small cell lung cancer?",
            c: "NCCAP Guidelines 2023 (Chunk [01]): Stage II NSCLC — surgical resection (lobectomy preferred). Adjuvant cisplatin-based chemotherapy post-resection. PORT (post-operative radiotherapy) for margin-positive cases only.",
            a: "Stage II non-small cell lung cancer is typically treated with surgery followed by adjuvant chemotherapy. Immunotherapy such as pembrolizumab may also be used in combination with chemotherapy. Radiation can be given if surgery is not possible."
        },
        metformin: {
            q: "What is the recommended starting dose for Metformin in adults with type 2 diabetes?",
            c: "ADA Standards 2024: Metformin is the preferred initial pharmacologic agent for the treatment of type 2 diabetes. Start with 500 mg once or twice daily with meals to reduce GI side effects.",
            a: "The standard starting dose is 500 mg once or twice daily with meals."
        }
    };

    const loadSample = (key) => {
        const s = SAMPLES[key];
        if (s) {
            setQuery(s.q);
            setContext(s.c);
            setAnswer(s.a);
        }
    };

    // Metadata based on mode
    const modeConfig = {
        researcher: { title: 'Expert Model Auditing', sub: 'Hallucination Detection for Medical AI', time: 'Dynamic based on model' },
        patient: { title: 'Check AI Medical Advice', sub: 'Verify health advice against trusted medical literature', time: 'Dynamic based on model' },
        governance: { title: 'System-wide Hallucination Audit', sub: 'Compliance-grade verification for clinical safe deployment', time: 'Scaling based on batch size' },
    };

    const currentMode = modeConfig[mode] || modeConfig.researcher;

    useEffect(() => {
        if (!embedded) window.scrollTo(0, 0);
    }, [view, embedded, evalTab]);

    useEffect(() => {
        if (location.state?.defaultView) {
            setView(location.state.defaultView);
        }
    }, [location.state]);

    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleEvaluate = () => {
        if (!engineConfig?.apiKey) {
            setIsApiModalOpen(true);
            return;
        }
        if (isABMode) {
            executeABTest();
        } else {
            executeEvaluationJob();
        }
    };

    const executeABTest = async () => {
        setIsAnalyzing(true);
        setErrorMsg('');
        setResultA(null);
        setResultB(null);
        setView('ab-report');

        try {
            // Run both in parallel
            const [dataA, dataB] = await Promise.all([
                executeSingleQuery(promptA),
                executeSingleQuery(promptB)
            ]);
            setResultA(dataA);
            setResultB(dataB);
        } catch (e) {
            console.error(e);
            setErrorMsg(e.message);
            setView('form');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const executeSingleQuery = async (sysPrompt) => {
        const endpoint = `${engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/query`;
        const payload = {
            question: query,
            top_k: engineConfig?.topK || 5,
            run_ragas: true, // Always run RAGAS for A/B tests to see quality
            llm_provider: engineConfig?.provider ? engineConfig.provider.toLowerCase() : 'gemini',
            llm_model: engineConfig?.model || 'gemini-2.0-flash',
            llm_api_key: engineConfig?.apiKey || '',
            system_prompt: sysPrompt
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.detail || `API Error: ${res.status}`);
        }
        return await res.json();
    };

    const executeEvaluationJob = async (overrideKey = null) => {
        setIsAnalyzing(true);
        setErrorMsg('');
        setResultData(null);
        
        try {
            let endpoint = `${engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/query`;
            let payload = {
                question: query,
                top_k: engineConfig?.topK || 5,
                run_ragas: engineConfig?.runRagas || false,
                llm_provider: engineConfig?.provider ? engineConfig.provider.toLowerCase() : 'gemini',
                llm_model: engineConfig?.model || 'gemini-2.5-flash-lite',
                llm_api_key: overrideKey || engineConfig?.apiKey || ''
            };

            if (context && answer) {
                endpoint = `${engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/evaluate`;
                const chunkTexts = context.split('\n\n').map(c => c.trim()).filter(Boolean);
                payload = {
                    question: query,
                    answer: answer,
                    context_chunks: chunkTexts.length ? chunkTexts.map(t => ({ text: t })) : [{ text: 'empty context chunk provided' }],
                    run_ragas: engineConfig?.runRagas || false,
                    llm_provider: engineConfig?.provider ? engineConfig.provider.toLowerCase() : 'gemini',
                    llm_model: engineConfig?.model || 'gemini-2.5-flash-lite',
                    llm_api_key: overrideKey || engineConfig?.apiKey || ''
                };
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.detail || `API Error: ${res.status}`);
            }

            const data = await res.json();
            setResultData(data);
            setView('report');
        } catch (e) {
            console.error(e);
            setErrorMsg(e.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const exportToJson = () => {
        if (!resultData) return;
        const exportPayload = {
            exported_at: new Date().toISOString(),
            query,
            generated_answer: resultData.generated_answer || answer,
            hrs: resultData.hrs,
            composite_score: resultData.composite_score,
            risk_band: resultData.risk_band,
            confidence_level: resultData.confidence_level,
            intervention_applied: resultData.intervention_applied,
            intervention_reason: resultData.intervention_reason || null,
            total_pipeline_ms: resultData.total_pipeline_ms,
            module_results: resultData.module_results,
            retrieved_sources: (resultData.retrieved_chunks || []).map(c => ({
                chunk_id: c.chunk_id,
                title: c.title,
                source: c.source,
                pub_type: c.pub_type,
                pub_year: c.pub_year,
                similarity_score: c.similarity_score,
                text_snippet: c.text?.slice(0, 500)
            })),
            llm_config: {
                provider: engineConfig?.provider,
                model: engineConfig?.model
            }
        };
        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medirag_audit_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const renderResearcherHeader = () => {
        if (mode !== 'researcher') return null;
        return (
            <div className="res-top-bar">
                <div className="res-brand-block">
                    <button className="res-hamburger" onClick={() => setIsSidebarOpen(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="res-brand-name">MediRAG-Eval</span>
                    <span className="res-mode-pill">Researcher mode</span>
                </div>
                
                {isSidebarOpen && <div className="res-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
                
                <div className={`res-tabs ${isSidebarOpen ? 'open' : ''}`}>
                    <button className="res-tabs-close" onClick={() => setIsSidebarOpen(false)}>✕</button>
                    <div className="res-tabs-title">Evaluator Menu</div>
                    <button className={`res-tab-btn ${evalTab === 'single' ? 'active' : ''}`} onClick={() => { setEvalTab('single'); setIsSidebarOpen(false); }}>Single eval</button>
                    <button className={`res-tab-btn ${evalTab === 'batch' ? 'active' : ''}`} onClick={() => { setEvalTab('batch'); setIsSidebarOpen(false); }}>Batch eval</button>
                    <button className={`res-tab-btn ${evalTab === 'config' ? 'active' : ''}`} onClick={() => { setEvalTab('config'); setIsSidebarOpen(false); }}>Config</button>
                </div>
            </div>
        );
    };

    const evalContent = (
        <div className={`eval-container ${embedded ? 'embedded' : ''}`}>
            {renderResearcherHeader()}

            {view === 'form' && (
                <>
                    {evalTab === 'single' && (
                        <div className="ab-prompt-fullwidth" style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label className="form-label" style={{ color: '#00C896', marginBottom: '4px' }}>Side-by-Side Prompt Engineering</label>
                                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.5 }}>Test different clinical personas or instructions against the same query</p>
                                </div>
                                <div 
                                    onClick={() => setIsABMode(!isABMode)}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        background: isABMode ? '#00C896' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: '0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '2px',
                                        left: isABMode ? '22px' : '2px',
                                        transition: '0.3s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}></div>
                                </div>
                            </div>
                            
                            {isABMode && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', animation: 'fadeIn 0.4s ease-out' }}>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '10px', opacity: 0.6, marginBottom: '8px', display: 'block' }}>SYSTEM PROMPT A // EXPERIMENT CONTROL</label>
                                        <textarea 
                                            className="form-textarea" 
                                            style={{ height: '120px', width: '100%', fontSize: '13px', padding: '16px', background: 'rgba(15, 23, 42, 0.4)' }}
                                            value={promptA}
                                            onChange={(e) => setPromptA(e.target.value)}
                                            placeholder="Enter first persona instructions..."
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontSize: '10px', opacity: 0.6, marginBottom: '8px', display: 'block' }}>SYSTEM PROMPT B // EXPERIMENT VARIANT</label>
                                        <textarea 
                                            className="form-textarea" 
                                            style={{ height: '120px', width: '100%', fontSize: '13px', padding: '16px', background: 'rgba(15, 23, 42, 0.4)' }}
                                            value={promptB}
                                            onChange={(e) => setPromptB(e.target.value)}
                                            placeholder="Enter second persona instructions..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {evalTab === 'single' && (
                        <div className="eval-split">
                            <div className="eval-form-col">
                                {mode === 'researcher' && (
                                    <div className="sample-row">
                                        <span className="sample-lbl">Load sample:</span>
                                        <button className={`sample-btn ${query.includes('NSCLC') ? 'active' : ''}`} onClick={() => loadSample('nsclc')}>NSCLC protocol</button>
                                        <button className={`sample-btn ${query.includes('Metformin') ? 'active' : ''}`} onClick={() => loadSample('metformin')}>Metformin dose</button>
                                    </div>
                                )}
                                
                                {mode !== 'researcher' && (
                                    <div className="eval-header-simple">
                                        <h1>{currentMode.title}</h1>
                                        <p>{currentMode.sub}</p>
                                    </div>
                                )}

                                {errorMsg && (
                                    <div style={{ padding: '12px', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #FF6B6B', color: '#FF6B6B', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                                        <strong>Error:</strong> {errorMsg}
                                    </div>
                                )}


                                <div className="form-group">
                                    <label className="form-label">USER QUERY</label>
                                    <textarea 
                                        className="form-textarea short" 
                                        placeholder="e.g., What are the standard treatment protocols for stage II non-small cell lung cancer?"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        disabled={isAnalyzing}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                                        <label className="form-label">RETRIEVED CONTEXT CHUNKS (Optional)</label>
                                        <span className="chunk-count">{context ? context.split('\n\n').filter(Boolean).length : 0} CHUNKS</span>
                                    </div>
                                    <textarea 
                                        className="form-textarea tall" 
                                        placeholder="Leave empty to retrieve from FAISS, or paste chunks separated by blank lines."
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        disabled={isAnalyzing}
                                    ></textarea>
                                </div>

                                {!isABMode && (
                                    <div className="form-group">
                                        <label className="form-label">GENERATED ANSWER TO AUDIT (Optional)</label>
                                        <textarea 
                                            className="form-textarea med" 
                                            placeholder="Leave empty to generate with LLM, or paste the AI's response..."
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            disabled={isAnalyzing}
                                        ></textarea>
                                    </div>
                                )}

                                <div className="form-actions-row">
                                    <div className="btn-group-row">
                                        <button className="eval-btn-primary" onClick={handleEvaluate} disabled={isAnalyzing || !query.trim()}>
                                            {isAnalyzing ? 'ANALYZING...' : 'Run evaluation'}
                                        </button>
                                        <button className="eval-btn-secondary" onClick={() => { setQuery(''); setContext(''); setAnswer(''); setErrorMsg(''); }}>Clear</button>
                                    </div>
                                    <span className="resp-time">{currentMode.time}</span>
                                </div>
                            </div>

                            <div className={`realtime-panel-res ${isAnalyzing ? 'is-analyzing' : ''}`}>
                                {!isAnalyzing ? (
                                    <div className="empty-state-res">
                                        <div className="empty-icon-link">⚯</div>
                                        <p>Run an evaluation to see results</p>
                                    </div>
                                ) : (
                                    <div className="evaluating-state-res">
                                        <div className="telemetry-dot-res pulse"></div>
                                        <span>SCANNING PIPELINE...</span>
                                        <div style={{marginTop:'40px', width:'100%', opacity:0.5}}>
                                            <div className="res-mini-bar"></div>
                                            <div className="res-mini-bar" style={{width:'60%'}}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {evalTab === 'batch' && (
                        <div className="batch-view">
                            <div className="batch-header-box">
                                <p className="batch-desc">Evaluate multiple query-context-answer triples at once. Each row is an independent evaluation job.</p>
                                <button className="run-all-btn">Run all jobs</button>
                            </div>
                            <div className="batch-queue-box">
                                <div className="bq-label">Batch queue — 4 preloaded evaluation jobs</div>
                                {[
                                    'Stage II NSCLC treatment?',
                                    'Metformin starting dose?',
                                    'Warfarin + ibuprofen?',
                                    'Pediatric paracetamol dose?'
                                ].map((job, idx) => (
                                    <div key={idx} className="bq-row">
                                        <span className="bq-id">JOB-0{idx+1}</span>
                                        <span className="bq-title">{job}</span>
                                        <span className="bq-status">queued</span>
                                    </div>
                                ))}
                            </div>
                            <div className="results-placeholder">
                                <h3 className="section-title-small">Results</h3>
                            </div>
                        </div>
                    )}

                    {evalTab === 'config' && (
                        <div className="config-view">
                            <div className="config-grid">
                                <div className="config-col">
                                    <h3 className="config-title">Metric weights</h3>
                                    <p className="config-desc">Adjust how much each sub-metric contributes to the final HRS. Weights are normalised automatically.</p>
                                    
                                    <div className="weight-slider-group">
                                        {[
                                            { label: 'Faithfulness [NLI]', val: '40%' },
                                            { label: 'Entities [NER]', val: '20%' },
                                            { label: 'Sources [TIER]', val: '25%' },
                                            { label: 'Logic [NLI]', val: '15%' }
                                        ].map((w, idx) => (
                                            <div key={idx} className="weight-line">
                                                <span className="w-lbl">{w.label}</span>
                                                <div className="w-track">
                                                    <div className="w-thumb" style={{left: w.val}}></div>
                                                </div>
                                                <span className="w-val-num">{w.val}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 className="config-title" style={{marginTop:'40px'}}>Risk thresholds</h3>
                                    <div className="threshold-inputs">
                                        <div className="t-box">
                                            <label className="t-lbl">HIGH RISK ABOVE</label>
                                            <input type="text" className="t-input-res" defaultValue="70" />
                                        </div>
                                        <div className="t-box">
                                            <label className="t-lbl">MEDIUM RISK ABOVE</label>
                                            <input type="text" className="t-input-res" defaultValue="40" />
                                        </div>
                                    </div>

                                    <h3 className="config-title" style={{marginTop:'40px'}}>Pipeline mode</h3>
                                    <div className="pipeline-checks-res">
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable SciSpaCy NER entity check</label>
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable source evidence tier scoring</label>
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable logical contradiction detection</label>
                                        <label className="p-check-res"><input type="checkbox" /> Sentence-level claim decomposition (slower)</label>
                                    </div>
                                </div>

                                <div className="config-col">
                                    <h3 className="config-title">API integration</h3>
                                    <div className="api-panel-res">
                                        <div className="api-endpoint">POST /evaluate</div>
                                        <div className="api-content-type">Content-Type: application/json</div>
                                        <pre className="code-pre-res">
{`{
  "question": "...",
  "context_chunks": [ { "text": "..." } ],
  "answer": "...",
  "run_ragas": false
}`}
                                        </pre>
                                        <div className="api-response-schema">
                                            <div className="schema-head">Response schema includes:</div>
                                            <ul className="schema-list">
                                                <li><span className="sc-dot"></span> <span className="sc-key">hrs</span> — 0-100 composite risk score</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">module_results</span> — faithfulness, entities, sources, logic</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">confidence_level</span> — LOW/MOD/HIGH</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">risk_band</span> — LOW/MOD/HIGH/CRITICAL</li>
                                            </ul>
                                        </div>
                                        <button className="guide-btn-res">Integration guide ↗</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {view === 'report' && resultData && (
                    <div className="eval-report-view">
                    <div className="report-header">
                        <div className="rh-eyebrow">
                            SYSTEM REPORT // HRS-{resultData.hrs}
                            <span className="rh-pill" style={{ background: resultData.hrs > 40 ? '#FF6B6B' : '#00C896' }}>
                                {resultData.risk_band} RISK
                            </span>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={exportToJson}
                                    style={{
                                        background: 'rgba(0,200,150,0.1)',
                                        border: '1px solid rgba(0,200,150,0.4)',
                                        color: '#00C896',
                                        padding: '4px 14px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    ⤓ EXPORT JSON
                                </button>
                                <button onClick={() => setView('form')} style={{background:'transparent', border:'1px solid var(--card-border)', color:'white', padding:'4px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'11px'}}>
                                    &larr; BACK
                                </button>
                            </div>
                        </div>
                        <h1 className="rh-title">Audit Report</h1>
                        <div className="rh-time">LATENCY: {resultData.total_pipeline_ms} ms | COMPOSITE: {resultData.composite_score?.toFixed(2)}</div>

                        <div className="report-query-box">
                            <div className="rq-label">ACTIVE QUERY</div>
                            "{resultData.question || query}"
                        </div>
                        
                        {resultData.generated_answer && (
                            <div className="report-query-box" style={{ marginTop: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="rq-label">GENERATED ANSWER</div>
                                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{resultData.generated_answer}</div>
                            </div>
                        )}
                        
                        {resultData.intervention_applied && (
                            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid #FF6B6B', borderRadius: '8px', color: '#FF6B6B' }}>
                                <strong>⚠️ SAFETY INTERVENTION APPLIED</strong><br />
                                <span style={{ fontSize: '13px' }}>{resultData.intervention_details?.message || resultData.intervention_reason}</span>
                            </div>
                        )}
                    </div>

                    <div className="report-cards-row">
                        <div className="rc-card">
                            <div className="rc-head"><span>FAITHFULNESS</span></div>
                            <div className="rc-val-group">
                                <div className="rc-val">{resultData.module_results?.faithfulness?.score?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width: `${(resultData.module_results?.faithfulness?.score || 0)*100}%`, background:'#00C896'}}></div></div>
                        </div>
                        <div className="rc-card">
                            <div className="rc-head"><span>ENTITIES</span></div>
                            <div className="rc-val-group">
                                <div className="rc-val">{resultData.module_results?.entity_verifier?.score?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width: `${(resultData.module_results?.entity_verifier?.score || 0)*100}%`, background:'#00C896'}}></div></div>
                        </div>
                        <div className="rc-card">
                            <div className="rc-head"><span>SOURCES</span></div>
                            <div className="rc-val-group">
                                <div className="rc-val">{resultData.module_results?.source_credibility?.score?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width: `${(resultData.module_results?.source_credibility?.score || 0)*100}%`, background:'#F5A623'}}></div></div>
                        </div>
                        <div className="rc-card">
                            <div className="rc-head"><span>CONTRADICTION</span></div>
                            <div className="rc-val-group">
                                <div className="rc-val">{resultData.module_results?.contradiction?.score?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width: `${(resultData.module_results?.contradiction?.score || 1)*100}%`, background:'#00C896'}}></div></div>
                        </div>
                    </div>

                    <div className="report-main-grid">
                        <div className="rep-panel">
                            <div className="rep-panel-header">
                                CLAUSE ANNOTATIONS TABLE
                            </div>
                            <table className="r-table">
                                <thead><tr><th>CLAIM</th><th>STATUS</th><th>NLI SCORE</th></tr></thead>
                                <tbody>
                                    {resultData.module_results?.faithfulness?.details?.claims?.map((cl, i) => (
                                        <tr key={i}>
                                            <td style={{ maxWidth: '250px' }}>{cl.claim}</td>
                                            <td>
                                                <span className={`r-pill ${cl.status === 'CONTRADICTED' ? 'red' : cl.status === 'ENTAILED' ? 'green' : 'gray'}`}>
                                                    {cl.status}
                                                </span>
                                            </td>
                                            <td>{cl.nli_score?.toFixed(3)}</td>
                                        </tr>
                                    )) || <tr><td colSpan="3" style={{ textAlign: 'center', opacity: 0.5 }}>No claims extracted</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="rep-panel">
                            <div className="rep-panel-header">
                                SOURCE CREDIBILITY
                            </div>
                            {resultData.retrieved_chunks && resultData.retrieved_chunks.length > 0 ? resultData.retrieved_chunks.map((chk, i) => {
                                const chunkDetails = resultData.module_results?.source_credibility?.details?.chunks?.find(c => c.chunk_id === chk.chunk_id) || {};
                                return (
                                    <div className="cred-card" key={i}>
                                        <div style={{ maxWidth: '75%' }}>
                                            <div className="cred-title">{chk.title || chk.source || `Chunk ${chk.chunk_id || i+1}`}</div>
                                            <div className="cred-sub">{chk.pub_type || 'Unknown Type'} &middot; Score {chk.similarity_score?.toFixed(3) || 'N/A'}</div>
                                        </div>
                                        <div className={`r-pill ${chunkDetails.tier === 1 ? 'green' : chunkDetails.tier === 2 ? 'green' : 'gray'}`}>
                                            {chunkDetails.tier ? `TIER ${chunkDetails.tier}` : 'UNKNOWN'}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ opacity: 0.5, padding: '16px' }}>No sources provided/retrieved.</div>
                            )}
                        </div>
                    </div>

                    {/* In-depth Source detail panel */}
                    <div className="rep-panel" style={{ marginTop: '20px' }}>
                        <div className="rep-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>RETRIEVED DATASET SOURCES</span>
                            <span style={{ fontSize: '11px', opacity: 0.5 }}>{(resultData.retrieved_chunks || []).length} records</span>
                        </div>

                        {(resultData.retrieved_chunks || []).length === 0 && (
                            <div style={{ opacity: 0.5, padding: '16px', fontSize: '13px' }}>No sources retrieved for this evaluation.</div>
                        )}

                        {(resultData.retrieved_chunks || []).map((chk, i) => {
                            const chunkDetails = resultData.module_results?.source_credibility?.details?.chunks?.find(c => c.chunk_id === chk.chunk_id) || {};
                            return (
                                <SourceChunkCard key={chk.chunk_id || i} chk={chk} i={i} chunkDetails={chunkDetails} />
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'ab-report' && (
                <div className="eval-report-view ab-report-view">
                    <style>{`
                        .ab-report-view { 
                            max-width: 1500px; 
                            padding: 40px;
                            margin: 0 auto;
                        }
                        .ab-grid { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 40px; 
                            margin-top: 30px; 
                        }
                        .ab-col { 
                            background: rgba(255,255,255,0.02); 
                            border: 1px solid rgba(255,255,255,0.08); 
                            border-radius: 24px; 
                            padding: 32px;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                            transition: transform 0.3s ease;
                        }
                        .ab-col:hover { transform: translateY(-5px); border-color: rgba(0,200,150,0.2); }
                        .ab-header { 
                            display: flex; 
                            justify-content: space-between; 
                            align-items: center; 
                            margin-bottom: 24px; 
                            padding-bottom: 20px; 
                            border-bottom: 1px solid rgba(255,255,255,0.05); 
                        }
                        .ab-prompt-summary { 
                            font-size: 11px; 
                            opacity: 0.4; 
                            font-style: italic; 
                            margin-bottom: 20px; 
                            display: block; 
                            line-height: 1.5;
                        }
                        .ab-answer-box {
                            background: rgba(0,0,0,0.3); 
                            padding: 24px; 
                            border-radius: 16px; 
                            marginBottom: 24px; 
                            min-height: 200px;
                            border: 1px solid rgba(255,255,255,0.03);
                            line-height: 1.7;
                            font-size: 14px;
                            color: rgba(255,255,255,0.9);
                        }
                        .metric-comp { 
                            display: flex; 
                            justify-content: space-between; 
                            margin-bottom: 12px; 
                            font-size: 13px; 
                            padding: 8px 0;
                            border-bottom: 1px solid rgba(255,255,255,0.02);
                        }
                        .metric-label { opacity: 0.5; font-weight: 500; }
                        .metric-val { font-weight: 800; font-family: 'Fira Code', monospace; }
                    `}</style>

                    <div className="report-header" style={{ marginBottom: '40px' }}>
                        <div className="rh-eyebrow" style={{ marginBottom: '16px' }}>
                            PROMPT A/B EXPERIMENT // CLINICAL STRESS TEST
                            <div style={{ marginLeft: 'auto' }}>
                                <button onClick={() => setView('form')} style={{
                                    background: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white', 
                                    padding: '8px 20px', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transition: '0.2s'
                                }}>
                                    &larr; BACK TO LAB
                                </button>
                            </div>
                        </div>
                        <h1 className="rh-title" style={{ fontSize: '32px', marginBottom: '12px' }}>A/B Comparison Report</h1>
                        <p style={{ opacity: 0.5, fontSize: '15px', maxWidth: '800px' }}>Testing model responses across different system personas for the query: <span style={{ color: 'white' }}>"{query}"</span></p>
                    </div>

                    {!resultA || !resultB ? (
                        <div style={{ padding: '100px 0', textAlign: 'center' }}>
                            <div className="telemetry-dot-res pulse" style={{ margin: '0 auto 24px', width: '20px', height: '20px' }}></div>
                            <p style={{ letterSpacing: '2px', fontSize: '12px', opacity: 0.6 }}>CALCULATING CROSS-MODEL RAGAS SCORES...</p>
                        </div>
                    ) : (
                        <div className="ab-grid">
                            {/* PROMPT A */}
                            <div className="ab-col" style={{ borderTop: `4px solid ${resultA.hrs < resultB.hrs ? '#00C896' : 'rgba(255,255,255,0.1)'}` }}>
                                <div className="ab-header">
                                    <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>PERSONA A</h3>
                                    <span className="rh-pill" style={{ background: resultA.hrs > 40 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 200, 150, 0.2)', color: resultA.hrs > 40 ? '#ef4444' : '#00C896', border: `1px solid ${resultA.hrs > 40 ? '#ef444450' : '#00C89650'}` }}>
                                        HRS {resultA.hrs}
                                    </span>
                                </div>
                                <span className="ab-prompt-summary">Instruction: "{promptA}"</span>
                                
                                <div className="ab-answer-box">
                                    <div className="rq-label" style={{ marginBottom: '12px', fontSize: '10px', opacity: 0.5 }}>GENERATED OUTPUT</div>
                                    {resultA.generated_answer}
                                </div>

                                <div className="metrics-list" style={{ marginTop: '24px' }}>
                                    <div className="metric-comp">
                                        <span className="metric-label">Faithfulness (Groundedness)</span>
                                        <span className="metric-val" style={{ color: resultA.module_results?.faithfulness?.score > 0.8 ? '#00C896' : '#FF6B6B' }}>
                                            {(resultA.module_results?.faithfulness?.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="metric-comp">
                                        <span className="metric-label">Entity Precision</span>
                                        <span className="metric-val">{(resultA.module_results?.entity_verifier?.score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="metric-comp">
                                        <span className="metric-label">Inference Latency</span>
                                        <span className="metric-val">{resultA.total_pipeline_ms}ms</span>
                                    </div>
                                </div>
                            </div>

                            {/* PROMPT B */}
                            <div className="ab-col" style={{ borderTop: `4px solid ${resultB.hrs < resultA.hrs ? '#00C896' : 'rgba(255,255,255,0.1)'}` }}>
                                <div className="ab-header">
                                    <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>PERSONA B</h3>
                                    <span className="rh-pill" style={{ background: resultB.hrs > 40 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 200, 150, 0.2)', color: resultB.hrs > 40 ? '#ef4444' : '#00C896', border: `1px solid ${resultB.hrs > 40 ? '#ef444450' : '#00C89650'}` }}>
                                        HRS {resultB.hrs}
                                    </span>
                                </div>
                                <span className="ab-prompt-summary">Instruction: "{promptB}"</span>

                                <div className="ab-answer-box">
                                    <div className="rq-label" style={{ marginBottom: '12px', fontSize: '10px', opacity: 0.5 }}>GENERATED OUTPUT</div>
                                    {resultB.generated_answer}
                                </div>

                                <div className="metrics-list" style={{ marginTop: '24px' }}>
                                    <div className="metric-comp">
                                        <span className="metric-label">Faithfulness (Groundedness)</span>
                                        <span className="metric-val" style={{ color: resultB.module_results?.faithfulness?.score > 0.8 ? '#00C896' : '#FF6B6B' }}>
                                            {(resultB.module_results?.faithfulness?.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="metric-comp">
                                        <span className="metric-label">Entity Precision</span>
                                        <span className="metric-val">{(resultB.module_results?.entity_verifier?.score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="metric-comp">
                                        <span className="metric-label">Inference Latency</span>
                                        <span className="metric-val">{resultB.total_pipeline_ms}ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (embedded) return evalContent;

    return (
        <div className="eval-page">
            {evalContent}
            <ApiKeyModal 
                isOpen={isApiModalOpen} 
                onClose={() => setIsApiModalOpen(false)} 
                defaultProvider={engineConfig?.provider || 'Mistral'}
                onSave={(key) => {
                    if (setEngineConfig) {
                        setEngineConfig({ ...engineConfig, apiKey: key });
                    }
                    setIsApiModalOpen(false);
                    // Pass the new key directly to avoid React state batched staleness
                    executeEvaluationJob(key);
                }} 
            />
        </div>
    );
};

export default Evaluate;
