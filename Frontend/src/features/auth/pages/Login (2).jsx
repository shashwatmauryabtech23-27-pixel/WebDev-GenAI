import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader'; // <-- CORRECTED PATH
import { getAuthError } from '../services/auth.api';

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await handleLogin({ email, password });
            navigate('/');
        } catch (err) {
            setError(getAuthError(err, "sign in"));
        }
    };

    if (loading) {
        return <Loader message="Authenticating Workspace Core & Syncing Session..." />;
    }

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <Link to="/" className="auth-brand">WebDev<span>GenAI</span></Link>
                <div><span className="auth-kicker">AI-powered development</span><h1>Turn your idea into a clear technical blueprint.</h1><p>Generate architecture, starter code and a practical deployment roadmap in one focused workspace.</p></div>
                <div className="auth-proof"><strong>Fast. Focused. Production-ready.</strong><span>Built for developers who want to ship.</span></div>
            </section>
            <div className="form-container">
                <div className="form-heading"><span>Welcome back</span><h2>Sign in to your account</h2><p>Continue building with your saved AI workspaces.</p></div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>
                    <button type="submit" className='auth-submit'>Sign in</button>
                </form>
                <p className="auth-switch">New to WebDev GenAI? <Link to={"/register"}>Create account</Link></p>
            </div>
        </main>
    );
};

export default Login;
