"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpFormSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUp } from "@/actions/server/auth.server";

interface SignUpFormProps {
  disableLink?: boolean;
}

export default function SignUpForm({ disableLink }: SignUpFormProps) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signUpFormSchema),
  });

  const handleSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    toast.promise(signUp(values), {
      loading: "Loading",
      success: (data) => {
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
                  <Input {...field} placeholder="m@example.com" />
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
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            SignUp
          </Button>
          <Button variant="outline" type="button" className="w-full">
            SignUp with Google
          </Button>
        </div>
        {!disableLink && (
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="login" className="underline">
              Login
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
}
