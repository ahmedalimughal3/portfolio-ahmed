import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getContentSection } from "@/lib/content-types";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminPageProps = {
  searchParams: Promise<{ section?: string }>;
};

async function AdminPageContent({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const { section: requestedSection } = await searchParams;
  const section = getContentSection(requestedSection ?? "projects")?.id;
  if (!section) notFound();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("id, section, slug, title, payload, sort_order, published, updated_at")
    .eq("section", section)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load admin content: ${error.message}`);
  }

  return <AdminDashboard key={section} section={section} records={data ?? []} />;
}

export default function AdminPage(props: AdminPageProps) {
  return (
    <Suspense fallback={<div className="admin-loading" role="status">Loading portfolio content…</div>}>
      <AdminPageContent {...props} />
    </Suspense>
  );
}
