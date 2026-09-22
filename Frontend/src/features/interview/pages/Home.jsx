import React, { useEffect, useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Loader from '../../auth/components/Loader';

const Home = () => {
    const { loading, generateReport, getReports, reports = [] } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
        // Load once when the protected workspace opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            setResumeFile(null)
            setFileName("")
            return
        }
        if (file.type !== "application/pdf") {
            alert("Please select a PDF resume.")
            e.target.value = ""
            setResumeFile(null)
            setFileName("")
            return
        }
        if (file.size > 3 * 1024 * 1024) {
            alert("Resume PDF must be smaller than 3MB.")
            e.target.value = ""
            setResumeFile(null)
            setFileName("")
            return
        }

        setResumeFile(file)
        setFileName(file.name)
    }

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        if (!jobDescription.trim()) {
            alert("Please paste the job description first.");
            return;
        }
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload your resume PDF or add a short self description.");
            return;
        }
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (error) {
            console.error("Interview report generation failed:", error);
            alert(error.response?.data?.message || "Unable to generate the report. Please check your details and try again.");
        }
    }

    if (loading) {
        return <Loader message="Analyzing your profile and preparing your interview report..." />
    }

    return (
        <div className='home-page'>

            <header className='page-header'>
                <h1>Prepare Smarter with <span className='highlight'>WebDev GenAI</span></h1>
                <p>Upload your resume and paste a job description to get a personalized interview plan.</p>
            </header>

            <form onSubmit={handleGenerateReport} className='interview-card'>
                <div className='interview-card__body'>

                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                            </span>
                            <h2>Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the complete job description here...\ne.g. role, required skills, responsibilities and experience.`}
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
                            <h2>Your Profile</h2>
                        </div>

                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Recommended</span>
                            </label>
                            <label className={`dropzone ${fileName ? 'dropzone--active' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    {fileName ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e5322d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    )}
                                </span>
                                <p className='dropzone__title'>{fileName ? fileName : 'Click to upload your resume'}</p>
                                <p className='dropzone__subtitle'>{fileName ? 'Resume attached successfully' : 'PDF only (Max 3MB)'}</p>
                                <input onChange={handleFileChange} hidden type='file' id='resume' name='resume' accept='.pdf,application/pdf' />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR ADD DETAILS</span></div>

                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Self Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Tell us about your skills, education, projects and experience..."
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2" /></svg>
                            </span>
                            <p>A detailed resume or self description helps AI create more relevant questions and advice.</p>
                        </div>
                    </div>
                </div>

                <div className='interview-card__footer'>
                    <span className='footer-info'>Powered by Gemini AI &bull; Usually takes about 30 seconds</span>
                    <button type='submit' className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate Interview Report
                    </button>
                </div>
            </form>

            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>Recent Interview Reports</h2>
                    <div className='reports-list'>
                        {reports.map(report => (
                            <div
                                key={report._id}
                                className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || 'Interview Preparation Report'}</h3>
                                <p className='report-meta'>Created on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <span className='match-score'>Job Match: {report.matchScore ?? 0}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    )
}

export default Home
