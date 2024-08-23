"use client";
import { forwardRef, Suspense } from "react";
import FileUpload from "@/components/FileUpload";
import { Button } from "./ui/button";
import { logOut } from "@/actions/server/auth.server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChatList } from "@/components/ClassList";
import { ChatListSkeleton } from "@/components/skeletons/ChatListSkeleton";
import { motion, HTMLMotionProps } from "framer-motion";
import useStore from "@/store";
import { cn } from "@/lib/utils";

interface ChatSideBarProps extends HTMLMotionProps<"div"> {}

const ChatSideBar = forwardRef<HTMLDivElement, ChatSideBarProps>(
  ({ className, ...props }, ref) => {
    const { chatsSidebarToggleState } = useStore();
    const router = useRouter();
    return (
      <motion.div
        {...props}
        ref={ref}
        animate={{ flexBasis: chatsSidebarToggleState ? "0%" : "30%" }}
        className={cn(
          "flex h-full max-w-xs basis-[30%] overflow-hidden bg-gray-900 text-gray-200 max-sm:max-w-none max-sm:flex-1",
          className,
        )}
      >
        <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4">
          <FileUpload isButton />
          <Suspense fallback={<ChatListSkeleton length={15} />}>
            <ChatList />
          </Suspense>
          <Button
            className="overflow-hidden"
            variant={"destructive"}
            onClick={() => {
              toast.promise(logOut({ redirectAfterLogout: false }), {
                success: () => {
                  router.push("/");
                  return "Logged out";
                },
                loading: "Logging out...",
                error: (error) => {
                  return (error as Error).message;
                },
              });
            }}
          >
            Logout
          </Button>
        </div>
      </motion.div>
    );
  },
);
ChatSideBar.displayName = "ChatSideBar";

export default ChatSideBar;
