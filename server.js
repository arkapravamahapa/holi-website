import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the frontend files from the 'public' folder
app.use(express.static('public'));

// --- SECURE BACKEND API ROUTE ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message, contextPrompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
            return res.status(500).json({ error: "Server missing Gemini API Key in .env file." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: contextPrompt + "\n\nUser Question/Statement: " + message }] }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });

    } catch (error) {
        console.error("Backend AI Error:", error);
        res.status(500).json({ error: "The festival spirits are quiet right now. Try again!" });
    }
});

// --- KEEP-AWAKE PING ROUTE ---
app.get('/api/wakeup', (req, res) => {
    res.status(200).json({ status: "AI is awake and ready!" });
});

// Start the server (Only run this locally, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Holi Backend Server running on http://localhost:${PORT}`);
    });
}

// VERCEL REQUIREMENT: Export the Express app so Vercel can use it
export default app;