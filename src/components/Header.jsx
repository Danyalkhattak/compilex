import React from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, 
  Zap, 
  Share2, 
  Github, 
  Star,
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

const Header = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect border-b border-white/10 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <motion.button
              onClick={toggleSidebar}
              className="btn-ghost p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
            >
              {sidebarCollapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </motion.button>

            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(14, 165, 233, 0.4)',
                      '0 0 0 10px rgba(14, 165, 233, 0)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">CompileX</h1>
                <p className="text-xs text-dark-400">Multi-Language Compiler</p>
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <div className="hidden md:flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-2 text-dark-300"
              whileHover={{ scale: 1.05, color: '#38bdf8' }}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Instant Compilation</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-dark-300"
              whileHover={{ scale: 1.05, color: '#38bdf8' }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Suggestions</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-dark-300"
              whileHover={{ scale: 1.05, color: '#38bdf8' }}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Easy Sharing</span>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/Danyalkhattak/compilex.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-dark-800 text-dark-300 hover:text-white transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header