import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am ElectroShop AI Assistant. Ask me anything like "Find me a laptop under ₹70,000 for Java development" or "Best phone under ₹30,000".'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        message: userText,
        userId: user?.id
      });
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.data.reply, products: res.data.recommendedProducts }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'I apologize, but I encountered an error connecting to AI services. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="floating-ai-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Open ElectroShop AI Assistant"
      >
        <Sparkles size={28} />
      </div>

      {isOpen && (
        <div className="ai-drawer glass-panel">
          <div className="ai-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot color="#38bdf8" size={22} />
              <div>
                <h4 style={{ color: 'white', fontSize: '1rem', margin: 0 }}>ElectroShop AI</h4>
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online Context Assistant</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => { setIsOpen(false); navigate('/ai-assistant'); }}
                title="Expand to Full Assistant Page"
                style={{ background: 'none', color: '#94a3b8' }}
              >
                <ExternalLink size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="ai-drawer-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              >
                {msg.content}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ marginTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.4rem' }}>
                      Recommended Products:
                    </div>
                    {msg.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { setIsOpen(false); navigate(`/products/${p.id}`); }}
                        style={{
                          fontSize: '0.8rem',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '0.3rem 0.5rem',
                          borderRadius: '4px',
                          marginBottom: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        🛍️ {p.name} - ₹{p.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-ai" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                🤖 AI is thinking & retrieving products...
              </div>
            )}
          </div>

          <form className="ai-drawer-footer" onSubmit={handleSend}>
            <input
              type="text"
              className="ai-drawer-input"
              placeholder="Ask AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.6rem' }} disabled={loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
