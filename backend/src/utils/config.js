/**
 * Configuración y validación de variables de entorno
 */

// Función para validar que una variable de entorno esté definida
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Error de configuración: La variable de entorno ${name} es requerida pero no está definida.`);
    }
    return value;
};

// Función para obtener JWT_SECRET con validación
const getJwtSecret = () => {
    return requireEnv('JWT_SECRET');
};

// Función para validar toda la configuración al inicio
const validateConfig = () => {
    try {
        const jwtSecret = getJwtSecret();
        console.log('✅ Configuración validada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error de configuración:', error.message);
        console.error('Por favor, asegúrate de que todas las variables de entorno requeridas estén definidas.');
        process.exit(1);
    }
};

module.exports = {
    requireEnv,
    getJwtSecret,
    validateConfig
}; 