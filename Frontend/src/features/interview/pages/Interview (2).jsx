import React, { useState, useEffect } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useParams } from 'react-router';
import Navbar from './Navbar.jsx';

const NAV_ITEMS = [
    { id: 'architecture', label: 'System Architecture', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>) },
    { id: 'boilerplate', label: 'Generated Codebase', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'roadmap', label: 'Deployment Blueprint', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
];

const CodeModuleCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='q-card' style={{ flexShrink: 0 }}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>M{index + 1}</span>
                <p className='q-card__question'>{item.moduleName || item.question || 'Core Module'}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Functional Scope</span>
                        <p style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.scope || item.intention || 'Defines the algorithmic boundaries of this component block.'}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Source Snapshot / Specifications</span>
                        <pre style={{ 
                            background: '#1c2230', 
                            padding: '1rem', 
                            borderRadius: '0.5rem', 
                            overflowX: 'auto', 
                            color: '#e6edf3', 
                            fontFamily: 'monospace', 
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            <code>{item.codeBlock || item.answer}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

const BlueprintStep = ({ step, index }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Phase {step.day || index + 1}</span>
            <h3 className='roadmap-day__focus'>{step.focus || step.title || 'Deployment Objective'}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(step.tasks || step.instructions || []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
);

const Interview = () => {
    const [activeNav, setActiveNav] = useState('architecture');
    const { report, getReportById, loading, getResumePdf } = useInterview();
    const { interviewId } = useParams();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    // getReportById is supplied by the context and keyed by the route id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId]);

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Compiling Sandbox Environment...</h1>
            </main>
        );
    }

    const scoreColor =
        (report.matchScore || 100) >= 80 ? 'score--high' :
        (report.matchScore || 100) >= 60 ? 'score--mid' : 'score--low';

    const architectureModules = report.technicalQuestions || [];
    const coreCodebase = report.behavioralQuestions || [];
    const executionPlan = report.preparationPlan || [];
    const systemDependencies = report.skillGaps || [];

    return (
        <div className="main-app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0b0e14' }}>
            
            <Navbar />

            <div className='interview-page' style={{ flexGrow: 1, height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
                <div className='interview-layout' style={{ height: '100%' }}>

                    {/* Left Workspace Navigation */}
                    <nav className='interview-nav'>
                        <div className="nav-content">
                            <p className='interview-nav__label'>Workspace Trees</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='interview-nav__icon'>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { getResumePdf(interviewId); }}
                            className='button primary-button' >
                            <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-4-4h3V4h2v8h3l-4 4zm9-4H3v8h18v-8z"/></svg>
                            Export Source Build (.zip)
                        </button>
                    </nav>

                    <div className='interview-divider' />

                    {/* Center Code / Blueprint View */}
                    <main className='interview-content' style={{ overflowY: 'auto', height: '100%' }}>
                        {activeNav === 'architecture' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>System Architecture Specifications</h2>
                                    <span className='content-header__count'>{architectureModules.length} Micro-services</span>
                                </div>
                                <div className='q-list' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {architectureModules.map((module, i) => (
                                        <CodeModuleCard key={i} item={module} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'boilerplate' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>Generated Codebase Layer</h2>
                                    <span className='content-header__count'>{coreCodebase.length} Primary Contexts</span>
                                </div>
                                <div className='q-list' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {coreCodebase.map((module, i) => (
                                        <CodeModuleCard key={i} item={module} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>Deployment Blueprint</h2>
                                    <span className='content-header__count'>{executionPlan.length} Operational Phases</span>
                                </div>
                                <div className='roadmap-list' style={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {executionPlan.map((step, i) => (
                                        <BlueprintStep key={i} step={step} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <div className='interview-divider' />

                    {/* Right System Architecture Sidebar */}
                    <aside className='interview-sidebar' style={{ height: '100%', overflowY: 'auto' }}>
                        <div className='match-score'>
                            <p className='match-score__label'>Optimization Index</p>
                            <div className={`match-score__ring ${scoreColor}`}>
                                <span className='match-score__value'>{report.matchScore || 100}</span>
                                <span className='match-score__pct'>%</span>
                            </div>
                            <p className='match-score__sub'>Clean Code Production Grade</p>
                        </div>

                        <div className='sidebar-divider' />

                        <div className='skill-gaps'>
                            <p className='skill-gaps__label'>System Warnings / Dependencies</p>
                            <div className='skill-gaps__list'>
                                {systemDependencies.length > 0 ? (
                                    systemDependencies.map((dependency, i) => (
                                        <span key={i} className={`skill-tag skill-tag--${dependency.severity || 'high'}`}>
                                            {dependency.skill || dependency.name || 'Core Module'}
                                        </span>
                                    ))
                                ) : (
                                    <span className="skill-tag skill-tag--low">Strict Compilation Success</span>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Interview;
