import { createHmac, timingSafeEqual } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const supplied = signature.replace(/^sha256=/i, "");
  const expectedBuffer = Buffer.from(expected, "hex");
  const suppliedBuffer = Buffer.from(supplied, "hex");

  return suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Cal.com webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("x-cal-signature-256") ??
    request.headers.get("x-cal-signature");
  if (!signature) {
    return Response.json({ error: "Missing webhook signature." }, { status: 401 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
  if (!isRecord(body) || !isRecord(body.payload)) {
    return Response.json({ error: "Invalid Cal.com booking payload." }, { status: 400 });
  }

  const eventType = stringValue(body.triggerEvent);
  const payload = body.payload;
  if (!eventType || !["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"].includes(eventType)) {
    return Response.json({ received: true });
  }

  const bookingUid = stringValue(payload.uid) ??
    stringValue(payload.bookingUid) ??
    (typeof payload.bookingId === "number" ? String(payload.bookingId) : null);
  if (!bookingUid) {
    return Response.json({ error: "Booking payload is missing its booking UID." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (eventType === "BOOKING_CANCELLED") {
    const { error } = await supabase
      .from("calcom_bookings")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("booking_uid", bookingUid);
    if (error) {
      console.error("Could not update cancelled Cal.com booking:", error.message);
      return Response.json({ error: "Could not update booking." }, { status: 500 });
    }
    return Response.json({ received: true });
  }

  const attendee = Array.isArray(payload.attendees) && isRecord(payload.attendees[0])
    ? payload.attendees[0]
    : isRecord(payload.attendee)
      ? payload.attendee
      : null;
  const name = attendee ? stringValue(attendee.name) : null;
  const email = attendee ? stringValue(attendee.email) : null;
  const startsAt = stringValue(payload.startTime);
  const endsAt = stringValue(payload.endTime);
  const timezone = attendee ? stringValue(attendee.timeZone) ?? stringValue(attendee.timezone) : null;
  const eventTitle = stringValue(payload.eventTitle) ?? stringValue(payload.title);
  const meetingUrl = stringValue(payload.meetingUrl) ?? stringValue(payload.location);
  const responses = isRecord(payload.responses) ? payload.responses : null;
  const notesResponse = responses && isRecord(responses.notes) ? responses.notes.value : null;
  const notes = stringValue(notesResponse) ?? stringValue(payload.notes);

  if (!name || !email || !startsAt || !endsAt || !timezone || !eventTitle) {
    return Response.json({ error: "Booking payload is missing required attendee or time details." }, { status: 400 });
  }
  if (!Number.isFinite(Date.parse(startsAt)) || !Number.isFinite(Date.parse(endsAt))) {
    return Response.json({ error: "Booking payload has invalid start or end times." }, { status: 400 });
  }

  const { error } = await supabase.from("calcom_bookings").upsert({
    booking_uid: bookingUid,
    attendee_name: name,
    attendee_email: email,
    starts_at: startsAt,
    ends_at: endsAt,
    timezone,
    event_title: eventTitle,
    meeting_url: meetingUrl,
    notes,
    status: "confirmed",
    updated_at: new Date().toISOString(),
  }, { onConflict: "booking_uid" });

  if (error) {
    console.error("Could not save Cal.com booking:", error.message);
    return Response.json({ error: "Could not save booking." }, { status: 500 });
  }

  return Response.json({ received: true });
}
