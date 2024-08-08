// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const itemRoutes = require('./routes/item');
const todoItems = require('./routes/todo')
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/Todo'; // Update this URI as needed
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase the timeout (30 seconds)
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/todo', todoItems);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
