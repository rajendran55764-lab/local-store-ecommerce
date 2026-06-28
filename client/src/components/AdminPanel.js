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
      const res = await fetch('https://local-store-backend-xxxx.onrender.com/api/products');
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      setError('Server error');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://local-store-backend-xxxx.onrender.com/api/orders', {
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
      const res = await fetch('https://local-store-backend-xxxx.onrender.com/api/products', {
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
        const res = await fetch(`https://local-store-backend-xxxx.onrender.com/api/products/${id}`, {
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
      const res = await fetch(`https://local-store-backend-xxxx.onrender.com/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type':
