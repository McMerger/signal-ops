import { create } from 'zustand'

type AppMode = 'beginner' | 'pro'

interface AppState {
    mode: AppMode
    toggleMode: () => void
    setMode: (mode: AppMode) => void
}

export const useAppStore = create<AppState>((set) => ({
    mode: 'beginner', // Default as per README "Beginner-friendly default"
    toggleMode: () => set((state) => ({ mode: state.mode === 'beginner' ? 'pro' : 'beginner' })),
    setMode: (mode) => set({ mode }),
}))
