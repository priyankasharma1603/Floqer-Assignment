import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling

function App() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const res = await axios.post('http://localhost:5000/api/chat', {
                userInput: input
            });
            setResponse(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-app-container">
            <div className="chat-box">
                <h1>Ask the LLM</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your question..."
                        className="chat-input"
                        required
                    />
                    <button type="submit" className="chat-submit-btn" disabled={loading}>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </form>

                {error && <p className="chat-error">{error}</p>}
                {response && (
                    <div className="chat-response">
                        <h3>Response:</h3>
                        <p>{JSON.stringify(response, null, 2)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
