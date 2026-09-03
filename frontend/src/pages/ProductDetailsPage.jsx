import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Star, Sparkles, CheckCircle2, XCircle, ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // New review form
  const [rating, setRating] = useState(5.0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [pRes, rRes, sumRes] = await Promise.all([
          api.get(`/api/products/${id}${user ? `?userId=${user.id}` : ''}`),
          api.get(`/api/products/${id}/reviews`),
          api.get(`/api/products/${id}/ai-review-summary`)
        ]);
        setProduct(pRes.data);
        setReviews(rRes.data);
        setAiSummary(sumRes.data);
      } catch (err) {
        console.error(err);
        addToast('Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to write a review', 'error');
      return;
    }
    if (!comment.trim()) {
      addToast('Please enter a review comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/api/products/${id}/reviews`, {
        userId: user.id,
        rating: Number(rating),
        comment: comment.trim()
      });
      setReviews(prev => [res.data, ...prev]);
      setComment('');
      addToast('Review posted successfully! 🌟', 'success');

      // Refresh AI Review Summary
      const sumRes = await api.get(`/api/products/${id}/ai-review-summary`);
      setAiSummary(sumRes.data);
    } catch (err) {
      addToast('Failed to post review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Product not found</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
        <ArrowLeft size={16} /> Back to Products
      </button>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
        {/* Left Column: Image Gallery */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '420px', borderRadius: '20px' }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Right Column: Info & Buy */}
        <div>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
            {product.category}
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.8rem', marginBottom: '0.4rem' }}>{product.name}</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1rem' }}>Brand: <strong style={{ color: 'white' }}>{product.brand}</strong></p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700 }}>
              <Star fill="#fbbf24" size={20} /> {product.rating ? product.rating.toFixed(1) : '4.5'}
            </div>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{reviews.length} Customer Reviews</span>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', marginBottom: '1.5rem' }}>
            ₹{product.price?.toLocaleString()}
          </div>

          <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.8rem', fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Specs Table */}
          {product.specs && (
            <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#38bdf8', marginBottom: '0.6rem' }}>Key Specifications</h4>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {product.specs}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
              onClick={() => addToCart(product.id)}
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              className="btn-ai"
              style={{ padding: '0.9rem 1.5rem', fontSize: '1rem' }}
              onClick={() => { addToCart(product.id); navigate('/cart'); }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* AI Review Summary Card */}
      {aiSummary && (
        <section className="glass-panel" style={{
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '3.5rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(49, 46, 129, 0.4) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Sparkles className="text-purple-400" size={24} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Review Summary</h2>
          </div>

          <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1.5rem', fontStyle: 'italic' }}>
            "{aiSummary.summary}"
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
                <CheckCircle2 size={18} /> What Buyers Love (Pros)
              </h4>
              <ul style={{ listStyle: 'none', color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiSummary.pros?.map((pro, idx) => (
                  <li key={idx}>✓ {pro}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
                <XCircle size={18} /> Common Complaints (Cons)
              </h4>
              <ul style={{ listStyle: 'none', color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiSummary.cons?.map((con, idx) => (
                  <li key={idx}>⚠️ {con}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customer Reviews ({reviews.length})</h2>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Write a Customer Review</h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: '0.4rem 0.8rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
            >
              <option value="5">5.0 ★★★★★ (Excellent)</option>
              <option value="4">4.0 ★★★★☆ (Good)</option>
              <option value="3">3.0 ★★★☆☆ (Average)</option>
              <option value="2">2.0 ★★☆☆☆ (Poor)</option>
              <option value="1">1.0 ★☆☆☆☆ (Terrible)</option>
            </select>
          </div>

          <textarea
            placeholder="Write your honest review feedback about this product..."
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'white',
              marginBottom: '1rem'
            }}
          />

          <button type="submit" className="btn-primary" disabled={submittingReview}>
            <Send size={16} /> Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-panel" style={{ padding: '1.2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>👤 {rev.username || 'Verified Buyer'}</span>
                <div style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 600 }}>
                  ★ {rev.rating} / 5
                </div>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
