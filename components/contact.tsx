import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/lib/content";

export function Contact() {
  return (
    <section className="section" id="contact" data-section="contact">
      <div className="wrap">
        <p className="kicker" data-build="type">
          05 — Contact
        </p>
        <h2 className="h-display" data-build="wipe">
          Contact
        </h2>
        <p className="lede" data-build="type">
          Email or GitHub. I&apos;m seeking a software development internship.
        </p>
        <div className="contact-links">
          <a className="big-link" data-build="type" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="big-link" data-build="type" href={profile.github} target="_blank" rel="noreferrer">
            {profile.githubLabel}
          </a>
        </div>
        <div className="cta" data-build="pop">
          <p className="cta-kicker">Open to</p>
          <h3>Seeking a software development internship.</h3>
          <p>
            I want to apply full-stack and AI engineering skills to real-world products.
          </p>
          <div className="cta-actions">
            <a className="btn btn-dark" href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              Email me
            </a>
            <a className="btn btn-line" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <footer className="footer" data-build="pop">
          <p>Velisetti Sandeep · {profile.city}</p>
          <p>Seeking a software development internship</p>
          <p className="footer-links">
            <a className="text-link" href={`mailto:${profile.email}`}>
              Email
            </a>
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
