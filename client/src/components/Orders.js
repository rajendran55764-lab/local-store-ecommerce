import React, { useState, useEffect } from 'react';

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/orders/myorders', {
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
      {error && <p className="error">{error}</p>}
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
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-danger'}`}>
                {order.status}
              </span>
            </div>

            <div className="order-status">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                <div key={step} className="status-step">
                  <div className={`status-circle ${index <= getStatusStep(order.status) ? 'active' : ''}`}>
                    {index <= getStatusStep(order.status) ? '✓' : index + 1}
                  </div>
                  <span className="status-label">{step}</span>
                </div>
              ))}
            </div>

            {order.items.map((item, index) => (
              <div key={index} style={{
                display:'flex',
                alignItems:'center',
                gap:'10px',
                marginBottom:'10px',
                marginTop:'15px'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{width:'50px', height:'50px', borderRadius:'8px', objectFit:'cover'}}
                  onError={(e) => e.target.src='https://via.placeholder.com/50'}
                />
                <div style={{flex:1}}>
                  <p style={{fontWeight:'600', fontSize:'14px'}}>{item.name}</p>
                  <p style={{color:'#666', fontSize:'13px'}}>Qty: {item.quantity}</p>
                </div>
                <p style={{fontWeight:'700', color:'#e44d26'}}>₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div style={{
              borderTop:'1px solid #ddd',
              paddingTop:'15px',
              marginTop:'15px',
              display:'flex',
              justifyContent:'space-between'
            }}>
              <p style={{fontWeight:'700'}}>Total Amount:</p>
              <p style={{fontWeight:'700', color:'#e44d26', fontSize:'18px'}}>
                ₹{order.totalAmount}
              </p>
            </div>

            <div style={{marginTop:'10px', color:'#666', fontSize:'13px'}}>
              <p>📍 {order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
