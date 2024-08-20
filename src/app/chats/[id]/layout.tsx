import { getChats } from "@/actions/server/chat.server";
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
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });
  reactQueryClient.prefetchQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id),
  });
  return (
    <HydrationBoundary state={dehydrate(reactQueryClient)}>
      <main className="flex h-screen">{children}</main>
    </HydrationBoundary>
  );
}
