const axios = require('axios')

exports.handler = async (event, context) => {
  console.log('runCode function called:', {
    method: event.httpMethod,
    headers: event.headers,
    hasBody: !!event.body
  })
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  try {
    const { code, language } = JSON.parse(event.body)
    
    console.log('Parsed request:', { 
      language, 
      codeLength: code?.length,
      hasRapidApiKey: !!process.env.RAPIDAPI_KEY
    })

    if (!code || !language) {
      console.log('Missing required fields:', { hasCode: !!code, hasLanguage: !!language })
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Code and language are required'
        })
      }
    }
    
    if (!process.env.RAPIDAPI_KEY) {
      console.error('RAPIDAPI_KEY not found in environment variables')
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'API configuration error'
        })
      }
    }

    // Map language names to Judge0 language IDs
    const languageMap = {
      'javascript': 63,  // Node.js
      'python': 71,      // Python 3
      'java': 62,        // Java
      'cpp': 54,         // C++ (GCC 9.2.0)
      'c': 50,           // C (GCC 9.2.0)
      'php': 68,         // PHP
      'ruby': 72,        // Ruby
      'go': 60,          // Go
      'rust': 73,        // Rust
      'typescript': 74,  // TypeScript
    }

    const languageId = languageMap[language] || 63 // Default to JavaScript

    // Submit code to Judge0 API
    console.log('Submitting to Judge0:', { languageId, codeLength: code.length })
    
    const submissionResponse = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false',
      {
        source_code: code,
        language_id: languageId,
        stdin: '',
        expected_output: null
      },
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    )
    
    console.log('Judge0 submission response:', submissionResponse.data)

    const token = submissionResponse.data.token

    // Wait and get result
    let attempts = 0
    let result = null
    const maxAttempts = 15 // Max 15 attempts (30 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      
      try {
        const resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            timeout: 10000
          }
        )
        
        result = resultResponse.data
        console.log(`Polling attempt ${attempts + 1}:`, { status: result.status })
        
        if (result.status.id > 2) { // Status > 2 means processing is done
          break
        }
      } catch (pollError) {
        console.error(`Polling error on attempt ${attempts + 1}:`, pollError.message)
        if (attempts === maxAttempts - 1) {
          throw pollError
        }
      }
      
      attempts++
    }

    if (!result || result.status.id <= 2) {
      console.log('Execution timed out or failed:', { result })
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: `Code execution timed out after ${maxAttempts * 2} seconds. The code might be taking too long to execute or there might be an issue with the execution environment.`
        })
      }
    }

    console.log('Final result:', { 
      statusId: result.status.id, 
      statusDescription: result.status.description,
      hasStdout: !!result.stdout,
      hasStderr: !!result.stderr,
      hasCompileOutput: !!result.compile_output
    })

    // Check for compilation or runtime errors
    if (result.compile_output && result.compile_output.trim()) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: `Compilation Error:\n${result.compile_output.trim()}`
        })
      }
    }

    if (result.stderr && result.stderr.trim()) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: `Runtime Error:\n${result.stderr.trim()}`
        })
      }
    }

    // Return successful output
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        output: result.stdout || 'Code executed successfully (no output)'
      })
    }

  } catch (error) {
    console.error('Run code error:', error)

    // Handle specific error types
    let errorMessage = 'Internal server error'
    
    if (error.response) {
      // Judge0 API error
      if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (error.response.status === 401) {
        errorMessage = 'API authentication failed'
      } else {
        errorMessage = error.response.data?.message || 'Code execution failed'
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Code execution timed out'
    } else if (error.message) {
      errorMessage = error.message
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: errorMessage
      })
    }
  }
}