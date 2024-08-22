import { getMessages } from "@/actions/server/messages.server";
import { getQueryClient } from "@/lib/reactQuery";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ChatLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function ChatLayout({
  children,
  params: { id },
}: ChatLayoutProps) {
  const reactQueryClient = getQueryClient();
  reactQueryClient.prefetchQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id),
  });
  return (
    <HydrationBoundary state={dehydrate(reactQueryClient)}>
      {children}
    </HydrationBoundary>
  );
}
