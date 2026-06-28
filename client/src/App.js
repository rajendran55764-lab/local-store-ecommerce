import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Orders from './components/Orders';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [cartCount, setCartCount] = useState(0);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setPage('home');
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    setPage('products');
  };

  return (
    <div className="App">
      <nav>
        <h1>🛒 Local Store</h1>
        <div>
          <button onClick={() => setPage('home')}>
            🏠 Home
          </button>
          <button onClick={() => setPage('products')}>
            🛍️ Products
          </button>
          {!token ? (
            <button onClick={() => setPage('login')}>
              🔑 Login
            </button>
          ) : (
            <>
              <button onClick={() => setPage('cart')}>
                🛒 Cart
              </button>
              <button onClick={() => setPage('orders')}>
                📦 Orders
              </button>
              {user?.role === 'admin' && (
                <button onClick={() => setPage('admin')}>
                  👑 Admin
                </button>
              )}
              <button onClick={logout}>
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        {page === 'home' && (
          <Home setPage={setPage} />
        )}
        {page === 'products' && (
          <Products token={token} setPage={setPage} />
        )}
        {page === 'login' && (
          <Login handleLogin={handleLogin} setPage={setPage} />
        )}
        {page === 'cart' && (
          <Cart token={token} setPage={setPage} />
        )}
        {page === 'orders' && (
          <Orders token={token} />
        )}
        {page === 'admin' && user?.role === 'admin' && (
          <AdminPanel token={token} />
        )}
      </div>
    </div>
  );
}

export default App;
