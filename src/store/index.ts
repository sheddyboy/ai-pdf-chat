import { create } from "zustand";

interface StoreType {
  chatsSidebarToggleState: boolean;
  mobileToggles: {
    chatsSidebar: boolean;
    pdfViewer: boolean;
    chat: boolean;
  };
  toggleChatsSidebar: () => void;
  mobileShowChatsSidebar: () => void;
  mobileHideChatsSidebar: () => void;
  mobileToggleChatAndPdfViewer: () => void;
}

const useStore = create<StoreType>((set) => ({
  chatsSidebarToggleState: false,
  mobileToggles: { chat: true, chatsSidebar: false, pdfViewer: false },
  mobileShowChatsSidebar: () =>
    set((state) => ({
      mobileToggles: { chat: false, chatsSidebar: true, pdfViewer: false },
    })),
  mobileHideChatsSidebar: () =>
    set((state) => ({
      mobileToggles: { chat: true, chatsSidebar: false, pdfViewer: false },
    })),
  mobileToggleChatAndPdfViewer: () =>
    set((state) => ({
      mobileToggles: {
        chatsSidebar: false,
        chat: !state.mobileToggles.chat,
        pdfViewer: state.mobileToggles.chat,
      },
    })),
  toggleChatsSidebar: () =>
    set((state) => ({
      chatsSidebarToggleState: !state.chatsSidebarToggleState,
    })),
}));

export default useStore;
