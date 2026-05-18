import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  showTour: boolean;
  showDoctorExport: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setShowTour: (show: boolean) => void;
  setShowDoctorExport: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  showTour: true,
  showDoctorExport: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setShowTour: (show) => set({ showTour: show }),
  setShowDoctorExport: (show) => set({ showDoctorExport: show }),
}));
