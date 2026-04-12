import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrambledText from '../components/ScrambledText';

const Home = () => {
    useEffect(() => {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const obj = entry.target;
                    const target = +obj.getAttribute('data-target');
                    if(target === 0) return;
                    let count = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    const updateCount = () => {
                        count += increment;
                        if(count < target) {
                            obj.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            obj.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(obj);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }, []);

  return (
    <>

    <header id="home" className="hero-section">
        <div className="hero-container">
            <div className="hero-left reveal-left">
                <div className="badge badge-outline">
                    <span className="shield-icon">🛡</span> Open Source · India Innovates 2026
                </div>
                <h1 className="main-title">
                    Detect Medical AI<br/>
                    <span className="gradient-text-danger">
                        <ScrambledText radius={150}>Hallucinations</ScrambledText>.
                    </span><br/>
                    Before They Harm.
                </h1>
                <p className="subheadline">
                    MediRAG-Eval is a post-generation audit layer for RAG-based medical QA systems — scoring faithfulness, entity accuracy, source credibility, and internal consistency in under 30 seconds.
                </p>
                <div className="cta-group">
                    <Link to="/chat" className="primary-btn large cursor-target" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>Try Live Demo →</Link>
                    <Link to="/api-docs" className="secondary-btn large cursor-target" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>Read the Docs</Link>
                </div>

                <div className="cursor-demo-section reveal-up">
                    <h4 className="demo-label">CROSSHAIR SYSTEM READY</h4>
                    <p className="demo-text">Hover over the interactive elements below to test the targeting system.</p>
                    <div className="demo-actions">
                        <button className="cursor-target demo-btn">Target Lock Component</button>
                        <div className="cursor-target demo-box">Interference Zone</div>
                    </div>
                </div>

                <div className="trust-indicators">
                    <span className="trust-item"><span className="check-icon">✓</span> Zero paid APIs</span>
                    <span className="trust-item"><span className="check-icon">✓</span> Runs on free Colab</span>
                    <span className="trust-item"><span className="check-icon">✓</span> 100% open source</span>
                </div>

            </div>

            <div className="hero-right reveal-right">
                <div className="floating-card audit-card">
                    {/* Scanning line overlay */}
                    <div className="scan-line"></div>

                    <div className="card-header">
                        <div className="mac-dots">
                            <span className="dot red-dot"></span>
                            <span className="dot yellow-dot"></span>
                            <span className="dot green-dot"></span>
                        </div>
                        <div className="card-label">SYSTEM AUDIT · ACTIVE</div>
                        <div className="telemetry-box">
                            <span className="telemetry-dot pulse"></span>
                            <span className="telemetry-text">NODE 082</span>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="query-meta">
                            <div className="query-text">
                                <span className="query-label">INPUT:</span> Dosage of metformin for T2 diabetes?
                            </div>
                            <div className="query-status">
                                <span className="status-bit">200 OK</span>
                                <span className="status-bit">RAG:ACTIVE</span>
                            </div>
                        </div>

                        <div className="divider"></div>
                        
                        <div className="gauge-container">
                            <svg className="gauge-svg" viewBox="0 0 120 120">
                                <path className="gauge-bg" d="M 20 95 A 50 50 0 1 1 100 95" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round"/>
                                {/* Segmented gauge look */}
                                <path id="gauge-fill" className="gauge-fill orange-fill" d="M 20 95 A 50 50 0 1 1 100 95" fill="none" strokeWidth="10" strokeLinecap="round" strokeDasharray="165 235" strokeDashoffset="0"/>
                            </svg>
                            <div className="gauge-content">
                                <div className="gauge-number pulse-ani" id="gauge-number">67</div>
                                <div className="gauge-label">RISK SCORE</div>
                            </div>
                        </div>

                        <div className="risk-indicator-row">
                            <span className="risk-badge orange-badge">HIGH RISK DETECTED</span>
                        </div>
                        
                        <div className="score-rows technical">
                            {[
                                { name: 'Faithfulness', val: '0.45', color: 'red', tag: 'DeBERTa-NLI' },
                                { name: 'Entity Accuracy', val: '0.60', color: 'amber', tag: 'SciSpaCy' },
                                { name: 'Source Credib.', val: '0.80', color: 'green', tag: 'Tier Analysis' },
                                { name: 'Consistency', val: '0.28', color: 'green', tag: 'Internal NLI' },
                            ].map((m, i) => (
                                <div key={i} className="score-row">
                                    <div className="score-main">
                                        <span className="score-name">{m.name}</span>
                                        <span className="score-tag">{m.tag}</span>
                                    </div>
                                    <div className="score-bar-container">
                                        <div className={`score-bar ${m.color}-bg`} style={{ width: `${parseFloat(m.val)*100}%` }}></div>
                                    </div>
                                    <div className={`score-val ${m.color}-text`}>{m.val}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="audit-trace">
                            <div className="trace-header">AUDIT TRACE LOG</div>
                            <div className="trace-line">
                                <span className="t-prefix">[ERR]</span> Claims extraction mismatch at clause 2.
                            </div>
                            <div className="trace-line warn">
                                <span className="t-prefix">[WARN]</span> Unverified dosage entity: 850mg tid.
                            </div>
                            <div className="trace-line success">
                                <span className="t-prefix">[OK]</span> Source Tier 1 verified (RCT).
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    
    <section className="stats-band">
        <div className="stats-shimmer"></div>
        <div className="stats-container reveal-up">
            <div className="stat-item">
                <div className="stat-value counter" data-target="4">0</div>
                <div className="stat-label">Evaluation Modules</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <div className="stat-value">&lt; <span className="counter" data-target="30">0</span>s</div>
                <div className="stat-label">End-to-End Audit Time</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <div className="stat-value"><span className="counter" data-target="11">0</span> Lakh+</div>
                <div className="stat-label">PubMed Samples Supported</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <div className="stat-value counter" data-target="0">0</div>
                <div className="stat-label">Paid APIs Required</div>
            </div>
        </div>
    </section>

    
    <section className="section" id="how-it-works">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label home-section-label"><span className="sl-dash">—</span>HOW IT WORKS<span className="sl-dash">—</span></div>
                <h2 className="section-title">Four Modules. One Risk Score.</h2>
                <p className="section-subtitle">
                    Every generated medical answer passes through four independent evaluation layers before receiving a Hallucination Risk Score.
                </p>
            </div>

            <div className="pipeline-container reveal-up">
                
                <div className="pipeline-step">
                    <div className="step-number">01</div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <h3 className="step-title">Faithfulness Scoring</h3>
                        <p className="step-desc">Atomic claims are extracted from the generated answer and checked against retrieved context using DeBERTa-v3 NLI. Each claim is labeled ENTAILED, NEUTRAL, or CONTRADICTED.</p>
                        <div className="step-tag">DeBERTa-v3 · NLI</div>
                    </div>
                </div>
                
                <div className="pipeline-arrow">→</div>

                
                <div className="pipeline-step">
                    <div className="step-number">02</div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                        </div>
                        <h3 className="step-title">Medical Entity Verification</h3>
                        <p className="step-desc">Drug names, dosages, conditions, and procedures are extracted via SciSpaCy and cross-referenced against DrugBank and retrieved context. Mismatches flagged as CRITICAL / MODERATE / MINOR.</p>
                        <div className="step-tag">SciSpaCy · DrugBank</div>
                    </div>
                </div>

                <div className="pipeline-arrow">→</div>

                
                <div className="pipeline-step">
                    <div className="step-number">03</div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        </div>
                        <h3 className="step-title">Source Credibility Ranking</h3>
                        <p className="step-desc">Retrieved context chunks are classified into 5 credibility tiers — from RCTs and systematic reviews (Tier 1) down to grey literature (Tier 5). Weighted average forms the credibility score.</p>
                        <div className="step-tag">RCT → Grey Literature</div>
                    </div>
                </div>

                <div className="pipeline-arrow">→</div>

                
                <div className="pipeline-step">
                    <div className="step-number">04</div>
                    <div className="step-card">
                        <div className="step-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <h3 className="step-title">Contradiction Detection</h3>
                        <p className="step-desc">Every sentence pair in the generated answer is checked for internal contradiction using DeBERTa NLI. Pairs with confidence &gt; 0.75 are flagged automatically.</p>
                        <div className="step-tag">Cross-sentence NLI</div>
                    </div>
                </div>


            </div>
        </div>
    </section>

    
    <section className="section" id="risk-bands">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label home-section-label"><span className="sl-dash">—</span>RISK SCORING<span className="sl-dash">—</span></div>
                <h2 className="section-title">Know Exactly How Risky Every Answer Is</h2>
            </div>
            
            <div className="risk-grid reveal-up">

                {/* LOW RISK */}
                <div className="risk-card-v2 risk-low">
                    <div className="rc-bg-img"><img src="/risk_low.png" alt="Low Risk Visual" /></div>
                    <div className="rc-orb rc-orb-1"></div>
                    <div className="rc-orb rc-orb-2"></div>
                    <div className="rc-top">
                        <div className="rc-score">0–30</div>
                        <div className="rc-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                        </div>
                    </div>
                    <div className="rc-bottom">
                        <div className="rc-badge rc-badge-low">LOW RISK</div>
                        <div className="rc-title">Clinically Safe</div>
                        <div className="rc-desc">Faithful, verified, credible output. Safe for clinical review.</div>
                        <div className="rc-action">Safe to use ↗</div>
                    </div>
                </div>

                {/* MODERATE RISK */}
                <div className="risk-card-v2 risk-mod">
                    <div className="rc-bg-img"><img src="/risk_mod.png" alt="Moderate Risk Visual" /></div>
                    <div className="rc-orb rc-orb-1"></div>
                    <div className="rc-orb rc-orb-2"></div>
                    <div className="rc-top">
                        <div className="rc-score">31–60</div>
                        <div className="rc-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                    </div>
                    <div className="rc-bottom">
                        <div className="rc-badge rc-badge-mod">MODERATE RISK</div>
                        <div className="rc-title">Review Needed</div>
                        <div className="rc-desc">Minor mismatches detected. Human review strongly recommended.</div>
                        <div className="rc-action">Review ↗</div>
                    </div>
                </div>

                {/* HIGH RISK */}
                <div className="risk-card-v2 risk-high">
                    <div className="rc-bg-img"><img src="/risk_high.png" alt="High Risk Visual" /></div>
                    <div className="rc-orb rc-orb-1"></div>
                    <div className="rc-orb rc-orb-2"></div>
                    <div className="rc-top">
                        <div className="rc-score">61–85</div>
                        <div className="rc-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                    </div>
                    <div className="rc-bottom">
                        <div className="rc-badge rc-badge-high">HIGH RISK</div>
                        <div className="rc-title">Expert Check</div>
                        <div className="rc-desc">Multiple unsupported claims or entity errors. Clinical expert required.</div>
                        <div className="rc-action">Escalate ↗</div>
                    </div>
                </div>

                {/* CRITICAL RISK */}
                <div className="risk-card-v2 risk-crit">
                    <div className="rc-bg-img"><img src="/risk_crit.png" alt="Critical Risk Visual" /></div>
                    <div className="rc-orb rc-orb-1"></div>
                    <div className="rc-orb rc-orb-2"></div>
                    <div className="rc-top">
                        <div className="rc-score">86–100</div>
                        <div className="rc-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </div>
                    </div>
                    <div className="rc-bottom">
                        <div className="rc-badge rc-badge-crit">CRITICAL RISK</div>
                        <div className="rc-title">Block Immediately</div>
                        <div className="rc-desc">Severe hallucinations. Contradictions or critical entity errors found.</div>
                        <div className="rc-action">Block ↗</div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    
    <section className="section" id="tech-stack">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label home-section-label"><span className="sl-dash">—</span>TECHNOLOGY<span className="sl-dash">—</span></div>
                <h2 className="section-title">Built on Best-in-Class Open Source Tools</h2>
                <p className="section-subtitle">Every component is free, reproducible, and runs without any paid API.</p>
            </div>
            
            <div className="tech-grid reveal-up">
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#FF6B6B'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div className="tech-name">BioBERT</div>
                    <div className="tech-purpose">Document Embeddings</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#00C2FF'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12h4l2-4 2 8 2-4h2"/></svg>
                    </div>
                    <div className="tech-name">DeBERTa-v3</div>
                    <div className="tech-purpose">NLI Faithfulness Scoring</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'var(--green-accent)'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div className="tech-name">SciSpaCy</div>
                    <div className="tech-purpose">Biomedical NER</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'var(--amber-accent)'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                    <div className="tech-name">FAISS</div>
                    <div className="tech-purpose">Vector Similarity Search</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#A78BFA'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </div>
                    <div className="tech-name">LangChain</div>
                    <div className="tech-purpose">RAG Pipeline</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'var(--green-accent)'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <div className="tech-name">RAGAS</div>
                    <div className="tech-purpose">Evaluation Metrics</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#F97316'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                    </div>
                    <div className="tech-name">Mistral-7B</div>
                    <div className="tech-purpose">Local LLM Judge (Ollama)</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#34D399'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div className="tech-name">FastAPI</div>
                    <div className="tech-purpose">REST Endpoint</div>
                </div>
                <div className="tech-card">
                    <div className="tech-icon" style={{color:'#60A5FA'}}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <div className="tech-name">React / GSAP UI</div>
                    <div className="tech-purpose">High-Fidelity Command Center</div>
                </div>

            </div>
        </div>
    </section>

    <section className="section" id="datasets">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label home-section-label"><span className="sl-dash">—</span>DATA SOURCES<span className="sl-dash">—</span></div>
                <h2 className="section-title">Verified Clinical Knowledge Bases</h2>
                <p className="section-subtitle">MediRAG-Eval grounds every decision using over 211K+ verified medical samples and gold-standard biomedical databases to ensure maximum accuracy.</p>
            </div>
            
            <style>
            {`
            .datasets-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 24px;
                margin-top: 40px;
            }
            .dataset-card {
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.8));
                border: 1px solid rgba(255,255,255,0.05);
                border-top: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 20px;
                padding: 30px;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            }
            .dataset-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.2);
                border-color: rgba(96, 165, 250, 0.4);
            }
            .ds-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.2));
                border: 1px solid rgba(59, 130, 246, 0.3);
                color: #60a5fa;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
            }
            .ds-title {
                font-size: 20px;
                font-weight: 800;
                color: white;
                margin-bottom: 8px;
                letter-spacing: 0.5px;
            }
            .ds-desc {
                font-size: 14px;
                color: #94a3b8;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            .ds-meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top: 1px solid rgba(255,255,255,0.05);
                padding-top: 16px;
                margin-top: auto;
            }
            .ds-stat {
                font-size: 11px;
                font-weight: 800;
                color: #34d399;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                padding: 4px 10px;
                border-radius: 20px;
            }
            .ds-source {
                font-size: 11px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 800;
            }
            `}
            </style>

            <div className="datasets-grid reveal-up">
                
                <div className="dataset-card">
                    <div className="ds-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <div className="ds-title">PubMedQA</div>
                    <div className="ds-desc">Biomedical research question answering dataset collected from original PubMed abstracts.</div>
                    <div className="ds-meta">
                        <div className="ds-stat">11 Lakh+ Samples</div>
                        <div className="ds-source">NIH / NLM</div>
                    </div>
                </div>

                <div className="dataset-card">
                    <div className="ds-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <div className="ds-title">MedQA-USMLE</div>
                    <div className="ds-desc">Multiple-choice questions collected directly from the US Medical Licensing Examinations.</div>
                    <div className="ds-meta">
                        <div className="ds-stat">12.7K+ Cases</div>
                        <div className="ds-source">USMLE</div>
                    </div>
                </div>

                <div className="dataset-card">
                    <div className="ds-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <div className="ds-title">BioASQ 2023</div>
                    <div className="ds-desc">Large-scale biomedical semantic indexing and question answering challenge data.</div>
                    <div className="ds-meta">
                        <div className="ds-stat">4.5K+ Gold Standard</div>
                        <div className="ds-source">BioASQ</div>
                    </div>
                </div>

                <div className="dataset-card">
                    <div className="ds-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
                    </div>
                    <div className="ds-title">DrugBank</div>
                    <div className="ds-desc">Comprehensive database containing exhaustive information on drugs and clinical drug targets.</div>
                    <div className="ds-meta">
                        <div className="ds-stat">506K+ Interactions</div>
                        <div className="ds-source">DrugBank</div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label home-section-label"><span className="sl-dash">—</span>USE CASES<span className="sl-dash">—</span></div>
                <h2 className="section-title">Built For Everyone Building Medical AI</h2>
            </div>
            
            <div className="use-cases-grid reveal-up">
                <div className="persona-card">
                    <div className="persona-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    </div>
                    <h3 className="persona-title">AI Developers</h3>
                    <p className="persona-text">Integrate MediRAG-Eval as a post-generation middleware layer in your medical RAG pipeline via the FastAPI endpoint. Get clause-level annotations in your CI/CD pipeline.</p>
                    <Link to="/api-docs" className="cta-link">See API Docs →</Link>
                </div>
                
                <div className="persona-card">
                    <div className="persona-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <h3 className="persona-title">Researchers</h3>
                    <p className="persona-text">Benchmark your RAG system on PubMedQA, MedQA-USMLE, and BioASQ. Compare faithfulness and RAGAS scores across model variants with full ablation support.</p>
                    <Link to="/console" className="cta-link">See Evaluation Criteria →</Link>
                </div>
                
                <div className="persona-card">
                    <div className="persona-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h3 className="persona-title">AI Governance Teams</h3>
                    <p className="persona-text">Generate structured JSON audit reports for every LLM output. Track hallucination risk trends on the dashboard. Build compliance evidence for CDSCO SaMD regulations.</p>
                    <Link to="/console" className="cta-link">See Dashboard →</Link>
                </div>
            </div>
        </div>
    </section>

    
    <section className="section ecosystem-section">
        <div className="section-container block-reveal">
            <div className="ecosystem-banner">
                {/* Full-width cinematic background */}
                <div className="ecosystem-banner-img">
                    <img src="/india_health.png" alt="India Digital Health Future" />
                </div>
                <div className="ecosystem-bg-overlay"></div>
                <div className="eco-dot-grid"></div>
                <div className="eco-glow-orb eco-orb-1"></div>
                <div className="eco-glow-orb eco-orb-2"></div>
                <div className="ecosystem-content reveal-up">
                    <div className="badge badge-outline">🇮🇳 Made for Bharat</div>
                    <h2 className="ecosystem-title">Designed for India's Digital Health Future</h2>
                    <p className="ecosystem-text">From eSanjeevani's 13 crore teleconsultations to ABDM's national health stack, India's medical AI ecosystem needs a safety layer. MediRAG-Eval is built to be that layer — open, free, and deployable anywhere.</p>
                    <div className="ecosystem-logos">
                        <div className="logo-placeholder">eSanjeevani</div>
                        <div className="logo-placeholder">ABDM</div>
                        <div className="logo-placeholder">ICMR</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="section cta-section">
        <div className="section-container align-center reveal-up">
            <h2 className="cta-headline">Start Auditing Your Medical AI Today.</h2>
            <p className="cta-subtext">No API key. No GPU required. Clone, install, and run in under 5 minutes.</p>
            
            <div className="code-block">
                <div className="code-header">
                    <div className="mac-dots">
                        <span className="dot red-dot"></span>
                        <span className="dot yellow-dot"></span>
                        <span className="dot green-dot"></span>
                    </div>
                    <span className="code-label">bash</span>
                </div>
                <pre><code>git clone https://github.com/medirag/medirag-eval
pip install -r requirements.txt
streamlit run src/dashboard/app.py</code></pre>
            </div>

            <div className="cta-actions">
                <Link to="/chat" className="primary-btn large" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>Try Live Demo →</Link>
                <a href="https://github.com/JoyTheSloth/MediRAG" target="_blank" rel="noopener noreferrer" className="secondary-btn large" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>View on GitHub</a>
            </div>
            
            <div className="cta-footer-note">India Innovates 2026 · Bharat Mandapam · March 28</div>
        </div>
    </section>

    
    
    </>
  );
};

export default Home;