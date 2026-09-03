import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Plus, Sparkles, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import api from '../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Laptop',
    price: '',
    description: '',
    specs: '',
    imageUrl: ''
  });

  // AI Description Generator Modal State
  const [aiGenLoading, setAiGenLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', brand: '', category: 'Laptop', price: '', description: '', specs: '', imageUrl: '' });
    setAiDraft(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description,
      specs: product.specs,
      imageUrl: product.imageUrl
    });
    setAiDraft(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      addToast('Product deleted', 'info');
      fetchProducts();
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleGenerateAIDescription = async () => {
    if (!formData.name || !formData.specs) {
      addToast('Please enter product Name and Specifications first!', 'error');
      return;
    }
    setAiGenLoading(true);
    addToast('Generating SEO product copy with AI...', 'ai');

    try {
      const res = await api.post('/api/admin/products/generate-description', {
        name: formData.name,
        category: formData.category,
        specs: formData.specs,
        price: Number(formData.price) || 0
      });

      setAiDraft(res.data);
      addToast('AI generated description ready for review! ✨', 'success');
    } catch (err) {
      addToast('AI Description Generation failed', 'error');
    } finally {
      setAiGenLoading(false);
    }
  };

  const handleApproveAIDescription = () => {
    if (aiDraft) {
      setFormData(prev => ({
        ...prev,
        description: aiDraft.description
      }));
      addToast('AI Description approved and populated into listing! ✅', 'success');
      setAiDraft(null);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      addToast('Please enter required product fields', 'error');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/admin/products/${editingId}`, formData);
        addToast('Product updated successfully!', 'success');
      } else {
        await api.post('/api/admin/products', formData);
        addToast('Product created successfully!', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      addToast('Failed to save product', 'error');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Manage Product Inventory</h1>
          <p style={{ color: '#94a3b8' }}>Create, update, delete products & generate AI listing copy</p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary" style={{ background: '#f43f5e' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Rating</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading products...</td></tr>
            ) : products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.brand}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#38bdf8', fontWeight: 600 }}>{p.category}</td>
                <td style={{ padding: '1rem', fontWeight: 800 }}>₹{p.price?.toLocaleString()}</td>
                <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 600 }}>★ {p.rating}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button onClick={() => handleOpenEdit(p)} className="icon-btn" style={{ marginRight: '0.5rem' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="icon-btn" style={{ color: '#f43f5e' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="flex-center" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '2rem', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: '#94a3b8' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Wearable">Wearable</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. CPU: i7 13th Gen, RAM: 16GB DDR5, Storage: 1TB SSD"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              {/* AI Description Generator Trigger */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAIDescription}
                    className="btn-ai"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    disabled={aiGenLoading}
                  >
                    <Sparkles size={14} /> {aiGenLoading ? 'Generating...' : 'Generate Description with AI'}
                  </button>
                </div>

                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description text..."
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              {/* AI Draft Review Approval Box */}
              {aiDraft && (
                <div style={{ background: 'rgba(129, 140, 248, 0.15)', border: '1px solid #818cf8', padding: '1rem', borderRadius: '12px' }}>
                  <h5 style={{ color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} /> AI Generated Draft (Review Required)
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.8rem', fontStyle: 'italic' }}>
                    "{aiDraft.description}"
                  </p>
                  <button type="button" onClick={handleApproveAIDescription} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#10b981' }}>
                    <CheckCircle2 size={14} /> Approve & Save Description
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
