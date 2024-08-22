"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { loginFormSchema, signUpFormSchema } from "@/schemas";

export async function login(values: z.infer<typeof loginFormSchema>) {
  const result = loginFormSchema.safeParse(values);
  if (result.error) {
    throw new Error(result.error.message);
  }

  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/", "layout");
  return data;
}

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
  const result = signUpFormSchema.safeParse(values);
  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }
  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/", "layout");
  return data;
}

export async function logOut({
  redirectAfterLogout,
}: {
  redirectAfterLogout: boolean;
}) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);

    revalidatePath("/", "layout");
    redirectAfterLogout && redirect("/");
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
