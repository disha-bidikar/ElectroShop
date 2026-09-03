import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/api/ai/cart-suggestions${user ? `?userId=${user.id}` : ''}`);
        setAiSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [user, cartItems]);

  if (!user) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', margin: '4rem auto', borderRadius: '20px' }}>
        <ShoppingBag size={48} color="#38bdf8" style={{ marginBottom: '1rem' }} />
        <h2>Please Login</h2>
        <p style={{ color: '#94a3b8', margin: '0.8rem 0 1.5rem' }}>Login to view and manage your shopping cart.</p>
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <ShoppingCart color="#38bdf8" /> My Cart ({cartItems.length})
      </h1>

      {cartItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3>Your cart is empty</h3>
          <p style={{ color: '#94a3b8', margin: '0.8rem 0 1.5rem' }}>Discover top electronics and add items to your cart.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <img
                  src={item.product?.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.product?.name}
                  style={{ width: '90px', height: '90px', objectFit: 'contain', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', padding: '0.4rem' }}
                />

                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>{item.product?.category}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.2rem 0' }}>{item.product?.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{item.product?.specs}</p>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.4rem' }}>
                    ₹{item.product?.price?.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Qty: <strong>{item.quantity}</strong></span>
                  <button onClick={() => removeFromCart(item.id)} className="icon-btn" title="Remove item" style={{ color: '#f43f5e' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* AI Cart Assistant Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(49, 46, 129, 0.3) 100%)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#c084fc' }}>
                  <Sparkles size={18} /> AI Cart Assistant Suggestions
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Customers frequently pair your cart items with these accessories in stock:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {aiSuggestions.map((p) => (
                    <div key={p.id} style={{ background: 'rgba(15,23,42,0.8)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', marginBottom: '0.2rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800, marginBottom: '0.5rem' }}>₹{p.price?.toLocaleString()}</div>
                      <button onClick={() => addToCart(p.id)} className="btn-primary" style={{ width: '100%', padding: '0.3rem', fontSize: '0.75rem' }}>
                        + Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#cbd5e1' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#cbd5e1' }}>
              <span>Shipping</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', color: '#cbd5e1' }}>
              <span>AI Protection & Warranty</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Included</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: '#38bdf8' }}>₹{cartTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.8rem', padding: '0.9rem', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
