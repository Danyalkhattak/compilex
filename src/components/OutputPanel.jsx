import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { Terminal, X, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const OutputPanel = () => {
  const { output, error, clearOutput } = useAppStore()

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const hasContent = output || error

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Output Header */}
      <div className="glass-effect rounded-t-lg border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary-400" />
          <span className="font-medium text-white">Output</span>
          {error && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Error</span>
            </div>
          )}
          {output && !error && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Success</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasContent && (
            <motion.button
              className="btn-ghost p-2"
              onClick={() => copyToClipboard(output || error)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Copy output"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          )}

          {hasContent && (
            <motion.button
              className="btn-ghost p-2"
              onClick={clearOutput}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Clear output"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 output-panel overflow-auto scrollbar-thin">
        {!hasContent ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-dark-400"
          >
            <Terminal className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              Run your code to see the output here
              <br />
              <span className="text-xs">Press Ctrl+Enter to execute</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error ? (
              <div className="text-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Compilation Error</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
              </div>
            ) : (
              <div className="text-green-400">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Execution Result</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-dark-100">{output}</pre>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default OutputPanel