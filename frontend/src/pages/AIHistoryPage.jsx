import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AIHistoryPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/ai/conversations/user/${user.id}`);
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/ai/conversations/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
      addToast('Deleted conversation', 'info');
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Sparkles color="#c084fc" /> AI Conversation History
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading AI history...</div>
      ) : conversations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3>No AI conversations saved</h3>
          <p style={{ color: '#94a3b8', margin: '0.8rem 0' }}>Your questions asked to ElectroShop AI Assistant will be stored here.</p>
          <Link to="/ai-assistant" className="btn-ai">Open AI Assistant</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {conversations.map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '1.2rem 1.8rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MessageSquare size={20} color="#818cf8" />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{c.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Saved on {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/ai-assistant" className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  Continue Chat <ArrowRight size={14} />
                </Link>
                <button onClick={() => handleDelete(c.id)} className="icon-btn" style={{ color: '#f43f5e' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIHistoryPage;
