import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";
import { SyncLoader } from "react-spinners";

interface PageViewerSkeletonProps extends HTMLAttributes<HTMLDivElement> {}

const PageViewerSkeleton = forwardRef<HTMLDivElement, PageViewerSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "relative flex flex-[5] items-center justify-center",
          className,
        )}
      >
        <Skeleton className="h-full w-full bg-blue-600/10" />
        <div className="absolute">
          <SyncLoader color="#2563eb" />
        </div>
      </div>
    );
  },
);
PageViewerSkeleton.displayName = "PageViewerSkeleton";

export default PageViewerSkeleton;
