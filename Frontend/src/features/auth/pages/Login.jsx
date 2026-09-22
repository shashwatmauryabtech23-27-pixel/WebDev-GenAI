import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader'; // <-- CORRECTED PATH

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrorCode("");
        try {
            await handleLogin({ email: email.trim(), password });
            navigate('/');
        } catch (err) {
            setErrorCode(err.response?.data?.code || "");
            setError(err.response?.data?.message || "Unable to sign in. Please check your details.");
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
                {location.state?.passwordReset && <div className="form-success" role="status">Password reset successfully. Sign in with your new password.</div>}
                {error && <div className="form-error" role="alert">{error} {errorCode === "ACCOUNT_NOT_FOUND" && <Link to="/register">Create account</Link>}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); }}
                            type="email" id="email" name='email' placeholder='Enter email address' autoComplete="email" required />
                    </div>
                    <div className="input-group">
                        <div className="input-label-row"><label htmlFor="password">Password</label><Link to="/forgot-password">Forgot password?</Link></div>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); }}
                            type="password" id="password" name='password' placeholder='Enter password' autoComplete="current-password" required />
                    </div>
                    <button type="submit" className='auth-submit' disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
                </form>
                <p className="auth-switch">New to WebDev GenAI? <Link to={"/register"}>Create account</Link></p>
            </div>
        </main>
    );
};

export default Login;
