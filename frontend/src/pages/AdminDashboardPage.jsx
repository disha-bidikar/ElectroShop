import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Package, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Loading admin metrics...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#f43f5e' }}>
            <Shield size={32} /> Admin Control Center
          </h1>
          <p style={{ color: '#94a3b8' }}>Manage inventory, AI descriptions, orders, and system statistics</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/products" className="btn-primary" style={{ background: '#f43f5e' }}>
            <Package size={18} /> Product Catalog & AI Copy
          </Link>
          <Link to="/admin/orders" className="btn-secondary">
            <ShoppingBag size={18} /> Manage Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Total Users</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #818cf8' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Total Products</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalProducts || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Total Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>₹{stats?.totalRevenue?.toLocaleString()}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Total Orders</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalOrders || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #c084fc' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>AI Queries / Sessions</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>{stats?.totalAIConversations || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
