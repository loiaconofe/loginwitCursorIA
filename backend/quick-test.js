const bcrypt = require('bcryptjs');

async function quickTest() {
    console.log('🧪 Test rápido de bcrypt...\n');

    const password = '123456';
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Contraseña original:', password);
    console.log('Contraseña hasheada:', hashedPassword);
    
    // Probar comparaciones
    console.log('\n--- Comparaciones ---');
    
    // Correcta
    const isCorrect = await bcrypt.compare('123456', hashedPassword);
    console.log('123456:', isCorrect ? '✅ Correcta' : '❌ Incorrecta');
    
    // Incorrecta
    const isWrong = await bcrypt.compare('wrong', hashedPassword);
    console.log('wrong:', isWrong ? '❌ BUG' : '✅ Correcto');
    
    // Parcial
    const isPartial = await bcrypt.compare('12345', hashedPassword);
    console.log('12345:', isPartial ? '❌ BUG' : '✅ Correcto');
    
    // Vacía
    const isEmpty = await bcrypt.compare('', hashedPassword);
    console.log('vacía:', isEmpty ? '❌ BUG' : '✅ Correcto');
    
    // Null
    try {
        const isNull = await bcrypt.compare(null, hashedPassword);
        console.log('null:', isNull ? '❌ BUG' : '✅ Correcto');
    } catch (error) {
        console.log('null: ❌ Error -', error.message);
    }
}

quickTest(); 