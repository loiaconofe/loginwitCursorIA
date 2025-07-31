const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, db } = require('./config/database');
const authRoutes = require('./routes/auth');
const { validateConfig } = require('./utils/config');

// Cargar variables de entorno
dotenv.config();

// Validar configuración requerida
validateConfig();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos en memoria
connectDB();

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    const stats = db.getStats();
    res.json({ 
        message: 'API de Login y Registro funcionando correctamente',
        version: '1.0.0',
        database: 'In-Memory con persistencia JSON',
        stats: stats,
        endpoints: {
            login: 'POST /api/auth/login',
            register: 'POST /api/auth/register',
            profile: 'GET /api/auth/profile',
            updateProfile: 'PUT /api/auth/profile',
            stats: 'GET /api/auth/stats'
        }
    });
});

// Ruta para obtener estadísticas de la base de datos
app.get('/api/stats', (req, res) => {
    const stats = db.getStats();
    res.json({
        success: true,
        data: {
            ...stats,
            database: 'In-Memory con persistencia JSON',
            dataFile: 'backend/data/users.json'
        }
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Ruta no encontrada' 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📱 API disponible en http://localhost:${PORT}`);
    console.log(`🔗 Frontend: http://localhost:${PORT}/front/src/html/index.html`);
    console.log(`📊 Base de datos: In-Memory con persistencia en backend/data/users.json`);
}); 