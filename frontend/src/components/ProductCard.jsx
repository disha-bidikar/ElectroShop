import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Star, Heart, Sparkles } from 'lucide-react';
import api from '../services/api';

const ProductCard = ({ product, isWishlistedInitial = false, recommendationReason }) => {
  const { addToCart, comparedProducts, toggleCompare } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial);

  const isCompared = comparedProducts.some(p => p.id === product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('Please login to manage wishlist', 'error');
      return;
    }
    try {
      await api.post(`/api/wishlist/toggle?userId=${user.id}&productId=${product.id}`);
      setIsWishlisted(!isWishlisted);
      addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'success');
    } catch (err) {
      addToast('Wishlist operation failed', 'error');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <span className="product-category-tag">{product.category}</span>
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "#f43f5e" : "none"} />
        </button>
        <Link to={`/products/${product.id}`} style={{ width: '100%', height: '100%' }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/200?text=Gadget'}
            alt={product.name}
            className="product-image"
          />
        </Link>
      </div>

      <div>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <p className="product-brand">{product.brand}</p>

        {recommendationReason && (
          <div style={{
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, rgba(129,140,248,0.15) 0%, rgba(192,132,252,0.15) 100%)',
            border: '1px solid rgba(129,140,248,0.3)',
            color: '#c084fc',
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            marginBottom: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Sparkles size={12} />
            <span>{recommendationReason}</span>
          </div>
        )}

        {product.specs && (
          <div className="product-specs-snippet" title={product.specs}>
            {product.specs}
          </div>
        )}
      </div>

      <div>
        <div className="product-price-row">
          <span className="product-price">₹{product.price?.toLocaleString()}</span>
          <div className="product-rating">
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
            onClick={() => addToCart(product.id)}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>

          <label className="compare-checkbox-label" title="Select to compare with AI">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => toggleCompare(product)}
            />
            <span>Compare</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
