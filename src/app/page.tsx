import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import FileUpload from "@/components/FileUpload";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="flex flex-col">
        <h1 className="mb-3 text-center text-5xl font-semibold">
          Chat with PDF
        </h1>
        <p className="mb-4 max-w-xl text-center">
          Join millions of students, researchers and professionals to instantly
          answer questions and understand research with AI
        </p>
        {data.user ? (
          <FileUpload />
        ) : (
          <Dialog>
            <DialogTrigger asChild className="mx-auto mt-4">
              <Button className="">Login</Button>
            </DialogTrigger>
            <DialogContent>
              <Tabs defaultValue="login">
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signUp">SignUp</TabsTrigger>
                </TabsList>
                <TabsContent value="login" asChild>
                  <LoginForm disableLink />
                </TabsContent>
                <TabsContent value="signUp" asChild>
                  <SignUpForm disableLink />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </main>
  );
}
