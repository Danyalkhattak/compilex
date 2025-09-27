const axios = require('axios');

// Test function to check if our serverless functions work
async function testFunctions() {
  console.log('Testing serverless functions...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:8888/.netlify/functions/health');
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: JavaScript code execution
  try {
    console.log('\n2. Testing JavaScript execution...');
    const jsResponse = await axios.post('http://localhost:8888/.netlify/functions/runCode', {
      code: 'console.log("Hello, World!");',
      language: 'javascript'
    });
    console.log('✅ JavaScript execution:', jsResponse.data);
  } catch (error) {
    console.log('❌ JavaScript execution failed:', error.message);
  }

  // Test 3: Python code execution
  try {
    console.log('\n3. Testing Python execution...');
    const pythonResponse = await axios.post('http://localhost:8888/.netlify/functions/runCode', {
      code: 'print("Hello from Python!")',
      language: 'python'
    });
    console.log('✅ Python execution:', pythonResponse.data);
  } catch (error) {
    console.log('❌ Python execution failed:', error.message);
  }

  // Test 4: Code sharing
  try {
    console.log('\n4. Testing code sharing...');
    const shareResponse = await axios.post('http://localhost:8888/.netlify/functions/shareCode', {
      code: 'console.log("Shared code");',
      language: 'javascript',
      title: 'Test Share'
    });
    console.log('✅ Code sharing:', shareResponse.data);
  } catch (error) {
    console.log('❌ Code sharing failed:', error.message);
  }

  console.log('\nTest completed!');
}

// Run tests
testFunctions().catch(console.error);