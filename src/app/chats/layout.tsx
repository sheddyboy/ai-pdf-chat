import { getChats } from "@/actions/server/chat.server";
import ChatSideBar from "@/components/ChatSideBar";
import { getQueryClient } from "@/lib/reactQuery";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ChatsLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function ChatsLayout({ children }: ChatsLayoutProps) {
  const reactQueryClient = getQueryClient();
  reactQueryClient.prefetchQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(),
  });
  return (
    <HydrationBoundary state={dehydrate(reactQueryClient)}>
      <main className="flex h-screen">
        <ChatSideBar className="max-sm:hidden" />
        {children}
      </main>
    </HydrationBoundary>
  );
}
