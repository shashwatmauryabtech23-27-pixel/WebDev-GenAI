import { useState } from "react";
import { isFirebaseConfigured, signInWithFirebaseGoogle } from "../services/firebase";

export default function GoogleSignIn({ onSuccess, onError }) {
    const [loading, setLoading] = useState(false);

    if (!isFirebaseConfigured) return <p className="google-config-note">Google sign-in will appear after Firebase setup.</p>;

    const handleClick = async () => {
        setLoading(true);
        try {
            const idToken = await signInWithFirebaseGoogle();
            await onSuccess(idToken);
        } catch (error) {
            if (error?.code !== "auth/popup-closed-by-user") onError(error);
        } finally {
            setLoading(false);
        }
    };

    return <button type="button" className="google-signin" onClick={handleClick} disabled={loading}><span className="google-g">G</span>{loading ? "Signing in…" : "Continue with Google"}</button>;
}
