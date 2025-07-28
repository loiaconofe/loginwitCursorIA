const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.lastLogin = data.lastLogin;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    // Validar datos del usuario
    static validate(userData) {
        const errors = [];

        // Validar nombre
        if (!userData.firstName || userData.firstName.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        } else if (userData.firstName.length > 50) {
            errors.push('El nombre no puede exceder 50 caracteres');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.firstName)) {
            errors.push('El nombre solo puede contener letras');
        }

        // Validar apellido
        if (!userData.lastName || userData.lastName.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        } else if (userData.lastName.length > 50) {
            errors.push('El apellido no puede exceder 50 caracteres');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.lastName)) {
            errors.push('El apellido solo puede contener letras');
        }

        // Validar email
        if (!userData.email) {
            errors.push('El email es requerido');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            errors.push('Ingresa un email válido');
        }

        // Validar contraseña
        if (!userData.password) {
            errors.push('La contraseña es requerida');
        } else if (userData.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        return errors;
    }

    // Validar email
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validar nombre y apellido
    static validateName(name) {
        return name.trim().length >= 2 && 
               name.length <= 50 && 
               /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
    }

    // Hashear contraseña
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    }

    // Comparar contraseña
    async comparePassword(candidatePassword) {
        // Validar que candidatePassword sea una cadena válida
        if (!candidatePassword || typeof candidatePassword !== 'string') {
            return false;
        }
        
        // Validar que this.password exista y sea una cadena válida
        if (!this.password || typeof this.password !== 'string') {
            return false;
        }
        
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            console.error('Error comparando contraseñas:', error.message);
            return false;
        }
    }

    // Obtener perfil público (sin contraseña)
    getPublicProfile() {
        const { password, ...publicProfile } = this;
        return publicProfile;
    }

    // Actualizar último login
    updateLastLogin() {
        this.lastLogin = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Actualizar datos del usuario
    update(updates) {
        if (updates.firstName !== undefined) this.firstName = updates.firstName;
        if (updates.lastName !== undefined) this.lastName = updates.lastName;
        if (updates.email !== undefined) this.email = updates.email;
        if (updates.isActive !== undefined) this.isActive = updates.isActive;
        
        this.updatedAt = new Date().toISOString();
    }

    // Convertir a objeto plano
    toObject() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            isActive: this.isActive,
            lastLogin: this.lastLogin,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Crear usuario desde datos
    static async create(userData) {
        // Validar datos
        const errors = User.validate(userData);
        if (errors.length > 0) {
            throw new Error(`Datos inválidos: ${errors.join(', ')}`);
        }

        // Hashear contraseña
        const hashedPassword = await User.hashPassword(userData.password);

        // Crear usuario
        const user = new User({
            ...userData,
            password: hashedPassword
        });

        return user;
    }

    // Crear usuario desde datos existentes (para cargar desde archivo)
    static fromData(data) {
        return new User(data);
    }
}

module.exports = User; 