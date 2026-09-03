import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Search, Sparkles, Filter, Scale, RefreshCw } from 'lucide-react';
import api from '../services/api';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  const { comparedProducts, clearCompare } = useCart();
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiThinking(true);
    addToast('AI is interpreting your request & filtering database...', 'ai');

    try {
      const res = await api.post('/api/ai/search', { query: searchQuery });
      setProducts(res.data);
      addToast(`AI returned ${res.data.length} matching products! ✨`, 'success');
    } catch (err) {
      addToast('AI Search failed. Using standard search.', 'error');
    } finally {
      setAiThinking(false);
    }
  };

  const filteredProducts = isAIMode ? products : products.filter((item) =>
    (category === 'All' || item.category.toLowerCase() === category.toLowerCase()) &&
    item.price <= maxPrice &&
    (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div>
      {/* Header Banner & Search */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Electronics</h1>
            <p style={{ color: '#94a3b8' }}>Browse flagship laptops, smartphones, accessories & gaming gear</p>
          </div>

          <button
            onClick={() => { setIsAIMode(!isAIMode); fetchProducts(); }}
            className={isAIMode ? "btn-ai" : "btn-secondary"}
          >
            <Sparkles size={18} /> {isAIMode ? "Ask AI Search (Active)" : "Switch to Ask AI Search"}
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={isAIMode ? handleAISearch : (e) => e.preventDefault()} style={{ display: 'flex', gap: '0.8rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }} />
            <input
              type="text"
              placeholder={
                isAIMode
                  ? 'Ask AI e.g. "Show me laptops under ₹80,000 with at least 16GB RAM"...'
                  : 'Search gadgets by name, brand, or specifications...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 3rem',
                background: 'var(--bg-card)',
                border: isAIMode ? '1px solid #818cf8' : '1px solid var(--border-color)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {isAIMode && (
            <button type="submit" className="btn-ai" disabled={aiThinking}>
              {aiThinking ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />} Search AI
            </button>
          )}
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar Filter */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            <Filter size={18} color="#38bdf8" /> Filter Products
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Laptop">Laptops</option>
              <option value="Mobile">Smartphones</option>
              <option value="Accessories">Accessories</option>
              <option value="Wearable">Wearables</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ color: '#cbd5e1' }}>Max Price:</span>
              <span style={{ color: '#38bdf8' }}>₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <button
            onClick={() => { setCategory('All'); setMaxPrice(250000); setSearchQuery(''); setIsAIMode(false); fetchProducts(); }}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}
          >
            Reset Filters
          </button>
        </div>

        {/* Products Grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading product catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
              <h3>No products found</h3>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="product-grid" style={{ marginTop: 0 }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Sticky Bar */}
      {comparedProducts.length > 0 && (
        <div className="compare-sticky-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Scale color="#38bdf8" size={24} />
            <div>
              <div style={{ fontWeight: 700 }}>Compare Products ({comparedProducts.length}/4)</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {comparedProducts.map(p => p.name).join(', ')}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={clearCompare} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Clear</button>
            <Link to="/compare" className="btn-ai" style={{ padding: '0.5rem 1.2rem' }}>
              <Sparkles size={16} /> Compare with AI
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
