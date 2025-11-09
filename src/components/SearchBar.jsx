// src/components/SearchBar.jsx
import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  // Debounce callback agar tidak terlalu sering memicu pencarian
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Cari produk..."
        value={input}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default SearchBar;