# **Proyek Point of Sales (POS) \- React Performance Optimization**

Proyek ini adalah aplikasi Point of Sales (POS) yang dibangun dengan React (Vite) sebagai studi kasus untuk menerapkan berbagai teknik optimasi performa. Aplikasi ini dirancang untuk menangani dataset besar (10.000+ produk) dengan tetap menjaga antarmuka pengguna (UI) yang responsif dan lancar.

## **Fitur Utama**

* Menampilkan daftar 10.000+ produk dummy.  
* Pencarian produk secara *real-time* berdasarkan nama, merek, atau kategori.  
* Menambahkan produk ke keranjang belanja.  
* Navigasi antar halaman (POS dan "Tentang") dengan *code splitting*.

## **Teknik Optimasi yang Diterapkan**

Proyek ini secara aktif menggunakan beberapa strategi optimasi React yang paling penting untuk mengatasi *bottleneck* performa.

### **1\. Virtualization (Windowing) dengan react-window**

Untuk menangani 10.000 item produk tanpa membuat *lag* pada browser, aplikasi ini menggunakan *list virtualization*.

* **File:** src/components/ProductList.jsx  
* **Teknik:** Menggunakan komponen FixedSizeList dari react-window.  
* **Dampak:** Hanya me-render item daftar yang terlihat di layar (viewport) \+ *buffer* kecil. Ini mengurangi jumlah *node* DOM dari 10.000+ menjadi sekitar 10-20, membuat *scrolling* menjadi instan dan sangat hemat memori.

### **2\. Memoization Komponen dengan React.memo**

Setiap baris produk di dalam daftar dibungkus dengan React.memo untuk mencegah re-render yang tidak perlu.

* **File:** src/components/ProductRow.jsx  
* **Teknik:** const ProductRow \= React.memo(...)  
* **Dampak:** Saat menambah item ke keranjang (memperbarui *state* cart di App.jsx), hanya komponen CartSummary yang akan di-render ulang. Semua komponen ProductRow lainnya akan "dilewati" (skip) karena *props* mereka tidak berubah, sehingga menghemat sumber daya render secara signifikan.

### **3\. Debouncing Input dengan lodash.debounce**

Untuk mencegah aplikasi memfilter 10.000 item pada *setiap* ketukan tombol di *search bar*, input pengguna di-*debounce*.

* **File:** src/components/SearchBar.jsx  
* **Teknik:** Menggunakan useCallback dan debounce dari lodash dengan jeda 300ms.  
* **Dampak:** Fungsi pencarian (yang memicu filter) hanya akan dijalankan setelah pengguna berhenti mengetik selama 300ms. Ini secara drastis mengurangi jumlah operasi filter yang mahal.

### **4\. Memoization Komputasi dengan useMemo**

Hasil dari fungsi filter (yang berpotensi mahal) disimpan di dalam useMemo.

* **File:** src/App.jsx  
* **Teknik:** const filteredProducts \= useMemo(...)  
* **Dampak:** Fungsi filter hanya akan dijalankan kembali jika dependensinya (searchTerm) berubah. Ini mencegah komputasi ulang yang tidak perlu pada setiap render App (misalnya, saat cart berubah).

### **5\. Custom In-Memory Caching**

Untuk meningkatkan performa pencarian lebih lanjut, aplikasi ini menggunakan cache kustom berbasis Map.

* **File:** src/utils/searchCache.js & src/App.jsx  
* **Teknik:** Sebelum memfilter, fungsi filterProducts memeriksa apakah hasil untuk searchTerm tersebut sudah ada di searchCache. Jika ya, hasil dari cache dikembalikan secara instan. Jika tidak, filter dijalankan dan hasilnya disimpan di cache.  
* **Dampak:** Jika pengguna mengetik "kopi", menghapusnya, lalu mengetik "kopi" lagi, operasi filter yang mahal hanya terjadi satu kali. Pencarian kedua akan terasa instan karena mengambil dari "Cache hit".

### **6\. Code Splitting dengan React.lazy dan Suspense**

Untuk memperkecil ukuran *bundle* awal, halaman sekunder (Halaman "Tentang") dipisah menjadi *chunk* JavaScript sendiri dan hanya dimuat saat diperlukan.

* **File:** src/App.jsx  
* **Teknik:** Menggunakan lazy(() \=\> import('./components/AboutPage')) dan membungkusnya dengan \<Suspense\>.  
* **Dampak:** Pengguna yang hanya mengunjungi halaman POS utama tidak perlu mengunduh kode untuk halaman "Tentang", sehingga waktu muat awal aplikasi (initial load time) menjadi lebih cepat.

## **Struktur Proyek**

pos-optimized/  
├── src/  
│   ├── components/  
│   │   ├── AboutPage.jsx     \# (Lazy loaded)  
│   │   ├── CartSummary.jsx  
│   │   ├── ProductList.jsx   \# (react-window)  
│   │   ├── ProductRow.jsx    \# (React.memo)  
│   │   └── SearchBar.jsx     \# (debounce)  
│   ├── data/  
│   │   └── products.js     \# (Dummy data 10k)  
│   ├── utils/  
│   │   └── searchCache.js  \# (Map cache)  
│   ├── App.jsx             \# (State, useMemo, Suspense)  
│   └── main.jsx  
└── package.json
