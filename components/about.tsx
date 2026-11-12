import { about, principles, skillGroups } from "@/lib/content";

export function About() {
  return (
    <section className="section" id="about" data-section="about">
      <div className="wrap">
        <p className="kicker" data-build="type">
          04 — About
        </p>
        <h2 className="h-display" data-build="wipe">
          About
        </h2>
        <div className="about-copy">
          {about.map((paragraph) => (
            <p key={paragraph} className="lede about-p" data-build="type">
              {paragraph}
            </p>
          ))}
        </div>
        <h3 className="subhead" data-build="wipe">
          Skills
        </h3>
        <ul className="skills">
          {skillGroups.map((group) => (
            <li key={group.label} data-build="pop">
              <p>{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h3 className="subhead" data-build="wipe">
          Principles
        </h3>
        <ul className="principles">
          {principles.map((item) => (
            <li key={item.index} data-build="pop">
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
