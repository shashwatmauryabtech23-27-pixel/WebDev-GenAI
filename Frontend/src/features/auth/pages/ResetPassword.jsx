import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/auth.api";
import "../auth.form.scss";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await resetPassword(token, password, confirmPassword);
            navigate("/login", { replace: true, state: { passwordReset: true } });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to reset the password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <Link to="/" className="auth-brand">WebDev<span>GenAI</span></Link>
                <div><span className="auth-kicker">Choose a new password</span><h1>Secure your account.</h1><p>Use a new password with at least 8 characters.</p></div>
                <div className="auth-proof"><strong>One-time reset link.</strong><span>The link expires after 15 minutes.</span></div>
            </section>
            <div className="form-container">
                <div className="form-heading"><span>Almost done</span><h2>Create a new password</h2><p>Enter and confirm your new password.</p></div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group"><label htmlFor="password">New password</label><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" id="password" autoComplete="new-password" minLength="8" required /></div>
                    <div className="input-group"><label htmlFor="confirm-password">Confirm password</label><input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" id="confirm-password" autoComplete="new-password" minLength="8" required /></div>
                    <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? "Updating password…" : "Reset password"}</button>
                </form>
                <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
            </div>
        </main>
    );
}
