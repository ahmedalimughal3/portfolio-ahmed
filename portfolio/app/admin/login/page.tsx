import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isSupabaseConfigured } from "@/lib/supabase/server";

async function AdminLoginContent() {
  await connection();
  return <AdminLoginForm isSupabaseConfigured={isSupabaseConfigured()} />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-loading" role="status">Loading sign-in…</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
