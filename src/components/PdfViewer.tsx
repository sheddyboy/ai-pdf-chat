"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/server/chat.server";
import { ArrowLeftRight, Menu, PanelLeftDashed } from "lucide-react";
import useStore from "@/store";
import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PdfViewerProps extends HTMLAttributes<HTMLDivElement> {
  activeChatId?: string;
}

const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
  ({ activeChatId, className, ...props }, ref) => {
    const [url, setUrl] = useState("");
    const {
      toggleChatsSidebar,
      mobileShowChatsSidebar,
      mobileToggleChatAndPdfViewer,
    } = useStore();

    const {
      data: { data: chats, error },
    } = useSuspenseQuery({
      queryKey: ["chats"],
      queryFn: () => getChats(),
    });

    const activeChat = chats?.find(
      (chat) => chat.id.toString() === activeChatId,
    );

    useEffect(() => {
      const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobileDevice) {
        setUrl(
          activeChat?.pdfUrl
            ? `https://docs.google.com/gview?url=${activeChat.pdfUrl}&embedded=true`
            : "",
        );
      } else {
        setUrl(activeChat?.pdfUrl ? activeChat.pdfUrl : "");
      }
    }, [activeChat?.pdfUrl]);

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex h-full flex-1 basis-[40%] flex-col gap-2 overflow-hidden p-2",
          className,
        )}
      >
        <div className="flex w-full gap-2">
          <PanelLeftDashed
            onClick={() => {
              toggleChatsSidebar();
            }}
            className="shrink-0 cursor-pointer max-sm:hidden"
          />
          <Menu
            onClick={() => {
              mobileShowChatsSidebar();
            }}
            className="hidden shrink-0 cursor-pointer max-sm:flex"
          />
          <p className="truncate font-bold">
            <span className="max-sm:inline">PDF View: </span>
            {activeChat?.pdfName}
          </p>
          <ArrowLeftRight
            className="ml-auto hidden shrink-0 max-sm:flex"
            onClick={() => {
              mobileToggleChatAndPdfViewer();
            }}
          />
        </div>
        <iframe
          src={url}
          className="h-full w-full flex-1 rounded-lg shadow-md"
        ></iframe>
      </div>
    );
  },
);
PdfViewer.displayName = "PdfViewer";
export default PdfViewer;
