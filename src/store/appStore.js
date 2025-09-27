import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
      // Editor state
      code: '// Welcome to CompileX!\n// Select a language and start coding\n\nconsole.log("Hello, World!");',
      language: 'javascript',
      theme: 'vs-dark',
      fontSize: 14,
      
      // Output state
      output: '',
      error: '',
      isRunning: false,
      isLoading: false,
      
      // AI suggestions state
      suggestions: [],
      showSuggestions: false,
      isAIEnabled: false,
      
      // Sharing state
      sharedLinks: [],
      
      // UI state
      sidebarCollapsed: false,
      
      // Actions
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
       
      setOutput: (output) => set({ output, error: '' }),
      setError: (error) => set({ error, output: '' }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setIsLoading: (isLoading) => set({ isLoading }),
      
      setSuggestions: (suggestions) => set({ suggestions }),
      setShowSuggestions: (show) => set({ showSuggestions: show }),
      toggleAI: () => set((state) => ({ isAIEnabled: !state.isAIEnabled })),
      
      addSharedLink: (link) => set((state) => ({ 
        sharedLinks: [link, ...state.sharedLinks.slice(0, 9)] // Keep last 10
      })),
      
      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Clear all
      clearOutput: () => set({ output: '', error: '' }),
      
      // Load saved drafts
      savedDrafts: [],
      addDraft: (draft) => set((state) => ({
        savedDrafts: [
          { ...draft, id: Date.now(), timestamp: new Date().toISOString() },
          ...state.savedDrafts.slice(0, 19) // Keep last 20
        ]
      })),
      
      loadDraft: (draft) => set({
        code: draft.code,
        language: draft.language
      }),
      
      deleteDraft: (id) => set((state) => ({
        savedDrafts: state.savedDrafts.filter(draft => draft.id !== id)
      }))
    }))