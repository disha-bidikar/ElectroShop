import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sparkles, ShoppingCart, Heart, Shield, LogOut, Scale } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, comparedProducts } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <ShoppingBag className="text-sky-400" size={28} />
          <span className="gradient-text">ElectroShop AI</span>
        </Link>

        {/* Main Navigation Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          <Link to="/ai-assistant" className={`nav-link ${isActive('/ai-assistant') ? 'active' : ''}`}>
            <Sparkles size={16} className="text-purple-400" />
            AI Assistant
          </Link>
          <Link to="/budget-assistant" className={`nav-link ${isActive('/budget-assistant') ? 'active' : ''}`}>
            Smart Budget
          </Link>
          {user && (
            <>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>My Orders</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>My Profile</Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: '#f43f5e' }}>
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="nav-actions">
          {comparedProducts.length > 0 && (
            <Link to="/compare" className="icon-btn" title="Compare Products">
              <Scale size={20} />
              <span className="badge" style={{ background: '#6366f1' }}>{comparedProducts.length}</span>
            </Link>
          )}

          {user && (
            <Link to="/wishlist" className="icon-btn" title="Wishlist">
              <Heart size={20} />
            </Link>
          )}

          <Link to="/cart" className="icon-btn" title="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8' }}>
                👋 {user.username}
              </span>
              <button onClick={logout} className="icon-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
