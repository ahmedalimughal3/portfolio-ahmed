"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function signIn(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your admin email and password." };
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Supabase is not configured.",
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    if (signInError.code === "email_not_confirmed") {
      return {
        error: "Confirm this account's email in Supabase Authentication before signing in.",
      };
    }
    if (signInError.code !== "invalid_credentials") {
      return { error: `Supabase sign-in failed: ${signInError.message}` };
    }
    return { error: "Sign-in failed. Check your email and password." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return { error: "Your session could not be verified. Please try again." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    return {
      error: adminError
        ? "Admin access could not be verified. Check the Supabase setup."
        : "This account does not have admin access.",
    };
  }

  redirect("/admin");
}
