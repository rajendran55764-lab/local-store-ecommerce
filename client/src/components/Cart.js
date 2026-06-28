import React, { useState, useEffect } from 'react';

function Cart({ token, setPage }) {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`https://local-store-backend-qw5w.onrender.com/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCart();
        setSuccess('Item removed!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const placeOrder = async () => {
    try {
      const res = await fetch('https://local-store-backend-qw5w.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod: 'Cash on Delivery'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('🎉 Order placed successfully!');
        fetchCart();
        setShowCheckout(false);
        setTimeout(() => setPage('orders'), 2000);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="card">
      <h2>🛒 My Cart</h2>
      {error && <p className="error">⚠️ {error}</p>}
      {success && <p className="success">✅ {success}</p>}

      {!cart || cart.items.length === 0 ? (
        <div style={{textAlign:'center', padding:'50px', color:'#666'}}>
          <div style={{fontSize:'60px'}}>🛒</div>
          <h3>Your cart is empty!</h3>
          <button className="btn" style={{marginTop:'20px'}} onClick={() => setPage('products')}>
            🛍️ Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => e.target.src='https://via.placeholder.com/80'}
              />
              <div style={{flex:1}}>
                <h3 style={{fontSize:'16px', color:'#333'}}>{item.name}</h3>
                <p style={{color:'#e44d26', fontWeight:'700'}}>₹{item.price}</p>
                <p style={{color:'#666', fontSize:'13px'}}>Qty: {item.quantity}</p>
              </div>
              <div>
                <p style={{fontWeight:'700', color:'#333', marginBottom:'10px'}}>
                  ₹{item.price * item.quantity}
                </p>
                <button
                  className="btn btn-danger"
                  style={{padding:'6px 12px', fontSize:'12px'}}
                  onClick={() => removeItem(item._id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{
            background:'#f8f9fa',
            padding:'20px',
            borderRadius:'10px',
            marginTop:'20px'
          }}>
            <h3 style={{marginBottom:'10px'}}>💰 Order Summary</h3>
            <p style={{fontSize:'20px', fontWeight:'700', color:'#e44d26'}}>
              Total: ₹{cart.totalAmount}
            </p>
          </div>

          {!showCheckout ? (
            <button
              className="btn btn-full"
              style={{marginTop:'20px'}}
              onClick={() => setShowCheckout(true)}
            >
              🚀 Proceed to Checkout
            </button>
          ) : (
            <div style={{marginTop:'20px'}}>
              <h3 style={{marginBottom:'15px'}}>📦 Shipping Address</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>🏠 Street</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>🏙️ City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>🗺️ State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>📮 Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                  />
                </div>
              </div>
              <div style={{display:'flex', gap:'15px', marginTop:'10px'}}>
                <button className="btn btn-full" onClick={placeOrder}>
                  ✅ Place Order
                </button>
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => setShowCheckout(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
