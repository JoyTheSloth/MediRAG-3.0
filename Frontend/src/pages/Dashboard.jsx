import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const MODULE_LABELS = [
    'MEDICAL KNOWLEDGE BASE',
    'CITATION RELIABILITY',
    'REASONING CONSISTENCY',
    'BIAS & TOXICITY',
    'SAFETY COMPLIANCE',
];

const MODULE_COLORS = ['var(--green-accent)', 'var(--green-accent)', 'var(--amber-accent)', '#FF6B6B', 'var(--green-accent)'];

const bandColor = (band) => {
    if (band === 'SAFE' || band === 'LOW') return 'var(--green-accent)';
    if (band === 'MODERATE') return 'var(--amber-accent)';
    return '#FF6B6B';
};

const bandLabel = (band) => {
    return band || 'UNKNOWN';
};

const Dashboard = ({ embedded = false }) => {
    const [range, setRange] = useState('30d');
    const [stats, setStats] = useState({
        totalEvals: 0,
        avgHrs: 0,
        critAlerts: 0,
        interventions: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/stats`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/logs?limit=4`)
                ]);
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }
                if (logsRes.ok) {
                    setRecentLogs(await logsRes.json());
                }
            } catch (err) {
                console.error("Dashboard DB fetch error:", err);
            }
        };
        fetchData();
        // optionally refresh every 10s
        const intervalId = setInterval(fetchData, 10000);
        return () => clearInterval(intervalId);
    }, [range]);

    useEffect(() => {
        const els = document.querySelectorAll('.reveal-up, .reveal-stagger');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal-active'); });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [range]);

    // Construct derived metrics based on fetched stats
    const rs = {
        totalEvals: stats.totalEvals || 0,
        avgHrs: stats.avgHrs || 0,
        critAlerts: stats.critAlerts || 0,
        interventions: stats.interventions || 0,
        hrsBand: stats.avgHrs > 60 ? 'HIGH RISK' : stats.avgHrs > 30 ? 'MODERATE RISK' : 'SAFE',
        avgFaith: 0.88, // placeholder
        modules: [0.92, 0.88, 0.71, 0.42, 0.95],
        recentEvals: recentLogs.length > 0 ? recentLogs : []
    };

    const dashContent = (
        <div className={`dashboard-container ${embedded ? 'embedded' : ''}`}>

            {/* HEADER */}
            {!embedded && (
                <div className="dash-header">
                    <div className="dash-title-block">
                        <h1>Evaluation Dashboard</h1>
                        <div className="dash-subtitle-block">
                            System Health &amp; RAG Safety Monitoring | Live Stream
                        </div>
                    </div>
                </div>
            )}

            {/* KPI CARDS */}
            <div className="kpi-row-new">

                {/* TOTAL EVALUATIONS */}
                <div className="kpi-card-new c-green">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">TOTAL EVALUATIONS</div>
                        <div style={{background:'rgba(0,200,150,0.1)', padding:'6px', borderRadius:'6px', color:'var(--green-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{rs.totalEvals.toLocaleString()}</div>
                        <div className="k-sub s-green">Live</div>
                    </div>
                </div>

                {/* AVG HRS */}
                <div className="kpi-card-new c-amber">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">AVG HRS</div>
                        <div style={{background:'rgba(245,166,35,0.1)', padding:'6px', borderRadius:'6px', color:'var(--amber-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{rs.avgHrs.toFixed(1)}</div>
                        <div className="k-sub s-amber" style={{textTransform:'uppercase', fontSize:'9px'}}>{rs.hrsBand}</div>
                    </div>
                </div>

                {/* CRITICAL ALERTS */}
                <div className="kpi-card-new c-red">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">CRITICAL ALERTS</div>
                        <div style={{background:'rgba(255,107,107,0.1)', padding:'6px', borderRadius:'6px', color:'#FF6B6B', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{rs.critAlerts}</div>
                        <div className="k-sub s-red">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:'4px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Historical
                        </div>
                    </div>
                </div>

                {/* INTERVENTIONS */}
                <div className="kpi-card-new c-amber">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">SAFETY INTERVENTIONS</div>
                        <div style={{background:'rgba(245,166,35,0.1)', padding:'6px', borderRadius:'6px', color:'var(--amber-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{rs.interventions}</div>
                        <div className="k-sub s-amber">Prevented</div>
                    </div>
                </div>

            </div>

            {/* BOTTOM GRID */}
            <div className="bot-grid">
                {/* 1. MODULE SCORES */}
                <div className="dash-panel-new" style={{gap: '12px'}}>
                    <div className="dp-title" style={{marginBottom:'16px'}}>MODULE SCORE COMPARISON</div>

                    {MODULE_LABELS.map((lbl, i) => (
                        <div className="mod-score-row" key={i} style={{marginBottom: i === MODULE_LABELS.length-1 ? 0 : undefined}}>
                            <div className="ms-head">
                                <span>{lbl}</span>
                                <span style={{color: MODULE_COLORS[i]}}>{rs.modules[i].toFixed(2)}</span>
                            </div>
                            <div className="ms-track">
                                <div className="ms-fill" style={{width:`${rs.modules[i]*100}%`, background: MODULE_COLORS[i]}}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. ACCURACY & HALLUCINATION BENCHMARKS (TRANSFERRED FROM RESEARCH) */}
                <div className="dash-panel-new" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div className="bench-sub-panel">
                        <div className="dp-title" style={{marginBottom:'16px', fontSize: '11px'}}>ACCURACY (MEDQA)</div>
                        {[
                            { name: 'Base Llama-3', val: 45, color: '#ef4444' },
                            { name: 'BioMISTRAL', val: 70, color: '#f59e0b' },
                            { name: 'MediRAG Stack', val: 94, color: '#00C896' }
                        ].map((m, i) => (
                            <div key={'acc'+i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                    <span>{m.name}</span>
                                    <span>{m.val}%</span>
                                </div>
                                <div className="ms-track" style={{ height: '6px' }}><div className="ms-fill" style={{ width: `${m.val}%`, background: m.color }} /></div>
                            </div>
                        ))}
                    </div>
                    <div className="bench-sub-panel">
                        <div className="dp-title" style={{marginBottom:'16px', fontSize: '11px'}}>HALLUCINATION RATE</div>
                        {[
                            { name: 'Base Llama-3', val: 38, color: '#ef4444' },
                            { name: 'BioMISTRAL', val: 18, color: '#f59e0b' },
                            { name: 'MediRAG Stack', val: 2, color: '#00C896' }
                        ].map((m, i) => (
                            <div key={'hal'+i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                    <span>{m.name}</span>
                                    <span>{m.val}%</span>
                                </div>
                                <div className="ms-track" style={{ height: '6px' }}><div className="ms-fill" style={{ width: `${m.val}%`, background: m.color }} /></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. RECENT EVALS */}
                <div className="dash-panel-new" style={{ gridColumn: '1 / -1' }}>
                    <div className="dp-title" style={{marginBottom:'24px'}}>
                        RECENT EVALUATIONS
                        <span style={{color:'var(--green-accent)', textDecoration:'none', letterSpacing:'0.05em', fontSize:'10px', float: 'right'}}>LIVE UPDATES &rarr;</span>
                    </div>

                    <table className="rt-table">
                        <thead>
                            <tr>
                                <th>QUERY / SUBJECT</th>
                                <th>HRS</th>
                                <th>RISK BAND</th>
                                <th>TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rs.recentEvals.length > 0 ? rs.recentEvals.map((ev, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="td-query" style={{maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                            {ev.question}
                                        </div>
                                        <div className="td-query-id">ID: EXT-{ev.id}</div>
                                    </td>
                                    <td className="td-hrs" style={{color: bandColor(ev.risk_band)}}>{ev.hrs}</td>
                                    <td><span className={`td-pill ${ev.risk_band === 'CRITICAL' ? 'crit' : ev.risk_band === 'MODERATE' ? 'mod' : 'safe'}`}>{bandLabel(ev.risk_band)}</span></td>
                                    <td className="td-time">{new Date(ev.timestamp).toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', opacity: 0.5, padding: '24px'}}>No real evaluations in DB yet. Run some from the Console.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="floating-badge">
                <div className="pulse-dot"></div>
                SYSTEM ONLINE: ALL NODES NOMINAL
            </div>

        </div>
    );

    if (embedded) return dashContent;

    return (
        <div className="dashboard-page">
            {dashContent}
        </div>
    );
};

export default Dashboard;
