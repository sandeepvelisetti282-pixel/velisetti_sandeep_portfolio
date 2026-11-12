"use client";

import { Bot, Pause, Play, Route } from "lucide-react";
import { useEffect, useState } from "react";
import { bus, requestTour, toggleAgents, togglePause } from "@/lib/bus";

export function Dock() {
  const [agents, setAgents] = useState(true);
  const [paused, setPaused] = useState(false);
  const [touring, setTouring] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAgents(document.documentElement.classList.contains("build-mode"));
      setPaused(document.documentElement.classList.contains("paused"));
      setTouring(bus.touring);
    };
    sync();
    window.addEventListener("pf", sync);
    return () => window.removeEventListener("pf", sync);
  }, []);

  const pauseDisabled = !agents && !touring;

  return (
    <div className="dock" role="toolbar" aria-label="Build controls">
      <button
        type="button"
        className="dock-btn"
        onClick={togglePause}
        disabled={pauseDisabled}
        aria-pressed={paused}
        title="Pause (P)"
      >
        {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        {paused ? "Resume" : "Pause"}
        <kbd>P</kbd>
      </button>
      <button
        type="button"
        className="dock-btn"
        onClick={toggleAgents}
        aria-pressed={agents}
        title="Agents (A)"
      >
        <Bot size={15} aria-hidden="true" />
        Agents
        <kbd>A</kbd>
      </button>
      <button type="button" className="dock-btn" onClick={requestTour} title="Tour (T)">
        <Route size={15} aria-hidden="true" />
        {touring ? "Stop" : "Tour"}
        <kbd>T</kbd>
      </button>
    </div>
  );
}
