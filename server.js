const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Conexión a MongoDB Atlas
const mongodbURI = 'mongodb+srv://giovazzaro:EgLbGhp5xP7vNZaU@cluster0.hzaghep.mongodb.net/diet?retryWrites=true&w=majority';

mongoose.connect(mongodbURI)

  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB Atlas:', err));

// Esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
}, { collection: 'usuarios' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta de registro
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
