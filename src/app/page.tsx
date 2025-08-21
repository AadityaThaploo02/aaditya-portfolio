"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, FileText, X } from "lucide-react";

/* === Minimal inline UI (no external UI imports required) ============== */
function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition";
  const variants = {
    primary: "bg-white text-black hover:opacity-90",
    secondary:
      "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700",
    ghost:
      "bg-transparent text-white/80 hover:text-white border border-transparent hover:border-zinc-700",
  } as const;
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4" } as const;
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
function Card({
  className = "",
  children,
  onClick,
}: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative rounded-2xl border border-zinc-800/70 bg-zinc-900/60
        shadow-sm transition
        ${onClick ? "cursor-pointer" : ""}
        hover:shadow-xl hover:shadow-black/20
        hover:border-zinc-700/80
        ${className}
      `}
      style={{
        backgroundImage:
          "radial-gradient(1200px 200px at 50% -10%, rgba(255,255,255,0.05), transparent)",
      }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset" }}
      />
    </div>
  );
}
function CardContent({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

/* === Universal Focus Modal ============================================ */
type FocusKind =
  | "project"
  | "experience"
  | "education"
  | "honor"
  | "skill"
  | "certification";
type FocusTarget = { kind: FocusKind; index?: number; label?: string } | null;

function useEscClose(onClose: () => void) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onClose]);
}

function FocusView({
  open,
  onClose,
  title,
  subtitle,
  meta,
  body,
  tags,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  body?: React.ReactNode;
  tags?: string[];
}) {
  useEscClose(onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold tracking-tight">{title}</h3>
              {subtitle && (
                <div className="mt-1 text-sm text-zinc-400">{subtitle}</div>
              )}
              {tags && tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {meta && <div className="mt-2 text-xs text-zinc-500">{meta}</div>}
              {body && (
                <div className="prose prose-invert mt-4 max-w-none leading-relaxed">
                  {body}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ====================================================================== */
type Tab =
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "honors"
  | "certifications";

/** Shape for the computed modal payload so we don’t need `as any`. */
type FocusContent =
  | {
      title: string;
      subtitle?: string;
      meta?: React.ReactNode;
      body?: React.ReactNode;
      tags?: string[];
    }
  | null;

export default function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [active, setActive] = useState<Tab>("projects");
  const [focus, setFocus] = useState<FocusTarget>(null);

  const profile = {
    name: "Aaditya Thaploo",
    headline:
      "Computer Science MS, Purdue University | Software Engineering • Cybersecurity • Machine Learning & AI • Data Engineering • Automation",
    about:
      "Computer Science Master’s graduate with hands-on experience in software engineering, cybersecurity, and analytics. Designed scalable systems that improve performance, strengthen reliability, and reduce security risks. Passionate about ML, distributed computing, and automation; eager to deliver measurable impact in software development, information security, QA, and data engineering.",
    location: "United States",
    email: "aadityathaploo02@gmail.com",
    linkedin: "https://www.linkedin.com/in/aaditya-thaploo-2a6717189/",
    resume: "/Athaploo_updated.pdf",
  };

  /* ===================== DATA: Projects (Problem/Approach/Outcomes + tags) ===================== */
  const projects = [
    {
      title: "AI Virtual Assistant for Customer Support",
      tags: ["Python", "NLP", "APIs", "Automation"],
      problem:
        "Customers faced delays in resolution due to manual support workflows and inconsistent query handling.",
      approach:
        "Built an AI assistant with intent recognition (NLP), integrated ticketing APIs, and automated response generation. Implemented PII redaction and retry/fallback logic.",
      outcomes: [
        "Reduced average resolution time by 38%",
        "Improved CSAT by 12 points",
        "Scaled to ~2k requests/week with p95 latency < 300ms",
      ],
    },
    {
      title: "College Enquiry Chatbot",
      tags: ["NLP", "Web", "Automation"],
      problem:
        "Students and parents struggled to access admission details; staff time was consumed by repetitive queries.",
      approach:
        "Developed a conversational bot (NLP + rules fallback) covering admissions, courses, and deadlines; deployed on college site.",
      outcomes: [
        "Automated 80%+ of routine queries",
        "Freed ~15 staff hours/week",
        "Improved prospective student engagement during admissions",
      ],
    },
    {
      title: "Snake Game in C++",
      tags: ["C++", "Algorithms", "Game Loop"],
      problem:
        "Needed a complete game to demonstrate algorithms, data structures, and event-loop design.",
      approach:
        "Implemented in C++ (arrays/structs), handling movement, scoring, food spawn, and collision detection within a clean game loop.",
      outcomes: [
        "Reinforced DS&A skills and real-time logic",
        "Delivered a fully playable, self-contained project",
      ],
    },
    {
      title: "“WeCare” Website (Doctor Appointment System)",
      tags: ["Full-Stack", "Web", "Scheduling"],
      problem:
        "Patients found scheduling difficult; manual coordination caused delays and miscommunication.",
      approach:
        "Built a responsive app for registration, appointment booking, and doctor availability; added backend scheduling and notifications.",
      outcomes: [
        "Enabled self-service booking → reduced waiting time",
        "Improved scheduling efficiency and patient satisfaction",
        "Demonstrated full-stack delivery (frontend + backend + DB)",
      ],
    },
    {
      title: "Portfolio Website",
      tags: ["Next.js", "Tailwind", "Framer Motion", "UX"],
      problem:
        "Needed a professional presence to showcase projects, internships, and contact info.",
      approach:
        "Built a modern portfolio with Next.js, Tailwind, Framer Motion, and modals for deep reads; added resume download + mailto/LinkedIn.",
      outcomes: [
        "Recruiter-friendly profile accessible 24/7",
        "Demonstrates modern React/Next.js + UX craft",
        "Improved visibility and response from outreach",
      ],
    },
    {
      title: "AI Summarizer Tool",
      tags: ["NLP", "Productivity"],
      problem:
        "Users spent too long reading dense documents to extract key points.",
      approach:
        "Developed an NLP summarizer to condense long-form text into concise abstracts; tuned for readability and coverage.",
      outcomes: [
        "Reduced reading effort/time by ~70%",
        "Boosted productivity for scanning large docs",
        "Showcased applied AI/NLP in information processing",
      ],
    },
    {
      title: "Music Genre Classification",
      tags: ["Python", "Librosa", "ONNX", "Audio"],
      problem:
        "Manual tagging of music tracks was slow and inconsistent; deployment needed to run efficiently across platforms.",
      approach:
        "Extracted MFCCs, chroma, spectral features, and tempo/BPM using Librosa; trained a classifier and exported the model to ONNX for lightweight, cross-platform inference.",
      outcomes: [
        "Delivered consistent genre predictions across common classes",
        "Enabled portable, fast inference with ONNX (desktop & edge)",
        "Reduced manual labeling effort and sped up content triage",
      ],
    },
    {
      title: "Chef Assistant — AI-Powered Recipe Recommender",
      tags: ["Python", "LangChain", "RAG", "APIs"],
      problem:
        "Users needed relevant, adaptable recipes with accurate nutrition under constraints (diet, allergies, pantry items).",
      approach:
        "Built a RAG system with short/long-term memory; integrated Spoonacular & API Ninjas Nutrition; added fallback prompting and adaptation for substitutions and portion scaling.",
      outcomes: [
        "Improved recipe relevance and response consistency",
        "Provided precise nutritional lookups in-flow",
        "Reduced hallucinations via retrieval + guardrails",
      ],
    },
    {
      title: "Lung Cancer Image Classification",
      tags: ["TensorFlow", "CNN", "Medical AI"],
      problem:
        "Radiology workflows required faster, more consistent screening support on CT scans.",
      approach:
        "Designed CNNs with normalization and augmentation; performed hyperparameter tuning and tracked precision/recall/F1 to minimize false negatives.",
      outcomes: [
        "Improved detection accuracy and class balance",
        "Enhanced model generalization across patient cohorts",
        "Produced reproducible evaluation with clear metrics",
      ],
    },
  ];

  /* ===================== DATA: Experience / Skills / Education / Honors ===================== */
  const experience = [
    {
      role: "IT Support & Automation",
      company: "Logenix International · Internship",
      dates: "May 2024 – Jul 2024 · 3 mos",
      location: "Washington, United States · On-site",
      problem:
        "Supply chain teams were slowed by manual workflows and recurring IT issues that impacted throughput and user experience.",
      approach:
        "Automated supply chain workflows using scripts & workflow tools; delivered Tier 2 support (setup, troubleshooting, hardware configuration, staff training); collaborated across teams to design scalable IT solutions.",
      outcomes: [
        "Operational efficiency improved by ~30%",
        "Reduced manual tasks and recurring tickets",
        "Ensured smoother IT operations and user satisfaction",
      ],
    },
    {
      role: "Software Engineer",
      company: "Virtusa Consulting Services Pvt. Ltd. · Internship",
      dates: "Jan 2023 – Jun 2023 · 6 mos",
      location: "Mumbai, Maharashtra, India · Remote",
      problem:
        "Security posture needed improvement across threat detection, compliance visibility, and response readiness.",
      approach:
        "Conducted penetration tests guided by MITRE ATT&CK; implemented mitigation strategies; monitored metrics using Security Scorecard & Black Kite; analyzed logs/network traffic via SIEM for detection and incident response.",
      outcomes: [
        "Enhanced detection capabilities and visibility",
        "Improved compliance posture",
        "Reduced potential attack exposure",
      ],
    },
  ];

  const skills = [
    "Python",
    "Java",
    "C",
    "C++",
    "TensorFlow",
    "PyTorch",
    "ONNX",
    "MPI",
    "SQL",
    "NoSQL",
    "Hadoop",
    "Spark",
    "Hive",
    "Impala",
    "Selenium",
    "Linux/Unix",
    "JIRA",
    "Penetration Testing",
    "Vulnerability Assessment",
    "MITRE ATT&CK",
    "Security Scorecard",
    "Black Kite",
  ];

  const education = [
    {
      school: "Purdue University Northwest (PNW), Indiana",
      degree: "Master of Science – MS, Computer Science",
      dates: "Aug 2023 – Aug 2025",
      details:
        "Coursework & skills: KNIME · Database Recovery & Backup · Ubuntu · Algorithm Analysis (Big-O best/worst/avg) · SQL.",
    },
    {
      school: "MIT World Peace University (MIT-WPU), Pune",
      degree: "Bachelor of Technology – BTech, Computer & Information Sciences",
      dates: "Jul 2019 – Jun 2023 · CGPA 8",
      details: "Projects and coursework emphasizing core CS and SQL.",
    },
  ];

  // honors: desc supports string OR string[]
  const honors: Array<{
    title: string;
    org: string;
    desc: string | string[];
  }> = [
    {
      title: "Capstone Project Award – Best in Department",
      org: "MIT-WPU Pune",
      desc:
        "Recognized for 'Lung Cancer Image Classification using Deep Learning'—innovation and impact in applying CNNs to medical imaging.",
    },
    {
      title: "Workshops & Leadership",
      org: "MIT-WPU Pune",
      desc: [
        "I led my college’s Industrial Tour in Bengaluru, coordinating visits to organizations and facilitating student–industry interaction.",
        "I attend workshops on Supply Chain Management and Communications, enhancing my knowledge of logistics, efficiency, and professional communication.",
        "I participated in Rehabilitation & Counselling Services programs, gaining experience in empathy, guidance, and social responsibility.",
        "I served as Captain of my college basketball team, showcasing leadership, teamwork, and strategic thinking in inter-collegiate tournaments.",
      ],
    },
  ];

  // === Certifications ====================================================
  const certifications: Array<{
    title: string;
    org: string;
    date?: string;
    credentialId?: string;
    verifyUrl?: string;
    tags?: string[];
    desc?: string | string[];
  }> = [
    {
      title: "Assets, Threats, and Vulnerabilities",
      org: "Google (Coursera)",
      date: "Jan 6, 2024",
      tags: ["Cybersecurity", "Risk"],
      desc:
        "Core security concepts: assets vs. threats, common vulnerabilities, and risk assessment frameworks for prioritizing defenses.",
      // verifyUrl intentionally omitted (not fully legible in screenshot)
    },
    {
      title: "Connect and Protect: Networks and Network Security",
      org: "Google (Coursera)",
      date: "Jan 3, 2024",
      tags: ["Networking", "Security"],
      verifyUrl: "https://coursera.org/verify/ESWBLBF75GJE",
      desc:
        "Covers TCP/IP, firewalls, proxies, and segmentation with practical strategies to secure networked systems.",
    },
    {
      title: "Data Science Orientation",
      org: "IBM (Coursera/Credly)",
      date: "Dec 26, 2023",
      tags: ["Data Science", "Foundations"],
      verifyUrl: "https://www.credly.com/go/Orao2M8L",
      desc:
        "Introduces the data science workflow, roles, and tools—setting the stage for hands-on analytics and ML.",
    },
    {
      title: "Foundations of Cybersecurity",
      org: "Google (Coursera)",
      date: "Dec 26, 2023",
      tags: ["Security", "Fundamentals"],
      verifyUrl: "https://coursera.org/verify/3LE6RM7F7LZC",
      desc:
        "Security principles, CIA triad, controls, and frameworks with context for entry-level SOC/analyst work.",
    },
    {
      title: "What is Data Science?",
      org: "IBM (Coursera)",
      date: "Dec 26, 2023",
      tags: ["Data Science"],
      verifyUrl: "https://coursera.org/verify/UA3MYLHYGKB",
      desc:
        "A high-level overview of DS practice, real-world applications, and how data-driven decisions are made.",
    },
    {
      title: "Introduction to Generative AI",
      org: "Google Cloud Training (Coursera)",
      date: "Dec 19, 2023",
      tags: ["GenAI", "AI"],
      verifyUrl: "https://coursera.org/verify/4VKCA8AXPSPF",
      desc:
        "Explains foundation models and generative techniques with practical use cases for text and content generation.",
    },
    {
      title: "Play It Safe: Manage Security Risks",
      org: "Google (Coursera)",
      date: "Dec 28, 2023",
      tags: ["Risk", "Security"],
      verifyUrl: "https://coursera.org/verify/KF9HCDDMZLBB",
      desc:
        "Risk management lifecycle, threat modeling, and control selection to reduce business exposure.",
    },
    {
      title: "Sound the Alarm: Detection and Response",
      org: "Google (Coursera)",
      date: "Jan 6, 2024",
      tags: ["SOC", "IR"],
      verifyUrl: "https://coursera.org/verify/TAJFHHFNL9FQ",
      desc:
        "Monitoring, alerting, and incident response fundamentals—triage, containment, and recovery best practices.",
    },
    {
      title: "Tools of the Trade: Linux and SQL",
      org: "Google (Coursera)",
      date: "Jan 3, 2024",
      tags: ["Linux", "SQL"],
      verifyUrl: "https://coursera.org/verify/7UPG2USXC6MQ",
      desc:
        "Hands-on basics with the Linux shell and SQL queries for investigation, automation, and reporting.",
    },
  ];

  /* ===================== Tabs / Variants ===================== */
  const tabs: { key: Tab; label: string }[] = useMemo(
    () => [
      { key: "projects", label: "Projects" },
      { key: "experience", label: "Professional Experience" },
      { key: "skills", label: "Skills" },
      { key: "education", label: "Education" },
      { key: "honors", label: "Honors & Awards" },
      { key: "certifications", label: "Certifications" },
    ],
    []
  );

  const contentVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const openDetail = (kind: FocusKind, index?: number, label?: string) =>
    setFocus({ kind, index, label });
  const closeDetail = () => setFocus(null);

  /* ===================== Build modal content by focus target ===================== */
  const focusContent: FocusContent = (() => {
    if (!focus) return null;

    if (focus.kind === "project" && focus.index !== undefined) {
      const p = projects[focus.index];
      return {
        title: p.title,
        subtitle: "Problem • Approach • Outcomes",
        tags: p.tags,
        body: (
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Problem</h4>
            <p className="mt-1">{p.problem}</p>

            <h4 className="mt-4 text-sm font-semibold text-zinc-300">
              Approach
            </h4>
            <p className="mt-1">{p.approach}</p>

            <h4 className="mt-4 text-sm font-semibold text-zinc-300">
              Outcomes
            </h4>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {p.outcomes.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        ),
      };
    }

    if (focus.kind === "experience" && focus.index !== undefined) {
      const e = experience[focus.index];
      return {
        title: `${e.role} — ${e.company}`,
        subtitle: `${e.dates} • ${e.location}`,
        body: (
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Problem</h4>
            <p className="mt-1">{e.problem}</p>

            <h4 className="mt-4 text-sm font-semibold text-zinc-300">
              Approach
            </h4>
            <p className="mt-1">{e.approach}</p>

            <h4 className="mt-4 text-sm font-semibold text-zinc-300">
              Outcomes
            </h4>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {e.outcomes.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        ),
      };
    }

    if (focus.kind === "education" && focus.index !== undefined) {
      const ed = education[focus.index];
      return {
        title: ed.school,
        subtitle: ed.degree,
        meta: <div className="text-xs">{ed.dates}</div>,
        body: ed.details ? <p>{ed.details}</p> : undefined,
      };
    }

    if (focus.kind === "honor" && focus.index !== undefined) {
      const h = honors[focus.index];
      return {
        title: h.title,
        subtitle: h.org,
        body: Array.isArray(h.desc) ? (
          <ul className="list-disc pl-5 space-y-2">
            {h.desc.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        ) : (
          <p>{h.desc}</p>
        ),
      };
    }

    if (focus.kind === "certification" && focus.index !== undefined) {
      const c = certifications[focus.index];
      return {
        title: c.title,
        subtitle: c.org,
        tags: c.tags,
        meta: (
          <div>
            {c.date ? <span>Issued: {c.date}</span> : null}
            {c.credentialId ? (
              <span className="ml-2">• Credential ID: {c.credentialId}</span>
            ) : null}
            {c.verifyUrl ? (
              <span className="ml-2">
                •{" "}
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Verify
                </a>
              </span>
            ) : null}
          </div>
        ),
        body: Array.isArray(c.desc) ? (
          <ul className="list-disc pl-5 space-y-2">
            {c.desc.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        ) : c.desc ? (
          <p>{c.desc}</p>
        ) : undefined,
      };
    }

    if (focus.kind === "skill") {
      return {
        title: focus.label || "Skill",
        body: (
          <p>
            One of Aaditya’s core tools/skills used across projects and
            experience.
          </p>
        ),
      };
    }

    return null;
  })();

  /* ============================= RENDER ============================= */
  return (
    <div
      className={
        darkMode
          ? "bg-zinc-950 text-white min-h-screen transition-colors"
          : "bg-white text-black min-h-screen transition-colors"
      }
    >
      {/* Sticky Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-sm supports-[backdrop-filter]:bg-black/40 bg-black/50 border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-white/90">
            {profile.name}
          </div>
          <div className="flex items-center gap-2">
            <a href={profile.resume} download>
              <Button variant="secondary" size="sm">
                Resume
              </Button>
            </a>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDarkMode((v) => !v)}
              className="hover:scale-[1.02]"
            >
              {darkMode ? "Light" : "Dark"}
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center pt-10">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {profile.name}
          </motion.h1>
          <p className="mt-3 text-zinc-300 leading-relaxed">
            {profile.headline}
          </p>

          <Card className="mt-8">
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-line leading-relaxed text-[15.5px]">
                {profile.about}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  className="hover:scale-[1.02]"
                  onClick={() => {
                    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
                      "Opportunity for Aaditya Thaploo"
                    )}&body=${encodeURIComponent("Hi Aaditya,")}`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> {profile.email}
                </Button>

                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Button
                    variant="secondary"
                    className="hover:-translate-y-0.5"
                  >
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Button>
                </a>

                <a href={profile.resume} download>
                  <Button
                    variant="secondary"
                    className="hover:-translate-y-0.5"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Resume
                  </Button>
                </a>
              </div>

              <p className="mt-4 text-sm text-zinc-400">{profile.location}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl mt-10">
          <div className="flex flex-wrap gap-2 justify-center sticky top-14 z-20 py-3 backdrop-blur-sm bg-black/30 rounded-xl border border-zinc-800">
            {tabs.map((t) => {
              const isActive = active === t.key;
              return (
                <Button
                  key={t.key}
                  variant={isActive ? "primary" : "ghost"}
                  className={`px-4 ${isActive ? "" : "hover:bg-zinc-900/60"}`}
                  onClick={() => setActive(t.key)}
                >
                  {t.label}
                </Button>
              );
            })}
          </div>

          {/* Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {active === "projects" && (
                <motion.div
                  key="projects"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {projects.map((p, i) => (
                    <Card
                      key={i}
                      className="hover:-translate-y-0.5 transition"
                      onClick={() => openDetail("project", i)}
                    >
                      <CardContent>
                        <div className="text-lg font-semibold tracking-tight">
                          {p.title}
                        </div>

                        {/* chip row */}
                        {p.tags && p.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {p.tags.map((t, ti) => (
                              <span
                                key={ti}
                                className="px-2 py-0.5 text-[11px] rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-zinc-400 mt-3">Problem</p>
                        <p className="text-sm mt-1 line-clamp-3">{p.problem}</p>
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail("project", i);
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}

              {active === "experience" && (
                <motion.div
                  key="experience"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="grid md:grid-cols-2 gap-5"
                >
                  {experience.map((e, i) => (
                    <Card
                      key={i}
                      className="hover:-translate-y-0.5 transition"
                      onClick={() => openDetail("experience", i)}
                    >
                      <CardContent>
                        <div className="font-semibold text-lg tracking-tight">
                          {e.role}
                        </div>
                        <div className="text-sm text-zinc-300">
                          {e.company}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {e.dates} • {e.location}
                        </div>

                        <p className="text-xs text-zinc-400 mt-3">Problem</p>
                        <p className="text-sm mt-1 line-clamp-3">{e.problem}</p>

                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              openDetail("experience", i);
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}

              {active === "skills" && (
                <motion.div
                  key="skills"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap gap-2 justify-center"
                >
                  {skills.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => openDetail("skill", undefined, s)}
                      className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-sm hover:-translate-y-0.5 hover:border-zinc-500 transition"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              {active === "education" && (
                <motion.div
                  key="education"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 gap-5"
                >
                  {education.map((ed, i) => (
                    <Card
                      key={i}
                      className="hover:-translate-y-0.5 transition"
                      onClick={() => openDetail("education", i)}
                    >
                      <CardContent>
                        <div className="font-semibold text-lg tracking-tight">
                          {ed.school}
                        </div>
                        <div className="text-sm text-zinc-300">
                          {ed.degree}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {ed.dates}
                        </div>
                        {ed.details && (
                          <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-3">
                            {ed.details}
                          </p>
                        )}
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              openDetail("education", i);
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}

              {active === "honors" && (
                <motion.div
                  key="honors"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="grid gap-5"
                >
                  {honors.map((h, i) => (
                    <Card
                      key={i}
                      className="hover:-translate-y-0.5 transition"
                      onClick={() => openDetail("honor", i)}
                    >
                      <CardContent>
                        <div className="font-semibold text-lg tracking-tight">
                          {h.title}
                        </div>
                        <div className="text-xs text-zinc-400">{h.org}</div>

                        {Array.isArray(h.desc) ? (
                          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed space-y-1">
                            {h.desc.map((d, j) => (
                              <li key={j} className="line-clamp-2">
                                {d}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                            {h.desc}
                          </p>
                        )}

                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              openDetail("honor", i);
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}

              {active === "certifications" && (
                <motion.div
                  key="certifications"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {certifications.map((c, i) => (
                    <Card
                      key={i}
                      className="hover:-translate-y-0.5 transition"
                      onClick={() => openDetail("certification", i)}
                    >
                      <CardContent>
                        <div className="font-semibold text-lg tracking-tight">
                          {c.title}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {c.org}
                          {c.date ? ` • ${c.date}` : ""}
                          {c.credentialId ? ` • ID: ${c.credentialId}` : ""}
                        </div>

                        {c.tags && c.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {c.tags.map((t, ti) => (
                              <span
                                key={ti}
                                className="px-2 py-0.5 text-[11px] rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {Array.isArray(c.desc) ? (
                          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed space-y-1">
                            {c.desc.slice(0, 3).map((d, j) => (
                              <li key={j} className="line-clamp-2">
                                {d}
                              </li>
                            ))}
                          </ul>
                        ) : c.desc ? (
                          <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                            {c.desc}
                          </p>
                        ) : null}

                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              openDetail("certification", i);
                            }}
                          >
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-4 py-14 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>

      {/* Modal */}
      <FocusView
        open={!!focusContent}
        onClose={closeDetail}
        title={focusContent?.title || ""}
        subtitle={focusContent?.subtitle}
        meta={focusContent?.meta}
        body={focusContent?.body}
        tags={focusContent?.tags}
      />
    </div>
  );
}
