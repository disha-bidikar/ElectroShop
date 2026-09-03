import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import api from '../services/api';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/wishlist/${user.id}`);
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Heart color="#f43f5e" fill="#f43f5e" /> My Wishlist ({wishlist.length})
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading wishlist...</div>
      ) : wishlist.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
          <h3>Your wishlist is empty</h3>
          <p style={{ color: '#94a3b8', margin: '0.8rem 0' }}>Click the heart icon on any product to save it here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(item => (
            <ProductCard key={item.id} product={item.product} isWishlistedInitial={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
