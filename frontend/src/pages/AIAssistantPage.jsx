import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Send, Bot, User, Trash2, Plus, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AIAssistantPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to ElectroShop AI Assistant! How can I help you today? Ask me about laptops for programming, smartphones, or best budget deals!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Find me a laptop under ₹70,000 for Java development.",
    "I need a phone with a good camera under ₹30,000.",
    "Which laptop is best for programming?",
    "Show me products suitable for students.",
    "Which product gives the best value for money?"
  ];

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/api/ai/conversations/user/${user.id}`);
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadConversation = async (convId) => {
    try {
      setActiveConvId(convId);
      const res = await api.get(`/api/ai/conversations/${convId}`);
      setMessages(res.data);
    } catch (err) {
      addToast('Failed to load conversation history', 'error');
    }
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([
      {
        role: 'assistant',
        content: 'New AI Chat session started. Ask me any natural language question about ElectroShop inventory!'
      }
    ]);
  };

  const handleDeleteConv = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/ai/conversations/${convId}`);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConvId === convId) startNewChat();
      addToast('Conversation deleted', 'info');
    } catch (err) {
      addToast('Failed to delete conversation', 'error');
    }
  };

  const handleSend = async (userQuery) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim() || loading) return;

    if (!userQuery) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        message: textToSend,
        userId: user?.id,
        conversationId: activeConvId
      });

      if (!activeConvId && res.data.conversationId) {
        setActiveConvId(res.data.conversationId);
        fetchConversations();
      }

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
    <div style={{ display: 'grid', gridTemplateColumns: user ? '280px 1fr' : '1fr', gap: '2rem', height: 'calc(100vh - 160px)' }}>
      {/* Left Sidebar: Saved AI Conversations */}
      {user && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <button onClick={startNewChat} className="btn-ai" style={{ width: '100%', marginBottom: '1.2rem', justifyContent: 'center' }}>
            <Plus size={18} /> New Conversation
          </button>

          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
            Saved Conversations
          </h4>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className="flex-between"
                style={{
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  background: activeConvId === conv.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: activeConvId === conv.id ? '1px solid #38bdf8' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                  <MessageSquare size={16} color="#818cf8" />
                  <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>
                    {conv.title || 'Conversation'}
                  </span>
                </div>
                <button onClick={(e) => handleDeleteConv(e, conv.id)} style={{ background: 'none', color: '#64748b' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.8rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '50%' }}>
            <Bot color="#38bdf8" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>ElectroShop AI Assistant</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ask natural language questions about laptops, phones, prices & specifications</p>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div style={{ padding: '0.8rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.6rem', overflowX: 'auto' }}>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', whiteSpace: 'nowrap', borderRadius: '50px' }}
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                gap: '0.8rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div className={`avatar-box ${msg.role === 'user' ? 'avatar-user' : 'avatar-ai'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} color="#38bdf8" />}
              </div>

              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`} style={{ maxWidth: '100%', fontSize: '0.95rem' }}>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>

                {/* Embedded Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                      📦 Matching Database Products:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                      {msg.products.map(p => (
                        <div
                          key={p.id}
                          className="flex-between"
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '0.8rem'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: '0.2rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem' }}>{p.specs}</div>
                            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>₹{p.price?.toLocaleString()}</span>
                          </div>
                          <Link to={`/products/${p.id}`} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            View <ArrowRight size={12} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles className="animate-spin" size={18} color="#818cf8" /> AI is querying products & generating response...
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '1.2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.8rem', background: 'rgba(15, 23, 42, 0.6)' }}>
          <input
            type="text"
            placeholder="Type your natural language query (e.g. Find laptop under 70000)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.85rem 1.2rem',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" className="btn-ai" disabled={loading} style={{ padding: '0.85rem 1.5rem' }}>
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;
