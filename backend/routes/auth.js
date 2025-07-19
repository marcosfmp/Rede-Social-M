const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Usuário já existe' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hash });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
