const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, bio, profile_picture, role, created_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, bio, profile_picture, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Crear un usuario
router.post('/', async (req, res) => {
  try {
    const { username, email, password, full_name, bio, profile_picture, role } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name, bio, profile_picture, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, password, full_name, bio, profile_picture, role]
    );
    res.status(201).json({ id: result.insertId, username, email, full_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/usuarios/perfil - Actualizar biografía y foto
router.put('/perfil', verificarToken, upload.single('profile_picture'), async (req, res) => {
    try {
        const userId = req.user.id; // Del token
        const { bio } = req.body;
        let profile_picture = null;

        // 1. Lógica para subir nueva foto a Cloudinary si se adjuntó una
        if (req.file) {
            // const result = await cloudinary.uploader.upload(req.file.path);
            // profile_picture = result.secure_url;
        }

        // 2. Actualizar en MySQL dinámicamente
        // Si hay foto nueva, actualizamos bio y foto. Si no, solo la bio.
        let query = 'UPDATE Users SET bio = ? WHERE id = ?';
        let params = [bio, userId];

        if (profile_picture) {
            query = 'UPDATE Users SET bio = ?, profile_picture = ? WHERE id = ?';
            params = [bio, profile_picture, userId];
        }

        await pool.query(query, params);

        res.json({ mensaje: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
