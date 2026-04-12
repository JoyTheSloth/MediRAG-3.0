import React, { useState, useEffect } from 'react';
import './PatientExperience.css';
import ApiKeyModal from '../components/ApiKeyModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PatientExperience = ({ engineConfig, setEngineConfig }) => {
    const [selectedDocType, setSelectedDocType] = useState('Discharge summary');
    const [selectedQuestion, setSelectedQuestion] = useState('-- pick a common question --');
    const [customQuestion, setCustomQuestion] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showTrace, setShowTrace] = useState(false);
    const [selectedApp, setSelectedApp] = useState('Apollo 247');
    const [activeDemoStep, setActiveDemoStep] = useState(0);

    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedText, setUploadedText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = React.useRef(null);

    const [resultData, setResultData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const docTypes = ['Discharge summary', 'Lab report', 'Prescription', 'Radiology report'];
    const appTargets = ['Apollo 247', 'Tata 1mg', 'Practo', 'Mfine', 'HealthifyMe'];
    const commonQuestions = [
        'Is the dosage correct?',
        'What side effects should I expect?',
        'Are there any drug interactions?',
        'What does this lab value mean?',
        'How long should I take this medication?'
    ];

    const [isApiModalOpen, setIsApiModalOpen] = useState(false);

    const handleCheck = () => {
        if (!engineConfig?.apiKey) {
            setIsApiModalOpen(true);
            return;
        }
        executeCheckJob();
    };

    const executeCheckJob = async (overrideKey = null) => {
        setIsAnalyzing(true);
        setShowResults(false);
        setErrorMsg('');
        setResultData(null);

        const q = customQuestion.trim() || selectedQuestion;
        if (q === '-- pick a common question --' || !q) {
            setErrorMsg('Please enter or select a question.');
            setIsAnalyzing(false);
            return;
        }

        try {
            if (!uploadedText) {
                throw new Error('Please upload a document first before checking.');
            }

            const apiUrl = engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const activeKey = overrideKey || engineConfig?.apiKey || '';

            // Enrich question with document context, then run through the full RAG pipeline
            const enrichedQuestion = `[Patient Document: ${uploadedFile?.name || 'uploaded file'}]\n\nDocument Content:\n${uploadedText.slice(0, 3000)}\n\n---\nPatient Question: ${q}`;

            let res;
            try {
                res = await fetch(`${apiUrl}/query`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: enrichedQuestion,
                        top_k: 5,
                        run_ragas: false,
                        llm_provider: (engineConfig?.provider || 'mistral').toLowerCase(),
                        llm_model: engineConfig?.model || 'mistral-large-latest',
                        llm_api_key: activeKey
                    })
                });
            } catch (networkErr) {
                throw new Error(`Cannot reach MediRAG backend at ${apiUrl}. Is the HF Space running? (${networkErr.message})`);
            }

            const data = await res.json();
            if (!res.ok) {
                // FastAPI can return detail as string, object, or array
                let errMsg;
                if (typeof data.detail === 'string') {
                    errMsg = data.detail;
                } else if (Array.isArray(data.detail)) {
                    errMsg = data.detail.map(e => e.msg || JSON.stringify(e)).join('; ');
                } else if (data.detail) {
                    errMsg = JSON.stringify(data.detail);
                } else {
                    errMsg = `Backend error ${res.status}: ${res.statusText}`;
                }
                throw new Error(errMsg);
            }

            setResultData(data);
            setShowResults(true);
        } catch (err) {
            console.error(err);
            setErrorMsg(typeof err.message === 'string' ? err.message : JSON.stringify(err));
        } finally {
            setIsAnalyzing(false);
        }
    };


    return (
        <div className="patient-experience">
            {/* LEFT COLUMN: INPUTS */}
            <div className="px-input-col">
                
                {/* UPLOAD SECTION */}
                <input 
                    type="file" 
                    onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setUploadedFile(file);
                            setIsUploading(true);
                            setUploadSuccess(false);
                            setErrorMsg('');

                            try {
                                const formData = new FormData();
                                formData.append('file', file);
                                const endpoint = `${engineConfig?.apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/parse_file`;
                                const res = await fetch(endpoint, {
                                    method: 'POST',
                                    body: formData
                                });

                                if (!res.ok) {
                                    const errData = await res.json();
                                    throw new Error(errData.detail || 'Failed to parse file content.');
                                }
                                
                                const data = await res.json();
                                setUploadedText(data.text);
                                setUploadSuccess(true);
                            } catch (err) {
                                console.error('Upload error:', err);
                                setErrorMsg(`Upload failed: ${err.message}`);
                            } finally {
                                setIsUploading(false);
                            }
                        }
                    }} 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept=".txt,.md,.pdf,.docx" 
                />
                <div 
                    className="px-upload-zone" 
                    onClick={() => {
                        if (!isUploading) fileInputRef.current?.click();
                    }} 
                    style={{ 
                        cursor: isUploading ? 'wait' : 'pointer', 
                        borderColor: uploadSuccess ? '#00C896' : 'rgba(255,255,255,0.1)', 
                        background: uploadSuccess ? 'rgba(0,200,150,0.05)' : '',
                        opacity: isUploading ? 0.7 : 1
                    }}
                >
                    <div className="px-upload-icon-wrapper" style={{ background: uploadSuccess ? '#00C896' : (isUploading ? '#ff4d4f' : ''), color: (uploadSuccess || isUploading) ? 'white' : '' }}>
                        {isUploading ? <div className="loader-ring" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div> : 
                         uploadSuccess ? '✓' : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        )}
                    </div>
                    <div className="px-upload-title">{uploadedFile ? uploadedFile.name : 'Upload your health document'}</div>
                    <div className="px-upload-subtitle">
                        {isUploading ? 'Ingesting and vectorizing document...' : 
                         uploadSuccess ? 'Document loaded successfully. Ask your question below.' : 
                         'Lab report, prescription, discharge summary — PDF'}
                    </div>
                </div>

                {/* TARGET APP SELECTION */}
                <div style={{ marginBottom: '20px' }}>
                    <div className="px-section-label">Target Healthcare App</div>
                    <div className="px-chips-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
                        {appTargets.map(app => (
                            <button
                                key={app}
                                className={`px-chip ${selectedApp === app ? 'active' : ''}`}
                                onClick={() => setSelectedApp(app)}
                                style={{ fontSize: '12px' }}
                            >
                                {app}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SAMPLE DOCUMENT TYPE SELECTION */}
                <div>
                    <div className="px-section-label">Document Type</div>
                    <div className="px-chips-row">
                        {docTypes.map(type => (
                            <button 
                                key={type} 
                                className={`px-chip ${selectedDocType === type ? 'active' : ''}`}
                                onClick={() => setSelectedDocType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* QUESTION INPUTS */}
                <div className="px-question-box">
                    <div>
                        <div className="px-section-label">Your Question</div>
                        <select 
                            className="px-select"
                            value={selectedQuestion}
                            onChange={(e) => setSelectedQuestion(e.target.value)}
                        >
                            <option value="-- pick a common question --">-- pick a common question --</option>
                            {commonQuestions.map(q => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>

                    <textarea 
                        className="px-textarea"
                        placeholder="Or type your own question about this document..."
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                    ></textarea>
                </div>

                {/* ACTION BUTTON */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                        className={`px-action-btn ${isAnalyzing ? 'disabled' : 'primary'}`}
                        disabled={isAnalyzing}
                        onClick={handleCheck}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="loader-ring"></div>
                                CHECKING...
                            </>
                        ) : 'Check this answer'}
                    </button>
                    <div className="px-hint">
                        MediRAG will verify the AI's answer against your document and medical sources
                    </div>
                    {errorMsg && <div style={{color:'red', marginTop:'16px', fontSize:'14px'}}>{errorMsg}</div>}
                </div>

            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className={`px-report-col ${showResults ? 'has-results' : ''}`}>
                {!showResults && !isAnalyzing && (
                    <>
                        <div className="px-empty-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="px-empty-title">Your safety report will appear here</div>
                        <div className="px-empty-subtitle">Upload a document and ask a question</div>
                    </>
                )}

                {isAnalyzing && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--text-gray)', marginTop: '60px' }}>
                        <div className="loader-ring" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                        <div style={{ fontSize: '14px' }}>Retrieving from medical dataset & verifying...</div>
                    </div>
                )}

                {showResults && resultData && (() => {
                    const hrs = resultData.hrs_score ?? resultData.hrs ?? 10;
                    const band = hrs >= 60 ? 'CRITICAL' : hrs >= 30 ? 'MODERATE' : 'SAFE';
                    const bandColor = band === 'SAFE' ? '#00C896' : band === 'CRITICAL' ? '#EF4444' : '#F5A623';
                    const chunks = resultData.retrieved_chunks || [];
                    const mods = resultData.module_results || {};
                    const answer = resultData.generated_answer || resultData.answer || '';

                    return (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Status bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontStyle: 'italic', color: 'var(--text-gray)', fontSize: '12px' }}>STATUS: REPORT GENERATED</div>
                                <div style={{ color: bandColor, fontSize: '12px', fontWeight: 800 }}>
                                    {resultData.intervention_applied ? '⚡ INTERVENTION APPLIED' : `✅ VERIFIED ${band}`}
                                </div>
                            </div>

                            {/* HRS Gauge */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${bandColor}33`, borderRadius: '14px', padding: '20px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-gray)', letterSpacing: '1px', marginBottom: '12px' }}>HALLUCINATION RISK SCORE</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '48px', fontWeight: 900, color: bandColor, lineHeight: 1 }}>{hrs}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-gray)' }}>/100</div>
                                    <div style={{ marginLeft: 'auto', background: `${bandColor}20`, border: `1px solid ${bandColor}`, borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 800, color: bandColor }}>
                                        {band} RISK
                                    </div>
                                </div>
                                <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${hrs}%`, background: `linear-gradient(90deg, #00C896, ${bandColor})`, borderRadius: '6px', transition: 'width 1.2s ease-out' }}></div>
                                </div>
                            </div>

                            {/* Answer — rendered as markdown */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p:      ({node, ...props}) => <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, marginBottom: '12px', marginTop: 0 }} {...props} />,
                                        strong: ({node, ...props}) => <strong style={{ color: '#ffffff', fontWeight: 700 }} {...props} />,
                                        em:     ({node, ...props}) => <em style={{ color: 'rgba(0,200,150,0.9)', fontStyle: 'italic' }} {...props} />,
                                        li:     ({node, ...props}) => <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '4px' }} {...props} />,
                                        ul:     ({node, ...props}) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
                                        ol:     ({node, ...props}) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
                                        h3:     ({node, ...props}) => <h3 style={{ fontSize: '14px', color: '#00C896', fontWeight: 700, margin: '14px 0 6px' }} {...props} />,
                                        h4:     ({node, ...props}) => <h4 style={{ fontSize: '13px', color: '#00C896', fontWeight: 600, margin: '10px 0 4px' }} {...props} />,
                                        code:   ({node, ...props}) => <code style={{ background: 'rgba(0,200,150,0.12)', color: '#00C896', padding: '1px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }} {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid #00C896', paddingLeft: '12px', margin: '10px 0', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }} {...props} />,
                                    }}
                                >
                                    {answer}
                                </ReactMarkdown>
                                {resultData.intervention_applied && resultData.safe_answer && (
                                    <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '8px', fontSize: '12px', color: '#F5A623' }}>
                                        ⚡ <strong>MediRAG intervened</strong> — answer was replaced with a safer version.
                                    </div>
                                )}
                            </div>

                            {/* Retrieved Dataset Sources */}
                            {chunks.length > 0 && (
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-gray)', letterSpacing: '1px', marginBottom: '14px' }}>📚 RETRIEVED DATASET SOURCES ({chunks.length})</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {chunks.map((chunk, i) => {
                                            const score = chunk.similarity_score ?? chunk.score ?? 0;
                                            const scoreColor = score > 0.5 ? '#00C896' : score > 0.2 ? '#F5A623' : 'rgba(255,255,255,0.4)';
                                            const title = chunk.title || chunk.doc_id || `Source ${i + 1}`;
                                            const source = chunk.source || chunk.pub_type || '';
                                            const text = chunk.text || chunk.chunk_text || '';
                                            return (
                                                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px', borderLeft: `3px solid ${scoreColor}` }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'white', lineHeight: 1.4, flex: 1 }}>{title}</div>
                                                        <div style={{ fontSize: '11px', fontWeight: 800, color: scoreColor, flexShrink: 0, background: `${scoreColor}15`, padding: '2px 8px', borderRadius: '10px' }}>
                                                            {(score * 100).toFixed(1)}% match
                                                        </div>
                                                    </div>
                                                    {source && (
                                                        <div style={{ fontSize: '10px', color: 'rgba(0,200,150,0.7)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{source}</div>
                                                    )}
                                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                                                        {text.length > 220 ? text.slice(0, 220) + '...' : text}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Metrics */}
                            {Object.keys(mods).length > 0 && (
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-gray)', letterSpacing: '1px', marginBottom: '14px' }}>📊 EVALUATION METRICS</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {Object.entries(mods).map(([key, val]) => {
                                            const score = val?.score ?? val ?? 0;
                                            const pct = Math.round(score * 100);
                                            const color = pct > 80 ? '#00C896' : pct > 50 ? '#F5A623' : '#EF4444';
                                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                            return (
                                                <div key={key}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{label}</span>
                                                        <span style={{ fontSize: '12px', fontWeight: 800, color }}>{pct}%</span>
                                                    </div>
                                                    <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 1.2s ease-out' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Audit Trace toggle */}
                            <button className="px-action-btn" onClick={() => setShowTrace(t => !t)}>
                                {showTrace ? 'Hide Audit Trace ▲' : 'View Raw Audit Trace ▼'}
                            </button>
                            {showTrace && (
                                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, overflowX: 'auto' }}>
                                    <div style={{ color: '#00C896', marginBottom: '8px' }}>// MediRAG Audit Trace — {selectedApp}</div>
                                    <div>hrs_score: <span style={{color:'#fff'}}>{hrs}</span></div>
                                    <div>risk_band: <span style={{color:'#fff'}}>"{ band}"</span></div>
                                    <div>intervention_applied: <span style={{color:'#fff'}}>{String(resultData.intervention_applied ?? false)}</span></div>
                                    <div>pipeline_ms: <span style={{color:'#fff'}}>{resultData.total_pipeline_ms ?? 'N/A'}</span></div>
                                    <div>chunks_retrieved: <span style={{color:'#fff'}}>{chunks.length}</span></div>
                                    {chunks.map((c, i) => (
                                        <div key={i}>chunk[{i}].score: <span style={{color:'#fff'}}>{(c.similarity_score ?? 0).toFixed(4)}</span> — <span style={{color:'rgba(255,255,255,0.4)'}}>{(c.title || c.doc_id || '').slice(0, 50)}</span></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* INTEGRATION PREVIEW SECTION */}
            <div style={{ gridColumn: '1 / -1', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="px-section-label">Live Integration Preview</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>MediRAG in Third-Party Apps</h2>
                    <p style={{ color: 'var(--text-gray)', marginTop: '8px' }}>How leading healthcare brands protect their patients using our governance layer</p>
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
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: i === activeDemoStep ? 'white' : 'var(--text-gray-light)' }}>{s.title}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '4px' }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Mockup */}
                    <div style={{ 
                        width: '320px', 
                        height: '540px', 
                        background: '#121826', 
                        borderRadius: '32px', 
                        border: '8px solid #1c253b',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        {/* Status Bar */}
                        <div style={{ height: '30px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                            <span>9:41</span>
                            <div style={{ display: 'flex', gap: '4px' }}><span>📶</span><span>🔋</span></div>
                        </div>

                        {/* App Header */}
                        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e53e3e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white' }}>Ap</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 800 }}>Apollo 247</div>
                                <div style={{ fontSize: '11px', color: '#00C896' }}>Health assistant</div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeDemoStep === 0 && (
                                <>
                                    <div style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                        <div style={{ color: '#4dabf7', marginBottom: '8px' }}>📤</div>
                                        <div style={{ fontSize: '11px', fontWeight: 700 }}>Upload your health document</div>
                                        <div style={{ fontSize: '9px', color: 'var(--text-gray)' }}>Lab report, prescription, discharge summary</div>
                                    </div>

                                    <div style={{ fontSize: '9px', textAlign: 'center', color: 'var(--text-gray)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                                        <span style={{ background: '#121826', padding: '0 8px', position: 'relative' }}>or try an example</span>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ background: '#e53e3e22', color: '#e53e3e', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>PDF</div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700 }}>Discharge_Summary_Rajan.pdf</div>
                                            <div style={{ fontSize: '9px', color: 'var(--text-gray)' }}>Apollo Hospitals • 3 pages • 124 KB</div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', fontSize: '12px', lineHeight: '1.4', textAlign: 'left' }}>
                                        My doctor mentioned metoprolol 25mg twice daily. Is this a normal dose for me?
                                    </div>

                                    <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        Ask Apollo AI →
                                    </button>
                                </>
                            )}
                            
                            {activeDemoStep > 0 && (
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', fontSize: '12px', lineHeight: '1.4', textAlign: 'left' }}>
                                    My doctor mentioned metoprolol 25mg twice daily. Is this a normal dose for me?
                                </div>
                            )}

                            {activeDemoStep === 1 && (
                                <div className="mc-thinking" style={{ fontSize: '11px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>
                                    <span className="dot-pulse"></span> Generative AI is typing...
                                </div>
                            )}

                            {activeDemoStep === 2 && (
                                <>
                                    <div style={{ fontSize: '12px', lineHeight: '1.5', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                        Yes, generating 25mg twice daily is a completely normal dosage to begin with for hypertension...
                                    </div>
                                    <div style={{ marginTop: '-8px', alignSelf: 'center', background: 'rgba(43, 89, 255, 0.1)', border: '1px solid #4dabf7', borderRadius: '20px', padding: '8px 16px', fontSize: '10px', fontWeight: 700, color: '#4dabf7', display: 'flex', alignItems: 'center', gap: '8px', animation: 'pulse 1.5s infinite' }}>
                                        <span style={{ fontSize: '14px' }}>🛡️</span> MediRAG Eval: Scanning output...
                                    </div>
                                </>
                            )}

                            {activeDemoStep === 3 && (
                                <>
                                    <div style={{ fontSize: '12px', lineHeight: '1.5', padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'left' }}>
                                        <div style={{ color: '#EF4444', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>⚠️</span> Clinical Error Detected
                                        </div>
                                        Yes, generating 25mg twice daily is a completely normal dosage to begin with for hypertension...
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(239, 68, 68, 0.2)', color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>
                                            <strong style={{color: '#EF4444'}}>MediRAG Audit:</strong> The uploaded document specifies 12.5mg twice daily, not 25mg. Response blocked for patient safety.
                                        </div>
                                    </div>
                                    <button style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>Connect to Human Doctor</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <ApiKeyModal 
                isOpen={isApiModalOpen} 
                onClose={() => setIsApiModalOpen(false)} 
                defaultProvider={engineConfig?.provider || 'Mistral'}
                onSave={(key) => {
                    if (setEngineConfig) {
                        setEngineConfig({ ...engineConfig, apiKey: key });
                    }
                    setIsApiModalOpen(false);
                    executeCheckJob(key);
                }} 
            />
        </div>
    );
};

export default PatientExperience;
