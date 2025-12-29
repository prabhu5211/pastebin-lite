// Simple test script to verify API functionality
// Run with: node test-api.js

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('Testing Pastebin Lite API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/healthz`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    console.log('✓ Health check passed\n');

    // Test paste creation
    console.log('2. Testing paste creation...');
    const createResponse = await fetch(`${BASE_URL}/api/pastes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'Hello, World! This is a test paste.',
        ttl_seconds: 300, // 5 minutes
        max_views: 5
      }),
    });
    
    const createData = await createResponse.json();
    console.log('Created paste:', createData);
    console.log('✓ Paste creation passed\n');

    // Test paste retrieval
    console.log('3. Testing paste retrieval...');
    const pasteId = createData.id;
    const retrieveResponse = await fetch(`${BASE_URL}/api/pastes/${pasteId}`);
    const retrieveData = await retrieveResponse.json();
    console.log('Retrieved paste:', retrieveData);
    console.log('✓ Paste retrieval passed\n');

    console.log('All tests passed! 🎉');
    console.log(`Visit ${createData.url} to see the paste in your browser.`);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();