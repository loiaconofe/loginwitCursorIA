const { connectDB, db } = require('./src/config/database');
const User = require('./src/models/User');

async function testLoginBug() {
    console.log('🐛 Reproduciendo bug de login reportado...\n');

    try {
        // Conectar a la base de datos
        await connectDB();

        // Limpiar base de datos
        await db.clear();
        console.log('✅ Base de datos limpiada');

        // Paso 1: Registrar usuario con contraseña "123456"
        console.log('\n📝 Paso 1: Registrando usuario con contraseña "123456"');
        const userData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: '123456'
        };

        const user = await User.create(userData);
        const savedUser = await db.createUser(user);
        console.log('✅ Usuario registrado:', savedUser.email);
        console.log('🔐 Contraseña original:', userData.password);
        console.log('🔐 Contraseña hasheada:', savedUser.password.substring(0, 30) + '...');

        // Paso 2: Intentar login con contraseña correcta
        console.log('\n🔐 Paso 2: Intentando login con contraseña correcta "123456"');
        const foundUser = await db.findByEmail('test@example.com');
        const correctPassword = await foundUser.comparePassword('123456');
        console.log('Resultado contraseña correcta:', correctPassword ? '✅ ÉXITO' : '❌ FALLO');

        // Paso 3: Intentar login con contraseña incorrecta
        console.log('\n🔐 Paso 3: Intentando login con contraseña incorrecta "wrongpassword"');
        const wrongPassword = await foundUser.comparePassword('wrongpassword');
        console.log('Resultado contraseña incorrecta:', wrongPassword ? '❌ BUG: Debería fallar' : '✅ Correcto: Falló como esperado');

        // Paso 4: Intentar login con contraseña parcial
        console.log('\n🔐 Paso 4: Intentando login con contraseña parcial "12345"');
        const partialPassword = await foundUser.comparePassword('12345');
        console.log('Resultado contraseña parcial:', partialPassword ? '❌ BUG: Debería fallar' : '✅ Correcto: Falló como esperado');

        // Paso 5: Verificar que la contraseña hasheada no es la original
        console.log('\n🔍 Paso 5: Verificando que la contraseña está hasheada');
        const isOriginalPassword = foundUser.password === '123456';
        console.log('¿La contraseña es la original?', isOriginalPassword ? '❌ BUG: No debería ser la original' : '✅ Correcto: Está hasheada');

        // Paso 6: Probar con null y undefined
        console.log('\n🔐 Paso 6: Probando con valores inválidos');
        const nullPassword = await foundUser.comparePassword(null);
        const undefinedPassword = await foundUser.comparePassword(undefined);
        console.log('Contraseña null:', nullPassword ? '❌ BUG' : '✅ Correcto');
        console.log('Contraseña undefined:', undefinedPassword ? '❌ BUG' : '✅ Correcto');

        // Resumen
        console.log('\n📊 Resumen del test:');
        console.log('- Contraseña correcta:', correctPassword ? '✅ Funciona' : '❌ No funciona');
        console.log('- Contraseña incorrecta:', !wrongPassword ? '✅ Funciona' : '❌ Bug detectado');
        console.log('- Contraseña parcial:', !partialPassword ? '✅ Funciona' : '❌ Bug detectado');
        console.log('- Contraseña hasheada:', !isOriginalPassword ? '✅ Funciona' : '❌ Bug detectado');
        console.log('- Valores inválidos:', (!nullPassword && !undefinedPassword) ? '✅ Funciona' : '❌ Bug detectado');

        if (correctPassword && !wrongPassword && !partialPassword && !isOriginalPassword && !nullPassword && !undefinedPassword) {
            console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema de autenticación funciona correctamente.');
        } else {
            console.log('\n⚠️  Se detectaron problemas en el sistema de autenticación.');
        }

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

// Ejecutar test
testLoginBug(); 