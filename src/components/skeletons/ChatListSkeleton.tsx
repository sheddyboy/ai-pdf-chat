import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChatListSkeletonProps {
  length: number;
}

export function ChatListSkeleton({ length }: ChatListSkeletonProps) {
  return (
    <div className="mb-4 flex flex-1 flex-col gap-2 overflow-auto">
      {Array.from({ length: length }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center rounded-lg bg-blue-600/10 p-3 text-slate-300",
          )}
        >
          <MessageCircle className="mr-2 shrink-0" />
          <Skeleton className="h-[10px] w-[80%]" />
        </div>
      ))}
    </div>
  );
}
