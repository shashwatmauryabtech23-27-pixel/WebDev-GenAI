import axios from "axios";

const configuredUrl = import.meta.env.VITE_API_URL?.trim();
export const API_URL = (configuredUrl || "http://localhost:3000").replace(/\/$/, "");

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 20000
});

export function getAuthError(err, action = "sign in") {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
    if (!err.response) {
        if (location.protocol === "https:" && API_URL.startsWith("http://")) {
            return "The production API URL is not configured securely. Add VITE_API_URL in Netlify.";
        }
        return `Cannot reach the server at ${API_URL}. Check the deployment and VITE_API_URL.`;
    }
    return `Unable to ${action}. Server returned ${err.response.status}.`;
}

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Registration failed ->", err);
        throw err; // Propagate down to UI handlers
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email: email.trim().toLowerCase(), password
        });
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Login verification failed ->", err);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Log-out pipeline failure ->", err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Token extraction failed ->", err);
        throw err;
    }
}
