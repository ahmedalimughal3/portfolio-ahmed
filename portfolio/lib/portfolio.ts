export type Project = {
  name: string;
  category: string;
  description: string;
  year: string;
  tags: string[];
  theme: "lime" | "blue" | "coral";
  visual: "orbit" | "flow" | "pulse";
};

export type ExperienceItem = {
  company: string;
  logo: string;
  logoAlt: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  color: "blue" | "lime" | "peach";
};

export type Skill = {
  title: string;
  description: string;
  color: "blue" | "lime" | "peach" | "dark";
};

export type Service = {
  number: string;
  title: string;
  description: string;
  tools: string[];
  color: "blue" | "lime" | "peach";
};

export const navigation = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "Work", href: "#work", icon: "work" },
  { label: "Experience", href: "#experience", icon: "experience" },
  { label: "Skills", href: "#skills", icon: "skills" },
  { label: "Services", href: "#services", icon: "services" },
  { label: "About", href: "#about", icon: "about" },
] as const;

export const contactDetails = {
  email: "mughalahmedali692@gmail.com",
  phone: "+923712561852",
  linkedin: "https://www.linkedin.com/in/ahmed-ali-mughal20/",
  github: "https://github.com/ahmedalimughal3",
};

export const services: Service[] = [
  {
    number: "01",
    title: "Full Stack Development",
    description:
      "Responsive, production-ready web applications with thoughtful interfaces, reliable APIs, and databases working together.",
    tools: ["Next.js", "React", "Node.js"],
    color: "blue",
  },
  {
    number: "02",
    title: "Backend & API Development",
    description:
      "Well-structured server-side features, REST APIs, database integrations, and secure, dependable application logic.",
    tools: ["Node.js", "Express", "MongoDB"],
    color: "lime",
  },
  {
    number: "03",
    title: "Frontend & UI Development",
    description:
      "Accessible, mobile-friendly interfaces with reusable components, smooth interactions, and careful attention to detail.",
    tools: ["TypeScript", "React", "CSS"],
    color: "peach",
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "BawdicSoft",
    logo: "/experience/bawdicsoft.png",
    logoAlt: "BawdicSoft logo",
    role: "Junior Full Stack Developer",
    period: "Present",
    location: "Full-time",
    summary:
      "Building and improving product features across the frontend and backend, working with the team to turn requirements into reliable user experiences.",
    highlights: [
      "Develop and maintain responsive user-facing features and reusable UI components.",
      "Contribute to backend APIs, data integrations, and ongoing product improvements.",
    ],
    color: "blue",
  },
  {
    company: "Teyzix Core",
    logo: "/experience/teyzix-core.webp",
    logoAlt: "Teyzix Core logo",
    role: "Backend Developer Intern",
    period: "Internship",
    location: "Backend development",
    summary:
      "Gained hands-on backend experience by contributing to server-side features and learning how APIs and application data work together.",
    highlights: [
      "Assist with building and testing backend endpoints and application logic.",
      "Work with databases, validate requests, and troubleshoot issues with the team.",
    ],
    color: "lime",
  },
  {
    company: "Coderatory",
    logo: "/experience/coderatory.jpg",
    logoAlt: "Coderatory logo",
    role: "MERN Stack Developer",
    period: "MERN stack development",
    location: "Full-stack development",
    summary:
      "Worked across MongoDB, Express, React, and Node.js to build full-stack features and connect polished interfaces with backend services.",
    highlights: [
      "Build responsive React interfaces and integrate them with REST APIs.",
      "Contribute to Node.js and Express services backed by MongoDB.",
    ],
    color: "peach",
  },
];

export const projects: Project[] = [
  {
    name: "Orbit AI",
    category: "AI WORKSPACE",
    description:
      "A calmer way to collect ideas, ask better questions, and make progress with AI.",
    year: "2025",
    tags: ["Product design", "Next.js", "AI"],
    theme: "lime",
    visual: "orbit",
  },
  {
    name: "Flowboard",
    category: "TEAM PRODUCTIVITY",
    description:
      "A lightweight project space that helps small teams stay focused and in sync.",
    year: "2024",
    tags: ["UX/UI", "React", "SaaS"],
    theme: "blue",
    visual: "flow",
  },
  {
    name: "Pulse",
    category: "FINANCE APP",
    description:
      "Friendly money insights that make everyday spending easier to understand.",
    year: "2024",
    tags: ["Visual design", "Mobile", "Fintech"],
    theme: "coral",
    visual: "pulse",
  },
];

export const skills: Skill[] = [
  {
    title: "Frontend",
    description: "Accessible interfaces, thoughtful details, and fast experiences.",
    color: "blue",
  },
  {
    title: "Backend",
    description: "Reliable APIs and practical foundations that scale with a product.",
    color: "lime",
  },
  {
    title: "Product",
    description: "From the first rough idea to a clear, useful experience.",
    color: "peach",
  },
  {
    title: "Collaboration",
    description: "Good questions, clear communication, and steady progress.",
    color: "dark",
  },
];
