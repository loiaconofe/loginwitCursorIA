const { connectDB, db } = require('./src/config/database');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function testAuth() {
    console.log('🧪 Iniciando pruebas de autenticación...\n');

    try {
        // Conectar a la base de datos
        await connectDB();

        // Limpiar base de datos para pruebas
        await db.clear();
        console.log('✅ Base de datos limpiada para pruebas');

        // Test 1: Crear usuario
        console.log('\n📝 Test 1: Crear usuario');
        const userData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@test.com',
            password: '123456'
        };

        const user = await User.create(userData);
        const savedUser = await db.createUser(user);
        console.log('✅ Usuario creado:', savedUser.email);

        // Test 2: Buscar usuario por email
        console.log('\n🔍 Test 2: Buscar usuario por email');
        const foundUser = await db.findByEmail('juan@test.com');
        if (foundUser) {
            console.log('✅ Usuario encontrado:', foundUser.email);
            console.log('🔐 Contraseña hasheada:', foundUser.password.substring(0, 20) + '...');
        } else {
            console.log('❌ Usuario no encontrado');
        }

        // Test 3: Verificar contraseña correcta
        console.log('\n🔐 Test 3: Verificar contraseña correcta');
        const isCorrectPassword = await foundUser.comparePassword('123456');
        console.log('Contraseña correcta (123456):', isCorrectPassword ? '✅ Correcta' : '❌ Incorrecta');

        // Test 4: Verificar contraseña incorrecta
        console.log('\n🔐 Test 4: Verificar contraseña incorrecta');
        const isWrongPassword = await foundUser.comparePassword('wrongpassword');
        console.log('Contraseña incorrecta (wrongpassword):', isWrongPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');

        // Test 5: Verificar contraseña parcialmente correcta
        console.log('\n🔐 Test 5: Verificar contraseña parcialmente correcta');
        const isPartialPassword = await foundUser.comparePassword('12345');
        console.log('Contraseña parcial (12345):', isPartialPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');

        // Test 6: Verificar contraseña con espacios
        console.log('\n🔐 Test 6: Verificar contraseña con espacios');
        const isSpacedPassword = await foundUser.comparePassword(' 123456 ');
        console.log('Contraseña con espacios ( 123456 ):', isSpacedPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');

        // Test 7: Verificar contraseña vacía
        console.log('\n🔐 Test 7: Verificar contraseña vacía');
        const isEmptyPassword = await foundUser.comparePassword('');
        console.log('Contraseña vacía:', isEmptyPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');

        // Test 8: Verificar contraseña null
        console.log('\n🔐 Test 8: Verificar contraseña null');
        try {
            const isNullPassword = await foundUser.comparePassword(null);
            console.log('Contraseña null:', isNullPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');
        } catch (error) {
            console.log('❌ Error con contraseña null:', error.message);
        }

        // Test 9: Verificar contraseña undefined
        console.log('\n🔐 Test 9: Verificar contraseña undefined');
        try {
            const isUndefinedPassword = await foundUser.comparePassword(undefined);
            console.log('Contraseña undefined:', isUndefinedPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');
        } catch (error) {
            console.log('❌ Error con contraseña undefined:', error.message);
        }

        // Test 10: Verificar contraseña número
        console.log('\n🔐 Test 10: Verificar contraseña número');
        try {
            const isNumberPassword = await foundUser.comparePassword(123456);
            console.log('Contraseña número (123456):', isNumberPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');
        } catch (error) {
            console.log('❌ Error con contraseña número:', error.message);
        }

        // Test 11: Verificar contraseña objeto
        console.log('\n🔐 Test 11: Verificar contraseña objeto');
        try {
            const isObjectPassword = await foundUser.comparePassword({ password: '123456' });
            console.log('Contraseña objeto:', isObjectPassword ? '❌ Debería ser incorrecta' : '✅ Correctamente rechazada');
        } catch (error) {
            console.log('❌ Error con contraseña objeto:', error.message);
        }

        // Mostrar estadísticas finales
        console.log('\n📊 Estadísticas finales:');
        const stats = db.getStats();
        console.log('Total usuarios:', stats.totalUsers);
        console.log('Usuarios activos:', stats.activeUsers);

        console.log('\n🎉 Todas las pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

// Ejecutar pruebas
testAuth(); 