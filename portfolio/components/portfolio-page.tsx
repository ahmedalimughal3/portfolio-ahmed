"use client";

import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icon";
import { ProjectCard } from "@/components/project-card";
import { SectionReveal } from "@/components/section-reveal";
import { ExperienceSection } from "@/components/experience-section";
import { SiteSidebar } from "@/components/site-sidebar";
import { contactDetails, projects, services, skills } from "@/lib/portfolio";

export function PortfolioPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SiteSidebar />
      <main className="page-shell">
        <section className="hero-section page-section" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> DESIGN ENGINEER <span className="eyebrow-divider">/</span> DIGITAL CRAFT</div>
            <h1>Small stack.<br /><span>Big ideas.</span></h1>
            <p className="hero-description">
              I bring thoughtful ideas to life with design, code, and a little
              curiosity. Building digital things that feel as good as they work.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">
                Explore my work <Icon name="arrow" />
              </a>
              <a className="text-link" href="#about">A little about me <span>↘</span></a>
            </div>
            <div className="hero-footnote"><span>BASED ON EARTH</span><span>AVAILABLE WORLDWIDE</span></div>
          </div>

          <div className="skills-art" aria-label="A snapshot of my skill set">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            {skills.map((skill, index) => (
              <motion.div
                className={`skill-card skill-card--${skill.color}`}
                key={skill.title}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: shouldReduceMotion ? 0 : [0, -5, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 + index * 0.08 },
                  scale: { duration: 0.5, delay: 0.2 + index * 0.08 },
                  y: { duration: 4 + index * 0.45, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 },
                }}
              >
                <span className="skill-card-icon">{["⌘", "↗", "✳", "◎"][index]}</span>
                <strong>{skill.title}</strong>
                <p>{skill.description}</p>
                <span className="skill-card-index">0{index + 1}</span>
              </motion.div>
            ))}
            <span className="art-note"><Icon name="spark" /> IDEAS INTO INTERFACES</span>
          </div>

          <a className="scroll-cue" href="#work" aria-label="Scroll to selected work">
            <span>SCROLL TO EXPLORE</span><span className="scroll-cue-line" />
          </a>
        </section>

        <section className="stats-strip" aria-label="Portfolio overview">
          <div><strong>03<span>+</span></strong><span>Selected projects</span></div>
          <div><strong>04</strong><span>Ways of working</span></div>
          <div><strong>∞</strong><span>Curiosity for what’s next</span></div>
          <span className="stats-note">DESIGN <b>×</b> DEVELOPMENT <b>×</b> DETAIL</span>
        </section>

        <section className="work-section page-section" id="work">
          <SectionReveal className="section-heading">
            <div>
              <span className="section-kicker">01 / SELECTED WORK</span>
              <h2>Things I&apos;ve built<span>.</span></h2>
            </div>
            <p>A few ideas brought to life — made with care, curiosity, and a healthy obsession with the details.</p>
          </SectionReveal>
          <div className="project-grid">
            {projects.map((project, index) => (
              <SectionReveal key={project.name} delay={index * 0.1}>
                <ProjectCard project={project} />
              </SectionReveal>
            ))}
          </div>
          <div className="work-footnote"><span>MORE IN THE WORKS</span><span>ALWAYS BUILDING SOMETHING NEW ↗</span></div>
        </section>

        <ExperienceSection />

        <section className="skills-section page-section" id="skills">
          <SectionReveal className="skills-section-copy">
            <span className="section-kicker">03 / THE TOOLKIT</span>
            <h2>Good work<br />takes a <span>good mix.</span></h2>
            <p>
              The best digital experiences happen when every part works together.
              I move between design and development to make the whole thing feel right.
            </p>
            <a className="text-link" href="#about">How I like to work <span>↘</span></a>
          </SectionReveal>
          <div className="toolkit-grid">
            {skills.map((skill, index) => (
              <SectionReveal key={skill.title} delay={index * 0.07}>
                <article className={`toolkit-card toolkit-card--${skill.color}`}>
                  <span className="toolkit-number">0{index + 1} / 04</span>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  <span className="toolkit-spark" aria-hidden="true">{["✳", "↗", "◒", "✦"][index]}</span>
                </article>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="services-section page-section" id="services">
          <SectionReveal className="services-heading">
            <div>
              <span className="section-kicker">04 / WHAT I CAN HELP WITH</span>
              <h2>Services<span>.</span></h2>
            </div>
            <p>Practical development support from the first idea through a polished, working product.</p>
          </SectionReveal>
          <div className="services-grid">
            {services.map((service, index) => (
              <SectionReveal key={service.title} delay={index * 0.08}>
                <article className={`service-card service-card--${service.color}`}>
                  <div className="service-card-top">
                    <span>{service.number} / 03</span>
                    <Icon name="spark" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul aria-label={`${service.title} technologies`}>
                    {service.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                  <div className="service-actions">
                    <a href={`tel:${contactDetails.phone}`}><Icon name="phone" /> Call</a>
                    <a href={`mailto:${contactDetails.email}?subject=${encodeURIComponent(`Inquiry: ${service.title}`)}`}><Icon name="mail" /> Email</a>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="about-section page-section" id="about">
          <SectionReveal className="about-content">
            <div>
              <span className="section-kicker">05 / A LITTLE ABOUT ME</span>
              <h2>Curious by nature.<br /><span>Intentional by design.</span></h2>
            </div>
            <div className="about-copy">
              <p>
                I&apos;m Ahmed — a designer-minded developer who enjoys turning
                complex ideas into simple, useful experiences. I care about how
                things work, how they feel, and all the small details in between.
              </p>
              <p>
                My process is collaborative and hands-on: ask good questions,
                make a thoughtful first version, then keep refining until it clicks.
              </p>
              <a className="text-link" href="#contact">Have a project in mind? <span>↘</span></a>
            </div>
          </SectionReveal>
        </section>

        <section className="contact-section page-section" id="contact">
          <SectionReveal className="contact-inner">
            <Icon className="contact-spark" name="spark" />
            <div className="contact-copy">
              <span className="section-kicker">06 / YOUR TURN</span>
              <h2>Got a good idea?<br /><span>Let&apos;s make it real.</span></h2>
              <p>Have a project or a question? Pick the easiest way to reach me.</p>
              <a className="contact-detail" href={`mailto:${contactDetails.email}`}>
                <Icon name="mail" /><span>{contactDetails.email}</span>
              </a>
              <a className="contact-detail" href={`tel:${contactDetails.phone}`}>
                <Icon name="phone" /><span>{contactDetails.phone}</span>
              </a>
              <div className="contact-socials">
                <a href={contactDetails.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
                <a href={contactDetails.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
              </div>
            </div>
          </SectionReveal>
        </section>

        <footer className="site-footer">
          <span>© 2026 AHMED. MADE WITH INTENTION.</span>
          <a href="#home">BACK TO TOP ↑</a>
          <span>DESIGNED TO FEEL GOOD.</span>
        </footer>
      </main>
    </>
  );
}
