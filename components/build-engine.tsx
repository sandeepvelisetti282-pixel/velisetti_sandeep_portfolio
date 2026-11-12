"use client";

import { useLayoutEffect } from "react";
import { bus, emit, requestTour, toggleAgents, togglePause } from "@/lib/bus";

const AGENTS = [
  { name: "Scout", color: "#ff3b2f" },
  { name: "Layout", color: "#7dd3fc" },
  { name: "Typeset", color: "#fbbf24" },
  { name: "Motion", color: "#bef264" },
  { name: "QA", color: "#fda4af" },
  { name: "Deploy", color: "#67e8f9" },
  { name: "Copy", color: "#fdba74" },
  { name: "Lint", color: "#e4e4e7" },
  { name: "Index", color: "#86efac" },
  { name: "Render", color: "#93c5fd" },
  { name: "Palette", color: "#f9a8d4" },
  { name: "Review", color: "#fde047" },
] as const;

type Cursor = {
  name: string;
  node: HTMLElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
  busy: boolean;
  enabled: boolean;
};

type Job = {
  el: HTMLElement;
  cursor: Cursor;
  wire: HTMLElement;
  kind: string;
  phase: "glide" | "box" | "reveal";
  phaseStart: number;
  dur: number;
  count: number;
  docX: number;
  docY: number;
  w: number;
  h: number;
  dead: boolean;
};

let tourWanted: boolean | null = null;

