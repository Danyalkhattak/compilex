const axios = require('axios')

exports.handler = async (event, context) => {
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
    const { code, language, max_tokens = 150 } = JSON.parse(event.body)

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

    // Create prompt based on language and code
    const prompts = {
      javascript: `// JavaScript code analysis and suggestions\n// Original code:\n${code}\n\n// Suggestions:`,
      python: `# Python code analysis and suggestions\n# Original code:\n${code}\n\n# Suggestions:`,
      java: `// Java code analysis and suggestions\n// Original code:\n${code}\n\n// Suggestions:`,
      cpp: `// C++ code analysis and suggestions\n// Original code:\n${code}\n\n// Suggestions:`,
      c: `// C code analysis and suggestions\n// Original code:\n${code}\n\n// Suggestions:`,
      default: `// Code analysis and suggestions\n// Original code:\n${code}\n\n// Suggestions:`
    }

    const prompt = prompts[language] || prompts.default

    // Call HuggingFace Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bigcode/starcoder',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: max_tokens,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      }
    )

    const result = response.data

    // Parse the AI response and create suggestions
    let suggestions = []
    
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0].generated_text || ''
      
      // Create different types of suggestions
      suggestions = [
        {
          text: generatedText.trim(),
          confidence: 0.85,
          type: 'ai_suggestion'
        },
        {
          text: `// Code optimization suggestion:\n// Consider adding error handling and input validation`,
          confidence: 0.75,
          type: 'best_practice'
        },
        {
          text: `// Performance tip:\n// Use appropriate data structures for better efficiency`,
          confidence: 0.70,
          type: 'performance'
        }
      ]
    } else {
      // Fallback suggestions if AI doesn't respond properly
      suggestions = [
        {
          text: `// General suggestion for ${language}:\n// Add comments to explain complex logic`,
          confidence: 0.60,
          type: 'documentation'
        },
        {
          text: `// Code quality suggestion:\n// Consider breaking down large functions into smaller ones`,
          confidence: 0.65,
          type: 'refactoring'
        }
      ]
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        suggestions: suggestions.filter(s => s.text && s.text.length > 10) // Filter out empty/short suggestions
      })
    }

  } catch (error) {
    console.error('AI suggestions error:', error)

    // Handle specific error types
    let errorMessage = 'Failed to get AI suggestions'
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'HuggingFace API authentication failed'
      } else if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (error.response.status === 503) {
        errorMessage = 'AI model is currently loading. Please try again in a moment.'
      } else {
        errorMessage = error.response.data?.error || 'AI API error'
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'AI request timed out'
    } else if (error.message) {
      errorMessage = error.message
    }

    // Return fallback suggestions even on error
    const fallbackSuggestions = [
      {
        text: `// Code review suggestion:\n// Add proper error handling and validation`,
        confidence: 0.60,
        type: 'best_practice'
      },
      {
        text: `// Performance tip:\n// Consider optimizing loops and data access patterns`,
        confidence: 0.55,
        type: 'performance'
      }
    ]

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        suggestions: fallbackSuggestions,
        warning: 'AI service unavailable, showing fallback suggestions'
      })
    }
  }
}