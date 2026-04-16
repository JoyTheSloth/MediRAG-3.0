import React, { useEffect } from 'react';

const Research = () => {
    // Re-trigger animations
    useEffect(() => {
        const counters = document.querySelectorAll('.research-counter');
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
        <div className="research-page">
            <style>{`
                .research-page {
                    min-height: 100vh;
                    padding-top: 120px;
                    padding-bottom: 80px;
                }
                .research-header {
                    text-align: center;
                    margin-bottom: 60px;
                }
                .tag-label {
                    background: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    padding: 6px 14px;
                    border-radius: 99px;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    display: inline-block;
                    margin-bottom: 16px;
                    border: 1px solid rgba(56, 189, 248, 0.2);
                }
                .ablation-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 60px;
                }
                .ablation-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 30px;
                }
                .bar-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .bar-label {
                    width: 130px;
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.8);
                }
                .bar-track {
                    flex-grow: 1;
                    height: 12px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 99px;
                    overflow: hidden;
                    position: relative;
                }
                .bar-fill {
                    height: 100%;
                    border-radius: 99px;
                    position: relative;
                }
                .bar-val {
                    width: 45px;
                    text-align: right;
                    font-weight: 700;
                    font-size: 14px;
                }
                .ragas-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-top: 30px;
                }
                .ragas-dial {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 24px 16px;
                    text-align: center;
                    transition: transform 0.2s;
                }
                .ragas-dial:hover {
                    transform: translateY(-5px);
                    border-color: rgba(0, 200, 150, 0.3);
                }
                .dial-value {
                    font-size: 36px;
                    font-weight: 900;
                    background: linear-gradient(135deg, #00C896, #00A37A);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }
                .dial-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .failure-modes {
                    margin-top: 80px;
                }
                .fm-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-top: 30px;
                }
                .fm-card {
                    background: #111827;
                    border: 1px solid #1f2937;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .fm-header {
                    background: #1f2937;
                    padding: 12px 20px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .fm-header.red { border-bottom: 2px solid #ef4444; color: #ef4444; }
                .fm-header.green { border-bottom: 2px solid #10b981; color: #10b981; }
                
                .fm-body {
                    padding: 20px;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #d1d5db;
                }
                
                @media(max-width: 768px) {
                    .ablation-grid, .fm-grid { grid-template-columns: 1fr; }
                    .ragas-grid { grid-template-columns: 1fr 1fr; }
                }
            `}</style>

            <div className="section-container">
                <div className="research-header reveal-up">
                    <div className="tag-label">Empirical Studies & Benchmarks</div>
                    <h1 className="section-title" style={{ fontSize: '3rem' }}>The Science of Safety</h1>
                    <p className="section-desc" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        MediRAG is built on rigorous ablation studies and RAGAS framework benchmarking. 
                        We don't just prompt-engineer; we mathematically verify the consistency and faithfulness of clinical outputs.
                    </p>
                </div>

                <div className="ablation-grid reveal-up">
                    <div className="ablation-card">
                        <h3 style={{ marginBottom: '8px' }}>Accuracy Ablation</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>Clinical accuracy across pipeline iterations.</p>
                        
                        <div className="bar-row">
                            <div className="bar-label">Base Llama 3 8B</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '45%', background: '#ef4444' }}></div>
                            </div>
                            <div className="bar-val" style={{ color: '#ef4444' }}>45%</div>
                        </div>
                        <div className="bar-row">
                            <div className="bar-label">Naive RAG</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '72%', background: '#f59e0b' }}></div>
                            </div>
                            <div className="bar-val" style={{ color: '#f59e0b' }}>72%</div>
                        </div>
                        <div className="bar-row">
                            <div className="bar-label">MediRAG Stack</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '94%', background: 'linear-gradient(90deg, #00C896, #00A37A)' }}>
                                    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.2)', animation: 'pulse 2s infinite'}}></div>
                                </div>
                            </div>
                            <div className="bar-val" style={{ color: '#00C896' }}>94%</div>
                        </div>
                    </div>

                    <div className="ablation-card">
                        <h3 style={{ marginBottom: '8px' }}>Hallucination Mitigation</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>Unflagged hallucinations slipping into user response.</p>
                        
                        <div className="bar-row">
                            <div className="bar-label">Base Llama 3 8B</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '38%', background: '#ef4444' }}></div>
                            </div>
                            <div className="bar-val" style={{ color: '#ef4444' }}>38%</div>
                        </div>
                        <div className="bar-row">
                            <div className="bar-label">Naive RAG</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '15%', background: '#f59e0b' }}></div>
                            </div>
                            <div className="bar-val" style={{ color: '#f59e0b' }}>15%</div>
                        </div>
                        <div className="bar-row">
                            <div className="bar-label">MediRAG Stack</div>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: '2%', background: '#00C896' }}></div>
                            </div>
                            <div className="bar-val" style={{ color: '#00C896' }}>2%</div>
                        </div>
                    </div>
                </div>

                <div className="ragas-metrics reveal-up">
                    <h2 className="section-title" style={{ textAlign: 'left', fontSize: '24px', marginBottom: '8px' }}>RAGAS Benchmarks (PubMedQA)</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>Evaluating retrieval quality and generation consistency across a 500-question sample.</p>
                    
                    <div className="ragas-grid">
                        <div className="ragas-dial">
                            <div className="dial-value">0.<span className="research-counter" data-target="96">0</span></div>
                            <div className="dial-label">Faithfulness</div>
                        </div>
                        <div className="ragas-dial">
                            <div className="dial-value">0.<span className="research-counter" data-target="91">0</span></div>
                            <div className="dial-label">Answer Relevance</div>
                        </div>
                        <div className="ragas-dial">
                            <div className="dial-value">0.<span className="research-counter" data-target="88">0</span></div>
                            <div className="dial-label">Context Precision</div>
                        </div>
                        <div className="ragas-dial">
                            <div className="dial-value">0.<span className="research-counter" data-target="93">0</span></div>
                            <div className="dial-label">Context Recall</div>
                        </div>
                    </div>
                </div>

                <div className="failure-modes reveal-up">
                    <div className="tag-label" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.2)' }}>Transparency</div>
                    <h2 className="section-title" style={{ textAlign: 'left', fontSize: '32px' }}>Known Failure Modes (The "Why")</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                        Why standard RAG fails in healthcare, and how our NLI pipeline catches the errors before the physician sees them.
                    </p>

                    <div className="fm-grid">
                        {/* Example 1 */}
                        <div className="fm-card">
                            <div className="fm-header red">
                                <span>⚠️ Standard RAG Output (Unsafe)</span>
                            </div>
                            <div className="fm-body">
                                <strong>Corpus Context:</strong> "Patient was given 500mg Metformin and responded well, though 850mg was considered." <br/><br/>
                                <strong>LLM Gen:</strong> "The patient should be given 850mg of Metformin as they respond well to it." <br/><br/>
                                <span style={{color:'#ef4444'}}>Issue: Semantic confusion. Suggesting the hypothetical dose as the prescribed dose.</span>
                            </div>
                        </div>

                        <div className="fm-card">
                            <div className="fm-header green">
                                <span>🛡️ MediRAG NLI Judge</span>
                            </div>
                            <div className="fm-body">
                                <strong>Claim Decomposition:</strong> <br/>
                                1. Patient should be given 850mg Metformin.<br/>
                                2. Patient responds well to 850mg.<br/><br/>
                                <strong>DeBERTa NLI Verdict:</strong> <br/>
                                Claim 1: <span style={{color:'#ef4444'}}>CONTRADICTION</span> (Score: 0.89)<br/>
                                Claim 2: <span style={{color:'#ef4444'}}>CONTRADICTION</span> (Score: 0.92)<br/>
                                <strong style={{color:'#00C896'}}>Action: Generation blocked. Hallucination Risk: CRITICAL.</strong>
                            </div>
                        </div>

                        {/* Example 2 */}
                        <div className="fm-card">
                            <div className="fm-header red">
                                <span>⚠️ Standard RAG Output (Unsafe)</span>
                            </div>
                            <div className="fm-body">
                                <strong>Corpus Context:</strong> "Ampicillin is effective against the Gram-positive bacteria." <br/><br/>
                                <strong>LLM Gen:</strong> "Ampicillin is an antibiotic effective against Gram-positive bacteria and most viral infections." <br/><br/>
                                <span style={{color:'#ef4444'}}>Issue: Phantom Knowledge. LLM hallucinated the 'viral infections' part from its pre-training weights, ignoring context.</span>
                            </div>
                        </div>

                        <div className="fm-card">
                            <div className="fm-header green">
                                <span>🛡️ MediRAG Entity Extractor</span>
                            </div>
                            <div className="fm-body">
                                <strong>SciSpaCy Entity Matcher:</strong><br/>
                                Medical Entities in Context: `[Ampicillin, Gram-positive bacteria]`<br/>
                                Medical Entities in Output: `[Ampicillin, Gram-positive bacteria, viral infections]`<br/><br/>
                                <strong>Verification Verdict:</strong><br/>
                                Entity 'viral infections' <span style={{color:'#ef4444'}}>NOT FOUND IN SOURCE</span>.<br/>
                                <strong style={{color:'#00C896'}}>Action: Entity highlighted in red on heatmap. Warning issued for Unverified Claim.</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Research;
