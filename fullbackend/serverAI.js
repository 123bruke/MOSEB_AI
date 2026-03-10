async function askAI() {

    const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Hello AI"
        })
    })

    const data = await res.json()

    console.log(data)
}