const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let products = Product.find(query);

    if (sort === 'price_low') products = products.sort({ price: 1 });
    else if (sort === 'price_high') products = products.sort({ price: -1 });
    else if (sort === 'rating') products = products.sort({ rating: -1 });
    else products = products.sort({ createdAt: -1 });

    const result = await products;
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD PRODUCT (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ msg: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE PRODUCT (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ msg: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE PRODUCT (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD REVIEW
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    const review = {
      user: req.user.id,
      username: req.body.username,
      rating,
      comment
    };
    product.reviews.push(review);
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.json({ msg: 'Review added successfully', product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
