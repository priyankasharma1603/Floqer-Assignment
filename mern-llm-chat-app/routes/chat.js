const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to handle chat prompts
router.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        const response = await axios.post('https://api.groq.com/v1/llm/query', 
            { prompt, max_tokens: 150 },
            { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
        );
        res.json({ reply: response.data.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get response from LLM' });
    }
});

module.exports = router;
