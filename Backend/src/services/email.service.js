const nodemailer = require("nodemailer")

function createTransporter() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured")
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    })
}

async function sendPasswordResetEmail({ to, username, resetToken }) {
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

    await createTransporter().sendMail({
        from: `WebDev GenAI <${process.env.GMAIL_USER}>`,
        to,
        subject: "Reset your WebDev GenAI password",
        text: `Hi ${username}, reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`,
        html: `<p>Hi ${username},</p><p>Click the link below to reset your password. It expires in 15 minutes.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can safely ignore this email.</p>`
    })
}

module.exports = { sendPasswordResetEmail }
