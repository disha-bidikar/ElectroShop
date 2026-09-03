import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Heart, Sparkles, MessageSquare, LogOut } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const [cRes, oRes] = await Promise.all([
          api.get(`/api/ai/conversations/user/${user.id}`),
          api.get(`/api/orders/user/${user.id}`)
        ]);
        setConversations(cRes.data);
        setOrders(oRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Profile Card */}
      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800 }}>
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{user.username}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{user.email || `${user.username}@electroshop.com`}</p>
            <span style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: isAdmin ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              color: isAdmin ? '#f43f5e' : '#38bdf8',
              border: `1px solid ${isAdmin ? '#f43f5e' : '#38bdf8'}`
            }}>
              {isAdmin ? '🛡️ Administrator' : '👤 Customer'}
            </span>
          </div>
        </div>

        <button onClick={logout} className="btn-secondary" style={{ borderColor: '#f43f5e', color: '#f43f5e' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Link to="/orders" className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package color="#38bdf8" size={32} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{orders.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Orders</div>
          </div>
        </Link>

        <Link to="/wishlist" className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Heart color="#f43f5e" size={32} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Wishlist</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Saved Favorites</div>
          </div>
        </Link>

        <Link to="/ai-history" className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Sparkles color="#c084fc" size={32} />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{conversations.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>AI Conversations</div>
          </div>
        </Link>
      </div>

      {/* Saved AI Conversations Preview */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles className="text-purple-400" size={20} /> Saved AI Conversations
          </h3>
          <Link to="/ai-history" style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>Manage History →</Link>
        </div>

        {conversations.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No saved AI chat history yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {conversations.slice(0, 5).map(c => (
              <Link key={c.id} to="/ai-assistant" style={{ padding: '0.8rem 1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MessageSquare size={16} color="#818cf8" />
                <span style={{ fontSize: '0.9rem', color: 'white' }}>{c.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
