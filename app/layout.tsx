import type { Metadata, Viewport } from "next";
import { Anton, Caveat_Brush, Geist, Geist_Mono } from "next/font/google";
import { BuildEngine } from "@/components/build-engine";
import { Dock } from "@/components/dock";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const caveat = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const bootScript = `(function(){try{var p=new URLSearchParams(location.search).get("agents");var s=localStorage.getItem("portfolio-agents");var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var on;if(p==="on")on=true;else if(p==="off")on=false;else if(s==="off")on=false;else if(s==="on")on=true;else on=!reduce;window.__agentsOn=on;if(on)document.documentElement.classList.add("build-mode");}catch(e){window.__agentsOn=true;document.documentElement.classList.add("build-mode");}})();`;

export const metadata: Metadata = {
  title: "Velisetti Sandeep — Portfolio",
  description:
    "B.Tech student in Hyderabad building full-stack web applications and AI systems with Next.js, TypeScript, Node.js, and Python. Seeking a software development internship.",
  authors: [{ name: "Velisetti Sandeep" }],
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script id="agents-boot" dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}>
        <div className="boot" id="boot" aria-hidden="true">
          <p className="boot-kicker">SYSTEM</p>
          <p className="boot-title">BOOT</p>
          <p className="boot-sub">Agents lining up</p>
          <div className="boot-bar">
            <span />
          </div>
        </div>
        {children}
        <Dock />
        <BuildEngine />
      </body>
    </html>
  );
}
