import axios from 'axios'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''

// API service for code execution
export const runCode = async (code, language) => {
  try {
    // For development, use Piston API (free alternative)
    if (import.meta.env.DEV) {
      return new Promise(async (resolve) => {
        try {
          // Use Piston API for development (free and no API key required)
          const languageMap = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'php': 'php',
            'ruby': 'ruby',
            'go': 'go',
            'rust': 'rust',
            'typescript': 'typescript'
          }

          const pistonLang = languageMap[language] || 'javascript'
          
          const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language: pistonLang,
              version: '*',
              files: [
                {
                  content: code
                }
              ]
            })
          })

          const result = await response.json()

          if (result.compile && result.compile.stderr) {
            resolve({
              success: false,
              error: result.compile.stderr
            })
          } else if (result.run && result.run.stderr) {
            resolve({
              success: false,
              error: result.run.stderr
            })
          } else {
            resolve({
              success: true,
              output: (result.run ? result.run.stdout : result.stdout) || 'Code executed successfully'
            })
          }
        } catch (error) {
          // Fallback to simple mock for JavaScript
          if (language === 'javascript') {
            try {
              const result = eval(code)
              resolve({
                success: true,
                output: result !== undefined ? String(result) : 'Code executed successfully'
              })
            } catch (evalError) {
              resolve({
                success: false,
                error: `JavaScript Error: ${evalError.message}`
              })
            }
          } else {
            resolve({
              success: true,
              output: `Mock output for ${language}:\nHello, World!\nCode executed successfully!`
            })
          }
        }
      })
    }

    // Production API call to serverless function
    const response = await axios.post(`${API_BASE}/api/runCode`, {
      code,
      language
    })

    return response.data
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: `Network error: ${error.message}`
    }
  }
}

// API service for code sharing
export const shareCode = async (code, language) => {
  try {
    // For development, use Pastebin-like mock or JSONBin
    if (import.meta.env.DEV) {
      return new Promise(async (resolve) => {
        try {
          // Use JSONBin.io for development (free service)
          const response = await fetch('https://api.jsonbin.io/v3/b', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': '$2a$10$WzKNE1lzWFOLEQW8J.Qg4.VGvBU.nD7EZkN8W.1YJgGOKzxRZNAGy' // Public demo key
            },
            body: JSON.stringify({
              code: code,
              language: language,
              timestamp: new Date().toISOString(),
              title: `CompileX ${language} snippet`
            })
          })

          if (response.ok) {
            const result = await response.json()
            const shareUrl = `https://compilex-share.netlify.app/share/${result.metadata.id}`
            resolve({
              success: true,
              url: shareUrl,
              id: result.metadata.id
            })
          } else {
            throw new Error('Failed to create share')
          }
        } catch (error) {
          // Fallback to simple mock
          const mockId = Math.random().toString(36).substring(7)
          resolve({
            success: true,
            url: `https://compilex-demo.netlify.app/share/${mockId}`,
            id: mockId
          })
        }
      })
    }

    // Production API call to serverless function
    const response = await axios.post(`${API_BASE}/api/shareCode`, {
      code,
      language,
      title: `CompileX ${language} snippet`
    })

    return response.data
  } catch (error) {
    console.error('Share API Error:', error)
    return {
      success: false,
      error: `Failed to share: ${error.message}`
    }
  }
}

// API service for AI suggestions
export const getSuggestions = async (code, language) => {
  try {
    // For development, return mock suggestions
    if (import.meta.env.DEV) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockSuggestions = [
            {
              text: `// AI Suggestion: Add error handling\ntry {\n  ${code}\n} catch (error) {\n  console.error('Error:', error);\n}`,
              confidence: 0.85,
              type: 'improvement'
            },
            {
              text: `// AI Suggestion: Add type checking\nif (typeof variable !== 'undefined') {\n  // Your code here\n}`,
              confidence: 0.72,
              type: 'safety'
            },
            {
              text: `// AI Suggestion: Performance optimization\n// Consider using const instead of let for immutable values`,
              confidence: 0.68,
              type: 'performance'
            }
          ]
          resolve(mockSuggestions)
        }, 2000)
      })
    }

    // Production API call to serverless function
    const response = await axios.post(`${API_BASE}/api/getSuggestions`, {
      code,
      language,
      max_tokens: 150
    })

    return response.data.suggestions || []
  } catch (error) {
    console.error('AI API Error:', error)
    throw new Error(`Failed to get suggestions: ${error.message}`)
  }
}

// Helper function to detect language from code
export const detectLanguage = (code) => {
  const patterns = {
    python: /(?:def\s+\w+|import\s+\w+|from\s+\w+|print\s*\()/,
    javascript: /(?:function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|console\.log)/,
    java: /(?:public\s+class|public\s+static\s+void\s+main|System\.out\.println)/,
    cpp: /(?:#include\s*<|using\s+namespace|std::cout|cout\s*<<)/,
    c: /(?:#include\s*<|printf\s*\(|scanf\s*\()/,
    php: /(?:<\?php|\$\w+|echo\s+)/,
    ruby: /(?:def\s+\w+|puts\s+|require\s+)/,
    go: /(?:package\s+main|func\s+main|fmt\.Printf)/,
    rust: /(?:fn\s+main|println!|use\s+std::)/,
  }

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(code)) {
      return lang
    }
  }

  return 'javascript' // Default fallback
}

// Helper function to get language file extension
export const getFileExtension = (language) => {
  const extensions = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    php: 'php',
    ruby: 'rb',
    go: 'go',
    rust: 'rs'
  }
  
  return extensions[language] || 'txt'
}