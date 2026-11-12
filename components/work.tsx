import { ArrowUpRight } from "lucide-react";
import { projects, workStats } from "@/lib/content";

export function Work() {
  return (
    <section className="section" id="work" data-section="work">
      <div className="wrap">
        <div className="work-head">
          <div>
            <p className="kicker" data-build="type">
              01 — Work
            </p>
            <h2 className="h-display" data-build="wipe">
              Work that ships
            </h2>
            <p className="lede" data-build="type">
              Two products: an AI wealth copilot and a multi-tenant task platform.
            </p>
          </div>
          <ul className="stat-row">
            {workStats.map((stat) => (
              <li key={stat.label} className="stat" data-build="pop">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="projects">
          {projects.map((project) => (
            <article key={project.name} className="project" data-build="pop">
              <p className="project-index">{project.index}</p>
              <div>
                <h3>{project.name}</h3>
                <p className="project-title">{project.title}</p>
                <ul className="points">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className="chips">
                  {project.tech.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="project-links">
                  <a className="btn btn-red" href={project.live} target="_blank" rel="noreferrer">
                    Live
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <a className="btn btn-ghost" href={project.code} target="_blank" rel="noreferrer">
                    Code
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
