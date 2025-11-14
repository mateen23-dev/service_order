// api/routes/serviceOrder.js
const express = require('express');
const router = express.Router();
const ServiceOrder = require('../models/ServiceOrder');

router.post('/', async (req, res) => {
  try {
    const order = new ServiceOrder(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// More routes (GET, PATCH, etc.)

module.exports = router;
