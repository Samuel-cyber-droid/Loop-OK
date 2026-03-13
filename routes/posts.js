const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/auth'); // Importamos el middleware
// Configuración básica de Multer (para recibir archivos)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Necesitarás configurar el SDK de Cloudinary previamente

// POST /api/posts - Crear publicación (Ruta protegida)
router.post('/', verificarToken, upload.single('imagen'), async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id; // Extraído del token JWT
        let media_url = null;
        let cloudinary_id = null;

        // Si el usuario subió una imagen, la enviamos a Cloudinary
        if (req.file) {
            // Lógica de Cloudinary (requiere importar y configurar cloudinary v2)
            // const result = await cloudinary.uploader.upload(req.file.path);
            // media_url = result.secure_url;
            // cloudinary_id = result.public_id;
        }

        // Guardar en MySQL
        const [result] = await pool.query(
            'INSERT INTO Posts (user_id, content, media_url, cloudinary_id, media_type) VALUES (?, ?, ?, ?, ?)',
            [userId, content, media_url, cloudinary_id, req.file ? 'imagen' : 'texto']
        );

        res.status(201).json({ mensaje: 'Publicación creada con éxito', postId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/posts - Obtener el feed general
router.get('/', async (req, res) => {
    try {
        // Un JOIN básico para traer el post y quién lo publicó
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.profile_picture 
            FROM Posts p 
            JOIN Users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;