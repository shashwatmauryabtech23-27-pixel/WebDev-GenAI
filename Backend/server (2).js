require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing")
    process.exit(1)
}

connectToDB().then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})).catch(() => process.exit(1))
