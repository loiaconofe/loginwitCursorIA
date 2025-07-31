const { InMemoryDatabase } = require('../src/config/database');
const { User } = require('../src/models/User');

console.log('=== Test: Server Restart Simulation ===\n');

// Step 1: Create initial database and add users
console.log('Step 1: Creating initial database with users...');
const db1 = new InMemoryDatabase();
db1.init();

// Add some test users
const user1 = db1.createUser({
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    password: 'password123'
});

const user2 = db1.createUser({
    name: 'Jane',
    surname: 'Smith',
    email: 'jane@example.com',
    password: 'password456'
});

console.log('Users created:');
console.log('- User 1:', user1.name, user1.surname, user1.email);
console.log('- User 2:', user2.name, user2.surname, user2.email);

// Save to file
db1.saveToFile();
console.log('Database saved to file');

// Step 2: Simulate server restart by creating new database instance
console.log('\nStep 2: Simulating server restart...');
const db2 = new InMemoryDatabase();
db2.init();

// Check if users are loaded correctly
console.log('Users loaded after restart:');
const loadedUser1 = db2.findByEmail('john@example.com');
const loadedUser2 = db2.findByEmail('jane@example.com');

if (loadedUser1) {
    console.log('- User 1 loaded:', loadedUser1.name, loadedUser1.surname, loadedUser1.email);
    console.log('  Has comparePassword method:', typeof loadedUser1.comparePassword === 'function');
    console.log('  Password comparison works:', loadedUser1.comparePassword('password123'));
} else {
    console.log('- User 1 NOT loaded!');
}

if (loadedUser2) {
    console.log('- User 2 loaded:', loadedUser2.name, loadedUser2.surname, loadedUser2.email);
    console.log('  Has comparePassword method:', typeof loadedUser2.comparePassword === 'function');
    console.log('  Password comparison works:', loadedUser2.comparePassword('password456'));
} else {
    console.log('- User 2 NOT loaded!');
}

// Step 3: Test authentication after restart
console.log('\nStep 3: Testing authentication after restart...');
if (loadedUser1) {
    console.log('Testing login for john@example.com:');
    console.log('- Correct password:', loadedUser1.comparePassword('password123'));
    console.log('- Wrong password:', loadedUser1.comparePassword('wrongpassword'));
    console.log('- Empty password:', loadedUser1.comparePassword(''));
    console.log('- Null password:', loadedUser1.comparePassword(null));
}

if (loadedUser2) {
    console.log('Testing login for jane@example.com:');
    console.log('- Correct password:', loadedUser2.comparePassword('password456'));
    console.log('- Wrong password:', loadedUser2.comparePassword('wrongpassword'));
}

// Step 4: Add new user after restart
console.log('\nStep 4: Adding new user after restart...');
const user3 = db2.createUser({
    name: 'Bob',
    surname: 'Johnson',
    email: 'bob@example.com',
    password: 'password789'
});

console.log('New user created:', user3.name, user3.surname, user3.email);
console.log('New user has comparePassword method:', typeof user3.comparePassword === 'function');

// Save again
db2.saveToFile();
console.log('Database saved again');

// Step 5: Simulate another restart
console.log('\nStep 5: Simulating another restart...');
const db3 = new InMemoryDatabase();
db3.init();

// Check all users
console.log('All users after second restart:');
const allUsers = db3.getAllUsers();
console.log('Total users:', allUsers.length);

allUsers.forEach((user, index) => {
    console.log(`- User ${index + 1}:`, user.name, user.surname, user.email);
    console.log(`  Has comparePassword method:`, typeof user.comparePassword === 'function');
});

// Step 6: Test all users can authenticate
console.log('\nStep 6: Testing authentication for all users...');
const testUsers = [
    { email: 'john@example.com', password: 'password123' },
    { email: 'jane@example.com', password: 'password456' },
    { email: 'bob@example.com', password: 'password789' }
];

testUsers.forEach((testUser, index) => {
    const user = db3.findByEmail(testUser.email);
    if (user) {
        console.log(`User ${index + 1} (${testUser.email}):`);
        console.log(`- Correct password:`, user.comparePassword(testUser.password));
        console.log(`- Wrong password:`, user.comparePassword('wrongpassword'));
    } else {
        console.log(`User ${index + 1} (${testUser.email}): NOT FOUND`);
    }
});

console.log('\n=== Test completed ==='); 