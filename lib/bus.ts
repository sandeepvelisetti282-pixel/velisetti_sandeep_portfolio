export const bus = {
  paused: false,
  touring: false,
  stopTour: false,
  agentsOff: false,
};

export function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pf"));
  }
}

declare global {
  interface Window {
    __agentsOn?: boolean;
  }
}

export function togglePause() {
  const agents = document.documentElement.classList.contains("build-mode");
  if (!agents && !bus.touring) return;
  bus.paused = !bus.paused;
  document.documentElement.classList.toggle("paused", bus.paused);
  emit();
}

export function toggleAgents() {
  const on = document.documentElement.classList.contains("build-mode");
  try {
    localStorage.setItem("portfolio-agents", on ? "off" : "on");
  } catch {
    /* storage can be blocked */
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("agents");
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (on) {
    history.replaceState(null, "", next);
    bus.paused = false;
    document.documentElement.classList.remove("paused");
    bus.agentsOff = true;
    emit();
  } else {
    window.location.assign(next);
  }
}

export function requestTour() {
  if (bus.touring) {
    bus.stopTour = true;
    return;
  }
  try {
    sessionStorage.setItem("portfolio-tour", "1");
  } catch {
    /* ignore */
  }
  window.location.reload();
}
