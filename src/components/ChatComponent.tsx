"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Menu, SendHorizontal } from "lucide-react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions/server/messages.server";
import { BeatLoader } from "react-spinners";
import { forwardRef, HTMLAttributes, useEffect, useRef } from "react";
import useStore from "@/store";
interface ChatComponentProps extends HTMLAttributes<HTMLDivElement> {
  activeChatId: string;
}

const ChatComponent = forwardRef<HTMLDivElement, ChatComponentProps>(
  ({ activeChatId, className, ...props }, ref) => {
    const { mobileShowChatsSidebar, mobileToggleChatAndPdfViewer } = useStore();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { data: messagesData } = useSuspenseQuery({
      queryKey: ["messages", activeChatId],
      queryFn: () => getMessages(activeChatId),
    });
    const { handleInputChange, handleSubmit, messages, isLoading, input } =
      useChat({
        api: "/api/chat",
        body: {
          pineconeNamespace: messagesData.chat.pineconeNamespace,
          chatId: activeChatId,
        },
        initialMessages: messagesData.messages.map(({ role, content, id }) => ({
          content,
          role,
          id: id.toString(),
        })),
      });

    useEffect(() => {
      const messagesContainer = messagesContainerRef.current;
      if (messagesContainer) {
        messagesContainer.scrollTo({
          behavior: "instant",
          top: messagesContainer.scrollHeight,
        });
      }
    }, []);
    useEffect(() => {
      const messagesContainer = messagesContainerRef.current;
      if (messagesContainer) {
        messagesContainer.scrollTo({
          behavior: "smooth",
          top: messagesContainer.scrollHeight,
        });
      }
    }, [messages]);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-1 basis-[30%] flex-col gap-3 overflow-hidden border-l-4 border-l-slate-200 p-2 max-sm:border-l-0",
          className,
        )}
      >
        <div className="flex w-full items-center gap-2">
          <Menu
            className="hidden shrink-0 cursor-pointer max-sm:flex"
            onClick={() => {
              mobileShowChatsSidebar();
            }}
          />
          <h1 className="text-xl font-bold max-sm:hidden">Chat</h1>
          <p className="hidden truncate font-bold max-sm:block">
            {messagesData.chat.pdfName}
          </p>

          <ArrowLeftRight
            className="ml-auto hidden shrink-0 max-sm:flex"
            onClick={() => {
              mobileToggleChatAndPdfViewer();
            }}
          />
        </div>
        <div
          ref={messagesContainerRef}
          className="flex flex-1 flex-col gap-2 overflow-auto px-4 pb-4"
        >
          {messages.map(({ content, id, role }) => (
            <div
              key={id}
              className={cn("flex", {
                "justify-end pl-10": role === "user",
                "justify-start pr-10": role === "assistant",
              })}
            >
              <div
                className={cn(
                  "rounded-lg px-3 py-1 text-sm shadow-md ring-1 ring-gray-900/10",
                  {
                    "bg-blue-600 text-white": role === "user",
                  },
                )}
              >
                {content}
              </div>
            </div>
          ))}
          {isLoading && <BeatLoader color="#2563eb" size={10} />}
          <div />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <Input
              placeholder="Ask any question.."
              onChange={handleInputChange}
              value={input}
              className="pr-[60px] placeholder:text-black/30"
            />
            <Button
              type="submit"
              className="absolute right-0 rounded-l-none bg-blue-600 hover:bg-blue-600/70"
            >
              <SendHorizontal />
            </Button>
          </div>
        </form>
      </div>
    );
  },
);

ChatComponent.displayName = "ChatComponent";

export default ChatComponent;
