const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    ...(process.env.FRONTEND_URL || "").split(","),
    ...(process.env.CORS_ORIGINS || "").split(",")
].map(origin => origin.trim().replace(/\/$/, "")).filter(Boolean))

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header include health checks, Postman and
        // server-to-server calls. Browser origins must be explicitly allowed.
        if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
            return callback(null, true)
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    credentials: true
}))

app.get("/api/health", (req, res) => res.json({ success: true, message: "WebDev GenAI API is running" }))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app
