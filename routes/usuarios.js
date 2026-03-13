const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/usuarios - Crear un usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
      [nombre, email]
    );
    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ id: req.params.id, nombre, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
