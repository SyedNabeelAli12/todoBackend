// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const axios = require('axios');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(cors());
// app.use(express.static("public"));

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("chat message", (msg, user,reciever) => {
//     try {
//       io.emit("chat message", msg,reciever);
//       axios
//         .post("http://127.0.0.1:3001/msg/message", {
//           username: user,
//           message: msg,
//           reciever:reciever
//         })
//         .then((response) => {
//           console.log("POST response data:", response.data);
//         })
//         .catch((error) => {
//           console.error("POST request error:", error);
//         });
//     } catch (error) {
//       console.error("Message broadcast error:", error);
//       socket.emit("error", "Failed to send message");
//     }
//   });

  

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });

//   socket.on("error", (error) => {
//     console.error("Socket error:", error);
//     socket.emit("error", "An unexpected error occurred");
//   });
// });

// const PORT = process.env.PORT || 3002;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require('axios');
const mongoose = require("mongoose");

// Database setup
// mongoose.connect('mongodb://localhost:27017/Todo', { useNewUrlParser: true, useUnifiedTopology: true });


const mongoURI = 'mongodb://127.0.0.1:27017/Todo'; // Update this URI as needed
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase the timeout (30 seconds)
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
const Messages = new mongoose.Schema({
  id: String,
  username: { type: String },
  message: String,
  Date: String,
  reciever: String
});

const Message = mongoose.model("messages", Messages);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.static("public"));

const users = {}; // Store socket IDs of connected users

io.on("connection", (socket) => {
  console.log("A user connected");

  // Track user connection
  socket.on('register', (username) => {
    users[username] = socket.id;
    console.log(`${username} registered with socket ID ${socket.id}`);
  });

  socket.on("chat message", (msg, user, reciever) => {
    try {
      // Save message to the database
      const newMessage = new Message({
        id: socket.id,
        username: user,
        message: msg,
        Date: new Date().toISOString(),
        reciever: reciever
      });
      newMessage.save();

      // Emit message to the specific receiver
      const receiverSocketId = users[reciever];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("chat message", msg, user, reciever);
      } else {
        console.log(`Receiver ${reciever} not connected`);
      }

      // Optionally, emit to sender or all connected clients
      socket.emit("chat message", msg, user, reciever);

    } catch (error) {
      console.error("Message broadcast error:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Remove user from the tracking list
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    socket.emit("error", "An unexpected error occurred");
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
