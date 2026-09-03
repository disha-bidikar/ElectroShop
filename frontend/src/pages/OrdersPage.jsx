import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package } from 'lucide-react';
import api from '../services/api';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Loading order history...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Package color="#38bdf8" /> My Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3>No previous orders found</h3>
          <p style={{ color: '#94a3b8', margin: '0.8rem 0' }}>Your completed orders will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{ padding: '1.8rem', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', pb: '1rem', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Order ID: #{order.id}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: order.status === 'DELIVERED' ? '#10b981' : '#38bdf8',
                    border: `1px solid ${order.status === 'DELIVERED' ? '#10b981' : '#38bdf8'}`
                  }}>
                    ● Status: {order.status}
                  </span>

                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                    Total: ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
                    <img
                      src={item.product?.imageUrl || 'https://via.placeholder.com/60'}
                      alt={item.product?.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.product?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Qty: {item.quantity} x ₹{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
