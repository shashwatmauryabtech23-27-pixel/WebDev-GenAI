const mongoose = require("mongoose")



async function connectToDB() {
    const mongoUri = process.env.MONGO_URI

    if (!mongoUri) {
        throw new Error("MONGO_URI is missing in Backend/.env")
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
    console.log("MongoDB connected")
}

module.exports = connectToDB
