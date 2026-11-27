"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavigation() {
  const pathname = usePathname();
  const bookingsActive = pathname.startsWith("/admin/bookings");

  return (
    <>
      <Link className={`admin-sidebar-link${bookingsActive ? "" : " is-active"}`} href="/admin">
        <span aria-hidden="true">▦</span> Portfolio content
      </Link>
      <Link className={`admin-sidebar-link${bookingsActive ? " is-active" : ""}`} href="/admin/bookings">
        <span aria-hidden="true">◷</span> Bookings
      </Link>
    </>
  );
}
