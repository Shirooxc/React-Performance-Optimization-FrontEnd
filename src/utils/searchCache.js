// src/utils/searchCache.js
// Cache sederhana berbasis Map
// Key: string (search term)
// Value: {  array, timestamp: number }

const MAX_CACHE_SIZE = 50; // Batasi jumlah entri agar tidak boros memori
const CACHE_TTL = 5 * 60 * 1000; // 5 menit (opsional, bisa dihapus jika tidak perlu expired)

export const searchCache = new Map();

export const getFromCache = (key) => {
  if (!searchCache.has(key)) return null;

  const entry = searchCache.get(key);
  const now = Date.now();

  // Opsional: hapus data lama
  if (now - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }

  return entry.data;
};

export const setToCache = (key, data) => {
  // Batasi ukuran cache
  if (searchCache.size >= MAX_CACHE_SIZE) {
    // Hapus entri pertama (FIFO - First In First Out)
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }

  searchCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};