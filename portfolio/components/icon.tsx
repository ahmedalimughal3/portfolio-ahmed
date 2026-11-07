import type { ReactNode, SVGProps } from "react";

type IconName =
  | "home"
  | "work"
  | "skills"
  | "about"
  | "experience"
  | "services"
  | "blog"
  | "mail"
  | "phone"
  | "arrow"
  | "spark"
  | "menu"
  | "close";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3.5 10 8.5-7 8.5 7" />
      <path d="M5.5 9v11h13V9M9 20v-6h6v6" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M8 4V2.5h8V4M3 10h18M10 10v2h4v-2" />
    </>
  ),
  skills: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
  services: (
    <>
      <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="m3.8 7.7 8.2 4.5 8.2-4.5M12 12.2V21" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <>
      <path d="M7.2 3.5h2.5l1.2 4.3-1.8 1.8a15 15 0 0 0 5.3 5.3l1.8-1.8 4.3 1.2v2.5a2 2 0 0 1-2.2 2 16.8 16.8 0 0 1-14.9-14.9 2 2 0 0 1 1.8-2.4Z" />
    </>
  ),
  blog: (
    <>
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 1 5 16.5v-12Z" />
      <path d="M5 16.5A2.5 2.5 0 0 1 7.5 14H20M9 6h7M9 9h7" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
