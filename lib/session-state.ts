import type { LifecycleState } from "./types";
import type { Role } from "./personas";

export const SESSION_KEY = "campaign-copilot-state";

export interface PersistedAppState {
  lifecycle: LifecycleState;
  paused: boolean;
  role: Role | null;
  briefApprovedInSlack: boolean;
  legalSent: boolean;
  legalApproved: boolean;
}

export function readSessionState(): Partial<PersistedAppState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Partial<PersistedAppState>) : {};
  } catch {
    return {};
  }
}

export function writeSessionState(state: PersistedAppState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

export function clearSessionState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
