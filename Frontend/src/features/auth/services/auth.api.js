import axios from "axios";
import { API_BASE_URL } from "../../../config/api.js";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

const authHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const saveToken = (data) => {
    if (data?.token) localStorage.setItem("authToken", data.token);
    return data;
};

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return saveToken(response.data);
    } catch (err) {
        console.error("Network Layer Exception: Registration failed ->", err);
        throw err; // Propagate down to UI handlers
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        return saveToken(response.data);
    } catch (err) {
        console.error("Network Layer Exception: Login verification failed ->", err);
        throw err;
    }
}

export async function googleLogin(idToken) {
    const response = await api.post("/api/auth/google", { idToken });
    return saveToken(response.data);
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout", { headers: authHeaders() });
        localStorage.removeItem("authToken");
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Log-out pipeline failure ->", err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me", { headers: authHeaders() });
        return response.data;
    } catch (err) {
        console.error("Network Layer Exception: Token extraction failed ->", err);
        throw err;
    }
}

export async function forgotPassword(email) {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword(token, password, confirmPassword) {
    const response = await api.post(`/api/auth/reset-password/${token}`, { password, confirmPassword });
    return response.data;
}
