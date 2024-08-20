"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions/server/messages.server";
import { BeatLoader } from "react-spinners";
import { useEffect, useRef } from "react";
interface ChatComponentProps {
  activeChatId: string;
}

export default function ChatComponent({ activeChatId }: ChatComponentProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { data: messagesData, error } = useSuspenseQuery({
    queryKey: ["messages", activeChatId],
    queryFn: () => getMessages(activeChatId),
  });
  const { handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: "/api/chat",
    body: {
      pineconeNamespace: messagesData.chat.pineconeNamespace,
      chatId: activeChatId,
    },
    initialMessages: messagesData.messages.map(({ role, content, id }) => ({
      content,
      role,
      id: id.toString(),
    })),
  });
  const formSchema = z.object({
    message: z.string().min(2),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        behavior: "instant",
        top: messagesContainer.scrollHeight,
      });
    }
  }, []);
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        behavior: "smooth",
        top: messagesContainer.scrollHeight,
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-[3] flex-col gap-3 border-l-4 border-l-slate-200 p-2">
      <h1 className="text-xl font-bold">Chat</h1>
      <div
        ref={messagesContainerRef}
        className="flex flex-1 flex-col gap-2 overflow-auto px-4 pb-4"
      >
        {messages.map(({ content, id, role }) => (
          <div
            key={id}
            className={cn("flex", {
              "justify-end pl-10": role === "user",
              "justify-start pr-10": role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-1 text-sm shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": role === "user",
                },
              )}
            >
              {content}
            </div>
          </div>
        ))}
        {isLoading && <BeatLoader color="#2563eb" size={10} />}
        <div />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values, e) => {
            handleSubmit(e);
            form.reset();
          })}
          //   onSubmit={(e) => form.handleSubmit(() => handleSubmit(e))}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="message"
            render={({
              field: { name, onBlur, onChange, ref, value, disabled },
            }) => (
              <FormItem>
                <FormControl className="">
                  <div className="relative flex items-center">
                    <Input
                      placeholder="Ask any question.."
                      name={name}
                      onBlur={onBlur}
                      ref={ref}
                      disabled={disabled}
                      onChange={(e) => {
                        onChange(e);
                        handleInputChange(e);
                      }}
                      value={value}
                      className="pr-[60px] placeholder:text-black/30"
                    />
                    <Button
                      type="submit"
                      className="absolute right-0 rounded-l-none bg-blue-600 hover:bg-blue-600/70"
                    >
                      <SendHorizontal />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
