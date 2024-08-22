import ChatSideBar from "@/components/ChatSideBar";

interface ChatsPageProps {}

export default function ChatsPage({}: ChatsPageProps) {
  return <ChatSideBar className="hidden max-sm:flex" />;
}
