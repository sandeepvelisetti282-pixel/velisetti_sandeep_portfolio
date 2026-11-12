const links = [
  ["Work", "#work"],
  ["Stack", "#stack"],
  ["Record", "#record"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

export function Nav() {
  return (
    <header className="nav" data-section="nav" data-build="pop">
      <a className="brand" href="#top">
        Sandeep
      </a>
      <nav className="nav-links" aria-label="Sections">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
