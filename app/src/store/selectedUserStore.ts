import { create } from 'zustand'
import type { User, selectedUserState } from '@/types'

const selectedUserStore = create<selectedUserState>((set) => ({
    selectedUser: null,
    setSelectedUser: (user: User) => set({ selectedUser: user }),
}))

export { selectedUserStore }