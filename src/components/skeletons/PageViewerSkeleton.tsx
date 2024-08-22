import { Skeleton } from "@/components/ui/skeleton";
import { SyncLoader } from "react-spinners";

interface PageViewerSkeletonProps {}

export function PageViewerSkeleton({}: PageViewerSkeletonProps) {
  return (
    <div className="relative flex flex-[5] items-center justify-center">
      <Skeleton className="h-full w-full bg-blue-600/10" />
      <div className="absolute">
        <SyncLoader color="#2563eb" />
      </div>
    </div>
  );
}
