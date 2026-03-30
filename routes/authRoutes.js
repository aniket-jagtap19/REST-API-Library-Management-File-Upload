const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    password: hashed
  });

  await user.save();
  res.send("User Registered");
});

// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.send("Wrong password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;