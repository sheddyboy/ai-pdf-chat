"use client";
import ChatSideBar from "@/components/ChatSideBar";
import PdfViewer from "@/components/PdfViewer";
import { Suspense } from "react";
import ChatComponent from "@/components/ChatComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { SyncLoader } from "react-spinners";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params: { id } }: ChatPageProps) {
  return (
    <>
      <ChatSideBar activeChatId={id} />
      <Suspense fallback={<PageViewerSkeleton />}>
        <PdfViewer activeChatId={id} />
      </Suspense>
      <Suspense fallback={<>Chats Loading...</>}>
        <ChatComponent activeChatId={id} />
      </Suspense>
    </>
  );
}

interface PageViewerSkeletonProps {}

function PageViewerSkeleton({}: PageViewerSkeletonProps) {
  return (
    <div className="relative flex flex-[5] items-center justify-center">
      <Skeleton className="h-full w-full bg-blue-600/10" />
      <div className="absolute">
        <SyncLoader color="#2563eb" />
      </div>
    </div>
  );
}
