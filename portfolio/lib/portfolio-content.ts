import "server-only";

import {
  contactDetails as defaultContactDetails,
  experience as defaultExperience,
  projects as defaultProjects,
  services as defaultServices,
  skills as defaultSkills,
  type ExperienceItem,
  type Project,
  type Service,
  type Skill,
} from "@/lib/portfolio";
import type { ContentRecord, ContentSection } from "@/lib/content-types";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type PortfolioContent = {
  projects: Project[];
  experience: ExperienceItem[];
  skills: Skill[];
  services: Service[];
  contactDetails: typeof defaultContactDetails;
  site: {
    heroKicker: string;
    heroTitle: string;
    heroAccent: string;
    heroDescription: string;
    aboutTitle: string;
    aboutAccent: string;
    aboutParagraph: string;
    aboutSecondParagraph: string;
    availability: string;
  };
};

const defaults: PortfolioContent = {
  projects: [...defaultProjects],
  experience: [...defaultExperience],
  skills: [...defaultSkills],
  services: [...defaultServices],
  contactDetails: defaultContactDetails,
  site: {
    heroKicker: "DESIGN ENGINEER / DIGITAL CRAFT",
    heroTitle: "Small stack.",
    heroAccent: "Big ideas.",
    heroDescription:
      "I bring thoughtful ideas to life with design, code, and a little curiosity. Building digital things that feel as good as they work.",
    aboutTitle: "Curious by nature.",
    aboutAccent: "Intentional by design.",
    aboutParagraph:
      "I'm Ahmed — a designer-minded developer who enjoys turning complex ideas into simple, useful experiences. I care about how things work, how they feel, and all the small details in between.",
    aboutSecondParagraph:
      "My process is collaborative and hands-on: ask good questions, make a thoughtful first version, then keep refining until it clicks.",
    availability: "Open to opportunities",
  },
};

const sections: ContentSection[] = ["projects", "experience", "skills", "services", "contact", "site"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Published portfolio content has an invalid "${key}" field.`);
  }
  return value;
}

function stringList(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Published portfolio content has an invalid "${key}" list.`);
  }
  return value;
}

function oneOf<const Options extends readonly string[]>(
  value: string,
  options: Options,
): value is Options[number] {
  return options.some((option) => option === value);
}

function parseProject(payload: Record<string, unknown>): Project {
  const theme = requiredString(payload, "theme");
  const visual = requiredString(payload, "visual");
  if (!oneOf(theme, ["lime", "blue", "coral"]) || !oneOf(visual, ["orbit", "flow", "pulse"])) {
    throw new Error("Published project has an unsupported visual style.");
  }
  return {
    name: requiredString(payload, "name"),
    category: requiredString(payload, "category"),
    description: requiredString(payload, "description"),
    year: requiredString(payload, "year"),
    tags: stringList(payload, "tags"),
    theme,
    visual,
  };
}

function parseRecords(records: ContentRecord[], section: ContentSection) {
  return records
    .filter((record) => record.section === section)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((record) => {
      if (!isRecord(record.payload)) {
        throw new Error(`Published "${section}" content contains an invalid record.`);
      }
      return record.payload;
    });
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) return defaults;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("id, section, slug, title, payload, sort_order, published, updated_at")
    .eq("published", true)
    .in("section", sections)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      "Could not load published portfolio content; using local defaults:",
      error.message,
    );
    return defaults;
  }

  const records = (data ?? []) as ContentRecord[];
  const projects = parseRecords(records, "projects");
  const experience = parseRecords(records, "experience");
  const skills = parseRecords(records, "skills");
  const services = parseRecords(records, "services");
  const contacts = parseRecords(records, "contact");
  const siteRecords = parseRecords(records, "site");
  const contact = contacts[0];
  if (contacts.length > 1) {
    throw new Error("Only one published contact-details record is supported.");
  }
  if (siteRecords.length > 1) {
    throw new Error("Only one published home-and-about record is supported.");
  }

  return {
    projects: projects.map(parseProject),
    experience: experience.length
      ? experience.map((payload) => ({
          company: requiredString(payload, "company"),
          logo: requiredString(payload, "logo"),
          logoAlt: requiredString(payload, "logoAlt"),
          role: requiredString(payload, "role"),
          period: requiredString(payload, "period"),
          location: requiredString(payload, "location"),
          summary: requiredString(payload, "summary"),
          highlights: stringList(payload, "highlights"),
          color: parseColor<ExperienceItem["color"]>(payload, ["blue", "lime", "peach"]),
        }))
      : [],
    skills: skills.length
      ? skills.map((payload) => ({
          title: requiredString(payload, "title"),
          description: requiredString(payload, "description"),
          color: parseColor<Skill["color"]>(payload, ["blue", "lime", "peach", "dark"]),
        }))
      : [],
    services: services.length
      ? services.map((payload) => ({
          number: requiredString(payload, "number"),
          title: requiredString(payload, "title"),
          description: requiredString(payload, "description"),
          tools: stringList(payload, "tools"),
          color: parseColor<Service["color"]>(payload, ["blue", "lime", "peach"]),
        }))
      : [],
    contactDetails: contact
      ? {
          email: requiredString(contact, "email"),
          phone: requiredString(contact, "phone"),
          linkedin: requiredString(contact, "linkedin"),
          github: requiredString(contact, "github"),
        }
      : { email: "", phone: "", linkedin: "", github: "" },
    site: siteRecords[0]
        ? {
            heroKicker: requiredString(siteRecords[0], "heroKicker"),
            heroTitle: requiredString(siteRecords[0], "heroTitle"),
            heroAccent: requiredString(siteRecords[0], "heroAccent"),
            heroDescription: requiredString(siteRecords[0], "heroDescription"),
            aboutTitle: requiredString(siteRecords[0], "aboutTitle"),
            aboutAccent: requiredString(siteRecords[0], "aboutAccent"),
            aboutParagraph: requiredString(siteRecords[0], "aboutParagraph"),
            aboutSecondParagraph: requiredString(siteRecords[0], "aboutSecondParagraph"),
            availability: requiredString(siteRecords[0], "availability"),
          }
        : {
            heroKicker: "",
            heroTitle: "",
            heroAccent: "",
            heroDescription: "",
            aboutTitle: "",
            aboutAccent: "",
            aboutParagraph: "",
            aboutSecondParagraph: "",
            availability: "",
          },
  };
}

function parseColor<Color extends string>(
  payload: Record<string, unknown>,
  options: readonly Color[],
): Color {
  const color = requiredString(payload, "color");
  if (!oneOf(color, options)) {
    throw new Error("Published portfolio content has an unsupported color theme.");
  }
  return color;
}
