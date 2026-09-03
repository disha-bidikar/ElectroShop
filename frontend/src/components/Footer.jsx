import React from 'react';
import { ShoppingBag, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3rem 2rem 1.5rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShoppingBag size={24} color="#38bdf8" />
            <h3 className="gradient-text" style={{ fontSize: '1.4rem' }}>ElectroShop AI</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Next-generation e-commerce platform powered by Spring Boot, React, and Gemini / OpenAI LLM integration.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>AI Features</h4>
          <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>🤖 ElectroShop AI Assistant</li>
            <li>🔍 Natural Language Product Search</li>
            <li>⚡ Personalized AI Recommendations</li>
            <li>📊 Smart Product Comparison</li>
            <li>📝 AI Review Summarization</li>
            <li>💡 Smart Budget Assistant</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><a href="/products">All Products</a></li>
            <li><a href="/ai-assistant">AI Shopping Assistant</a></li>
            <li><a href="/budget-assistant">Find Within Budget</a></li>
            <li><a href="/cart">My Cart</a></li>
            <li><a href="/orders">Order Tracking</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Developer</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Built by <strong>Disha Bidikar</strong>
          </p>
          <a
            href="https://github.com/disha-bidikar/ElectroShop"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Github size={16} /> GitHub Repository
          </a>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} ElectroShop AI. Built with React 18, Spring Boot 3, and AI.
      </div>
    </footer>
  );
};

export default Footer;
