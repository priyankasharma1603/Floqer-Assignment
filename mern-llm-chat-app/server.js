const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Body parser to handle JSON requests
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API route to handle LLM or Groq API requests
app.post('/api/chat', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ message: 'User input is required' });
    }

    try {
        // Example call to Groq API (modify as needed based on actual API)
        const groqResponse = await axios.post('https://api.groq.com/v1/query', {
            input: userInput
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Return Groq API response
        return res.status(200).json(groqResponse.data);

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
