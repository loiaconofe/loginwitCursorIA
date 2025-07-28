const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
    let token;

    // Verificar si el token está en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-jwt');

            // Obtener el usuario del token
            const user = await db.findById(decoded.userId);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido - Usuario no encontrado'
                });
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido - Usuario deshabilitado'
                });
            }

            // Agregar el usuario al request
            req.user = user;
            next();

        } catch (error) {
            console.error('Error verificando token:', error);
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado - Token no proporcionado'
        });
    }
};

// Middleware opcional para rutas que pueden ser públicas o privadas
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-jwt');
            
            const user = await db.findById(decoded.userId);
            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Si hay error, simplemente continuar sin usuario
            console.log('Token opcional inválido:', error.message);
        }
    }

    next();
};

// Middleware para verificar roles (extensible para futuras funcionalidades)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        // Por ahora solo verificamos que el usuario exista
        // En el futuro se pueden agregar roles específicos
        next();
    };
};

module.exports = {
    protect,
    optionalAuth,
    authorize
}; 