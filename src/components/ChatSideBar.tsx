"use client";
import { MessageCircle } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/server/chat.server";
import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";

interface ChatSideBarProps {
  activeChatId: string;
}

export default function ChatSideBar({ activeChatId }: ChatSideBarProps) {
  return (
    <div className="max-w-xs flex-[3] overflow-auto bg-gray-900 p-4 text-gray-200">
      <FileUpload isButton />
      <Suspense fallback={<>Loading...</>}>
        <ChatList activeChatId={activeChatId} />
      </Suspense>
      <div className="absolute bottom-4 left-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}

interface ChatListProps {
  activeChatId: string;
}

function ChatList({ activeChatId }: ChatListProps) {
  const { data: chats } = useSuspenseQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });
  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat) => (
        <Link href={`/chats/${chat.id}`} key={chat.id}>
          <div
            className={cn("flex items-center rounded-lg p-3 text-slate-300", {
              "bg-blue-600 text-white": activeChatId === chat.id.toString(),
              "hover:text-white": !(activeChatId === chat.id.toString()),
            })}
          >
            <MessageCircle className="mr-2 shrink-0" />
            <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-sm">
              {chat.pdfName}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
