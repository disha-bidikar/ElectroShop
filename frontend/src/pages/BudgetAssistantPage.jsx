import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import { Sparkles } from 'lucide-react';
import api from '../services/api';

const BudgetAssistantPage = () => {
  const [budget, setBudget] = useState(70000);
  const [purpose, setPurpose] = useState('Programming / Java Development');
  const [category, setCategory] = useState('Laptop');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleFind = async (e) => {
    e.preventDefault();
    setLoading(true);
    addToast('Evaluating budget & specifications with AI...', 'ai');

    try {
      const res = await api.post('/api/ai/budget-assistant', {
        budget: Number(budget),
        purpose: purpose,
        category: category
      });
      setResults(res.data);
      addToast(`Found ${res.data.length} ranked matches within budget!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to find matches', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
          <Sparkles color="#10b981" size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Smart Budget Assistant</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '0.5rem' }}>
          Find the best ranked products that fit strictly within your price point with AI specification analysis.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleFind} className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '20px',
        maxWidth: '800px',
        margin: '0 auto 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Target Budget (₹): <strong style={{ color: '#10b981' }}>₹{Number(budget).toLocaleString()}</strong>
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 60000"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'white'
            }}
          >
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile Phone</option>
            <option value="Accessories">Accessories</option>
            <option value="Wearable">Wearable</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Primary Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'white'
            }}
          >
            <option value="Programming / Java Development">Programming / Software Dev</option>
            <option value="Gaming & Heavy GPU">Gaming & Heavy GPU</option>
            <option value="Student / College">Student / College Study</option>
            <option value="Camera & Content Creation">Camera & Content Creation</option>
            <option value="Daily Productivity">Daily Productivity</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ background: '#10b981', padding: '0.85rem', fontSize: '1rem' }} disabled={loading}>
          <Sparkles size={18} /> {loading ? 'Ranking...' : 'Rank Matches'}
        </button>
      </form>

      {/* Results List */}
      {results.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Top Ranked Matches for ₹{Number(budget).toLocaleString()}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {results.map((match, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img
                  src={match.product?.imageUrl}
                  alt={match.product?.name}
                  style={{ width: '120px', height: '120px', objectFit: 'contain', background: 'rgba(15,23,42,0.6)', borderRadius: '12px', padding: '0.5rem' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{match.product?.name}</h3>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid #10b981',
                      padding: '0.2rem 0.7rem',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      fontWeight: 800
                    }}>
                      🎯 {match.matchScore}% Match
                    </span>
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.8rem' }}>
                    ₹{match.product?.price?.toLocaleString()}
                  </div>

                  {/* Why Match Breakdown */}
                  <div style={{ background: 'rgba(15,23,42,0.6)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.3rem' }}>Why it matches:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {match.matchReasons?.map((reason, rIdx) => (
                        <span key={rIdx} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ alignSelf: 'center' }}>
                  <ProductCard product={match.product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAssistantPage;
