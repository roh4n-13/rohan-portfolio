/**
 * Central profile + project data for Rohan Makwana's portfolio.
 *
 * Edit this file to update content without touching layout code.
 *
 * HONESTY RULE (from the brief): never invent employment history, clients,
 * awards, certifications, metrics, or achievements. Everything here is either
 * from the brief itself or verified against the public GitHub repositories
 * on 26 October 2026. `linkedin` stays null until a real URL is
 * supplied — the UI renders no LinkedIn CTA while it is null. `email`
 * was set to the owner's professional address on 26 October 2026 at his
 * direction ("mail add karo"), which renders the "Email me" CTA.
 */

export const profile = {
  name: "Rohan Makwana",
  monogram: "RM",
  location: "Ahmedabad, Gujarat, India",
  heroLabel: "Ahmedabad, India · Developer in progress",
  education: "Bachelor of Computer Applications (BCA)",
  university: "Gujarat University",
  graduation: "2028",
  positioning: "Aspiring Software Developer",
  heroHeadline: ["BUILDING", "WHAT'S NEXT."],
  heroCopy:
    "I'm Rohan — a BCA student exploring software, AI, and the art of building useful things.",
  aboutHeadline: ["CURIOUS BY NATURE.", "BUILT THROUGH EXPERIMENTS."],
  aboutCopy:
    "I'm a BCA student learning software development the way it actually sticks: by building projects, breaking them, wiring up new tools, and solving practical problems. I like useful software more than impressive demos — things that save someone time, keep work organised, or quietly automate a boring job.",
  contactHeadline: ["HAVE AN IDEA?", "LET'S BUILD IT."],
  github: "https://github.com/roh4n-13",
  githubHandle: "roh4n-13",
  /** Professional email, added at the owner's direction on 26 Oct 2026. */
  email: "work.rohanmakwana@gmail.com",
  /** General resume PDF served from public/; buttons render when set. */
  resumeUrl: "/Rohan_Makwana_Resume.pdf",
  /** Availability signal shown in the hero and contact sections. */
  availability: "Open to fresher roles · Ahmedabad & remote",
  /** Set to a real profile URL when supplied; null = no LinkedIn CTA. */
  linkedin: null as string | null,
  interests: [
    "Full-stack web development",
    "AI-assisted development and AI tools",
    "Developer tools and automation",
    "Cybersecurity fundamentals",
  ],
  currentlyExploring: [
    "Full-stack development",
    "AI-assisted coding workflows",
    "API integrations",
  ],
};

export type TimelineStep = {
  title: string;
  text: string;
};

export const timeline: TimelineStep[] = [
  {
    title: "Learning the fundamentals",
    text: "Computer applications, web technologies, and database fundamentals through BCA coursework — then testing each idea with small, real builds.",
  },
  {
    title: "Building web applications",
    text: "Turning coursework into working software: task workflows, local-first data, and interfaces people can actually use every day.",
  },
  {
    title: "Experimenting with integrations and automation",
    text: "Connecting apps to the outside world — optional Google Sheets sync, backups, reminders, and share flows that remove manual work.",
  },
  {
    title: "Expanding into AI and software engineering",
    text: "AI-assisted coding workflows, developer tooling, and cybersecurity fundamentals — learning what good engineering looks like, not just what compiles.",
  },
];

export type ProjectStatus = "In Development" | "Experimental" | "Completed";

export type Project = {
  id: string;
  index: string;
  name: string;
  role: string;
  status: ProjectStatus;
  description: string;
  tech: string[];
  repoUrl: string;
  repoLabel: string;
  releaseUrl?: string;
  releaseLabel?: string;
  /** Direct APK download (Android) shown as a "Try the app" button. */
  apkUrl?: string;
  apkLabel?: string;
  demoUrl: null;
};

export const projects: Project[] = [
  {
    id: "muse-task-app",
    index: "01",
    name: "Muse Task App",
    role: "Featured project",
    status: "Completed",
    description:
      "A local-first Android task manager — tasks, reminders, and a money summary, with optional Google Sheets sync.",
    tech: ["Kotlin", "Jetpack Compose", "Room", "OkHttp", "Google Apps Script"],
    repoUrl: "https://github.com/roh4n-13/muse-taskapp",
    repoLabel: "View repository",
    releaseUrl: "https://github.com/roh4n-13/muse-taskapp/releases/tag/v1.0.0",
    releaseLabel: "v1.0.0 release",
    apkUrl:
      "https://github.com/roh4n-13/muse-taskapp/releases/download/v1.0.0/app-release.1.apk",
    apkLabel: "Download APK",
    demoUrl: null,
  },
];

export type TechGroup = {
  label: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  { label: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Next.js"] },
  { label: "Backend", items: ["Node.js", "Express", "APIs"] },
  { label: "Languages", items: ["Python", "C", "Java"] },
  { label: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel"] },
];

/**
 * Repository facts verified from public GitHub data on 26 October 2026.
 * Shown as build-time facts, not a live fetch. Only the Muse project is
 * listed, per the owner's direction.
 */
export const repoFacts = [
  {
    repo: "muse-taskapp",
    language: "Kotlin",
    note: "Native Android app · v1.0.0 released",
    url: "https://github.com/roh4n-13/muse-taskapp",
  },
];

