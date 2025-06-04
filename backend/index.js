const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas API
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  // Establecer carpeta estática
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Manejar todas las demás rutas
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});