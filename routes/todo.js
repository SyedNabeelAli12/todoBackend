const express = require("express");
const router = express.Router();
const TodoItem = require("../models/TodoItem");

router.get("/", async (req, res) => {
  try {
    const items = await TodoItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const newItem = new TodoItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/markComplete", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const markComplete = await TodoItem.findOneAndUpdate(
      {
        id: id,
      },
      { $set: { completed: true } }
    );
    res.status(200).json(markComplete);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/deleteTodo", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const deleteTodo = await TodoItem.deleteOne({
      id: id,
    });
    res.status(200).json(deleteTodo);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
