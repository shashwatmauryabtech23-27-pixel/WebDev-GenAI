import React from 'react';
import '../style/home.scss'; // Reuse common styles

const Tools = () => {
    const allTools = [
        { title: "Mock Interview", icon: "🎙️", desc: "AI-powered real-time interviews." },
        { title: "Resume Matcher", icon: "📄", desc: "Compare resume with job description." },
        { title: "Code Assessor", icon: "💻", desc: "Evaluate your webdev snippets." },
        { title: "Performance Logs", icon: "📊", desc: "Track your progress over time." },
        { title: "Behavioral AI", icon: "🧠", desc: "Analyze soft skills and communication." },
        { title: "Salary Estimator", icon: "💰", desc: "Get market-standard salary insights." }
    ];

    return (
        <div className="landing-page">
            <main className="main-container" style={{ paddingTop: "2rem" }}>
                <header className="hero-section">
                    <h1>All AI Interview Tools</h1>
                    <p>Select a tool below to start your preparation journey.</p>
                </header>

                <section className="tools-grid-layout" style={{ marginTop: "2rem" }}>
                    {allTools.map((tool, index) => (
                        <div key={index} className="tool-card-item">
                            <div className="tool-card-header">
                                <span className="tool-icon-box">{tool.icon}</span>
                            </div>
                            <h3 className="tool-card-title">{tool.title}</h3>
                            <p className="tool-card-desc">{tool.desc}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Tools;