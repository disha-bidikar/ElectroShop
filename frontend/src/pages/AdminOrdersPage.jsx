import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { ShoppingBag } from 'lucide-react';
import api from '../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status?status=${newStatus}`);
      addToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <ShoppingBag color="#38bdf8" /> Manage All Customer Orders ({orders.length})
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3>No customer orders placed yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '1.8rem', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', pb: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>Order #{order.id}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>User ID: {order.userId} | Address: {order.shippingAddress}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '0.4rem 0.8rem', background: 'rgba(15,23,42,0.8)', border: '1px solid #38bdf8', borderRadius: '8px', color: 'white', fontWeight: 700 }}
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ background: 'rgba(15,23,42,0.6)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'white', fontWeight: 600 }}>{item.product?.name}</span> (x{item.quantity})
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

export default AdminOrdersPage;
