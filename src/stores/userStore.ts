import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '../types';

interface UserState {
  usuario: Usuario | null;
  isPremium: boolean;
  setUsuario: (usuario: Usuario) => void;
  updateUsuario: (updates: Partial<Usuario>) => void;
  clearUsuario: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      usuario: null,
      isPremium: false,
      setUsuario: (usuario) => set({ usuario, isPremium: usuario.plano === 'premium' }),
      updateUsuario: (updates) => {
        const current = get().usuario;
        if (current) {
          const updated = { ...current, ...updates };
          set({ 
            usuario: updated, 
            isPremium: updated.plano === 'premium' 
          });
        }
      },
      clearUsuario: () => set({ usuario: null, isPremium: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);