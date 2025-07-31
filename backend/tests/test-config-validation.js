const { validateConfig, getJwtSecret, requireEnv } = require('../src/utils/config');

console.log('=== Test: Configuration Validation ===\n');

// Test 1: Check if JWT_SECRET is defined
console.log('Test 1: Checking if JWT_SECRET is defined...');
try {
    const jwtSecret = getJwtSecret();
    console.log('✅ JWT_SECRET is defined:', jwtSecret ? 'Yes' : 'No');
    console.log('JWT_SECRET length:', jwtSecret ? jwtSecret.length : 0);
} catch (error) {
    console.log('❌ JWT_SECRET error:', error.message);
}

// Test 2: Test requireEnv function with existing variable
console.log('\nTest 2: Testing requireEnv with existing variable...');
try {
    const port = requireEnv('PORT');
    console.log('✅ PORT is defined:', port);
} catch (error) {
    console.log('❌ PORT error:', error.message);
}

// Test 3: Test requireEnv function with non-existing variable
console.log('\nTest 3: Testing requireEnv with non-existing variable...');
try {
    const nonExistent = requireEnv('NON_EXISTENT_VARIABLE');
    console.log('✅ NON_EXISTENT_VARIABLE is defined:', nonExistent);
} catch (error) {
    console.log('❌ NON_EXISTENT_VARIABLE error:', error.message);
}

// Test 4: Test validateConfig function
console.log('\nTest 4: Testing validateConfig function...');
try {
    const result = validateConfig();
    console.log('✅ validateConfig result:', result);
} catch (error) {
    console.log('❌ validateConfig error:', error.message);
}

// Test 5: Test JWT token generation with validated secret
console.log('\nTest 5: Testing JWT token generation with validated secret...');
try {
    const jwt = require('jsonwebtoken');
    const secret = getJwtSecret();
    const token = jwt.sign({ test: 'data' }, secret, { expiresIn: '1h' });
    console.log('✅ JWT token generated successfully');
    console.log('Token preview:', token.substring(0, 50) + '...');
    
    // Verify the token
    const decoded = jwt.verify(token, secret);
    console.log('✅ JWT token verified successfully');
    console.log('Decoded data:', decoded);
} catch (error) {
    console.log('❌ JWT token generation/verification error:', error.message);
}

console.log('\n=== Configuration validation test completed ==='); 