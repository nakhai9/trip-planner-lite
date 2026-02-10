import { create } from "zustand";

type GlobalStore = {
  isLoading: boolean;
  description?: string;
  isShowToast: boolean;
  setIsLoading: (loading: boolean) => void;
  setConfiguration: (config: {
    description: string;
    [key: string]: string;
  }) => void;
};
export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: false,
  description: undefined,
  isShowToast: false,
  message: "",
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setConfiguration: (config) => set(config),
}));

type ToastStore = {
  isShow: boolean;
  type: "success" | "error" | "warning" | "info";
  message: any;
  hideToast: () => void;
  showSuccess: (message: string) => void;
  showError: (message: any) => void;
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
}));
