import React, { useEffect, useRef, useState } from 'react';
import './Chatbot.css';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { token, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your career assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMsg.text, history: messages.slice(-6) })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.message || 'Chat failed');
      }
      const reply = data.reply || '...';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I had an issue replying. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button className={`chatbot-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Chatbot">
        <span className="chatbot-fab-icon">💬</span>
      </button>

      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-logo">🤖</span>
              <span>Career Assistant</span>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`chatbot-msg ${m.role}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg assistant"><div className="bubble">Typing…</div></div>
            )}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask about careers, colleges, courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
