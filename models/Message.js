const mongoose = require("mongoose");

const Messages = new mongoose.Schema({
  id: String,
  username: { type: String },
  message: String,
  Date: String,
  reciever:String
});

const Message = mongoose.model("messages", Messages);

module.exports = Message;
