import { tools } from "@/lib/content";

export function Stack() {
  const loop = [...tools, ...tools];
  return (
    <section className="section" id="stack" data-section="stack">
      <div className="wrap">
        <p className="kicker" data-build="type">
          02 — Stack
        </p>
        <h2 className="h-display" data-build="wipe">
          Stack
        </h2>
        <p className="lede" data-build="type">
          From Python and Next.js to LangChain, PostgreSQL, and Vercel.
        </p>
      </div>
      <div className="marquee" data-build="wipe">
        <div className="marquee-track">
          {loop.map((tool, index) => (
            <span className="tool" key={`${tool}-${index}`} aria-hidden={index >= tools.length}>
              <i aria-hidden="true" />
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
