const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const User = require('../models/User');

// Generar JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'tu-secreto-jwt', {
        expiresIn: '7d'
    });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await db.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario usando la clase User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        // Guardar en la base de datos
        const savedUser = await db.createUser(user);

        // Generar token
        const token = generateToken(savedUser.id);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: savedUser.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        // Manejar errores de validación
        if (error.message.includes('Datos inválidos')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar que el usuario existe
        const user = await db.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta deshabilitada'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Actualizar último login
        user.updateLastLogin();
        await db.updateUser(user.id, user.toObject());

        // Generar token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await db.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.getPublicProfile()
            }
        });

    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const updates = {};

        // Solo actualizar campos que se proporcionen
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;

        // Verificar si el email ya existe (si se está actualizando)
        if (email) {
            const existingUser = await db.findByEmail(email);
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está en uso'
                });
            }
        }

        // Validar los datos actualizados
        const currentUser = await db.findById(req.user.id);
        const updatedData = { ...currentUser.toObject(), ...updates };
        
        const errors = User.validate(updatedData);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors
            });
        }

        const updatedUser = await db.updateUser(req.user.id, updates);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: {
                user: user.getPublicProfile()
            }
        });

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// @desc    Obtener estadísticas de la base de datos (solo para desarrollo)
// @route   GET /api/auth/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const stats = db.getStats();
        
        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getStats
}; 