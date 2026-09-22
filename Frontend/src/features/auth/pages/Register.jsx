import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import "../auth.form.scss"; // <-- MISSING STYLE COUPLING ADDED
import GoogleSignIn from '../components/GoogleSignIn';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorCode, setErrorCode] = useState("");

    const { loading, handleRegister, handleGoogleLogin } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrorCode("");
        try {
            await handleRegister({ username: username.trim(), email: email.trim(), password });
            navigate("/");
        } catch (err) {
            setErrorCode(err.response?.data?.code || "");
            setError(err.response?.data?.message || "Unable to create your account. Please try again.");
        }
    };

    const handleGoogle = async (credential) => {
        setError("");
        try {
            await handleGoogleLogin(credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Google sign-up failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <main className="form-loading-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>Provisioning Secure User Node...</h1>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <Link to="/" className="auth-brand">WebDev<span>GenAI</span></Link>
                <div><span className="auth-kicker">Build smarter</span><h1>Your next full-stack project starts with one prompt.</h1><p>Create a secure account and keep every generated architecture and implementation plan together.</p></div>
                <div className="auth-proof"><strong>One workspace, less clutter.</strong><span>From prompt to deployment blueprint.</span></div>
            </section>
            <div className="form-container">
                <div className="form-heading"><span>Start for free</span><h2>Create your account</h2><p>No complicated setup. Start generating in seconds.</p></div>
                {error && <div className="form-error" role="alert">{error} {errorCode === "ACCOUNT_EXISTS" && <Link to="/login">Go to login</Link>}</div>}
                <GoogleSignIn onSuccess={handleGoogle} onError={() => setError("Unable to load Google sign-in.")} />
                <div className="auth-divider"><span>or create with email</span></div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username} onChange={(e) => { setUsername(e.target.value); }}
                            type="text" id="username" name='username' placeholder='Enter username' autoComplete="username" minLength="3" maxLength="30" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email} onChange={(e) => { setEmail(e.target.value); }}
                            type="email" id="email" name='email' placeholder='Enter email address' autoComplete="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password} onChange={(e) => { setPassword(e.target.value); }}
                            type="password" id="password" name='password' placeholder='At least 8 characters' autoComplete="new-password" minLength="8" required />
                    </div>

                    <button type="submit" className='auth-submit' disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
                </form>

                <p className="auth-switch">Already have an account? <Link to={"/login"}>Sign in</Link></p>
            </div>
        </main>
    );
};

export default Register;
