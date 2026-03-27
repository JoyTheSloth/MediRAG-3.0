import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>

    <header className="section about-hero">
        <div className="section-container align-center reveal-up">
            <div className="badge badge-outline"><span className="shield-icon">🎯</span> Our Mission</div>
            <h1 className="main-title">
                Building Trust in Medical AI.<br/>
                <span className="gradient-text-green">One Audit at a Time.</span>
            </h1>
            <p className="about-hero-subtext">
                Hallucinations in medical AI aren't just errors — they're patient safety risks. MediRAG-Eval was built to give developers, researchers, and AI governance teams a rigorous, open-source framework to detect, score, and explain hallucinations in RAG-based medical QA systems before they reach clinicians or patients.
            </p>
        </div>
    </header>

    
    <section className="section">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label about-section-label"><span className="sl-dash">—</span>THE PROBLEM<span className="sl-dash">—</span></div>
            </div>
            
            <div className="problem-section-v2">
                {/* 1. THREE CARDS IN A LINE */}
                <div className="problem-cards-row reveal-up">
                    <div className="problem-card red-border">
                        <div className="pr-icon-ring red-text">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="problem-content">
                            <h3 className="problem-title">Unverified Claims</h3>
                            <p className="problem-text">LLMs confidently generate medical statements unsupported by retrieved evidence.</p>
                        </div>
                    </div>
                    
                    <div className="problem-card orange-border">
                        <div className="pr-icon-ring orange-text">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                        </div>
                        <div className="problem-content">
                            <h3 className="problem-title">Dosage Errors</h3>
                            <p className="problem-text">Wrong drug names and incorrect dosage counts go undetected in generic RAG.</p>
                        </div>
                    </div>

                    <div className="problem-card amber-border">
                        <div className="pr-icon-ring amber-text">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        </div>
                        <div className="problem-content">
                            <h3 className="problem-title">No Audit Trail</h3>
                            <p className="problem-text">Existing systems produce answers with no explainability layer for tracing logic.</p>
                        </div>
                    </div>
                </div>
                
                {/* 2. TWO PERCENTAGES BELOW */}
                <div className="problem-stats-row reveal-up">
                    <div className="stat-block-v2">
                        <div className="huge-stat green-text">~30%</div>
                        <p className="stat-desc-v2">of generated medical answers contain a hallucination</p>
                        <p className="stat-subtext-v2">Based on benchmarks across PubMedQA and MedQA datasets. Generic LLMs often "fill in gaps" when evidence is ambiguous.</p>
                    </div>
                    <div className="stat-block-v2">
                        <div className="huge-stat amber-text">~12%</div>
                        <p className="stat-desc-v2">involve critical and harmful dosage errors</p>
                        <p className="stat-subtext-v2">High-severity failures including wrong drug combinations and contraindicated dosages. Requires automated forensic auditing.</p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label about-section-label"><span className="sl-dash">—</span>OUR APPROACH<span className="sl-dash">—</span></div>
                <h2 className="section-title">A Four-Layer Audit Engine</h2>
            </div>
            
            <div className="audit-pipeline-diagram reveal-up">
                <div className="flow-box blue-box">
                    <div className="flow-title">User Query + Retrieved Chunks + Generated Answer</div>
                    <div className="flow-tag blue-tag">Input Data</div>
                </div>
                
                <div className="flow-arrow">→</div>
                <div className="flow-box green-box">
                    <div className="flow-title">Module 1: Faithfulness Scorer</div>
                    <div className="flow-tag green-tag">DeBERTa NLI</div>
                </div>
                
                <div className="flow-arrow">→</div>
                <div className="flow-box green-box">
                    <div className="flow-title">Module 2: Entity Verifier</div>
                    <div className="flow-tag green-tag">SciSpaCy + DrugBank</div>
                </div>
                
                <div className="flow-arrow">→</div>
                <div className="flow-box green-box">
                    <div className="flow-title">Module 3: Source Credibility</div>
                    <div className="flow-tag green-tag">Tier Ranker</div>
                </div>
                
                <div className="flow-arrow">→</div>
                <div className="flow-box green-box">
                    <div className="flow-title">Module 4: Contradiction Detector</div>
                    <div className="flow-tag green-tag">NLI Cross-check</div>
                </div>

                <div className="flow-arrow">→</div>
                <div className="flow-box amber-box glow-box">
                    <div className="flow-title">HRS Score + JSON Audit Report</div>
                    <div className="flow-tag amber-tag">Output Payload</div>
                </div>
            </div>
            
            <p className="pipeline-caption reveal-up">All modules run locally. Zero paid APIs. Full pipeline completes in &lt; 30 seconds on CPU.</p>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label about-section-label"><span className="sl-dash">—</span>THE TEAM<span className="sl-dash">—</span></div>
                <h2 className="section-title">Built by MediRAG</h2>
                <p className="section-subtitle">B.Tech Computer Science & Engineering, 2026 — Amity University Kolkata</p>
            </div>
            
            <div className="team-grid reveal-up">
                <div className="team-card">
                    <div className="avatar bg-dark-green">AS</div>
                    <h3 className="team-name">Alapan Sen</h3>
                    <div className="team-role">Team Lead & Architecture</div>
                    <p className="team-bio">RAG pipeline design, faithfulness scoring, system integration</p>
                    <div className="team-socials">
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>

                <div className="team-card">
                    <div className="avatar bg-dark-blue">BS</div>
                    <h3 className="team-name">Bikram Sardar</h3>
                    <div className="team-role">NLP & Entity Verification</div>
                    <p className="team-bio">SciSpaCy NER, DrugBank integration, entity accuracy module</p>
                    <div className="team-socials">
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>

                <div className="team-card">
                    <div className="avatar bg-dark-purple">JD</div>
                    <h3 className="team-name">Joydeep Das</h3>
                    <div className="team-role">Evaluation & Dashboard</div>
                    <p className="team-bio">RAGAS integration, score aggregation, React SPA UI, FastAPI endpoint</p>
                    <div className="team-socials">
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
                        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="section-header reveal-up">
                <div className="section-label about-section-label"><span className="sl-dash">—</span>IMPACT<span className="sl-dash">—</span></div>
                <h2 className="section-title">Designed with India's Digital Health Future in Mind</h2>
            </div>
            
            <div className="impact-grid reveal-up">
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><line x1="9" y1="22" x2="9" y2="12"></line><line x1="15" y1="22" x2="15" y2="12"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg>
                    </div>
                    <h3 className="impact-title">eSanjeevani</h3>
                    <p className="impact-text">Audit AI advice before it reaches 13+ crore teleconsultation users</p>
                </div>
                
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h3 className="impact-title">ABDM Compliance</h3>
                    <p className="impact-text">Safety layer for AI tools plugged into Ayushman Bharat Digital Mission</p>
                </div>
                
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.3 6.6L14.7 12 9.3 17.4"></path><path d="M10 2v4"></path><path d="M14 2v4"></path><path d="M21 16v-4c0-3.3-2.7-6-6-6H9c-3.3 0-6 2.7-6 6v4"></path></svg>
                    </div>
                    <h3 className="impact-title">ICMR Research</h3>
                    <p className="impact-text">Faithfulness verification for clinical guideline-based QA systems</p>
                </div>
                
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                    </div>
                    <h3 className="impact-title">Pharma AI</h3>
                    <p className="impact-text">Drug interaction and dosage hallucination detection for pharma internal tools</p>
                </div>
                
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    </div>
                    <h3 className="impact-title">Consumer Health</h3>
                    <p className="impact-text">Safety auditing for Practo, Tata 1mg, Apollo 24/7 AI chatbots</p>
                </div>
                
                <div className="impact-card">
                    <div className="impact-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <h3 className="impact-title">CDSCO Regulation</h3>
                    <p className="impact-text">Alignment with upcoming India AI-in-healthcare SaMD regulatory framework</p>
                </div>
            </div>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="tech-philosophy-card reveal-up">
                <div className="philosophy-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                </div>
                <h2 className="section-title">100% Open Source. Zero Cost. Maximum Transparency.</h2>
                
                <div className="philosophy-tags">
                    <div className="ptag ptag-red"><span className="strike">No OpenAI API</span></div>
                    <div className="ptag ptag-green">Runs on Free Colab T4</div>
                    <div className="ptag ptag-green">All Models on HuggingFace</div>
                    <div className="ptag ptag-green">Local LLM via Ollama</div>
                    <div className="ptag ptag-green">Public Benchmark Datasets Only</div>
                </div>
                
                <p className="philosophy-text">
                    Every component — from BioBERT embeddings to DeBERTa NLI scoring to Mistral-7B claim decomposition — is freely available and reproducible. No black boxes. No vendor lock-in. Full audit trail from query to score.
                </p>
            </div>
        </div>
    </section>

    
    <section className="section">
        <div className="section-container">
            <div className="context-grid reveal-up">
                
                <div className="context-card green-context">
                    <div className="context-icon green-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <h3 className="context-title">India Innovates 2026</h3>
                    <div className="context-subtitle">Bharat Mandapam, New Delhi — March 28, 2026</div>
                    <p className="context-desc">MediRAG-Eval was built for India Innovates 2026, demonstrating 3 live modules: RAG backbone, faithfulness scoring, and the high-fidelity React audit dashboard.</p>
                    <div className="context-tag green-tag">Demo-Ready ✓</div>
                </div>
                
                
                <div className="context-card blue-context">
                    <div className="context-icon blue-text">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </div>
                    <h3 className="context-title">B.Tech Major Project</h3>
                    <div className="context-subtitle">Amity University Kolkata — May 2026</div>
                    <p className="context-desc">Full 4-module implementation with RAGAS benchmarks, ablation experiments, FastAPI endpoint, and evaluation on PubMedQA, MedQA-USMLE, and BioASQ 2023 datasets.</p>
                    <div className="context-tag blue-tag">Submission: May 2026</div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="cta-banner reveal-up">
        <div className="cta-banner-content">
            <h2 className="cta-banner-title">Ready to Audit Your Medical AI?</h2>
            <p className="cta-banner-subtext">Run your first evaluation in under 30 seconds. No API key needed.</p>
            <div className="cta-banner-actions">
                <Link to="/chat" className="primary-btn-white large" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>Try the Demo →</Link>
                <a href="https://github.com/JoyTheSloth/MediRAG" target="_blank" rel="noopener noreferrer" className="secondary-btn large" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>View on GitHub</a>
            </div>
        </div>
    </section>

    
    
    </>
  );
};

export default About;