import React, { useState, useEffect } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useParams } from 'react-router';
import Navbar from './Navbar.jsx';

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>) },
    { id: 'plan', label: 'Preparation Plan', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
];

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='q-card' style={{ flexShrink: 0 }}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Why the interviewer asks this</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>How to answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const BlueprintStep = ({ step, index }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {step.day || index + 1}</span>
            <h3 className='roadmap-day__focus'>{step.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(step.tasks || []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
);

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical');
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
                <h1>Loading your interview report...</h1>
            </main>
        );
    }

    const scoreColor =
        (report.matchScore ?? 0) >= 80 ? 'score--high' :
        (report.matchScore ?? 0) >= 60 ? 'score--mid' : 'score--low';

    const technicalQuestions = report.technicalQuestions || [];
    const behavioralQuestions = report.behavioralQuestions || [];
    const preparationPlan = report.preparationPlan || [];
    const skillGaps = report.skillGaps || [];

    return (
        <div className="main-app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0b0e14' }}>
            
            <Navbar />

            <div className='interview-page' style={{ flexGrow: 1, height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
                <div className='interview-layout' style={{ height: '100%' }}>

                    {/* Left Workspace Navigation */}
                    <nav className='interview-nav'>
                        <div className="nav-content">
                            <p className='interview-nav__label'>Interview Report</p>
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
                            Download ATS Resume (PDF)
                        </button>
                    </nav>

                    <div className='interview-divider' />

                    {/* Center Code / Blueprint View */}
                    <main className='interview-content' style={{ overflowY: 'auto', height: '100%' }}>
                        {activeNav === 'technical' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>Technical Interview Questions</h2>
                                    <span className='content-header__count'>{technicalQuestions.length} Questions</span>
                                </div>
                                <div className='q-list' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {technicalQuestions.map((question, i) => (
                                        <QuestionCard key={i} item={question} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>Behavioral Interview Questions</h2>
                                    <span className='content-header__count'>{behavioralQuestions.length} Questions</span>
                                </div>
                                <div className='q-list' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {behavioralQuestions.map((question, i) => (
                                        <QuestionCard key={i} item={question} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'plan' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className='content-header'>
                                    <h2>Your Preparation Plan</h2>
                                    <span className='content-header__count'>{preparationPlan.length} Days</span>
                                </div>
                                <div className='roadmap-list' style={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '2rem' }}>
                                    {preparationPlan.map((step, i) => (
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
                            <p className='match-score__label'>Job Match Score</p>
                            <div className={`match-score__ring ${scoreColor}`}>
                                <span className='match-score__value'>{report.matchScore ?? 0}</span>
                                <span className='match-score__pct'>%</span>
                            </div>
                            <p className='match-score__sub'>AI-assisted resume and role estimate</p>
                            {report.scoreBreakdown && (
                                <div style={{ textAlign: 'left', marginTop: '1rem', fontSize: '.85rem' }}>
                                    {[
                                        ['eligibility', 'Eligibility', 10],
                                        ['programming', 'Programming', 20],
                                        ['data', 'Data and databases', 15],
                                        ['coreSkills', 'Core role skills', 45],
                                        ['domain', 'Domain experience', 10]
                                    ].map(([key, label, maximum]) => (
                                        <p key={key} style={{ margin: '.55rem 0' }}>
                                            <strong>{label}: {Math.min(maximum, Math.max(0, Math.round(Number(report.scoreBreakdown[key]?.points) || 0)))}/{maximum}</strong>
                                            <br />{report.scoreBreakdown[key]?.evidence}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='sidebar-divider' />

                        <div className='skill-gaps'>
                            <p className='skill-gaps__label'>Skills to Improve</p>
                            <div className='skill-gaps__list'>
                                {skillGaps.length > 0 ? (
                                    skillGaps.map((gap, i) => (
                                        <span key={i} className={`skill-tag skill-tag--${gap.severity || 'medium'}`}>
                                            {gap.skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="skill-tag skill-tag--low">No major skill gaps found</span>
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
