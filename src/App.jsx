import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import OutputPanel from './components/OutputPanel'
import Sidebar from './components/Sidebar'
import { useAppStore } from './store/appStore'

function App() {
  const { isLoading, sidebarCollapsed } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-4">
          <div className="flex gap-4 h-[calc(100vh-100px)]">
            {/* Collapsible Sidebar */}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -320, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 320 }}
                  exit={{ opacity: 0, x: -320, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <div className="w-80 h-full">
                    <Sidebar />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 min-w-0">
              {/* Code Editor - Takes more space */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 lg:flex-[2] min-h-0"
              >
                <CodeEditor />
              </motion.div>
              
              {/* Output Panel - Smaller but visible */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:flex-1 h-64 lg:h-full min-h-0"
              >
                <OutputPanel />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="glass-effect rounded-xl p-8 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-dark-200">Processing your code...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default App