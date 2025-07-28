const { connectDB, db } = require('./src/config/database');
const User = require('./src/models/User');

async function testServerRestart() {
    console.log('🔄 Simulando reinicio del servidor...\n');

    try {
        // Simular primer arranque del servidor
        console.log('🚀 Primer arranque del servidor...');
        await connectDB();
        
        // Crear un usuario
        console.log('\n📝 Creando usuario...');
        const userData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: '123456'
        };

        const user = await User.create(userData);
        const savedUser = await db.createUser(user);
        console.log('✅ Usuario creado y guardado');

        // Probar login (debería funcionar)
        console.log('\n🔐 Probando login después de crear usuario...');
        const foundUser = await db.findByEmail('test@example.com');
        const isCorrect = await foundUser.comparePassword('123456');
        const isWrong = await foundUser.comparePassword('wrong');
        console.log('Contraseña correcta:', isCorrect ? '✅ Correcta' : '❌ Incorrecta');
        console.log('Contraseña incorrecta:', isWrong ? '❌ BUG' : '✅ Correcto');

        // Simular reinicio del servidor
        console.log('\n🔄 Reiniciando servidor...');
        
        // Crear nueva instancia de base de datos (como si fuera un nuevo arranque)
        const InMemoryDatabase = require('./src/config/database').db.constructor;
        const newDb = new InMemoryDatabase();
        await newDb.init();

        // Probar login después del reinicio
        console.log('\n🔐 Probando login después del reinicio...');
        const reloadedUser = await newDb.findByEmail('test@example.com');
        
        if (reloadedUser) {
            console.log('✅ Usuario encontrado después del reinicio');
            console.log('🔐 ¿Es instancia de User?', reloadedUser instanceof User);
            console.log('🔐 ¿Tiene método comparePassword?', typeof reloadedUser.comparePassword === 'function');
            
            const isCorrectAfterRestart = await reloadedUser.comparePassword('123456');
            const isWrongAfterRestart = await reloadedUser.comparePassword('wrong');
            console.log('Contraseña correcta después del reinicio:', isCorrectAfterRestart ? '✅ Correcta' : '❌ Incorrecta');
            console.log('Contraseña incorrecta después del reinicio:', isWrongAfterRestart ? '❌ BUG' : '✅ Correcto');
        } else {
            console.log('❌ Usuario NO encontrado después del reinicio');
        }

        // Verificar archivo
        console.log('\n📄 Verificando archivo de datos...');
        const fs = require('fs');
        const dataFile = './data/users.json';
        if (fs.existsSync(dataFile)) {
            const fileData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            console.log('📄 Usuarios en archivo:', fileData.length);
            if (fileData.length > 0) {
                console.log('📄 Primer usuario:', fileData[0].email);
                console.log('📄 ¿Tiene password?', !!fileData[0].password);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

testServerRestart(); 