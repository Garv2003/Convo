import { create } from 'zustand'
import type { User, UserState } from '@/types'

const userStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
}))

export { userStore }