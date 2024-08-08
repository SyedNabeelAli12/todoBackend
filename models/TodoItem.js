const mongoose = require("mongoose");

const TodoItem = new mongoose.Schema({
  id: String,
  title: { type: String, required: true },

  description: String,
  dueDate: String,
  completed: Boolean,
  userId: String,
  image: String,
});

const Item = mongoose.model("todo", TodoItem);

module.exports = Item;
