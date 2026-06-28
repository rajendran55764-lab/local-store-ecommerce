const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET CART
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD TO CART
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity: quantity || 1,
        image: product.image
      });
    }

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ msg: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE CART ITEM
router.put('/update/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
    await cart.save();
    res.json({ msg: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// REMOVE FROM CART
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
    await cart.save();
    res.json({ msg: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// CLEAR CART
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    res.json({ msg: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
