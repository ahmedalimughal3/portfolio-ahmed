"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { navigation } from "@/lib/portfolio";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { Icon } from "@/components/icon";

export function SiteSidebar({ availability }: { availability: string }) {
  const isVisible = useScrollDirection();
  const [activeSection, setActiveSection] = useState("#home");
  const [bookingError, setBookingError] = useState("");
  const [bookingStep, setBookingStep] = useState<"details" | "schedule">("details");
  const [bookingUrl, setBookingUrl] = useState("");
  const bookingDialog = useRef<HTMLDialogElement>(null);

  function openBookingDialog() {
    setBookingError("");
    setBookingStep("details");
    setBookingUrl("");
    bookingDialog.current?.showModal();
  }

  function continueToBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let bookingUrl: URL;
    try {
      const eventUrl = process.env.NEXT_PUBLIC_CALCOM_EVENT_URL ||
        "https://cal.com/ahmed-ali-f8b8p4/30min";
      bookingUrl = new URL(eventUrl);
    } catch {
      setBookingError("The booking link is invalid. Please email me to arrange a call.");
      return;
    }
    if (bookingUrl.protocol !== "https:") {
      setBookingError("The booking link must use HTTPS. Please email me to arrange a call.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    bookingUrl.searchParams.set("name", String(formData.get("name") ?? "").trim());
    bookingUrl.searchParams.set("email", String(formData.get("email") ?? "").trim());
    const notes = String(formData.get("notes") ?? "").trim();
    if (notes) bookingUrl.searchParams.set("notes", notes);
    bookingUrl.searchParams.set("embed", "true");
    setBookingUrl(bookingUrl.toString());
    setBookingStep("schedule");
  }

  useEffect(() => {
    const sectionIds = navigation.map(({ href }) => href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.35] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <aside
        className={`site-sidebar${isVisible ? " is-visible" : " is-hidden"}`}
        aria-label="Portfolio navigation"
      >
        <a className="brand-mark" href="#home" aria-label="Ahmed, home">
          <span className="brand-symbol">A</span>
          <span className="brand-name">AHMED<span>.</span></span>
        </a>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, href, icon }) => (
            <a
              className={`sidebar-link${activeSection === href ? " is-active" : ""}`}
              href={href}
              key={href}
              aria-current={activeSection === href ? "location" : undefined}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </a>
          ))}
          <Link className="sidebar-link blog-trigger" href="/blog">
            <Icon name="blog" />
            <span>Blog</span>
            <span className="blog-new-badge">NEW</span>
          </Link>
          <button aria-label="Book a free call" className="sidebar-link booking-trigger" onClick={openBookingDialog} type="button">
            <Icon name="calendar" />
            <span>Book a free call</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <span className="sidebar-caption">CURRENTLY</span>
          <span className="availability"><i /> {availability}</span>
          <div className="sidebar-shortcuts">
            <a href="#contact" aria-label="Contact Ahmed">✉</a>
            <a href="#work" aria-label="View selected work">↗</a>
          </div>
        </div>
      </aside>

      <dialog
        className={`booking-dialog${bookingStep === "schedule" ? " is-scheduling" : ""}`}
        ref={bookingDialog}
        onClick={(event) => {
          if (event.target === bookingDialog.current) bookingDialog.current?.close();
        }}
      >
        {bookingStep === "details" ? (
          <form className="booking-form" onSubmit={continueToBooking}>
            <button
              aria-label="Close booking form"
              className="booking-close"
              onClick={() => bookingDialog.current?.close()}
              type="button"
            >
              ×
            </button>
            <span className="section-kicker">LET&apos;S TALK</span>
            <h2>Book a free call<span>.</span></h2>
            <p>Share a few details first, then choose a time that works for you.</p>
            <label>
              <span>Your name</span>
              <input autoComplete="name" name="name" maxLength={120} required />
            </label>
            <label>
              <span>Email address</span>
              <input autoComplete="email" name="email" type="email" maxLength={254} required />
            </label>
            <label>
              <span>What would you like to discuss? <small>Optional</small></span>
              <textarea name="notes" maxLength={1000} rows={3} />
            </label>
            {bookingError && <p className="booking-error" role="alert">{bookingError}</p>}
            <button className="button button-dark booking-submit" type="submit">
              Choose a date and time <Icon name="arrow" />
            </button>
            <small className="booking-privacy">Your details will be shared with Cal.com to arrange the call.</small>
          </form>
        ) : (
          <div className="booking-scheduler">
            <header className="booking-scheduler-heading">
              <div>
                <span className="section-kicker">FREE CONSULTATION</span>
                <h2>Choose a date &amp; time</h2>
              </div>
              <button
                className="booking-back"
                onClick={() => setBookingStep("details")}
                type="button"
              >
                ← Edit details
              </button>
              <button
                aria-label="Close booking form"
                className="booking-close"
                onClick={() => bookingDialog.current?.close()}
                type="button"
              >
                ×
              </button>
            </header>
            <iframe
              className="booking-calcom-frame"
              src={bookingUrl}
              title="Choose a free-call date and time with Cal.com"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
