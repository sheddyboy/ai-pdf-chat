"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { loginFormSchema, signUpFormSchema } from "@/schemas";

export async function login(values: z.infer<typeof loginFormSchema>) {
  const result = loginFormSchema.safeParse(values);
  if (result.error) {
    return { data: null, error: result.error.message };
  }

  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { data: null, error: error.message };
  }
  revalidatePath("/", "layout");
  return { data, error: null };
}

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
  const result = signUpFormSchema.safeParse(values);
  if (result.error) {
    return { data: null, error: result.error.message };
  }
  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { data: null, error: error.message };
  }
  revalidatePath("/", "layout");
  return { data, error: null };
}

export async function logOut({
  redirectAfterLogout,
}: {
  redirectAfterLogout: boolean;
}) {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath("/", "layout");
  if (redirectAfterLogout) {
    redirect("/");
  } else {
    return { data: "Logged Out", error: null };
  }
}
