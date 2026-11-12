import { ArrowDown } from "lucide-react";
import { heroStats, profile } from "@/lib/content";

export function Hero() {
  return (
    <section className="hero" id="top" data-section="hero">
      <div className="hero-word">
        <span className="word-clip" data-build="wipe">
          <span className="metal">PORTFOLIO</span>
        </span>
      </div>
      <div className="figure" data-build="pop">
        <div className="glow" aria-hidden="true" />
        <img
          src="/headshot.png"
          alt="Velisetti Sandeep"
          width={824}
          height={1024}
          draggable={false}
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy">
        <div className="hero-left">
          <p className="brush" data-build="type">
            Hello, I&apos;m
          </p>
          <h1 className="name" data-build="wipe">
            {profile.first}
            <br />
            {profile.last}
          </h1>
          <p className="role" data-build="type">
            {profile.role}
          </p>
          <p className="bio" data-build="type">
            {profile.bio}
          </p>
          <a className="btn btn-red" href="#work" data-build="pop">
            View work
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <p className="based" data-build="type">
            Based in {profile.city}
          </p>
        </div>
        <div className="hero-gap" aria-hidden="true" />
        <ul className="hero-stats">
          {heroStats.map((stat) => (
            <li key={stat.label} className="stat" data-build="pop">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
