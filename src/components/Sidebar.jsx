import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import Select from 'react-select'
import {
  Settings,
  Palette,
  Type,
  Sparkles,
  Share2,
  Save,
  Trash2,
  Clock,
  Code2,
  ChevronDown,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react'
import { shareCode } from '../services/api'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const {
    language,
    theme,
    fontSize,
    isAIEnabled,
    sharedLinks,
    savedDrafts,
    code,
    setLanguage,
    setTheme,
    setFontSize,
    toggleAI,
    addSharedLink,
    loadDraft,
    deleteDraft
  } = useAppStore()

  const [activeSection, setActiveSection] = useState('language')
  const [isSharing, setIsSharing] = useState(false)

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'c', label: 'C', icon: '🔧' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'ruby', label: 'Ruby', icon: '💎' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  ]

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ]

  const fontSizes = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' },
    { value: 20, label: '20px' }
  ]

  const handleShare = async () => {
    if (!code.trim()) {
      toast.error('No code to share!')
      return
    }

    setIsSharing(true)
    try {
      const result = await shareCode(code, language)
      if (result.success) {
        addSharedLink({
          url: result.url,
          language,
          timestamp: new Date().toISOString(),
          preview: code.substring(0, 100) + (code.length > 100 ? '...' : '')
        })
        
        // Copy to clipboard
        await navigator.clipboard.writeText(result.url)
        toast.success('Code shared! Link copied to clipboard!')
      } else {
        toast.error('Failed to share code')
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Error sharing code: ' + error.message)
    } finally {
      setIsSharing(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      color: '#f8fafc',
      minHeight: '40px',
      '&:hover': {
        borderColor: '#0ea5e9'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e293b',
      border: '1px solid #475569'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#334155' : '#1e293b',
      color: '#f8fafc',
      '&:hover': {
        backgroundColor: '#334155'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#f8fafc'
    }),
    input: (provided) => ({
      ...provided,
      color: '#f8fafc'
    })
  }

  const SectionHeader = ({ title, icon: Icon, isActive, onClick }) => (
    <motion.button
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
        isActive ? 'bg-primary-600 text-white' : 'hover:bg-dark-800 text-dark-300'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="font-medium">{title}</span>
      </div>
      {isActive ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </motion.button>
  )

  return (
    <div className="h-full">
      <div className="sidebar h-full overflow-y-auto scrollbar-thin">
        {/* Language Selection */}
        <div className="space-y-3">
          <SectionHeader
            title="Language"
            icon={Code2}
            isActive={activeSection === 'language'}
            onClick={() => setActiveSection(activeSection === 'language' ? '' : 'language')}
          />
          
          <AnimatePresence>
            {activeSection === 'language' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Select
                  value={languages.find(lang => lang.value === language)}
                  onChange={(selected) => setLanguage(selected.value)}
                  options={languages}
                  styles={customSelectStyles}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-3">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <SectionHeader
            title="Settings"
            icon={Settings}
            isActive={activeSection === 'settings'}
            onClick={() => setActiveSection(activeSection === 'settings' ? '' : 'settings')}
          />
          
          <AnimatePresence>
            {activeSection === 'settings' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Theme
                  </label>
                  <Select
                    value={themes.find(t => t.value === theme)}
                    onChange={(selected) => setTheme(selected.value)}
                    options={themes}
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <Type className="w-4 h-4 inline mr-2" />
                    Font Size
                  </label>
                  <Select
                    value={fontSizes.find(f => f.value === fontSize)}
                    onChange={(selected) => setFontSize(selected.value)}
                    options={fontSizes}
                    styles={customSelectStyles}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">AI Suggestions</span>
                  </div>
                  <motion.button
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      isAIEnabled ? 'bg-primary-600' : 'bg-dark-600'
                    }`}
                    onClick={toggleAI}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{
                        x: isAIEnabled ? 24 : 4
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Share Code */}
        <div className="space-y-3">
          <SectionHeader
            title="Share"
            icon={Share2}
            isActive={activeSection === 'share'}
            onClick={() => setActiveSection(activeSection === 'share' ? '' : 'share')}
          />
          
          <AnimatePresence>
            {activeSection === 'share' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <motion.button
                  className="btn-primary w-full"
                  onClick={handleShare}
                  disabled={isSharing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSharing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {isSharing ? 'Sharing...' : 'Share Code'}
                </motion.button>

                {sharedLinks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-dark-300">Recent Shares</h4>
                    {sharedLinks.slice(0, 3).map((link, index) => (
                      <div key={index} className="p-3 bg-dark-800 rounded-lg text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-primary-400">{link.language}</span>
                          <span className="text-dark-400">{formatDate(link.timestamp)}</span>
                        </div>
                        <p className="text-dark-300 truncate">{link.preview}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(link.url)}
                          className="text-primary-400 hover:text-primary-300 mt-1"
                        >
                          Copy Link
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved Drafts */}
        <div className="space-y-3">
          <SectionHeader
            title="Drafts"
            icon={Save}
            isActive={activeSection === 'drafts'}
            onClick={() => setActiveSection(activeSection === 'drafts' ? '' : 'drafts')}
          />
          
          <AnimatePresence>
            {activeSection === 'drafts' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {savedDrafts.length === 0 ? (
                  <p className="text-dark-400 text-sm text-center py-4">
                    No saved drafts yet
                  </p>
                ) : (
                  savedDrafts.slice(0, 5).map((draft) => (
                    <motion.div
                      key={draft.id}
                      className="p-3 bg-dark-800 rounded-lg group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-primary-400 text-sm">{draft.language}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-dark-400" />
                          <span className="text-dark-400 text-xs">
                            {formatDate(draft.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-dark-300 text-xs mb-2 line-clamp-2">
                        {draft.code.substring(0, 80)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadDraft(draft)}
                          className="text-primary-400 hover:text-primary-300 text-xs"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Sidebar