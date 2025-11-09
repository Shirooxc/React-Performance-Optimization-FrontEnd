
// src/App.jsx
import React, { useState, useMemo } from 'react';
import { products } from './data/products';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';
import { lazy, Suspense } from 'react';
import { getFromCache, setToCache } from './utils/searchCache';

const AboutPage = lazy(() => import('./components/AboutPage'));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('pos'); // 'pos' atau 'about'

  // Filter produk berdasarkan pencarian (optimalkan dengan useMemo)
  const filterProducts = (term) => {
    if (!term.trim()) return products;

    const cacheKey = term.toLowerCase().trim();
    const cached = getFromCache(cacheKey);

    if (cached) {
      console.log('🎯 Cache hit:', cacheKey);
      return cached;
    }

    console.log('🔍 Cache miss:', cacheKey);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(cacheKey) ||
      p.brand.toLowerCase().includes(cacheKey) ||
      p.category.toLowerCase().includes(cacheKey)
    );

    setToCache(cacheKey, filtered);
    return filtered;
  };

  const filteredProducts = useMemo(() => {
    return filterProducts(searchTerm);
  }, [searchTerm]);


  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  return (
    <>
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => setView('pos')}>POS</button>
      <button onClick={() => setView('about')} style={{ marginLeft: '10px' }}>Tentang</button>
    </div>

    {view === 'pos' ? (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Point of Sales (POS) – Optimized</h1>
      <CartSummary cart={cart} />
      <SearchBar onSearch={setSearchTerm} />
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <ProductList
          filteredProducts={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
    ) : (
      <Suspense fallback={<div>Loading...</div>}>
        <AboutPage />
      </Suspense>

    )}
    </>
  );
}

export default App;