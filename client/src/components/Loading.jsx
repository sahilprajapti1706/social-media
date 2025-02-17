import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="chat-loading-container">
            <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;
