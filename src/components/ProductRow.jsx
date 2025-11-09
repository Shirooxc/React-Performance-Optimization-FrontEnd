// src/components/ProductRow.jsx
import React from 'react';

const ProductRow = React.memo(({ product, onAddToCart }) => {
  return (
    <div
      style={{
        padding: '12px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <strong>{product.name}</strong> • {product.brand} • {product.category}
        <br />
        <small>Stok: {product.stock}</small>
      </div>
      <div>
        <span>Rp{product.price.toLocaleString('id-ID')}</span>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            marginLeft: '12px',
            padding: '6px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Tambah
        </button>
      </div>
    </div>
  );
});

export default ProductRow;