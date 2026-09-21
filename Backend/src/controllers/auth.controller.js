const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

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



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
