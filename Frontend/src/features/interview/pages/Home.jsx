import React, { useEffect, useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Loader from '../../auth/components/Loader';

const Home = () => {
    const { loading, generateReport, getReports, reports = [] } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [fileName, setFileName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
        // Load once when the protected workspace opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    }

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        if (!jobDescription.trim()) {
            alert("Please provide an AI Application Prompt to synthesize your codebase!");
            return;
        }
        const resumeFile = resumeInputRef.current?.files[0]
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (error) {
            console.error("Application Synthesis Failed:", error);
            alert("System core was unable to sync synthesis pipeline. Please check your prompt constraints or try again.");
        }
    }

    if (loading) {
        return <Loader message="Compiling Architectural Neural Layers & Generating Sandbox Workspace..." />
    }

    return (
        <div className='home-page'>

            <header className='page-header'>
                <h1>Orchestrate Your <span className='highlight'>WebDev GenAI</span> App</h1>
                <p>Pass your text description, logic prompt, or existing layouts to build enterprise production-ready full-stack architectures.</p>
            </header>

            <form onSubmit={handleGenerateReport} className='interview-card'>
                <div className='interview-card__body'>

                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                            </span>
                            <h2>AI Application Prompt</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Describe what app or component you want to generate...\ne.g. 'A futuristic dark mode task dashboard with drag-and-drop lists, sleek charts, and an interactive side navigation using Tailwind CSS...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    <div className='panel-divider' />

                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                            </span>
                            <h2>Technical Configuration</h2>
                        </div>

                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Reference Layout Docs
                                <span className='badge badge--best'>Enhanced Model Context</span>
                            </label>
                            <label className={`dropzone ${fileName ? 'dropzone--active' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    {fileName ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5322d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    )}
                                </span>
                                <p className='dropzone__title'>{fileName ? fileName : 'Click to sync mockups or boilerplate text'}</p>
                                <p className='dropzone__subtitle'>{fileName ? 'File attached successfully' : 'PDF, DOCX, or Text Files (Max 5MB)'}</p>
                                <input ref={resumeInputRef} onChange={handleFileChange} hidden type='file' id='resume' name='resume' accept='.pdf,.docx,.txt' />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR SPECIFY CONFIG</span></div>

                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Custom Framework Constraints</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Specify tech stack preferences or state structures if any (e.g. 'Use Redux toolkit for state, strict functional components, semantic HTML5, and pure CSS variable themes')..."
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2" /></svg>
                            </span>
                            <p>Providing clear architectural constraints yields high-fidelity standalone component codebases.</p>
                        </div>
                    </div>
                </div>

                <div className='interview-card__footer'>
                    <span className='footer-info'>Neural Code Synthesis Active &bull; Compiles in ~30s</span>
                    <button type='submit' className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Synthesize Full-Stack Application
                    </button>
                </div>
            </form>

            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent AI Applications</h2>
                    <div className='reports-list'>
                        {reports.map(report => (
                            <div
                                key={report._id}
                                className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || 'Untitled Sandbox Project'}</h3>
                                <p className='report-meta'>Compiled on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <span className={`match-score`}>Optimization Index: {report.matchScore || 100}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

<section className="feature-highlights">
                <h2 className="feature-highlights__title">Work Your Way</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="feature-card__preview">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/006/924/840/non_2x/artificial-intelligence-technology-flat-illustration-free-vector.jpg"
                                alt="Practice on Web"
                            />
                        </div>
                        <div className="feature-card__content">
                            <h3>Practice on Web</h3>
                            <p>Generate architectures, run mock interviews, and manage your sandbox — all from your browser.</p>
                            <span className="feature-card__arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                            </span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__preview">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/006/924/840/non_2x/artificial-intelligence-technology-flat-illustration-free-vector.jpg"
                                alt="Track Anywhere"
                            />
                        </div>
                        <div className="feature-card__content">
                            <h3>Track Anywhere</h3>
                            <p>Keep tabs on your performance logs and skill gaps, right from your phone whenever you're free.</p>
                            <span className="feature-card__arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                            </span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__preview">
                            <img
                                src="https://media.istockphoto.com/id/1300845620/vector/job-interview-flat-vector-illustration.jpg?s=612x612&w=0&k=20&c=jQ0YV5wJZOb5oTfN5C6ZP4pR5U6yqZ0FQ3n5V5xJQ5s="
                                alt="Built for Teams"
                            />
                        </div>
                        <div className="feature-card__content">
                            <h3>Built for Teams</h3>
                            <p>Onboard cohorts, share templates, and scale your interview-prep workflow across a team.</p>
                            <span className="feature-card__arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="premium-banner">
                <div className="premium-banner__text">
                    <h2>Get more with Premium</h2>
                    <ul>
                        <li>✓ Unlimited AI feedback reports</li>
                        <li>✓ Advanced skill gap analysis</li>
                        <li>✓ Priority code synthesis queue</li>
                    </ul>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="premium-banner__btn">
                        ★ Start Building
                    </button>
                </div>
                <div className="premium-banner__image">
                    <img
                        src="https://media.istockphoto.com/id/1300845620/vector/job-interview-flat-vector-illustration.jpg?s=612x612&w=0&k=20&c=jQ0YV5wJZOb5oTfN5C6ZP4pR5U6yqZ0FQ3n5V5xJQ5s="
                        alt="Premium features illustration"
                    />
                </div>
            </section>

        </div>
    )
}

export default Home
