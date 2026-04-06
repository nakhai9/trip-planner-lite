import { create } from "zustand";

type GlobalStore = {
  isLoading: boolean;
  isShowToast: boolean;
  loadingMessage?: string;
  setIsLoading: (loading: boolean, message?: string) => void;
};
export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: false,
  isShowToast: false,
  loadingMessage: "",
  setIsLoading: (loading: boolean, message?: string) =>
    set({ isLoading: loading, loadingMessage: message }),
}));

type ToastStore = {
  isShow: boolean;
  type: "success" | "error" | "warning" | "info";
  message: any;
  hideToast: () => void;
  showSuccess: (message: string) => void;
  showError: (message: any) => void;
  showInfo: (message: string) => void;
};
export const useToast = create<ToastStore>((set) => ({
  isShow: false,
  message: "",
  type: "success",
  hideToast: () =>
    set({
      isShow: false,
    }),
  showSuccess: (message: string) =>
    set({ message, type: "success", isShow: true }),
  showError: (message: any) =>
    set({
      message: message instanceof Error ? message.message : String(message),
      type: "error",
      isShow: true,
    }),
  showInfo: (message: string) => {
    set({
      message,
      type: "warning",
      isShow: true,
    });
  },
}));
