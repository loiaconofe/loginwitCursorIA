const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

console.log('=== Frontend Login Test ===\n');

// Test 1: Check if server is running
async function testServerConnection() {
    console.log('Test 1: Checking server connection...');
    try {
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.text();
        console.log('Server response:', data);
        return true;
    } catch (error) {
        console.log('Server connection failed:', error.message);
        return false;
    }
}

// Test 2: Register a new user
async function testRegistration() {
    console.log('\nTest 2: Testing user registration...');
    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test',
                surname: 'User',
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });

        const data = await response.json();
        console.log('Registration response:', data);
        return data.success;
    } catch (error) {
        console.log('Registration failed:', error.message);
        return false;
    }
}

// Test 3: Login with correct password
async function testCorrectLogin() {
    console.log('\nTest 3: Testing login with correct password...');
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });

        const data = await response.json();
        console.log('Correct login response:', data);
        return data.success;
    } catch (error) {
        console.log('Correct login failed:', error.message);
        return false;
    }
}

// Test 4: Login with wrong password
async function testWrongLogin() {
    console.log('\nTest 4: Testing login with wrong password...');
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
        });

        const data = await response.json();
        console.log('Wrong login response:', data);
        return !data.success; // Should fail
    } catch (error) {
        console.log('Wrong login test failed:', error.message);
        return false;
    }
}

// Test 5: Login with empty password
async function testEmptyPasswordLogin() {
    console.log('\nTest 5: Testing login with empty password...');
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: ''
            })
        });

        const data = await response.json();
        console.log('Empty password login response:', data);
        return !data.success; // Should fail
    } catch (error) {
        console.log('Empty password login test failed:', error.message);
        return false;
    }
}

// Test 6: Login with non-existent user
async function testNonExistentUser() {
    console.log('\nTest 6: Testing login with non-existent user...');
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'nonexistent@example.com',
                password: 'anypassword'
            })
        });

        const data = await response.json();
        console.log('Non-existent user login response:', data);
        return !data.success; // Should fail
    } catch (error) {
        console.log('Non-existent user login test failed:', error.message);
        return false;
    }
}

// Test 7: Get database stats
async function testGetStats() {
    console.log('\nTest 7: Testing database stats...');
    try {
        const response = await fetch(`${BASE_URL}/api/stats`);
        const data = await response.json();
        console.log('Database stats:', data);
        return true;
    } catch (error) {
        console.log('Get stats failed:', error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const results = {
        serverConnection: await testServerConnection(),
        registration: await testRegistration(),
        correctLogin: await testCorrectLogin(),
        wrongLogin: await testWrongLogin(),
        emptyPasswordLogin: await testEmptyPasswordLogin(),
        nonExistentUser: await testNonExistentUser(),
        getStats: await testGetStats()
    };

    console.log('\n=== Test Results ===');
    Object.entries(results).forEach(([test, result]) => {
        console.log(`${test}: ${result ? 'PASS' : 'FAIL'}`);
    });

    const passedTests = Object.values(results).filter(result => result).length;
    const totalTests = Object.keys(results).length;
    console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
}

// Run tests
runAllTests().catch(console.error); 