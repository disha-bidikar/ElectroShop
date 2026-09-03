import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Lock, User, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please enter both username and password', 'error');
      return;
    }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      addToast('Welcome back to ElectroShop AI! 👋', 'success');
      navigate('/');
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleDemoFill = (usr, pwd) => {
    setUsername(usr);
    setPassword(pwd);
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '4rem auto',
      padding: '2.5rem',
      borderRadius: '20px'
    }} className="glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
          <ShoppingBag color="#38bdf8" size={32} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.3rem' }}>
          Login to access cart, wishlist & personalized AI assistance
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Demo credentials helper */}
      <div style={{
        marginTop: '1.8rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        border: '1px dashed rgba(255,255,255,0.1)',
        fontSize: '0.8rem'
      }}>
        <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem' }}>🔑 Quick Demo Logins:</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleDemoFill('user', 'user123')}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            User: user / user123
          </button>
          <button
            onClick={() => handleDemoFill('admin', 'admin123')}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: '#f43f5e' }}
          >
            Admin: admin / admin123
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
