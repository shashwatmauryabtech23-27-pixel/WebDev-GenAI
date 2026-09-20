const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",").map(origin => origin.trim().replace(/\/$/, "")).filter(Boolean)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true)
        return callback(new Error(`CORS blocked origin: ${origin}`))
    },
    credentials: true
}))

app.get("/", (req, res) => res.json({ success: true, message: "WebDev GenAI Backend is running" }))
app.get("/api/health", (req, res) => res.json({ success: true, message: "WebDev GenAI API is running" }))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use((err, req, res, next) => {
    console.error("Request error:", err.message)
    res.status(err.message.startsWith("CORS blocked") ? 403 : 500).json({ message: err.message.startsWith("CORS blocked") ? "This website origin is not allowed by the API." : "Internal server error" })
})



module.exports = app
