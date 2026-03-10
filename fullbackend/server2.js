import express from "express"
import axios from "axios"

const router = express.Router()

router.post("/chat", async(req, res) => {
    try {

        const { message } = req.body

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions", {
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: message }
                ]
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        )

        res.json(response.data)

    } catch (error) {
        res.status(500).json({
            error: "AI request failed"
        })
    }
})

export default router