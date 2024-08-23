"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/server/chat.server";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import useStore from "@/store";

interface ChatListProps {}

export function ChatList({}: ChatListProps) {
  const { mobileHideChatsSidebar } = useStore();
  const path = usePathname();
  const chatWrapperRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<HTMLAnchorElement>(null);
  const chatId = path.split("/")[2];
  const {
    data: { data: chats, error },
  } = useSuspenseQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });

  useEffect(() => {
    if (activeChatRef.current && chatWrapperRef.current) {
      const chatWrapper = chatWrapperRef.current;
      const activeChat = activeChatRef.current;
      const activeChatPosition = activeChat.offsetTop;
      const chatWrapperHeight = chatWrapper.clientHeight;
      const activeChatHeight = activeChat.clientHeight;
      const scrollPosition =
        activeChatPosition - chatWrapperHeight / 2 + activeChatHeight / 2;
      chatWrapper.scrollTop = scrollPosition;
    }
  }, []);

  return (
    <div
      ref={chatWrapperRef}
      className="mb-4 flex flex-1 flex-col gap-2 overflow-auto"
    >
      {chats?.map((chat) => (
        <Link
          onClick={() => {
            mobileHideChatsSidebar();
          }}
          ref={chatId === chat.id.toString() ? activeChatRef : null}
          href={`/chats/${chat.id}`}
          key={chat.id}
        >
          <div
            className={cn("flex items-center rounded-lg p-3 text-slate-300", {
              "bg-blue-600 text-white": chatId === chat.id.toString(),
              "hover:text-white": !(chatId === chat.id.toString()),
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
