const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg, user) => {
    try {
      io.emit("chat message", msg);
      axios
        .post("http://127.0.0.1:3001/msg/message", {
          username: user,
          message: msg,
        })
        .then((response) => {
          console.log("POST response data:", response.data);
        })
        .catch((error) => {
          console.error("POST request error:", error);
        });
    } catch (error) {
      console.error("Message broadcast error:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
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
