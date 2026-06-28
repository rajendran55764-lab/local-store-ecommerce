import React, { useState, useEffect } from 'react';

function AdminPanel({ token }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/products');
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      setError('Server error');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      setError('Server error');
    }
  };

  const addProduct = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Product added successfully!');
        fetchProducts();
        setShowAddProduct(false);
        setNewProduct({
          name: '', description: '', price: '',
          image: '', category: '', stock: ''
        });
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        const res = await fetch(`https://local-store-backend-qw5w.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setSuccess('Product deleted!');
          fetchProducts();
        }
      } catch (err) {
        setError('Server error');
      }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`https://local-store-backend-qw5w.onrender.com/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSuccess('Order status updated!');
        fetchOrders();
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="card">
      <h2>👑 Admin Panel</h2>
      {error && <p className="error">⚠️ {error}</p>}
      {success && <p className="success">✅ {success}</p>}

      {/* Stats */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'1fr 1fr',
        gap:'15px',
        marginBottom:'25px'
      }}>
        <div style={{
          background:'linear-gradient(135deg, #e44d26 0%, #f16529 100%)',
          padding:'20px',
          borderRadius:'15px',
          color:'white',
          textAlign:'center'
        }}>
          <p style={{fontSize:'30px', fontWeight:'700'}}>{products.length}</p>
          <p>Total Products</p>
        </div>
        <div style={{
          background:'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
          padding:'20px',
          borderRadius:'15px',
          color:'white',
          textAlign:'center'
        }}>
          <p style={{fontSize:'30px', fontWeight:'700'}}>{orders.length}</p>
          <p>Total Orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
        <button
          className={`btn ${activeTab === 'products' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Products
        </button>
        <button
          className={`btn ${activeTab === 'orders' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <button
            className="btn btn-success"
            style={{marginBottom:'20px'}}
            onClick={() => setShowAddProduct(!showAddProduct)}
          >
            ➕ Add New Product
          </button>

          {showAddProduct && (
            <div style={{
              background:'#f8f9fa',
              padding:'20px',
              borderRadius:'15px',
              marginBottom:'20px'
            }}>
              <h3 style={{marginBottom:'15px'}}>Add New Product</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Product description"
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  style={{width:'100%', padding:'12px', borderRadius:'10px', border:'2px solid #e0e0e0'}}
                />
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button className="btn" onClick={addProduct}>
                  💾 Save Product
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddProduct(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          {products.map(product => (
            <div key={product._id} style={{
              display:'flex',
              alignItems:'center',
              gap:'15px',
              padding:'15px',
              background:'#f8f9fa',
              borderRadius:'10px',
              marginBottom:'10px'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{width:'60px', height:'60px', borderRadius:'10px', objectFit:'cover'}}
                onError={(e) => e.target.src='https://via.placeholder.com/60'}
              />
              <div style={{flex:1}}>
                <p style={{fontWeight:'700'}}>{product.name}</p>
                <p style={{color:'#e44d26', fontWeight:'600'}}>₹{product.price}</p>
                <p style={{color:'#666', fontSize:'13px'}}>
                  {product.category} | Stock: {product.stock}
                </p>
              </div>
              <button
                className="btn btn-danger"
                style={{padding:'8px 15px', fontSize:'13px'}}
                onClick={() => deleteProduct(product._id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p style={{textAlign:'center', color:'#666', padding:'30px'}}>
              No orders yet!
            </p>
          ) : (
            orders.map(order => (
              <div key={order._id} style={{
                background:'#f8f9fa',
                padding:'20px',
                borderRadius:'15px',
                marginBottom:'15px'
              }}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <div>
                    <p style={{fontWeight:'700'}}>Order #{order._id.substring(0, 8)}</p>
                    <p style={{color:'#666', fontSize:'13px'}}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{color:'#e44d26', fontWeight:'700'}}>₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={{
                        padding:'8px 12px',
                        borderRadius:'8px',
                        border:'2px solid #e0e0e0',
                        fontSize:'13px'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <p style={{color:'#666', fontSize:'13px'}}>
                  📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
