import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Scale, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ComparePage = () => {
  const { comparedProducts, toggleCompare, clearCompare, addToCart } = useCart();
  const { addToast } = useToast();

  const [aiCompareResult, setAiCompareResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAIComparison = async () => {
    if (comparedProducts.length === 0) return;
    setLoading(true);
    addToast('Analyzing product specifications with AI...', 'ai');
    try {
      const res = await api.post('/api/ai/compare', {
        productIds: comparedProducts.map(p => p.id)
      });
      setAiCompareResult(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to generate AI comparison', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (comparedProducts.length > 0) {
      fetchAIComparison();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparedProducts]);

  if (comparedProducts.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px', maxWidth: '600px', margin: '4rem auto' }}>
        <Scale size={48} color="#38bdf8" style={{ marginBottom: '1rem' }} />
        <h2>No Products Selected for Comparison</h2>
        <p style={{ color: '#94a3b8', margin: '0.8rem 0 1.5rem' }}>
          Go to the products page and check the "Compare" checkbox on 2 to 4 products.
        </p>
        <Link to="/products" className="btn-primary">Browse Products to Compare</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Scale color="#38bdf8" /> AI Product Comparison ({comparedProducts.length})
          </h1>
          <p style={{ color: '#94a3b8' }}>Side-by-side specification analysis & AI evaluation badges</p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={clearCompare} className="btn-secondary">Clear All</button>
          <button onClick={fetchAIComparison} className="btn-ai" disabled={loading}>
            <Sparkles size={18} /> {loading ? 'Analyzing...' : 'Refresh AI Comparison'}
          </button>
        </div>
      </div>

      {/* AI Winner Badges Box */}
      {aiCompareResult && (
        <div className="glass-panel" style={{
          padding: '1.8rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(49, 46, 129, 0.5) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.4)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc' }}>
            <Sparkles size={20} /> AI Recommendation Verdict
          </h3>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            {aiCompareResult.bestForProgramming && (
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.4rem 0.9rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #38bdf8' }}>
                💻 {aiCompareResult.bestForProgramming}
              </span>
            )}
            {aiCompareResult.bestValue && (
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.4rem 0.9rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #10b981' }}>
                💰 {aiCompareResult.bestValue}
              </span>
            )}
            {aiCompareResult.bestPerformance && (
              <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '0.4rem 0.9rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #f43f5e' }}>
                ⚡ {aiCompareResult.bestPerformance}
              </span>
            )}
          </div>

          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {aiCompareResult.aiComparisonSummary}
          </p>
        </div>
      )}

      {/* Side-by-side Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px', overflow: 'hidden' }} className="glass-panel">
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem', textAlign: 'left', width: '180px', color: '#94a3b8' }}>Feature</th>
              {comparedProducts.map(p => (
                <th key={p.id} style={{ padding: '1.2rem', textAlign: 'center', minWidth: '220px' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'contain', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{p.name}</div>
                  <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.3rem' }}>₹{p.price?.toLocaleString()}</div>
                  <button onClick={() => toggleCompare(p)} className="icon-btn" style={{ margin: '0.5rem auto 0', color: '#f43f5e' }}>
                    <Trash2 size={16} /> Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#cbd5e1' }}>Brand</td>
              {comparedProducts.map(p => <td key={p.id} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>{p.brand}</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#cbd5e1' }}>Category</td>
              {comparedProducts.map(p => <td key={p.id} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>{p.category}</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#cbd5e1' }}>Customer Rating</td>
              {comparedProducts.map(p => <td key={p.id} style={{ padding: '1rem', textAlign: 'center', color: '#fbbf24', fontWeight: 700 }}>★ {p.rating} / 5</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#cbd5e1' }}>Specifications</td>
              {comparedProducts.map(p => <td key={p.id} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#e2e8f0' }}>{p.specs}</td>)}
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#cbd5e1' }}>Action</td>
              {comparedProducts.map(p => (
                <td key={p.id} style={{ padding: '1rem', textAlign: 'center' }}>
                  <button onClick={() => addToCart(p.id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
