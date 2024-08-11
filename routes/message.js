const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  try {

    console.log("User",req.body.username)
    const items = await Message.find({username:req.body.username});
    console.log(items)
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

router.post("/message", async (req, res) => {
  try {

    const json = {id: generateRandomAlphanumeric(10),
    username: req.body.username,
    message: req.body.message,
    Date: new Date().toISOString()}
    const newItem = new Message(json);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// router.post("/markComplete", async (req, res) => {
//   try {
//     const { id } = req.body;
//     console.log(id);
//     const markComplete = await TodoItem.findOneAndUpdate(
//       {
//         id: id,
//       },
//       { $set: { completed: true } }
//     );
//     res.status(200).json(markComplete);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ error: err.message });
//   }
// });

// router.delete("/deleteTodo", async (req, res) => {
//   try {
//     const { id } = req.body;
//     console.log(id);
//     const deleteTodo = await TodoItem.deleteOne({
//       id: id,
//     });
//     res.status(200).json(deleteTodo);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ error: err.message });
//   }
// });



module.exports = router;
