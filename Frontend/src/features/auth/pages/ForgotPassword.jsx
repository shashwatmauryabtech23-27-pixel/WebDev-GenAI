import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/auth.api";
import "../auth.form.scss";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setSubmitting(true);

        try {
            const data = await forgotPassword(email.trim().toLowerCase());
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to send the reset email. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <Link to="/" className="auth-brand">WebDev<span>GenAI</span></Link>
                <div><span className="auth-kicker">Account recovery</span><h1>Get back to building.</h1><p>We will email you a secure password reset link that expires in 15 minutes.</p></div>
                <div className="auth-proof"><strong>Secure reset link.</strong><span>Your existing password is never emailed.</span></div>
            </section>
            <div className="form-container">
                <div className="form-heading"><span>Reset access</span><h2>Forgot your password?</h2><p>Enter the email address connected to your account.</p></div>
                {message && <div className="form-success" role="status">{message}</div>}
                {error && <div className="form-error" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" id="email" autoComplete="email" placeholder="Enter email address" required />
                    </div>
                    <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? "Sending link…" : "Send reset link"}</button>
                </form>
                <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
            </div>
        </main>
    );
}
