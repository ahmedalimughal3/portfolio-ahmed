import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connection } from "next/server";

type BookingRecord = {
  booking_uid: string;
  attendee_name: string;
  attendee_email: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  event_title: string;
  meeting_url: string | null;
  notes: string | null;
  status: string;
};

function formatBookingTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date(value));
}

async function AdminBookingsContent() {
  await connection();
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("calcom_bookings")
    .select("booking_uid, attendee_name, attendee_email, starts_at, ends_at, timezone, event_title, meeting_url, notes, status")
    .order("starts_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load bookings. Run supabase/calcom-bookings.sql in Supabase first: ${error.message}`);
  }

  const bookings = (data ?? []) as BookingRecord[];
  return (
    <>
      <header className="admin-topbar">
        <div className="admin-breadcrumb"><span>Workspace</span><i>/</i><strong>Bookings</strong></div>
        <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">View website <span aria-hidden="true">↗</span></a>
      </header>
      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <span className="admin-eyebrow">CAL.COM SCHEDULED CALLS</span>
            <h1>Bookings<span>.</span></h1>
            <p>Confirmed calls and attendee details.</p>
          </div>
        </div>
        <div className="booking-admin-list">
          {bookings.length === 0 ? (
            <div className="admin-empty-state">
              <span aria-hidden="true">◷</span>
              <h2>No bookings yet</h2>
              <p>New Cal.com bookings will appear here after the webhook is configured.</p>
            </div>
          ) : bookings.map((booking) => (
            <article className="booking-admin-card" key={booking.booking_uid}>
              <div className="booking-admin-main">
                <span className={`booking-status${booking.status === "confirmed" ? " is-confirmed" : ""}`}>
                  {booking.status}
                </span>
                <h2>{booking.attendee_name}</h2>
                <a href={`mailto:${booking.attendee_email}`}>{booking.attendee_email}</a>
              </div>
              <div className="booking-admin-time">
                <strong>{booking.event_title}</strong>
                <span>{formatBookingTime(booking.starts_at, booking.timezone)}</span>
                <small>Until {formatBookingTime(booking.ends_at, booking.timezone)} · {booking.timezone}</small>
                {booking.notes && <small className="booking-admin-notes">{booking.notes}</small>}
              </div>
              {booking.meeting_url && /^https:\/\//i.test(booking.meeting_url) && (
                <a className="booking-admin-link" href={booking.meeting_url} target="_blank" rel="noreferrer">
                  Meeting link ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="admin-loading" role="status">Loading bookings…</div>}>
      <AdminBookingsContent />
    </Suspense>
  );
}
