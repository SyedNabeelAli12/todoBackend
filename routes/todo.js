const express = require('express');
const router = express.Router();
const TodoItem = require('../models/TodoItem');

router.get('/', async (req, res) => {
    try {
      const items = await TodoItem.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/add', async (req, res) => {
    try {
      const newItem = new TodoItem(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  module.exports = router; 