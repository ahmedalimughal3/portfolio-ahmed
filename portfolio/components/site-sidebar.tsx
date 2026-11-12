"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navigation } from "@/lib/portfolio";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { Icon } from "@/components/icon";

export function SiteSidebar({ availability }: { availability: string }) {
  const isVisible = useScrollDirection();
  const [activeSection, setActiveSection] = useState("#home");

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

    </>
  );
}
