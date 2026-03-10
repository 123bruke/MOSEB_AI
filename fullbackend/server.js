import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import aiRoutes from "./routes/ai.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/ai", aiRoutes)

app.get("/", (req, res) => {
    res.json({ message: "MOSEB AI backend running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})