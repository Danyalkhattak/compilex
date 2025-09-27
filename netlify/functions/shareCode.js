const axios = require('axios')

exports.handler = async (event, context) => {
  console.log('shareCode function called:', {
    method: event.httpMethod,
    hasGithubToken: !!process.env.GITHUB_TOKEN
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
    const { code, language, title } = JSON.parse(event.body)

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

    // Get file extension
    const getExtension = (lang) => {
      const extensions = {
        'javascript': 'js',
        'python': 'py',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'ruby': 'rb',
        'go': 'go',
        'rust': 'rs',
        'typescript': 'ts'
      }
      return extensions[lang] || 'txt'
    }

    const filename = `main.${getExtension(language)}`
    const gistTitle = title || `CompileX ${language} snippet`

    // Create GitHub Gist using direct API call
    const gistResponse = await axios.post('https://api.github.com/gists', {
      description: gistTitle,
      public: true,
      files: {
        [filename]: {
          content: code
        }
      }
    }, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CompileX'
      }
    })

    const gist = gistResponse.data

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        url: gist.html_url,
        id: gist.id,
        rawUrl: gist.files[filename].raw_url
      })
    }

  } catch (error) {
    console.error('Share code error:', error)

    // Handle specific error types
    let errorMessage = 'Failed to share code'
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'GitHub authentication failed'
      } else if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else {
        errorMessage = error.response.data?.message || 'GitHub API error'
      }
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