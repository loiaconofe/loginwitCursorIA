const { connectDB, db } = require('./src/config/database');
const User = require('./src/models/User');

async function testFrontendLogin() {
    console.log('🌐 Simulando llamadas del frontend...\n');

    try {
        // Conectar a la base de datos
        await connectDB();

        // Limpiar base de datos
        await db.clear();
        console.log('✅ Base de datos limpiada');

        // Paso 1: Registrar usuario (como hace el frontend)
        console.log('\n📝 Paso 1: Registrando usuario...');
        const registerData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: '123456'
        };

        // Simular el registro como lo hace el controlador
        const user = await User.create(registerData);
        const savedUser = await db.createUser(user);
        console.log('✅ Usuario registrado:', savedUser.email);

        // Paso 2: Simular login con contraseña correcta
        console.log('\n🔐 Paso 2: Login con contraseña correcta...');
        const loginDataCorrect = {
            email: 'test@example.com',
            password: '123456'
        };

        // Simular exactamente lo que hace el controlador de login
        const userFound = await db.findByEmail(loginDataCorrect.email);
        if (!userFound) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('✅ Usuario encontrado:', userFound.email);
        console.log('🔐 ¿Es instancia de User?', userFound instanceof User);
        console.log('🔐 ¿Tiene método comparePassword?', typeof userFound.comparePassword === 'function');

        const isPasswordValid = await userFound.comparePassword(loginDataCorrect.password);
        console.log('🔐 Contraseña correcta:', isPasswordValid ? '✅ Válida' : '❌ Inválida');

        if (isPasswordValid) {
            console.log('✅ Login exitoso con contraseña correcta');
        } else {
            console.log('❌ Login fallido con contraseña correcta');
        }

        // Paso 3: Simular login con contraseña incorrecta
        console.log('\n🔐 Paso 3: Login con contraseña incorrecta...');
        const loginDataWrong = {
            email: 'test@example.com',
            password: 'wrong'
        };

        const userFound2 = await db.findByEmail(loginDataWrong.email);
        if (!userFound2) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        const isPasswordValid2 = await userFound2.comparePassword(loginDataWrong.password);
        console.log('🔐 Contraseña incorrecta:', isPasswordValid2 ? '❌ BUG: Debería ser inválida' : '✅ Correcto: Es inválida');

        if (isPasswordValid2) {
            console.log('❌ BUG: Login exitoso con contraseña incorrecta');
        } else {
            console.log('✅ Correcto: Login fallido con contraseña incorrecta');
        }

        // Paso 4: Probar con contraseña parcial
        console.log('\n🔐 Paso 4: Login con contraseña parcial...');
        const loginDataPartial = {
            email: 'test@example.com',
            password: '12345'
        };

        const userFound3 = await db.findByEmail(loginDataPartial.email);
        const isPasswordValid3 = await userFound3.comparePassword(loginDataPartial.password);
        console.log('🔐 Contraseña parcial:', isPasswordValid3 ? '❌ BUG: Debería ser inválida' : '✅ Correcto: Es inválida');

        // Paso 5: Probar con contraseña vacía
        console.log('\n🔐 Paso 5: Login con contraseña vacía...');
        const loginDataEmpty = {
            email: 'test@example.com',
            password: ''
        };

        const userFound4 = await db.findByEmail(loginDataEmpty.email);
        const isPasswordValid4 = await userFound4.comparePassword(loginDataEmpty.password);
        console.log('🔐 Contraseña vacía:', isPasswordValid4 ? '❌ BUG: Debería ser inválida' : '✅ Correcto: Es inválida');

        // Paso 6: Verificar datos en memoria
        console.log('\n📊 Paso 6: Verificando datos en memoria...');
        const stats = db.getStats();
        console.log('📊 Estadísticas:', stats);

        // Paso 7: Verificar datos en archivo
        console.log('\n📄 Paso 7: Verificando datos en archivo...');
        const fs = require('fs');
        const dataFile = './data/users.json';
        if (fs.existsSync(dataFile)) {
            const fileData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            console.log('📄 Usuarios en archivo:', fileData.length);
            if (fileData.length > 0) {
                console.log('📄 Primer usuario:', fileData[0].email);
                console.log('📄 Contraseña hasheada:', fileData[0].password);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

testFrontendLogin(); 