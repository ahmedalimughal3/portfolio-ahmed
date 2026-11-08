"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { ExperienceItem } from "@/lib/portfolio";
import { Icon } from "@/components/icon";
import { SectionReveal } from "@/components/section-reveal";

export function ExperienceSection({ experience }: { experience: ExperienceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const safeActiveIndex = experience.length ? activeIndex % experience.length : 0;
  const activeExperience = experience[safeActiveIndex];

  useEffect(() => {
    if (!experience.length || isPaused || shouldReduceMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % experience.length);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [experience.length, isPaused, shouldReduceMotion]);

  if (!activeExperience) return null;

  return (
    <section
      className="experience-section page-section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <SectionReveal className="experience-heading">
        <div>
          <span className="section-kicker">02 / WHERE I&apos;VE WORKED</span>
          <h2 id="experience-title">Experience<span>.</span></h2>
        </div>
        <p>{experience.length} chapters, one growing story. The details are yours to make personal.</p>
      </SectionReveal>

      <div
        className="experience-layout"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div className="experience-details" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              className="experience-entry"
              key={activeExperience.company}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="experience-period">{activeExperience.period}</span>
              <h3>{activeExperience.role}</h3>
              <div className="experience-company-line">
                <span>{activeExperience.company}</span>
                <span>{activeExperience.location}</span>
              </div>
              <p>{activeExperience.summary}</p>
              <ul>
                {activeExperience.highlights.map((highlight) => (
                  <li key={highlight}><span aria-hidden="true">↗</span>{highlight}</li>
                ))}
              </ul>
            </motion.article>
          </AnimatePresence>

          <div className="experience-controls" aria-label="Choose an experience">
            {experience.map((item, index) => (
              <button
                aria-label={`Show ${item.company}`}
                aria-pressed={index === safeActiveIndex}
                className={`experience-dot${index === safeActiveIndex ? " is-active" : ""}`}
                key={item.company}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
            <span>{String(safeActiveIndex + 1).padStart(2, "0")} <i>/</i> {String(experience.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className={`experience-brand experience-brand--${activeExperience.color}`}>
          <div className="experience-brand-grid" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="experience-logo"
              key={activeExperience.company}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.72, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, rotate: 8 }}
              transition={{ type: "spring", stiffness: 190, damping: 19 }}
            >
              <Image
                alt={activeExperience.logoAlt}
                className="experience-logo-image"
                height={190}
                unoptimized
                src={activeExperience.logo}
                width={190}
              />
            </motion.div>
          </AnimatePresence>
          <div className="experience-brand-footer">
            <span>COMPANY MARK</span>
            <strong>{activeExperience.company}</strong>
          </div>
          <span className="experience-brand-corner"><Icon name="spark" /></span>
        </div>
      </div>
    </section>
  );
}
