import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

// Header Component
const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-logo">✨</div>
          <div>
            <h1 className="header-title">ChatAI Pro</h1>
            <p className="header-subtitle">Next-generation AI conversation</p>
          </div>
        </div>
        <div className="header-status">
          <div className="status-dot"></div>
          <span className="status-text">Online</span>
        </div>
      </div>
    </header>
  );
};

// Input Area Component
const InputArea = ({ prompt, setPrompt, onSend, isLoading }) => {
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="input-area">
      <div className="input-content">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... I'm here to help!"
            className="textarea"
            rows="1"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!prompt.trim() || isLoading}
          className="send-button"
          title="Send message (Enter)"
        >
          {isLoading ? (
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          ) : (
            <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-messages">
      <div className="messages-content">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h2 className="empty-state-title">Welcome to ChatAI Pro</h2>
            <p className="empty-state-text">
              Start a conversation
              Ask questions, get creative, or just have a chat!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.sender}`}>
                <div className={`message ${message.sender}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message ai">
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                  <span style={{ marginLeft: '12px', color: '#9ca3af' }}>
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

// Main Chat Interface Parent Component
const ChatInterface = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = { sender: 'user', content: prompt.trim() };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    // Simulate AI response with more realistic delay
    const responses = [
      "That's a great question! Let me think about this...",
      "I'd be happy to help you with that. Here's what I think...",
      "Interesting! Based on what you've asked, I can provide some insights...",
      "Thanks for asking! This is definitely something I can help with...",
      "Great point! Let me break this down for you..."
    ];

    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiMessage = { 
        sender: 'ai', 
        content: randomResponse + "\n\nThis is a simulated response. Replace this with your actual AI integration to get real, intelligent responses!"
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="chat-container">
      <Header />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <InputArea 
        prompt={prompt}
        setPrompt={setPrompt}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;