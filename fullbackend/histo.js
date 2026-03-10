import axios from "axios"
import Chat from "../models/Chat.js"

export const askAI = async(req, res) => {

    const { message } = req.body

    try {

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions", {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }]
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        )

        const aiReply = response.data.choices[0].message.content

        await Chat.create({
            userId: req.user.id,
            message,
            response: aiReply
        })

        res.json({ reply: aiReply })

    } catch (error) {
        res.status(500).json({ error: "AI request failed" })
    }
}