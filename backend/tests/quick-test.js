const bcrypt = require('bcryptjs');

console.log('=== Quick Bcrypt Test ===\n');

// Test 1: Basic hashing
console.log('Test 1: Basic hashing');
const password = 'testpassword123';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Original password:', password);
console.log('Hashed password:', hashedPassword);
console.log('Password is hashed:', hashedPassword !== password);

// Test 2: Basic comparison
console.log('\nTest 2: Basic comparison');
const correctResult = bcrypt.compareSync(password, hashedPassword);
console.log('Correct password comparison:', correctResult);

const wrongResult = bcrypt.compareSync('wrongpassword', hashedPassword);
console.log('Wrong password comparison:', wrongResult);

// Test 3: Edge cases
console.log('\nTest 3: Edge cases');
console.log('Empty password comparison:', bcrypt.compareSync('', hashedPassword));
console.log('Null password comparison:', bcrypt.compareSync(null, hashedPassword));
console.log('Undefined password comparison:', bcrypt.compareSync(undefined, hashedPassword));

// Test 4: Multiple hashes of same password
console.log('\nTest 4: Multiple hashes of same password');
const hash1 = bcrypt.hashSync(password, 10);
const hash2 = bcrypt.hashSync(password, 10);
console.log('Hash 1:', hash1);
console.log('Hash 2:', hash2);
console.log('Hashes are different:', hash1 !== hash2);
console.log('Both work with original password:', 
    bcrypt.compareSync(password, hash1) && bcrypt.compareSync(password, hash2));

console.log('\n=== Quick test completed ==='); 