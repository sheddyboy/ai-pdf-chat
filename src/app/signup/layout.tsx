interface SignupLayoutProps {
  children: React.ReactNode;
}

export default function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <main className="min-h-screen flex justify-center items-center">
      {children}
    </main>
  );
}
