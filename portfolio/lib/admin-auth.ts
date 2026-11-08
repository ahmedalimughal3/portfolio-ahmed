import "server-only";

import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError && userError.name !== "AuthSessionMissingError") {
    throw new Error(`Could not verify the current session: ${userError.message}`);
  }
  if (!user) return null;

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new Error(`Could not verify admin access: ${adminError.message}`);
  }

  return admin ? user : null;
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=1");
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return user;
}
