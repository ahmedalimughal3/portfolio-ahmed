import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "./sign-out";

async function AdminWorkspace({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=1");
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <span className="admin-brand-mark">A</span>
          <span>AHMED<span className="admin-brand-dot">.</span></span>
        </Link>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <Link className="admin-sidebar-link is-active" href="/admin">
          <span aria-hidden="true">▦</span> Portfolio content
        </Link>
        <div className="admin-sidebar-bottom">
          <span className="admin-status-dot" />
          <span>Signed in as<br /><strong>{user.email}</strong></span>
          <form action={signOut}>
            <button aria-label="Sign out" className="admin-signout" type="submit" title="Sign out">
              ↗
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="admin-loading" role="status">Loading admin workspace…</div>}>
      <AdminWorkspace>{children}</AdminWorkspace>
    </Suspense>
  );
}
