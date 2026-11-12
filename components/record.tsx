import { timeline } from "@/lib/content";

export function Record() {
  return (
    <section className="section" id="record" data-section="record">
      <div className="wrap">
        <p className="kicker" data-build="type">
          03 — Record
        </p>
        <h2 className="h-display" data-build="wipe">
          Record
        </h2>
        <p className="lede" data-build="type">
          A 9.8 CGPA, JEE Main, the Takeover Hackathon, and Build to Ship.
        </p>
        <ol className="time">
          {timeline.map((item) => (
            <li key={item.title} data-build="pop">
              <p className="when">{item.when}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.href ? (
                <a className="text-link" href={item.href} target="_blank" rel="noreferrer">
                  {item.hrefLabel}
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
