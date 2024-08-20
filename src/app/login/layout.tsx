interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <main className="min-h-screen flex justify-center items-center">
      {children}
    </main>
  );
}
