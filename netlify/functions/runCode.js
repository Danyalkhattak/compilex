import axios from 'axios'

export const handler = async (event, context) => {
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

    if (!code || !language) {
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
    const submissionResponse = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        source_code: code,
        language_id: languageId
      },
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    const token = submissionResponse.data.token

    // Wait and get result
    let attempts = 0
    let result = null
    
    while (attempts < 10) { // Max 10 attempts (10 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      const resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      )
      
      result = resultResponse.data
      
      if (result.status.id > 2) { // Status > 2 means processing is done
        break
      }
      
      attempts++
    }

    if (!result || result.status.id <= 2) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: 'Code execution timed out'
        })
      }
    }

    // Check for compilation or runtime errors
    if (result.compile_output || result.stderr) {
      const errorMessage = result.compile_output || result.stderr
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: errorMessage.trim()
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