function readTourWanted() {
  if (tourWanted === null) {
    tourWanted = false;
    try {
      tourWanted = sessionStorage.getItem("portfolio-tour") === "1";
      if (tourWanted) sessionStorage.removeItem("portfolio-tour");
    } catch {
      tourWanted = false;
    }
  }
  return tourWanted;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function tourDistance(t: number) {
  const ease = 0.16;
  const v = 1 / (1 - ease);
  if (t < ease) {
    const u = t / ease;
    return (v * ease * u * u) / 2;
  }
  if (t > 1 - ease) {
    const u = (1 - t) / ease;
    return 1 - (v * ease * u * u) / 2;
  }
  return (v * ease) / 2 + v * (t - ease);
}

export function BuildEngine() {
  useLayoutEffect(() => {
    if (window.__agentsOn) document.documentElement.classList.add("build-mode");

    const cursors: Cursor[] = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]")).map(
      (node, index) => ({
        name: AGENTS[index]?.name ?? "Agent",
        node,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        busy: false,
        enabled: true,
      }),
    );
    const wires = Array.from(document.querySelectorAll<HTMLElement>("[data-wire]"));
    const queue: HTMLElement[] = [];
    const queued = new Set<HTMLElement>();
    const active: Job[] = [];
    const open = new Set<Element>();
    let last = performance.now();
    let raf = 0;
    let broken = false;
    let bootAt = performance.now();
    const bootMs = document.documentElement.classList.contains("build-mode") ? 1100 : 0;
    let booted = false;

    type Tour = {
      waiting: boolean;
      t0: number;
      duration: number;
      max: number;
      expected: number;
    };
    let tour: Tour | null = null;
    let ignoreScroll = 0;

    function cursorCount() {
      return window.matchMedia("(max-width: 760px)").matches ? 6 : 12;
    }

    function park(cursor: Cursor, index: number) {
      const n = Math.max(1, cursors.filter((item) => item.enabled).length);
      const enabledIndex = cursors.filter((item, i) => item.enabled && i <= index).length - 1;
      const slot = Math.max(0, enabledIndex);
      const pad = 78;
      const width = window.innerWidth;
      cursor.tx = pad + ((slot + 0.5) / n) * Math.max(40, width - pad * 2);
      cursor.ty = window.innerHeight - 78;
    }

    function syncCursors() {
      const count = cursorCount();
      cursors.forEach((cursor, index) => {
        cursor.enabled = index < count;
        cursor.node.classList.toggle("agent-off", !cursor.enabled);
        if (!cursor.busy) park(cursor, index);
      });
    }

    function place(cursor: Cursor) {
      cursor.node.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
      cursor.node.classList.toggle("flip", cursor.x > window.innerWidth - 150);
    }

    function revealInstant(el: HTMLElement) {
      if (el.dataset.full != null) el.textContent = el.dataset.full;
      el.classList.remove("is-building");
      el.classList.add("is-built");
      el.style.clipPath = "";
      el.style.opacity = "";
      el.style.transform = "";
    }

    function targetsOf(section: Element) {
      const nodes: HTMLElement[] = [];
      if (section instanceof HTMLElement && section.hasAttribute("data-build")) nodes.push(section);
      section.querySelectorAll<HTMLElement>("[data-build]").forEach((node) => nodes.push(node));
      return nodes;
    }

    function enqueueSection(section: Element, all = false) {
      targetsOf(section).forEach((el) => {
        if (el.classList.contains("is-built") || el.classList.contains("is-building") || queued.has(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) {
          revealInstant(el);
          return;
        }
        if (!all && rect.top > window.innerHeight * 0.98) return;
        queued.add(el);
        queue.push(el);
      });
    }

    function snapPast() {
      for (const job of active) {
        if (job.el.getBoundingClientRect().bottom < 0) cancelJob(job);
      }
      document.querySelectorAll<HTMLElement>("[data-build]:not(.is-built):not(.is-building)").forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) revealInstant(el);
      });
      for (let i = queue.length - 1; i >= 0; i -= 1) {
        if (queue[i].classList.contains("is-built")) {
          queued.delete(queue[i]);
          queue.splice(i, 1);
        }
      }
    }

    function placeWire(wire: HTMLElement, left: number, top: number, width: number, height: number) {
      wire.style.left = `${left}px`;
      wire.style.top = `${top}px`;
      wire.style.width = `${Math.max(width, 8)}px`;
      wire.style.height = `${Math.max(height, 8)}px`;
      wire.querySelector("em")?.classList.toggle("inside", top < 22);
    }

    function beginReveal(job: Job) {
      const el = job.el;
      el.classList.add("is-building");
      if (job.kind === "type" && !el.dataset.typed) {
        const text = el.textContent ?? "";
        el.dataset.full = text;
        el.replaceChildren();
        Array.from(text).forEach((char) => {
          const span = document.createElement("span");
          span.className = "ch";
          span.textContent = char;
          span.style.visibility = "hidden";
          el.appendChild(span);
        });
        const caret = document.createElement("span");
        caret.className = "caret";
        caret.setAttribute("aria-hidden", "true");
        el.appendChild(caret);
        el.dataset.typed = "1";
      }
      if (job.kind === "type") {
        job.count = el.querySelectorAll(".ch").length;
        job.dur = Math.min(2200, Math.max(360, job.count * 18));
      } else if (job.kind === "wipe") {
        job.dur = 760;
        el.style.clipPath = "inset(0 100% 0 0)";
      } else {
        job.dur = 460;
        el.style.opacity = "0";
        el.style.transform = "scale(0.94)";
      }
    }

    function applyReveal(job: Job, t: number) {
      const el = job.el;
      if (job.kind === "type") {
        const show = Math.floor(t * job.count);
        el.querySelectorAll<HTMLElement>(".ch").forEach((char, index) => {
          char.style.visibility = index < show ? "visible" : "hidden";
        });
        return;
      }
      if (job.kind === "wipe") {
        const p = easeInOutCubic(t);
        el.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
        return;
      }
      const p = easeOutBack(Math.min(1, t));
      el.style.opacity = String(Math.min(1, t * 1.35));
      el.style.transform = `scale(${0.94 + 0.06 * p})`;
    }

    function finish(job: Job) {
      const el = job.el;
      el.querySelectorAll<HTMLElement>(".ch").forEach((char) => {
        char.style.visibility = "visible";
      });
      el.querySelector(".caret")?.remove();
      el.style.clipPath = "";
      el.style.opacity = "";
      el.style.transform = "";
      el.classList.remove("is-building");
      el.classList.add("is-built");
      job.wire.classList.remove("on");
      job.cursor.busy = false;
      park(job.cursor, cursors.indexOf(job.cursor));
      job.dead = true;
    }

    function cancelJob(job: Job) {
      revealInstant(job.el);
      job.wire.classList.remove("on");
      job.cursor.busy = false;
      park(job.cursor, cursors.indexOf(job.cursor));
      job.dead = true;
    }

    function pump() {
      while (active.filter((job) => !job.dead).length < 6 && queue.length) {
        const el = queue.shift();
        if (!el) break;
        queued.delete(el);
        if (el.classList.contains("is-built") || el.classList.contains("is-building")) continue;
        const cursor = cursors.find((item) => item.enabled && !item.busy);
        const wire = wires.find((item) => !item.classList.contains("on"));
        if (!cursor || !wire) {
          queue.unshift(el);
          queued.add(el);
          break;
        }
        cursor.busy = true;
        const kind = el.dataset.build || "pop";
        const label = wire.querySelector("em");
        if (label) label.textContent = `${cursor.name} · ${kind}`;
        active.push({
          el,
          cursor,
          wire,
          kind,
          phase: "glide",
          phaseStart: performance.now(),
          dur: 480,
          count: 0,
          docX: 0,
          docY: 0,
          w: 0,
          h: 0,
          dead: false,
        });
      }
    }

    function stepJobs(now: number) {
      for (const job of active) {
        if (job.dead) continue;
        const rect = job.el.getBoundingClientRect();
        if (job.phase === "glide") {
          job.cursor.tx = rect.left;
          job.cursor.ty = rect.top;
          const dist = Math.hypot(job.cursor.x - rect.left, job.cursor.y - rect.top);
          if (dist < 16 || now - job.phaseStart > 1200) {
            job.phase = "box";
            job.phaseStart = now;
            job.wire.classList.add("on");
          }
        } else if (job.phase === "box") {
          const t = Math.min(1, (now - job.phaseStart) / 460);
          const u = easeInOutCubic(t);
          placeWire(job.wire, rect.left, rect.top, rect.width * u, rect.height * u);
          job.cursor.tx = rect.left + rect.width * u;
          job.cursor.ty = rect.top + rect.height * u;
          if (t >= 1) {
            job.docX = rect.left + window.scrollX;
            job.docY = rect.top + window.scrollY;
            job.w = rect.width;
            job.h = rect.height;
            job.phase = "reveal";
            job.phaseStart = now;
            beginReveal(job);
          }
        } else {
          const t = Math.min(1, (now - job.phaseStart) / job.dur);
          const left = job.docX - window.scrollX;
          const top = job.docY - window.scrollY;
          placeWire(job.wire, left, top, job.w, job.h);
          job.cursor.tx = left + job.w;
          job.cursor.ty = top + job.h;
          applyReveal(job, t);
          if (t >= 1) finish(job);
        }
      }
      for (let i = active.length - 1; i >= 0; i -= 1) {
        if (active[i].dead) active.splice(i, 1);
      }
    }

    function stepCursors(dt: number) {
      const k = 1 - Math.exp(-dt / 150);
      cursors.forEach((cursor, index) => {
        if (!cursor.enabled && !cursor.busy) return;
        if (!cursor.busy) park(cursor, index);
        cursor.x += (cursor.tx - cursor.x) * k;
        cursor.y += (cursor.ty - cursor.y) * k;
        place(cursor);
      });
    }

    function endTour() {
      tour = null;
      bus.touring = false;
      bus.stopTour = false;
      emit();
    }

    function stepTour(now: number) {
      if (!tour) return;
      if (tour.waiting) {
        const hero = document.querySelector('[data-section="hero"]');
        const pending = document.documentElement.classList.contains("build-mode")
          ? hero?.querySelector("[data-build]:not(.is-built)")
          : null;
        if (!pending) {
          tour.waiting = false;
          tour.t0 = now;
          tour.max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          tour.duration = Math.min(52000, Math.max(28000, tour.max * 16));
          tour.expected = 0;
          ignoreScroll = 4;
          window.scrollTo(0, 0);
        }
        return;
      }
      const t = Math.min(1, (now - tour.t0) / tour.duration);
      const y = tour.max * tourDistance(t);
      tour.expected = y;
      window.scrollTo(0, y);
      if (t >= 1) endTour();
    }

    function agentsOff() {
      bus.agentsOff = false;
      bus.paused = false;
      window.__agentsOn = false;
      document.documentElement.classList.remove("build-mode", "paused");
      active.forEach((job) => {
        job.wire.classList.remove("on");
        job.cursor.busy = false;
        job.dead = true;
      });
      active.length = 0;
      queue.length = 0;
      queued.clear();
      document.querySelectorAll<HTMLElement>("[data-build]").forEach(revealInstant);
      emit();
    }

    function boot() {
      if (booted) return;
      booted = true;
      document.documentElement.classList.add("booted");
      syncCursors();
      cursors.forEach((cursor, index) => {
        park(cursor, index);
        cursor.x = cursor.tx;
        cursor.y = cursor.ty + 30;
        place(cursor);
      });
      const hero = document.querySelector('[data-section="hero"]');
      const nav = document.querySelector('[data-section="nav"]');
      if (nav) {
        open.add(nav);
        enqueueSection(nav, true);
      }
      if (hero) {
        open.add(hero);
        enqueueSection(hero, true);
      }
      document.querySelectorAll<HTMLElement>("[data-section]").forEach((section) => {
        if (section.getBoundingClientRect().bottom < 0) {
          targetsOf(section).forEach(revealInstant);
        }
      });
      if (readTourWanted()) {
        bus.touring = true;
        tour = { waiting: true, t0: 0, duration: 32000, max: 0, expected: 0 };
        emit();
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          open.add(entry.target);
          enqueueSection(entry.target, entry.target.getAttribute("data-section") === "hero");
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: [0, 0.12, 0.25] },
    );
    document.querySelectorAll("[data-section]").forEach((section) => io.observe(section));

    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (event.key === "Escape" || (bus.touring && ["arrowdown", "arrowup", "pagedown", "pageup", "home", "end", " "].includes(key))) {
        if (bus.touring) {
          event.preventDefault();
          endTour();
        }
        return;
      }
      if (key === "p") {
        event.preventDefault();
        togglePause();
      } else if (key === "a") {
        event.preventDefault();
        toggleAgents();
      } else if (key === "t") {
        event.preventDefault();
        requestTour();
      }
    }

    function onScrollIntent() {
      if (bus.touring) endTour();
    }

    function onScroll() {
      if (ignoreScroll > 0) {
        ignoreScroll -= 1;
        return;
      }
      if (!tour || tour.waiting) return;
      if (Math.abs(window.scrollY - tour.expected) > 48) endTour();
    }

    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      if (bus.touring) endTour();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("resize", syncCursors);

    function frame(now: number) {
      const dt = Math.min(34, now - last);
      last = now;
      if (!broken) {
        try {
          if (!booted && now - bootAt >= bootMs) boot();
          if (bus.agentsOff) agentsOff();
          if (bus.stopTour) endTour();
          if (booted && document.documentElement.classList.contains("build-mode")) {
            snapPast();
            open.forEach((section) => {
              if (section.getAttribute("data-section") !== "hero") enqueueSection(section);
            });
            if (!bus.paused) {
              pump();
              stepJobs(now);
              stepCursors(dt);
            }
          }
          if (bus.touring && !bus.paused) stepTour(now);
        } catch (error) {
          broken = true;
          console.error(error);
          try {
            agentsOff();
          } catch {
            document.documentElement.classList.remove("build-mode");
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    syncCursors();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", syncCursors);
      document.querySelectorAll<HTMLElement>("[data-typed]").forEach((el) => {
        if (el.dataset.full != null) el.textContent = el.dataset.full;
        delete el.dataset.typed;
        delete el.dataset.full;
      });
      document.querySelectorAll<HTMLElement>(".is-building").forEach((el) => {
        el.classList.remove("is-building");
        el.style.clipPath = "";
        el.style.opacity = "";
        el.style.transform = "";
      });
    };
  }, []);

  return (
    <>
      {AGENTS.map((agent, index) => (
        <div key={agent.name} className="agent" data-cursor={index} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M5 2.5 L5 19.2 L9.4 14.8 L13.2 22 L16.2 20.6 L12.3 13.6 L19 13.2 Z"
              fill="#fff"
              stroke="#09090b"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
          </svg>
          <span className="tag" style={{ background: agent.color }}>
            <span className="bot">
              <span className="ant">
                <span className="bulb" style={{ animationDelay: `${index * 0.11}s` }} />
              </span>
              <span className="face">
                <span className="eye" style={{ animationDelay: `${index * 0.17}s` }} />
                <span className="eye" style={{ animationDelay: `${index * 0.17 + 0.08}s` }} />
              </span>
            </span>
            {agent.name}
          </span>
        </div>
      ))}
      {AGENTS.slice(0, 6).map((agent) => (
        <div key={`wire-${agent.name}`} className="wire" data-wire={agent.name} aria-hidden="true">
          <b className="tl" />
          <b className="tr" />
          <b className="bl" />
          <b className="br" />
          <em />
        </div>
      ))}
    </>
  );
}
