import React, { useState, useEffect } from 'react';

function Products({ token, setPage }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  const fetchProducts = async () => {
    try {
      let url = 'https://local-store-backend-qw5w.onrender.com/api/products?';
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}&`;
      if (sort) url += `sort=${sort}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const addToCart = async (productId) => {
    if (!token) {
      setPage('login');
      return;
    }
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('✅ Added to cart!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2 style={{marginBottom:'20px', color:'#333'}}>🛍️ Our Products</h2>

      {error && <p className="error">⚠️ {error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">📱 Electronics</option>
          <option value="Clothing">👕 Clothing</option>
          <option value="Food">🍎 Food</option>
          <option value="Books">📚 Books</option>
          <option value="Home">🏠 Home</option>
          <option value="Sports">⚽ Sports</option>
          <option value="Other">📦 Other</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{textAlign:'center', padding:'50px', color:'#666'}}>
          <div style={{fontSize:'60px'}}>🛍️</div>
          <h3>No products found!</h3>
          <p>Try different search or category</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => e.target.src='https://via.placeholder.com/300'}
              />
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p>{product.description.substring(0, 60)}...</p>
                <div className="product-rating">
                  {'⭐'.repeat(Math.round(product.rating || 0))}
                  <span style={{color:'#666', fontSize:'12px'}}>
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className="product-price">₹{product.price}</div>
                <div style={{marginBottom:'10px'}}>
                  <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
                  </span>
                </div>
                <button
                  className="btn"
                  style={{width:'100%'}}
                  onClick={() => addToCart(product._id)}
                  disabled={product.stock === 0}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
