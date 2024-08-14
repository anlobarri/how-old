"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Error signing up:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/nickname");
}

export async function saveNickname(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    redirect("/error");
  }

  if (!user) {
    console.error("No user found");
    redirect("/login");
  }

  const nickname = formData.get("nickname") as string;

  const { error } = await supabase
    .from("users")
    .upsert({ id: user.id, nickname: nickname, email: user.email });
  if (error) {
    console.error("Error saving nickname:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
