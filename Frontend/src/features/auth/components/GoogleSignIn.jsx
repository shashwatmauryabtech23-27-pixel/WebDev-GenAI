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

    return (
        <button type="button" className="google-signin" onClick={handleClick} disabled={loading}>
            <svg className="google-logo" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.614Z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.468-.806 5.956-2.181l-2.909-2.258c-.806.54-1.836.859-3.047.859-2.344 0-4.328-1.584-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
                <path fill="#FBBC05" d="M3.963 10.706A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.038l3.007-2.332Z" />
                <path fill="#EA4335" d="M9 3.58c1.322 0 2.508.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58Z" />
            </svg>
            {loading ? "Signing in…" : "Continue with Google"}
        </button>
    );
}
