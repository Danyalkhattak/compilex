import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useAppStore } from '../store/appStore'
import { Play, Save, Sparkles, Settings } from 'lucide-react'
import { runCode, getSuggestions } from '../services/api'
import toast from 'react-hot-toast'

const CodeEditor = () => {
  const editorRef = useRef(null)
  const {
    code,
    language,
    theme,
    fontSize,
    isRunning,
    isAIEnabled,
    setCode,
    setIsRunning,
    setOutput,
    setError,
    setSuggestions,
    addDraft
  } = useAppStore()

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure Monaco themes
    monaco.editor.defineTheme('compilex-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' }
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#334155',
        'editorCursor.foreground': '#0ea5e9',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#0ea5e9'
      }
    })
    
    // Set initial theme
    const currentTheme = theme === 'vs-dark' ? 'compilex-dark' : theme
    monaco.editor.setTheme(currentTheme)

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleRun)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, handleAISuggestion)
  }

  // Effect to handle theme changes
  React.useEffect(() => {
    if (editorRef.current) {
      const monaco = window.monaco
      if (monaco) {
        const currentTheme = theme === 'vs-dark' ? 'compilex-dark' : theme
        monaco.editor.setTheme(currentTheme)
      }
    }
  }, [theme])

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!')
      return
    }

    setIsRunning(true)
    setError('')
    setOutput('')
    
    console.log('Running code:', { language, codeLength: code.length })
    
    try {
      const result = await runCode(code, language)
      console.log('Code execution result:', result)
      
      if (result.success) {
        setOutput(result.output)
        toast.success('Code executed successfully!')
      } else {
        setError(result.error)
        toast.error('Execution error!')
      }
    } catch (error) {
      console.error('Code execution failed:', error)
      setError(`Network Error: ${error.message}`)
      toast.error('Failed to execute code - check console for details')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    if (!code.trim()) {
      toast.error('No code to save!')
      return
    }

    addDraft({
      code,
      language,
      name: `${language} snippet`
    })
    toast.success('Code saved as draft!')
  }

  const handleAISuggestion = async () => {
    if (!isAIEnabled) {
      toast.error('AI suggestions are disabled. Enable them in the sidebar!')
      return
    }

    if (!code.trim()) {
      toast.error('Write some code first to get AI suggestions!')
      return
    }

    try {
      const suggestions = await getSuggestions(code, language)
      setSuggestions(suggestions)
      toast.success('AI suggestions generated!')
    } catch (error) {
      toast.error('Failed to get AI suggestions')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Editor Header */}
      <div className="glass-effect rounded-t-lg border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-dark-300 font-medium">
            main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            className="btn-ghost p-2"
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </motion.button>

          {isAIEnabled && (
            <motion.button
              className="btn-ghost p-2"
              onClick={handleAISuggestion}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="AI Suggestions (Ctrl+Space)"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            className="btn-primary"
            onClick={handleRun}
            disabled={isRunning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Run Code (Ctrl+Enter)"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 code-editor">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'vs-dark' ? 'compilex-dark' : theme}
          options={{
            fontSize,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 20,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            mouseWheelZoom: true,
            padding: { top: 20, bottom: 20 },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
            }
          }}
        />
      </div>
    </motion.div>
  )
}

export default CodeEditor