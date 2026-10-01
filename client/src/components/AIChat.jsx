import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, Bot, AlertCircle, Send } from 'lucide-react';
import { getExpenses, getBudget, getGroups } from '../utils/storage';

const QUICK_PROMPTS = [
  'Where am I overspending?',
  'Give me a student budget plan',
  'Summarize my expenses',
  'What category takes most of my money?',
  'How can I reduce unnecessary spending?',
  'Analyze my spending patterns'
];

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text) => {
    const question = text || input;
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const expenses = getExpenses();
      const budget = getBudget();
      const groups = getGroups();

      const response = await fetch('/api/qwen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, expenses, budget, groups })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError(err.message === 'Failed to fetch' 
        ? 'Failed to connect to AI service. Make sure the backend server is running.'
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat">
      {messages.length === 0 ? (
        <div className="ai-welcome">
          <Sparkles size={48} className="ai-sparkles" />
          <h2>Kharcha AI</h2>
          <p>Your AI spending assistant. Ask me anything about your expenses!</p>
          <div className="ai-quick-prompts">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button 
                key={i} 
                className="ai-quick-prompt"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ${msg.role}`}>
              <div className="ai-message-icon">
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="ai-message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="ai-message assistant">
              <div className="ai-message-icon"><Bot size={20} /></div>
              <div className="ai-loading">
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {error && (
        <div className="ai-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="ai-input-area">
        <div className="ai-input-wrapper">
          <input
            type="text"
            className="ai-input"
            placeholder="Ask about your spending..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button 
            className="ai-send-btn" 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        
        {messages.length > 0 && (
          <div className="ai-quick-prompts-small">
             {QUICK_PROMPTS.slice(0, 3).map((prompt, i) => (
              <button 
                key={i} 
                className="ai-quick-prompt small"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
