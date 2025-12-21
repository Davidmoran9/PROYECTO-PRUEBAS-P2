const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();
const SECRET = 'biblioteca_secret'; // luego puede ir en .env

// REGISTRO
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  const existe = await Usuario.findOne({ email });
  if (existe) {
    return res.status(400).json({ msg: 'Usuario ya existe' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const usuario = new Usuario({
    nombre,
    email,
    password: passwordHash
  });

  await usuario.save();
  res.json({ msg: 'Usuario registrado correctamente' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(400).json({ msg: 'Credenciales inválidas' });
  }

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) {
    return res.status(400).json({ msg: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: usuario._id },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
