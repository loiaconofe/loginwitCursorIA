const fs = require('fs').promises;
const path = require('path');

class InMemoryDatabase {
    constructor() {
        this.users = new Map();
        this.dataFile = path.join(__dirname, '../../data/users.json');
        this.initialized = false;
    }

    // Inicializar la base de datos
    async init() {
        try {
            // Crear directorio de datos si no existe
            const dataDir = path.dirname(this.dataFile);
            try {
                await fs.access(dataDir);
            } catch {
                await fs.mkdir(dataDir, { recursive: true });
            }

            // Cargar datos existentes si el archivo existe
            try {
                const data = await fs.readFile(this.dataFile, 'utf8');
                const users = JSON.parse(data);
                
                // Convertir array a Map para mejor rendimiento
                // Importar User aquí para evitar dependencias circulares
                const User = require('../models/User');
                users.forEach(userData => {
                    // Crear instancia de User para mantener los métodos
                    const user = User.fromData(userData);
                    this.users.set(user.id, user);
                });
                
                console.log(`✅ Base de datos en memoria cargada: ${this.users.size} usuarios`);
            } catch (error) {
                // Si el archivo no existe, crear uno vacío
                await this.saveToFile();
                console.log('✅ Base de datos en memoria inicializada');
            }
            
            this.initialized = true;
        } catch (error) {
            console.error('❌ Error inicializando base de datos:', error.message);
            throw error;
        }
    }

    // Guardar datos en archivo
    async saveToFile() {
        try {
            const usersArray = Array.from(this.users.values()).map(user => {
                // Si es una instancia de User, convertir a objeto plano
                if (typeof user.toObject === 'function') {
                    return user.toObject();
                }
                return user;
            });
            await fs.writeFile(this.dataFile, JSON.stringify(usersArray, null, 2));
        } catch (error) {
            console.error('Error guardando datos:', error.message);
        }
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Crear usuario
    async createUser(userData) {
        // Importar User aquí para evitar dependencias circulares
        const User = require('../models/User');
        
        let user;
        
        // Si userData ya es una instancia de User, solo agregar el ID
        if (userData instanceof User) {
            userData.id = this.generateId();
            user = userData;
            this.users.set(user.id, user);
        } else {
            // Si es un objeto plano, crear instancia de User
            user = new User({
                id: this.generateId(),
                ...userData,
                isActive: true,
                lastLogin: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            this.users.set(user.id, user);
        }
        
        await this.saveToFile();
        return user;
    }

    // Buscar usuario por email
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email.toLowerCase() === email.toLowerCase()) {
                return user;
            }
        }
        return null;
    }

    // Buscar usuario por ID
    async findById(id) {
        return this.users.get(id) || null;
    }

    // Actualizar usuario
    async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) return null;

        // Si es una instancia de User, usar su método update
        if (typeof user.update === 'function') {
            user.update(updates);
        } else {
            // Si es un objeto plano, actualizar directamente
            Object.assign(user, updates, {
                updatedAt: new Date().toISOString()
            });
        }

        this.users.set(id, user);
        await this.saveToFile();
        return user;
    }

    // Eliminar usuario
    async deleteUser(id) {
        const deleted = this.users.delete(id);
        if (deleted) {
            await this.saveToFile();
        }
        return deleted;
    }

    // Obtener todos los usuarios (solo para desarrollo)
    async getAllUsers() {
        return Array.from(this.users.values());
    }

    // Obtener estadísticas
    getStats() {
        return {
            totalUsers: this.users.size,
            activeUsers: Array.from(this.users.values()).filter(u => u.isActive).length,
            initialized: this.initialized
        };
    }

    // Limpiar base de datos (solo para desarrollo)
    async clear() {
        this.users.clear();
        await this.saveToFile();
    }
}

// Instancia global de la base de datos
const db = new InMemoryDatabase();

// Función para conectar (inicializar)
const connectDB = async () => {
    try {
        await db.init();
        console.log('✅ Base de datos en memoria conectada');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, db }; 