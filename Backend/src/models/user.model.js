const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },

    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: function () { return !this.googleId }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    passwordResetToken: String,
    passwordResetExpires: Date
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
