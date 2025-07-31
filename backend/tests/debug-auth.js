const bcrypt = require('bcryptjs');
const { User } = require('../src/models/User');
const { InMemoryDatabase } = require('../src/config/database');

console.log('=== Debug Authentication ===\n');

// Initialize database
const db = new InMemoryDatabase();
db.init();

// Step 1: Check current users
console.log('Step 1: Current users in database');
const allUsers = db.getAllUsers();
console.log('Total users:', allUsers.length);

allUsers.forEach((user, index) => {
    console.log(`User ${index + 1}:`, {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        passwordLength: user.password ? user.password.length : 0,
        hasComparePassword: typeof user.comparePassword === 'function',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
    });
});

// Step 2: Create a test user if none exist
if (allUsers.length === 0) {
    console.log('\nStep 2: Creating test user...');
    const testUser = db.createUser({
        name: 'Debug',
        surname: 'User',
        email: 'debug@example.com',
        password: 'debugpassword123'
    });
    
    console.log('Test user created:', {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        passwordLength: testUser.password.length,
        isHashed: testUser.password !== 'debugpassword123'
    });
    
    db.saveToFile();
    console.log('Database saved');
} else {
    console.log('\nStep 2: Using existing user for testing');
}

// Step 3: Test password comparison
console.log('\nStep 3: Testing password comparison');
const testUser = db.findByEmail('debug@example.com') || allUsers[0];

if (testUser) {
    console.log('Testing with user:', testUser.email);
    console.log('User has comparePassword method:', typeof testUser.comparePassword === 'function');
    
    if (typeof testUser.comparePassword === 'function') {
        // Test with correct password
        const correctResult = testUser.comparePassword('debugpassword123');
        console.log('Correct password result:', correctResult);
        
        // Test with wrong password
        const wrongResult = testUser.comparePassword('wrongpassword');
        console.log('Wrong password result:', wrongResult);
        
        // Test with empty password
        const emptyResult = testUser.comparePassword('');
        console.log('Empty password result:', emptyResult);
        
        // Test with null password
        const nullResult = testUser.comparePassword(null);
        console.log('Null password result:', nullResult);
        
        // Test with undefined password
        const undefinedResult = testUser.comparePassword(undefined);
        console.log('Undefined password result:', undefinedResult);
        
        // Test with number password
        const numberResult = testUser.comparePassword(123);
        console.log('Number password result:', numberResult);
        
        // Test with object password
        const objectResult = testUser.comparePassword({ password: 'test' });
        console.log('Object password result:', objectResult);
    } else {
        console.log('ERROR: User does not have comparePassword method!');
        console.log('User type:', typeof testUser);
        console.log('User constructor:', testUser.constructor.name);
        console.log('User methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(testUser)));
    }
} else {
    console.log('ERROR: No test user found!');
}

// Step 4: Test User class directly
console.log('\nStep 4: Testing User class directly');
const directUser = User.create({
    name: 'Direct',
    surname: 'Test',
    email: 'direct@test.com',
    password: 'directpassword123'
});

console.log('Direct user created:', directUser.email);
console.log('Direct user has comparePassword:', typeof directUser.comparePassword === 'function');

if (typeof directUser.comparePassword === 'function') {
    const directCorrect = directUser.comparePassword('directpassword123');
    console.log('Direct correct password:', directCorrect);
    
    const directWrong = directUser.comparePassword('wrongdirectpassword');
    console.log('Direct wrong password:', directWrong);
}

// Step 5: Test bcrypt directly
console.log('\nStep 5: Testing bcrypt directly');
const testPassword = 'testpassword123';
const hashedPassword = bcrypt.hashSync(testPassword, 10);

console.log('Original password:', testPassword);
console.log('Hashed password:', hashedPassword);

const bcryptCorrect = bcrypt.compareSync(testPassword, hashedPassword);
console.log('Bcrypt correct password:', bcryptCorrect);

const bcryptWrong = bcrypt.compareSync('wrongpassword', hashedPassword);
console.log('Bcrypt wrong password:', bcryptWrong);

// Step 6: Test database persistence
console.log('\nStep 6: Testing database persistence');
db.saveToFile();
console.log('Database saved to file');

// Create new database instance to simulate restart
const newDb = new InMemoryDatabase();
newDb.init();

const reloadedUser = newDb.findByEmail('debug@example.com');
if (reloadedUser) {
    console.log('User reloaded from file:', reloadedUser.email);
    console.log('Reloaded user has comparePassword:', typeof reloadedUser.comparePassword === 'function');
    
    if (typeof reloadedUser.comparePassword === 'function') {
        const reloadedCorrect = reloadedUser.comparePassword('debugpassword123');
        console.log('Reloaded correct password:', reloadedCorrect);
        
        const reloadedWrong = reloadedUser.comparePassword('wrongpassword');
        console.log('Reloaded wrong password:', reloadedWrong);
    }
} else {
    console.log('ERROR: User not found after reload!');
}

console.log('\n=== Debug completed ==='); 