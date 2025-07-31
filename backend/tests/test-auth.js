const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../src/models/User');
const { InMemoryDatabase } = require('../src/config/database');

// Test 1: User validation
console.log('=== Test 1: User validation ===');
const validUserData = {
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    password: 'password123'
};

const validationResult = User.validate(validUserData);
console.log('Valid user data validation:', validationResult.success);
console.log('Validation errors:', validationResult.errors);

// Test 2: Password hashing
console.log('\n=== Test 2: Password hashing ===');
const password = 'testpassword123';
const hashedPassword = User.hashPassword(password);
console.log('Original password:', password);
console.log('Hashed password:', hashedPassword);
console.log('Password is hashed:', hashedPassword !== password);

// Test 3: User creation
console.log('\n=== Test 3: User creation ===');
const user = User.create(validUserData);
console.log('User created:', user.name, user.surname, user.email);
console.log('Password is hashed:', user.password !== validUserData.password);
console.log('Has comparePassword method:', typeof user.comparePassword === 'function');

// Test 4: Password comparison - correct password
console.log('\n=== Test 4: Password comparison - correct password ===');
const isCorrectPassword = user.comparePassword(password);
console.log('Correct password comparison:', isCorrectPassword);

// Test 5: Password comparison - wrong password
console.log('\n=== Test 5: Password comparison - wrong password ===');
const isWrongPassword = user.comparePassword('wrongpassword');
console.log('Wrong password comparison:', isWrongPassword);

// Test 6: Password comparison - empty password
console.log('\n=== Test 6: Password comparison - empty password ===');
const isEmptyPassword = user.comparePassword('');
console.log('Empty password comparison:', isEmptyPassword);

// Test 7: Password comparison - undefined password
console.log('\n=== Test 7: Password comparison - undefined password ===');
const isUndefinedPassword = user.comparePassword(undefined);
console.log('Undefined password comparison:', isUndefinedPassword);

// Test 8: Password comparison - null password
console.log('\n=== Test 8: Password comparison - null password ===');
const isNullPassword = user.comparePassword(null);
console.log('Null password comparison:', isNullPassword);

// Test 9: Password comparison - number password
console.log('\n=== Test 9: Password comparison - number password ===');
const isNumberPassword = user.comparePassword(123);
console.log('Number password comparison:', isNumberPassword);

// Test 10: Password comparison - object password
console.log('\n=== Test 10: Password comparison - object password ===');
const isObjectPassword = user.comparePassword({ password: 'test' });
console.log('Object password comparison:', isObjectPassword);

// Test 11: User from data
console.log('\n=== Test 11: User from data ===');
const userData = {
    id: '123',
    name: 'Jane',
    surname: 'Smith',
    email: 'jane@example.com',
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    lastLogin: null
};

const userFromData = User.fromData(userData);
console.log('User from data:', userFromData.name, userFromData.surname);
console.log('Has comparePassword method:', typeof userFromData.comparePassword === 'function');

// Test 12: User public profile
console.log('\n=== Test 12: User public profile ===');
const publicProfile = user.getPublicProfile();
console.log('Public profile:', publicProfile);
console.log('Password not included:', !publicProfile.password);

// Test 13: Database operations
console.log('\n=== Test 13: Database operations ===');
const db = new InMemoryDatabase();
db.init();

// Create a test user
const testUser = db.createUser({
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    password: 'testpass123'
});

console.log('User created in DB:', testUser.name, testUser.email);

// Find user by email
const foundUser = db.findByEmail('test@example.com');
console.log('User found by email:', foundUser ? foundUser.name : 'Not found');

// Find user by ID
const foundUserById = db.findById(testUser.id);
console.log('User found by ID:', foundUserById ? foundUserById.name : 'Not found');

// Test 14: JWT token generation
console.log('\n=== Test 14: JWT token generation ===');
const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
);
console.log('JWT token generated:', token.substring(0, 50) + '...');

// Test 15: JWT token verification
console.log('\n=== Test 15: JWT token verification ===');
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('JWT token verified:', decoded);
} catch (error) {
    console.log('JWT token verification failed:', error.message);
}

console.log('\n=== All tests completed ==='); 