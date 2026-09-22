const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const crypto = require("node:crypto")
const { sendPasswordResetEmail } = require("../services/email.service")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
    const username = req.body.username?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

    if (!username || !email || !password) {
        return res.status(400).json({
            code: "MISSING_FIELDS",
            message: "Username, email and password are required."
        })
    }

    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ code: "INVALID_USERNAME", message: "Username must be between 3 and 30 characters." })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ code: "INVALID_EMAIL", message: "Please enter a valid email address." })
    }

    if (password.length < 8) {
        return res.status(400).json({ code: "WEAK_PASSWORD", message: "Password must contain at least 8 characters." })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            code: "ACCOUNT_EXISTS",
            message: "An account already exists with this email or username. Please sign in."
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })


    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ code: "ACCOUNT_EXISTS", message: "An account already exists with this email or username. Please sign in." })
        }
        console.error("Registration error:", error.message)
        return res.status(500).json({ code: "REGISTRATION_FAILED", message: "Unable to create your account right now. Please try again." })
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).json({ code: "MISSING_FIELDS", message: "Email and password are required." })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            code: "ACCOUNT_NOT_FOUND",
            message: "No account was found with this email. Please register first."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            code: "INVALID_CREDENTIALS",
            message: "Incorrect password. Please try again."
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    return res.status(200).json({
        message: "Logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    } catch (error) {
        console.error("Login error:", error.message)
        return res.status(500).json({ code: "LOGIN_FAILED", message: "Unable to sign in right now. Please try again." })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

async function forgotPasswordController(req, res) {
    try {
        const email = req.body.email?.trim().toLowerCase()

        if (!email) {
            return res.status(400).json({ message: "Email is required." })
        }

        const user = await userModel.findOne({ email })

        // Always return the same response so attackers cannot discover accounts.
        if (!user) {
            return res.status(200).json({ message: "If an account exists for this email, a password reset link has been sent." })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000
        await user.save()

        try {
            await sendPasswordResetEmail({ to: user.email, username: user.username, resetToken })
        } catch (emailError) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save()
            throw emailError
        }

        return res.status(200).json({ message: "If an account exists for this email, a password reset link has been sent." })
    } catch (error) {
        console.error("Forgot password error:", error.message)
        return res.status(500).json({ message: "Unable to send the reset email right now. Please try again." })
    }
}

async function resetPasswordController(req, res) {
    try {
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must contain at least 8 characters." })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." })
        }

        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: "This reset link is invalid or has expired." })
        }

        user.password = await bcrypt.hash(password, 10)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })

        return res.status(200).json({ message: "Password reset successfully. You can now sign in." })
    } catch (error) {
        console.error("Reset password error:", error.message)
        return res.status(500).json({ message: "Unable to reset the password right now. Please try again." })
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController
}
