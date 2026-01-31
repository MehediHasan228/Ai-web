const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { OpenAI } = require('openai');

// @desc Chat with OpenAI using per-user keys
// @route POST /api/ai/chat
exports.chat = async (req, res) => {
    try {
        const { messages, systemPrompt, temperature } = req.body;

        // Fetch user's OpenAI key from DB
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user || (!user.openaiKey && !process.env.OPENAI_API_KEY)) {
            return res.status(400).json({
                message: 'OpenAI API Key not found. Please add it in Settings.'
            });
        }

        const openai = new OpenAI({
            apiKey: user.openaiKey || process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt || "You are a helpful assistant." },
                ...messages
            ],
            temperature: temperature || 0.7,
        });

        res.json({
            content: response.choices[0].message.content,
            usage: response.usage
        });
    } catch (err) {
        console.error('OpenAI Error:', err);
        res.status(err.status || 500).json({
            message: err.message || 'Error communicating with OpenAI'
        });
    }
};

// @desc AI Analysis of Inventory
// @route POST /api/ai/analyze-inventory
exports.analyzeInventory = async (req, res) => {
    try {
        const { items } = req.body; // Array of ingredients from frontend

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const apiKey = user?.openaiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(400).json({
                message: 'OpenAI API Key not found. Please add it in Settings.'
            });
        }

        const openai = new OpenAI({ apiKey });

        // Use requested logic: suggest 2 simple recipes based on provided items
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a professional chef. Suggest 2 simple recipes based on the available ingredients provided. Include a short title and 3-4 steps for each. Return as JSON: { \"suggestion\": \"...text...\", \"suggestions\": [{ \"title\": \"\", \"description\": \"\", \"matchPercent\": 100 }] }"
                },
                {
                    role: "user",
                    content: `I have the following ingredients: ${items?.join(", ") || "Nothing"}. What can I cook?`
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500,
        });

        const result = JSON.parse(response.choices[0].message.content);
        res.json({
            success: true,
            suggestion: result.suggestion,
            suggestions: result.suggestions
        });
    } catch (err) {
        console.error('AI Analysis Error:', err);
        res.status(500).json({ message: 'AI Service is currently unavailable' });
    }
};
