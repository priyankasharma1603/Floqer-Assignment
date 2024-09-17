import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);

        // Send the prompt to the backend
        const response = await axios.post('/api/chat/ask', { prompt: input });
        
        const botMessage = { text: response.data.reply, sender: 'bot' };
        setMessages([...messages, newMessage, botMessage]);
        setInput('');
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something about the data..." 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
