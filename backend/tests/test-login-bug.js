const bcrypt = require('bcryptjs');
const { User } = require('../src/models/User');
const { InMemoryDatabase } = require('../src/config/database');

console.log('=== Test: Login Bug Reproduction ===\n');

// Initialize database
const db = new InMemoryDatabase();
db.init();

// Step 1: Register a new user
console.log('Step 1: Registering a new user...');
const userData = {
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    password: 'correctpassword123'
};

const newUser = db.createUser(userData);
console.log('User registered:', {
    id: newUser.id,
    name: newUser.name,
    surname: newUser.surname,
    email: newUser.email,
    passwordLength: newUser.password.length,
    isHashed: newUser.password !== userData.password
});

// Step 2: Try to login with correct password
console.log('\nStep 2: Testing login with correct password...');
const foundUser = db.findByEmail('test@example.com');
if (foundUser) {
    console.log('User found in database:', foundUser.email);
    console.log('User has comparePassword method:', typeof foundUser.comparePassword === 'function');
    
    const correctPasswordResult = foundUser.comparePassword('correctpassword123');
    console.log('Correct password result:', correctPasswordResult);
    
    // Log the hashed password for debugging
    console.log('Hashed password in DB:', foundUser.password);
} else {
    console.log('ERROR: User not found in database!');
}

// Step 3: Try to login with wrong password
console.log('\nStep 3: Testing login with wrong password...');
if (foundUser) {
    const wrongPasswordResult = foundUser.comparePassword('wrongpassword');
    console.log('Wrong password result:', wrongPasswordResult);
    
    // Test with empty password
    const emptyPasswordResult = foundUser.comparePassword('');
    console.log('Empty password result:', emptyPasswordResult);
    
    // Test with null password
    const nullPasswordResult = foundUser.comparePassword(null);
    console.log('Null password result:', nullPasswordResult);
}

// Step 4: Test bcrypt directly
console.log('\nStep 4: Testing bcrypt directly...');
const testPassword = 'correctpassword123';
const hashedTestPassword = bcrypt.hashSync(testPassword, 10);
console.log('Original password:', testPassword);
console.log('Hashed password:', hashedTestPassword);

const bcryptCorrectResult = bcrypt.compareSync(testPassword, hashedTestPassword);
console.log('Bcrypt correct password result:', bcryptCorrectResult);

const bcryptWrongResult = bcrypt.compareSync('wrongpassword', hashedTestPassword);
console.log('Bcrypt wrong password result:', bcryptWrongResult);

// Step 5: Test User class methods directly
console.log('\nStep 5: Testing User class methods directly...');
const testUser = User.create({
    name: 'Direct',
    surname: 'Test',
    email: 'direct@test.com',
    password: 'directpassword123'
});

console.log('Direct user created:', testUser.email);
console.log('Direct user has comparePassword:', typeof testUser.comparePassword === 'function');

const directCorrectResult = testUser.comparePassword('directpassword123');
console.log('Direct correct password result:', directCorrectResult);

const directWrongResult = testUser.comparePassword('wrongdirectpassword');
console.log('Direct wrong password result:', directWrongResult);

// Step 6: Test database persistence
console.log('\nStep 6: Testing database persistence...');
db.saveToFile();
console.log('Database saved to file');

// Simulate restart by creating new database instance
const newDb = new InMemoryDatabase();
newDb.init();

const reloadedUser = newDb.findByEmail('test@example.com');
if (reloadedUser) {
    console.log('User reloaded from file:', reloadedUser.email);
    console.log('Reloaded user has comparePassword method:', typeof reloadedUser.comparePassword === 'function');
    
    const reloadedCorrectResult = reloadedUser.comparePassword('correctpassword123');
    console.log('Reloaded correct password result:', reloadedCorrectResult);
    
    const reloadedWrongResult = reloadedUser.comparePassword('wrongpassword');
    console.log('Reloaded wrong password result:', reloadedWrongResult);
} else {
    console.log('ERROR: User not found after reload!');
}

console.log('\n=== Test completed ==='); 