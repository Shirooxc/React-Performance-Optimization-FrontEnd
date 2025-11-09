// src/components/ProductList.jsx
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProductRow from './ProductRow';

const ProductList = ({ filteredProducts, onAddToCart }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductRow
        product={filteredProducts[index]}
        onAddToCart={onAddToCart}
      />
    </div>
  );

  // Hitung tinggi item (sesuaikan dengan desain)
  const itemSize = 80;

  return (
    <List
      height={600}
      itemCount={filteredProducts.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default ProductList;