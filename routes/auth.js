const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Register
router.post('/registro', async (req, res) => {
    try {
        const { username, email, password, fullname } = req.body;

        // Encrypt pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save in db
        const [result] = await pool.query(
            'INSERT INTO USERS (username, email, password, full_name) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, fullname]
        );
        res.status(201).json({ mensaje: "Usuario Registrado con Exito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Search user
        const [rows] = await pool.query('SELECT * FROM USERS WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = rows[0];

        // compare pass
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        //Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;