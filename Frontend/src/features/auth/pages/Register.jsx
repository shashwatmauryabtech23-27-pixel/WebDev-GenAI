import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import "../auth.form.scss"; // <-- MISSING STYLE COUPLING ADDED

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loading, handleRegister } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await handleRegister({ username, email, password });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create your account. Please try again.");
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
                {error && <div className="form-error" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value); }}
                            type="text" id="username" name='username' placeholder='Enter username' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value); }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value); }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>

                    <button type="submit" className='auth-submit'>Create account</button>
                </form>

                <p className="auth-switch">Already have an account? <Link to={"/login"}>Sign in</Link></p>
            </div>
        </main>
    );
};

export default Register;
