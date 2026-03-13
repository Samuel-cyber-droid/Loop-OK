const express = require('express');
require('dotenv').config();
const { testConnection } = require('./db');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/users', usersRoutes);

// Iniciar servidor
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
