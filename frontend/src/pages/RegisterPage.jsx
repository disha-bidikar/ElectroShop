import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Lock, User, Mail, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please enter both username and password', 'error');
      return;
    }
    setLoading(true);
    const result = await register(username, password, email);
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully! Please login. 🎉', 'success');
      navigate('/login');
    } else {
      addToast(result.message, 'error');
    }
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create Account</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.3rem' }}>
          Sign up to experience AI-powered shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Choose username"
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
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            <input
              type="email"
              placeholder="Enter email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Choose password"
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
          <UserPlus size={18} /> {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#38bdf8', fontWeight: 600 }}>Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
