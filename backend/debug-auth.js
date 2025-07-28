const { connectDB, db } = require('./src/config/database');
const User = require('./src/models/User');

async function debugAuth() {
    console.log('🔍 Debugging autenticación...\n');

    try {
        // Conectar a la base de datos
        await connectDB();

        // Limpiar base de datos
        await db.clear();
        console.log('✅ Base de datos limpiada');

        // Paso 1: Crear usuario
        console.log('\n📝 Paso 1: Creando usuario...');
        const userData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: '123456'
        };

        const user = await User.create(userData);
        console.log('✅ Usuario creado con User.create():', user.email);
        console.log('🔐 Contraseña original:', userData.password);
        console.log('🔐 Contraseña hasheada:', user.password);
        console.log('🔐 ¿Es instancia de User?', user instanceof User);
        console.log('🔐 ¿Tiene método comparePassword?', typeof user.comparePassword === 'function');

        // Paso 2: Guardar en base de datos
        console.log('\n💾 Paso 2: Guardando en base de datos...');
        const savedUser = await db.createUser(user);
        console.log('✅ Usuario guardado en BD:', savedUser.email);
        console.log('🔐 Contraseña hasheada en BD:', savedUser.password);
        console.log('🔐 ¿Es instancia de User?', savedUser instanceof User);
        console.log('🔐 ¿Tiene método comparePassword?', typeof savedUser.comparePassword === 'function');

        // Paso 3: Buscar usuario por email
        console.log('\n🔍 Paso 3: Buscando usuario por email...');
        const foundUser = await db.findByEmail('test@example.com');
        console.log('✅ Usuario encontrado:', foundUser.email);
        console.log('🔐 Contraseña hasheada encontrada:', foundUser.password);
        console.log('🔐 ¿Es instancia de User?', foundUser instanceof User);
        console.log('🔐 ¿Tiene método comparePassword?', typeof foundUser.comparePassword === 'function');

        // Paso 4: Probar comparación de contraseñas
        console.log('\n🔐 Paso 4: Probando comparación de contraseñas...');
        
        // Contraseña correcta
        console.log('\n--- Contraseña correcta (123456) ---');
        try {
            const isCorrect = await foundUser.comparePassword('123456');
            console.log('Resultado:', isCorrect ? '✅ Correcta' : '❌ Incorrecta');
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        // Contraseña incorrecta
        console.log('\n--- Contraseña incorrecta (wrong) ---');
        try {
            const isWrong = await foundUser.comparePassword('wrong');
            console.log('Resultado:', isWrong ? '❌ BUG: Debería ser incorrecta' : '✅ Correcto: Es incorrecta');
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        // Contraseña parcial
        console.log('\n--- Contraseña parcial (12345) ---');
        try {
            const isPartial = await foundUser.comparePassword('12345');
            console.log('Resultado:', isPartial ? '❌ BUG: Debería ser incorrecta' : '✅ Correcto: Es incorrecta');
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        // Paso 5: Verificar datos en archivo
        console.log('\n📄 Paso 5: Verificando datos en archivo...');
        const fs = require('fs');
        const dataFile = './data/users.json';
        if (fs.existsSync(dataFile)) {
            const fileData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            console.log('📄 Datos en archivo:', fileData.length, 'usuarios');
            if (fileData.length > 0) {
                console.log('📄 Primer usuario en archivo:', fileData[0].email);
                console.log('📄 Contraseña en archivo:', fileData[0].password);
            }
        }

        // Paso 6: Recargar base de datos
        console.log('\n🔄 Paso 6: Recargando base de datos...');
        await db.clear();
        await db.init();
        const reloadedUser = await db.findByEmail('test@example.com');
        if (reloadedUser) {
            console.log('✅ Usuario recargado:', reloadedUser.email);
            console.log('🔐 ¿Es instancia de User?', reloadedUser instanceof User);
            console.log('🔐 ¿Tiene método comparePassword?', typeof reloadedUser.comparePassword === 'function');
            
            // Probar comparación después de recargar
            console.log('\n--- Probando después de recargar ---');
            const isCorrectAfterReload = await reloadedUser.comparePassword('123456');
            const isWrongAfterReload = await reloadedUser.comparePassword('wrong');
            console.log('Contraseña correcta después de recargar:', isCorrectAfterReload ? '✅ Correcta' : '❌ Incorrecta');
            console.log('Contraseña incorrecta después de recargar:', isWrongAfterReload ? '❌ BUG' : '✅ Correcto');
        } else {
            console.log('❌ Usuario no encontrado después de recargar');
        }

    } catch (error) {
        console.error('❌ Error en debug:', error.message);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

// Ejecutar debug
debugAuth(); 