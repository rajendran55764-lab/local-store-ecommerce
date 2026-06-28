import React, { useState, useEffect } from 'react';

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://local-store-backend-xxxx.onrender.com/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="card">
      <h2>📦 My Orders</h2>
      {error && <p className="error">⚠️ {error}</p>}

      {orders.length === 0 ? (
        <div style={{textAlign:'center', padding:'50px', color:'#666'}}>
          <div style={{fontSize:'60px'}}>📦</div>
          <h3>No orders yet!</h3>
          <p>Start shopping to see your orders here</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{
            background:'#f8f9fa',
            padding:'20px',
            borderRadius:'15px',
            marginBottom:'20px'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
              <div>
                <p style={{fontWeight:'700', color:'#333'}}>
                  Order #{order._id.substring(0, 8)}
                </p>
                <p style={{color:'#666', fontSize:'13px'}}>
                  📅 {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className={`badge ${
                  order.status === 'Delivered' ? 'badge-success' : 'badge-danger'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Status Track */}
            <div className="order-status">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                <div key={step} className="status-step">
                  <div className={`status-circle ${
                    index <= getStatusStep(order.status) ? 'active' : ''
                  }`}>
                    {index <= getStatusStep(order.status) ? '✓' : index + 1}
                  </div>
                  <span className="status-label">{step}</span>
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div style={{marginTop:'15px'}}>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  display:'flex',
