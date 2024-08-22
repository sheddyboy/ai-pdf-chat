import { Skeleton } from "@/components/ui/skeleton";
import { SyncLoader } from "react-spinners";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface ChatComponentSkeletonProps {}

export function ChatComponentSkeleton({}: ChatComponentSkeletonProps) {
  return (
    <div className="flex flex-[3] flex-col gap-3 border-l-4 border-l-slate-200 p-2">
      <h1 className="text-xl font-bold">Chat</h1>
      <div className="flex flex-1 flex-col gap-2 overflow-auto px-4 pb-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={cn("flex", {
              "justify-end pl-10": index % 2 === 0,
              "justify-start pr-10": index % 2 === 1,
            })}
          >
            <Skeleton
              className={cn(
                "w-[80%] rounded-lg px-3 py-1 text-sm shadow-md ring-1 ring-gray-900/10",
                {
                  "h-[30px] bg-blue-600 text-white": index % 2 === 0,
                  "h-[80px]": index % 2 === 1,
                },
              )}
            />
          </div>
        ))}
        <div />
      </div>

      <div className="relative flex items-center">
        <Input
          placeholder="Ask any question.."
          disabled
          className="pr-[60px] placeholder:text-black/30"
        />
        <Button
          type="submit"
          className="absolute right-0 rounded-l-none bg-blue-600 hover:bg-blue-600/70"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
