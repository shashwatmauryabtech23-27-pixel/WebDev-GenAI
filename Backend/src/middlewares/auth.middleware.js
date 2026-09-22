const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
        const token = req.cookies?.token || bearerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not provided. Please login again."
            });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next(); // Agle controller par jao
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

module.exports = { authUser };
