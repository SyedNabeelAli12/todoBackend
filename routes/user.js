const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.use(express.json());

const SECRET_KEY = 'SALTINBOUND';

const users = [
  { username: 'admin', password: 'admin', name: 'Admin' },
  { username: 'user1', password: 'user1', name: 'User One' },
  { username: 'user2', password: 'user2', name: 'User two' }
];

router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

router.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find(u => u.username === decoded.username);
    res.json(user);
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
