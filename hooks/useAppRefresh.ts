// hooks/useAppRefresh.ts
import { create } from 'zustand';

interface AppRefreshState {
  isRefreshing: boolean;
  refreshApp: () => Promise<void>;
}

export const useAppRefresh = create<AppRefreshState>((set) => ({
  isRefreshing: false,
  refreshApp: async () => {
    set({ isRefreshing: true });
    
    try {
      console.log('🔄 Refreshing entire app...');
      
      // Aquí puedes agregar todas las funciones de refresh que necesites
      // Por ejemplo:
      // - Recargar datos de usuario
      // - Recargar organizaciones
      // - Limpiar caches, etc.
      
      // Simulamos un pequeño delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ App refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing app:', error);
    } finally {
      set({ isRefreshing: false });
    }
  },
}));