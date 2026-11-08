export type ContentSection =
  | "projects"
  | "experience"
  | "skills"
  | "services"
  | "contact"
  | "site";

export type ContentField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "select" | "email" | "url" | "tel";
  options?: string[];
  required?: boolean;
};

export const contentSections: {
  id: ContentSection;
  label: string;
  description: string;
  fields: ContentField[];
}[] = [
  {
    id: "projects",
    label: "Projects",
    description: "Selected work shown in the portfolio.",
    fields: [
      { key: "name", label: "Project name", required: true },
      { key: "category", label: "Category", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "year", label: "Year", required: true },
      { key: "tags", label: "Tags", kind: "list", required: true },
      { key: "theme", label: "Color theme", kind: "select", options: ["lime", "blue", "coral"], required: true },
      { key: "visual", label: "Card visual", kind: "select", options: ["orbit", "flow", "pulse"], required: true },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    description: "Roles, company details, and highlights.",
    fields: [
      { key: "company", label: "Company", required: true },
      { key: "logo", label: "Logo path", required: true },
      { key: "logoAlt", label: "Logo description", required: true },
      { key: "role", label: "Role", required: true },
      { key: "period", label: "Period", required: true },
      { key: "location", label: "Location", required: true },
      { key: "summary", label: "Summary", kind: "textarea", required: true },
      { key: "highlights", label: "Highlights", kind: "list", required: true },
      { key: "color", label: "Color theme", kind: "select", options: ["blue", "lime", "peach"], required: true },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    description: "Skill cards shown on the homepage.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "color", label: "Color theme", kind: "select", options: ["blue", "lime", "peach", "dark"], required: true },
    ],
  },
  {
    id: "services",
    label: "Services",
    description: "Services and technologies offered.",
    fields: [
      { key: "number", label: "Display number", required: true },
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "tools", label: "Tools / technologies", kind: "list", required: true },
      { key: "color", label: "Color theme", kind: "select", options: ["blue", "lime", "peach"], required: true },
    ],
  },
  {
    id: "contact",
    label: "Contact details",
    description: "Email, phone, and social links used across the portfolio.",
    fields: [
      { key: "email", label: "Email", kind: "email", required: true },
      { key: "phone", label: "Phone", kind: "tel", required: true },
      { key: "linkedin", label: "LinkedIn URL", kind: "url", required: true },
      { key: "github", label: "GitHub URL", kind: "url", required: true },
    ],
  },
  {
    id: "site",
    label: "Home & about",
    description: "Homepage headline, introduction, and availability copy.",
    fields: [
      { key: "heroKicker", label: "Homepage eyebrow", required: true },
      { key: "heroTitle", label: "Headline (first line)", required: true },
      { key: "heroAccent", label: "Headline (highlighted line)", required: true },
      { key: "heroDescription", label: "Homepage introduction", kind: "textarea", required: true },
      { key: "aboutTitle", label: "About headline (first line)", required: true },
      { key: "aboutAccent", label: "About headline (highlighted line)", required: true },
      { key: "aboutParagraph", label: "About paragraph", kind: "textarea", required: true },
      { key: "aboutSecondParagraph", label: "About paragraph (continued)", kind: "textarea", required: true },
      { key: "availability", label: "Availability message", required: true },
    ],
  },
];

export type ContentPayload = Record<string, string | string[]>;

export type ContentRecord = {
  id: string;
  section: ContentSection;
  slug: string;
  title: string;
  payload: ContentPayload;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export function getContentSection(value: string): (typeof contentSections)[number] | undefined {
  return contentSections.find((section) => section.id === value);
}
