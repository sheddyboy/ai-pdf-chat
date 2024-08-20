"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/server/chat.server";

interface PdfViewerProps {
  activeChatId: string;
}

export default function PdfViewer({ activeChatId }: PdfViewerProps) {
  const { data: chats } = useSuspenseQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });

  const activeChat = chats.find((chat) => chat.id.toString() === activeChatId);
  const activeChatUrl = activeChat?.pdfUrl ?? "";
  return (
    <div className="flex-[5] overflow-scroll">
      <iframe src={activeChatUrl} className="h-full w-full"></iframe>
    </div>
  );
}
