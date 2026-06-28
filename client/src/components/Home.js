import React from 'react';

function Home({ setPage }) {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero" style={{borderRadius:'15px', marginBottom:'30px'}}>
        <h1>🛒 Welcome to Local Store</h1>
        <p>Shop the best products at amazing prices!</p>
        <button className="btn" style={{
          background:'white',
          color:'#e44d26',
          fontSize:'16px',
          padding:'15px 40px'
        }}
          onClick={() => setPage('products')}
        >
          🛍️ Shop Now
        </button>
      </div>

      {/* Categories */}
      <h2 style={{marginBottom:'20px', color:'#333'}}>🏷️ Shop by Category</h2>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',
        gap:'15px',
        marginBottom:'30px'
      }}>
        {[
          {name:'Electronics', icon:'📱'},
          {name:'Clothing', icon:'👕'},
          {name:'Food', icon:'🍎'},
          {name:'Books', icon:'📚'},
          {name:'Home', icon:'🏠'},
          {name:'Sports', icon:'⚽'}
        ].map(cat => (
          <div key={cat.name}
            onClick={() => setPage('products')}
            style={{
              background:'white',
              padding:'20px',
              borderRadius:'15px',
              textAlign:'center',
              cursor:'pointer',
              boxShadow:'0 5px 15px rgba(0,0,0,0.1)',
              transition:'all 0.3s ease'
            }}
          >
            <div style={{fontSize:'35px'}}>{cat.icon}</div>
            <p style={{marginTop:'10px', fontWeight:'600', color:'#333'}}>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 style={{marginBottom:'20px', color:'#333'}}>✨ Why Choose Us?</h2>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',
        gap:'15px'
      }}>
        {[
          {icon:'🚚', title:'Fast Delivery', desc:'Get your orders delivered quickly'},
          {icon:'💰', title:'Best Prices', desc:'Amazing deals every day'},
          {icon:'🔒', title:'Secure Payment', desc:'100% secure transactions'},
          {icon:'⭐', title:'Top Quality', desc:'Only the best products'}
        ].map(feature => (
          <div key={feature.title} style={{
            background:'white',
            padding:'20px',
            borderRadius:'15px',
            textAlign:'center',
            boxShadow:'0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize:'35px'}}>{feature.icon}</div>
            <h3 style={{margin:'10px 0 5px', color:'#333'}}>{feature.title}</h3>
            <p style={{color:'#666', fontSize:'13px'}}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
