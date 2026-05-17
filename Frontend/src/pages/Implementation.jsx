import React from 'react';
import './Implementation.css';

const Implementation = () => {
    return (
        <div className="impl-container">
            <div className="impl-hero reveal-up">
                <div className="impl-badge">FOR HEALTHCARE BRANDS</div>
                <h1>Middleware Integration Guide</h1>
                <p>Deploy MediRAG as a clinical safety layer between your application and your AI model.</p>
            </div>

            <div className="impl-grid">
                {/* MODE 1: PROXY MODE */}
                <div className="impl-card mode-proxy reveal-up">
                    <div className="impl-card-header">
                        <div className="impl-number">01</div>
                        <h3>The Safe API Proxy (End-to-End)</h3>
                    </div>
                    <p className="impl-card-desc">The easiest way to integrate. Replace your direct LLM calls with a single request to MediRAG. We handle retrieval, generation, and the safety audit.</p>
                    <div className="impl-code-block">
                        <div className="impl-code-title">POST /query</div>
                        <pre>
{`{
  "question": "Can I take aspirin with Warfarin?",
  "use_privacy_shield": true,
  "use_consensus": true
}`}
                        </pre>
                    </div>
                    <div className="impl-benefits">
                        <div className="benefit b-teal">✔ Automatic PHI Redaction</div>
                        <div className="benefit b-teal">✔ Hallucination Blocking</div>
                        <div className="benefit b-teal">✔ Multi-Model Consensus</div>
                    </div>
                </div>

                {/* MODE 2: AUDIT MODE */}
                <div className="impl-card mode-audit reveal-up">
                    <div className="impl-card-header">
                        <div className="impl-number">02</div>
                        <h3>The Forensic Auditor (Post-Gen)</h3>
                    </div>
                    <p className="impl-card-desc">Use your existing RAG pipeline and simply use MediRAG to verify the answer before the patient sees it. Perfect for brands with custom infrastructure.</p>
                    <div className="impl-code-block">
                        <div className="impl-code-title">POST /evaluate</div>
                        <pre>
{`{
  "question": "...",
  "answer": "Generated AI Answer",
  "context_chunks": [ ... ]
}`}
                        </pre>
                    </div>
                    <div className="impl-benefits">
                        <div className="benefit b-amber">✔ Faithfulness Scoring</div>
                        <div className="benefit b-amber">✔ Entity Consistency</div>
                        <div className="benefit b-amber">✔ Clinical Risk Banding</div>
                    </div>
                </div>
            </div>

            <div className="impl-security-section reveal-up">
                <div className="sec-content">
                    <div className="sec-tag">COMPLIANCE</div>
                    <h2>Clinical-Grade Security Architecture</h2>
                    <p>MediRAG is designed to meet the rigorous safety requirements of SaMD Class B and HIPAA standards.</p>
                    
                    <div className="security-cards">
                        <div className="s-card s-card-lock">
                            <div className="s-icon">🔒</div>
                            <h4>Zero-Data Retention</h4>
                            <p>Payloads are processed in-memory. Clinical data is never persisted on our servers.</p>
                        </div>
                        <div className="s-card s-card-shield">
                            <div className="s-icon">🛡️</div>
                            <h4>Hallucination Firewall</h4>
                            <p>Real-time NLI evaluation blocks factually inconsistent claims with 94% accuracy.</p>
                        </div>
                        <div className="s-card s-card-bolt">
                            <div className="s-icon">⚡</div>
                            <h4>Latency Optimized</h4>
                            <p>Global edge distribution ensures safety audits add less than 200ms to your pipeline.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="impl-sdk-section reveal-up">
                <h2>Integrate with your Stack</h2>
                <p>Use our lightweight wrappers or standard HTTP requests to get started in minutes.</p>
                <div className="sdk-grid">
                    <div className="sdk-card sdk-card-py">
                        <div className="sdk-lang">Python</div>
                        <code>pip install medirag-sdk</code>
                        <div className="sdk-features">Async Support • RAGAS Integration</div>
                    </div>
                    <div className="sdk-card sdk-card-node">
                        <div className="sdk-lang">Node.js</div>
                        <code>npm install medirag-node</code>
                        <div className="sdk-features">TypeScript • Edge Middleware Ready</div>
                    </div>
                    <div className="sdk-card sdk-card-go">
                        <div className="sdk-lang">Go</div>
                        <code>go get github.com/medirag/go</code>
                        <div className="sdk-features">High Performance • gRPC Support</div>
                    </div>
                </div>
            </div>

            <div className="impl-flow-section reveal-up">
                <h2>Integration Workflow</h2>
                <div className="impl-steps">
                    <div className="impl-step">
                        <div className="step-num">1</div>
                        <div className="step-content">
                            <h4>🔗 Initialize Connection</h4>
                            <p>Point your backend to the MediRAG API endpoint. Set up your <code>HF_TOKEN</code> for private dataset access.</p>
                        </div>
                    </div>
                    <div className="impl-step">
                        <div className="step-num">2</div>
                        <div className="step-content">
                            <h4>🛡️ Define Safety Thresholds</h4>
                            <p>Set your target <strong>Health Risk Score (HRS)</strong>. We recommend blocking any response with an HRS {'>'} 80.</p>
                        </div>
                    </div>
                    <div className="impl-step">
                        <div className="step-num">3</div>
                        <div className="step-content">
                            <h4>⚡ Configure Interventions</h4>
                            <p>Decide whether to <strong>Regenerate</strong> (fix the answer) or <strong>Block</strong> (show a safety warning) when a risk is detected.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="impl-footer-cta reveal-up">
                <h3>Ready to secure your medical AI?</h3>
                <p>Consult our detailed API documentation for full parameter references and implementation examples.</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                    <button className="primary-btn" onClick={() => window.location.href='/api-docs'}>View Full API Docs</button>
                    <button className="secondary-btn" onClick={() => window.location.href='/api-agent'}>See Governance Live</button>
                </div>
            </div>
        </div>
    );
};

export default Implementation;
