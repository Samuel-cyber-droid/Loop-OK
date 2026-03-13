const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        // verify token
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token no válido' });
    }
};

module.exports = verificarToken;