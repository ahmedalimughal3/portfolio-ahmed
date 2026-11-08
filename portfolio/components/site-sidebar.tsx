"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation } from "@/lib/portfolio";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { Icon } from "@/components/icon";

export function SiteSidebar({ availability }: { availability: string }) {
  const isVisible = useScrollDirection();
  const [activeSection, setActiveSection] = useState("#home");
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const blogButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

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

  useEffect(() => {
    if (!isBlogOpen) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBlogOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const dialogButtons = document.querySelectorAll<HTMLButtonElement>(
          ".blog-dialog button",
        );
        const firstButton = dialogButtons[0];
        const lastButton = dialogButtons[dialogButtons.length - 1];

        if (
          event.shiftKey &&
          (document.activeElement === firstButton ||
            !document.querySelector(".blog-dialog")?.contains(document.activeElement))
        ) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBlogOpen]);

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
          <button
            aria-haspopup="dialog"
            className="sidebar-link blog-trigger"
            onClick={() => setIsBlogOpen(true)}
            ref={blogButtonRef}
            type="button"
          >
            <Icon name="blog" />
            <span>Blog</span>
            <span className="blog-new-badge">NEW</span>
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

      <AnimatePresence onExitComplete={() => blogButtonRef.current?.focus()}>
        {isBlogOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="blog-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsBlogOpen(false)}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <motion.section
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-labelledby="blog-dialog-title"
              aria-modal="true"
              className="blog-dialog"
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 12 }}
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 16 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                aria-label="Close blog dialog"
                className="blog-dialog-close"
                onClick={() => setIsBlogOpen(false)}
                ref={closeButtonRef}
                type="button"
              >
                <Icon name="close" />
              </button>
              <span className="blog-dialog-icon"><Icon name="blog" /></span>
              <span className="section-kicker">A NEW CHAPTER IS LOADING</span>
              <h2 id="blog-dialog-title">Good reads.<br /><span>Coming soon.</span></h2>
              <p>Notes, ideas, and things I learn along the way. I&apos;m working on the first post now.</p>
              <span className="blog-dialog-progress"><i /></span>
              <button
                className="blog-dialog-action"
                onClick={() => setIsBlogOpen(false)}
                type="button"
              >
                Sounds good <Icon name="arrow" />
              </button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
