exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        hasRapidApiKey: !!process.env.RAPIDAPI_KEY,
        hasGithubToken: !!process.env.GITHUB_TOKEN,
        hasHuggingfaceKey: !!process.env.HUGGINGFACE_API_KEY,
        nodeVersion: process.version
      },
      message: 'CompileX serverless functions are running'
    })
  }
}