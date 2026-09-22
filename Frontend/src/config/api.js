const localHosts = new Set(["localhost", "127.0.0.1"])
const runningLocally = typeof window !== "undefined" && localHosts.has(window.location.hostname)

const configuredApiUrl = runningLocally
    ? import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000"
    : import.meta.env.VITE_API_URL

if (!configuredApiUrl) {
    throw new Error("VITE_API_URL is required for deployed frontend builds.")
}

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, "")
