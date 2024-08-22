"use client";

import { notFound } from "next/navigation";

interface ChatsErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatsErrorPage({ error, reset }: ChatsErrorPageProps) {
  notFound();
}
