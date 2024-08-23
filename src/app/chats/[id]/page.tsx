"use client";
import PdfViewer from "@/components/PdfViewer";
import { Suspense } from "react";
import ChatComponent from "@/components/ChatComponent";
import PageViewerSkeleton from "@/components/skeletons/PageViewerSkeleton";
import ChatComponentSkeleton from "@/components/skeletons/ChatComponentSkeleton";
import ChatSideBar from "@/components/ChatSideBar";
import useStore from "@/store";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params: { id } }: ChatPageProps) {
  const { mobileToggles } = useStore();
  return (
    <>
      {mobileToggles.chatsSidebar && (
        <ChatSideBar className="hidden max-sm:flex" />
      )}
      <Suspense
        fallback={
          <>
            <PageViewerSkeleton className="max-sm:hidden" />
            {mobileToggles.pdfViewer && (
              <PageViewerSkeleton className="hidden max-sm:flex" />
            )}
          </>
        }
      >
        <PdfViewer activeChatId={id} className="max-sm:hidden" />
        {mobileToggles.pdfViewer && (
          <PdfViewer activeChatId={id} className="hidden max-sm:flex" />
        )}
      </Suspense>
      <Suspense
        fallback={
          <>
            <ChatComponentSkeleton className="max-sm:hidden" />
            {mobileToggles.chat && (
              <ChatComponentSkeleton className="hidden max-sm:flex" />
            )}
          </>
        }
      >
        <ChatComponent activeChatId={id} className="max-sm:hidden" />
        {mobileToggles.chat && (
          <ChatComponent activeChatId={id} className="hidden max-sm:flex" />
        )}
      </Suspense>
    </>
  );
}
