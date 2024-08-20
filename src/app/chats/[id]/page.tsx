"use client";
import ChatSideBar from "@/components/ChatSideBar";
import PdfViewer from "@/components/PdfViewer";
import { Suspense } from "react";
import ChatComponent from "@/components/ChatComponent";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params: { id } }: ChatPageProps) {
  return (
    <>
      <ChatSideBar activeChatId={id} />
      <Suspense fallback={<>pdf viewer Loading...</>}>
        <PdfViewer activeChatId={id} />
      </Suspense>
      <Suspense fallback={<>Chats Loading...</>}>
        <ChatComponent activeChatId={id} />
      </Suspense>
    </>
  );
}
