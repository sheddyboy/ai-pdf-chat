"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/actions/server/auth.server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  disableLink?: boolean;
}

export default function LoginForm({ disableLink }: LoginFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const handleSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    toast.promise(login(values), {
      loading: "Loading",
      success: ({ data, error }) => {
        if (error !== null) {
          throw new Error(error);
        }
        router.push("/");
        return "Success";
      },
      error: (error: Error) => {
        return error.message;
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="m@example.com"
                    className="text-base placeholder:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="text-base placeholder:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          {/* <Button variant="outline" type="button" className="w-full">
            Login with Google
          </Button> */}
        </div>
        {!disableLink && (
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="signup" className="underline">
              Sign up
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
}
