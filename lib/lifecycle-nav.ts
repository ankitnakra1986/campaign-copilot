import type { LifecycleState } from "./types";

export const LIFECYCLE_IMPACT_ID = "lifecycle-impact";

/** Scroll to the compounding chart when the user re-clicks the active lifecycle tab. */
export function scrollToLifecycleImpact() {
  document.getElementById(LIFECYCLE_IMPACT_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function handleLifecycleSelect(
  state: LifecycleState,
  current: LifecycleState,
  setLifecycle: (s: LifecycleState) => void,
  pathname: string,
) {
  if (state === current) {
    if (pathname === "/campaigns" || pathname === "/memory") {
      scrollToLifecycleImpact();
    }
    return;
  }
  setLifecycle(state);
}
