import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight, Laptop, Smartphone, Headphones, Watch, Gamepad } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recRes, prodRes] = await Promise.all([
          api.get(`/api/ai/recommendations${user ? `?userId=${user.id}` : ''}`),
          api.get('/api/products')
        ]);
        setRecommendations(recRes.data);
        setFeaturedProducts(prodRes.data.filter(p => p.isFeatured || p.rating >= 4.7).slice(0, 8));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="glass-panel" style={{
        padding: '4rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(49, 46, 129, 0.4) 100%)',
        border: '1px solid rgba(129, 140, 248, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.2rem',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Sparkles size={16} /> Powered by ElectroShop AI Engine
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
            Next-Gen E-Commerce, <br />
            <span className="gradient-text">Guided by Artificial Intelligence</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Ask natural language queries like <em>"Find me a laptop under ₹70,000 for Java development"</em> or compare products with instant AI analysis.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/ai-assistant" className="btn-ai" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
              <Sparkles size={20} /> Ask AI Assistant
            </Link>
            <Link to="/products" className="btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Shop by Category</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.2rem'
        }}>
          {[
            { name: 'Laptop', icon: <Laptop size={28} color="#38bdf8" />, count: 'High performance' },
            { name: 'Mobile', icon: <Smartphone size={28} color="#818cf8" />, count: 'Flagships & 5G' },
            { name: 'Accessories', icon: <Headphones size={28} color="#c084fc" />, count: 'Audio & Gear' },
            { name: 'Wearable', icon: <Watch size={28} color="#f43f5e" />, count: 'Smartwatches' },
            { name: 'Gaming', icon: <Gamepad size={28} color="#10b981" />, count: 'Consoles & Monitors' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.name}`}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.8rem',
                transition: 'var(--transition)'
              }}
            >
              {cat.icon}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{cat.name}</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended For You Section with AI Explanation */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles className="text-purple-400" /> Recommended For You
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Personalized by AI based on browsing, cart & product specifications</p>
          </div>
          <Link to="/products" style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading AI Recommendations...</div>
        ) : (
          <div className="product-grid">
            {recommendations.map((item, idx) => (
              <ProductCard
                key={idx}
                product={item.product}
                recommendationReason={item.explanation}
              />
            ))}
          </div>
        )}
      </section>

      {/* Budget Assistant Teaser Banner */}
      <section className="glass-panel flex-between" style={{
        padding: '2.5rem',
        marginBottom: '3.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>💡 Smart Budget Assistant</h3>
          <p style={{ color: '#cbd5e1', maxWidth: '500px' }}>
            Looking for gadgets strictly within your budget? Input your target price & purpose to get AI Ranked Matches with score breakdowns.
          </p>
        </div>
        <Link to="/budget-assistant" className="btn-primary" style={{ background: '#10b981' }}>
          Find Products Within Budget <ArrowRight size={18} />
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Trending & Top Rated</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
