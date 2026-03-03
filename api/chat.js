const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, contextPrompt } = req.body;

        // 2. Initialize Gemini using your secure .env variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Combine the system prompt and user message
        const fullPrompt = `${contextPrompt}\n\nUser: ${message}\nGuide:`;

        // 4. Generate the response
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        // 5. Send it back to your frontend
        return res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Serverless API Error:", error);
        return res.status(500).json({ error: "The festival spirits are sleeping. Try again!" });
    }
}