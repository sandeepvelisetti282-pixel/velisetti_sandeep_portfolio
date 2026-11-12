export const profile = {
  name: "Velisetti Sandeep",
  first: "Velisetti",
  last: "Sandeep",
  role: "Software Development Intern",
  city: "Hyderabad",
  email: "sandeepvelisetti282@gmail.com",
  github: "https://github.com/sandeepvelisetti282-pixel",
  githubLabel: "github.com/sandeepvelisetti282-pixel",
  bio: "B.Tech student building full-stack web apps and AI systems. REST APIs, RAG pipelines, and secure multi-tenant databases.",
};

export const heroStats = [
  { value: "9.8", label: "CGPA · B.Tech / 10" },
  { value: "97.7", label: "JEE Main percentile" },
  { value: "Finalist", label: "Takeover Hackathon · NxtWave" },
];

export const workStats = [
  { value: "2", label: "Projects" },
  { value: "RAG", label: "LangChain + Gemini" },
  { value: "RLS", label: "Multi-tenant Postgres" },
];

export const projects = [
  {
    index: "01",
    name: "AdvisorAI_IQ",
    title: "AI-Powered Wealth Management Copilot",
    code: "https://github.com/sandeepvelisetti282-pixel/AdvisorAI_IQ",
    live: "https://advisoriq-oda4.onrender.com/",
    points: [
      "Developed an AI-powered financial assistant using LangChain agents and Google Gemini to answer queries via retrieval-augmented generation and ChromaDB vector retrieval.",
      "Built a Random Forest transaction checker to identify suspicious transactions and integrated stock market data retrieval using yfinance.",
      "Implemented response guardrails and PII protection, evaluated faithfulness and relevancy using RAGAS, and integrated LangSmith for tracing.",
    ],
    tech: [
      "Python",
      "LangChain",
      "Google Gemini",
      "RAG",
      "ChromaDB",
      "Scikit-learn",
      "Random Forest",
      "Gradio",
      "RAGAS",
      "LangSmith",
      "yfinance",
    ],
  },
  {
    index: "02",
    name: "TaskFlow",
    title: "Full-Stack Multi-Tenant Task Management Platform",
    code: "https://github.com/sandeepvelisetti282-pixel/taskflow",
    live: "https://frontend-five-gray-fov6bldujd.vercel.app/",
    points: [
      "Developed a full-stack task management platform using Next.js and Node.js/Express.js REST APIs with task CRUD, filtering, searching, priority management, and assignments.",
      "Designed PostgreSQL database schemas with custom ENUM types, SQL triggers, and row level security.",
      "Implemented JWT authentication, permission-based multi-tenant access controls, and asynchronous email notifications for task updates.",
    ],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Supabase",
      "JWT",
    ],
  },
];

export const tools = [
  "Python",
  "TypeScript",
  "JavaScript",
  "C++",
  "SQL",
  "Next.js",
  "React.js",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Gradio",
  "Node.js",
  "Express.js",
  "REST APIs",
  "MVC Architecture",
  "JWT Authentication",
  "LangChain",
  "Google Gemini",
  "RAG",
  "Scikit-learn",
  "Random Forest",
  "RAGAS",
  "LangSmith",
  "yfinance",
  "PostgreSQL",
  "Supabase",
  "ChromaDB (Vector DB)",
  "Row Level Security (RLS)",
  "SQL Triggers",
  "Git",
  "GitHub",
  "Vercel",
  "Render",
  "Zoho Creator",
  "Deluge Scripting",
];

export const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C++", "SQL"],
  },
  {
    label: "Frontend",
    items: ["Next.js", "React.js", "HTML5", "CSS3", "Tailwind CSS", "Gradio"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "MVC Architecture", "JWT Authentication"],
  },
  {
    label: "AI & Machine Learning",
    items: [
      "LangChain",
      "Google Gemini",
      "RAG",
      "Scikit-learn",
      "Random Forest",
      "RAGAS",
      "LangSmith",
      "yfinance",
    ],
  },
  {
    label: "Databases",
    items: [
      "PostgreSQL",
      "Supabase",
      "ChromaDB (Vector DB)",
      "Row Level Security (RLS)",
      "SQL Triggers",
    ],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "GitHub", "Vercel", "Render", "Zoho Creator", "Deluge Scripting"],
  },
];

export type TimelineItem = {
  when: string;
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

export const timeline: TimelineItem[] = [
  {
    when: "Now",
    title: "Seeking a software development internship",
    body: "I want to apply full-stack and AI engineering skills to real-world products.",
  },
  {
    when: "2025–2029",
    title: "B.Tech · Chaitanya (Deemed to be University), Hyderabad",
    body: "NIAT Technology Program. CGPA 9.8 / 10.",
  },
  {
    when: "Hackathon",
    title: "Takeover Hackathon finalist · NxtWave",
    body: "Selected as a finalist in the Takeover Hackathon conducted by NxtWave. Certificate issued by NxtWave (NIAT).",
    href: "https://s3-ap-south-1.amazonaws.com/poster-generation-backend-nxtwave-media-static/misc/NIAT-HACKATHON-CER/9QLHSSWUIJ.png",
    hrefLabel: "View certificate",
  },
  {
    when: "Mentorship",
    title: "Build to Ship · technical mentorship",
    body: "Mentored participants through building and deploying a full-stack application end to end.",
    href: "https://drive.google.com/file/d/1qs8cxcJ9lt4qeZCRBXdfitEVJh3Df7v6/view?usp=drivesdk",
    hrefLabel: "View supporting file",
  },
  {
    when: "JEE Main",
    title: "97.7 percentile",
    body: "Secured 97.7 percentile in the JEE Main examination.",
  },
  {
    when: "2023–2025",
    title: "Intermediate (12th) · Lakshya International School",
    body: "84.6% (423/500).",
  },
  {
    when: "2022–2023",
    title: "Secondary school (10th) · Aditya High School",
    body: "89.5% (537/600).",
  },
  {
    when: "Practice",
    title: "Competitive programming · LeetCode",
    body: "Actively practices data structures and algorithms on LeetCode using C++ and Python.",
  },
];

export const principles = [
  {
    index: "01",
    title: "Ship the whole path",
    body: "In Build to Ship I mentored participants through building and deploying a full-stack application, end to end.",
  },
  {
    index: "02",
    title: "Access is part of the design",
    body: "TaskFlow uses JWT authentication, permission-based multi-tenant controls, and PostgreSQL row level security.",
  },
  {
    index: "03",
    title: "Measure the answer",
    body: "AdvisorAI_IQ uses response guardrails, PII protection, RAGAS faithfulness and relevancy, and LangSmith tracing.",
  },
  {
    index: "04",
    title: "Keep the fundamentals warm",
    body: "I practice data structures and algorithms on LeetCode in C++ and Python.",
  },
];

export const about = [
  "I'm a B.Tech student at Chaitanya (Deemed to be University), Hyderabad, in the NIAT Technology Program (2025–2029), with a 9.8 CGPA. I build full-stack web applications and AI-powered systems with Next.js, React.js, TypeScript, Node.js, Express.js, PostgreSQL, and Python.",
  "That work covers REST APIs, retrieval-augmented generation with LangChain and Google Gemini, and secure multi-tenant database architectures. I'm a Takeover Hackathon finalist with NxtWave, I mentored through Build to Ship, and I scored 97.7 percentile in JEE Main. I'm seeking a software development internship.",
];
