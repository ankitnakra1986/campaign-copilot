"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { lifecycleConfigs } from "./seed";
import type { LifecycleConfig, LifecycleState } from "./types";
import type { Role } from "./personas";
import {
  clearSessionState,
  readSessionState,
  writeSessionState,
} from "./session-state";

interface AppState {
  lifecycle: LifecycleState;
  setLifecycle: (s: LifecycleState) => void;
  config: LifecycleConfig;
  paused: boolean;
  togglePaused: () => void;
  role: Role | null;
  setRole: (r: Role) => void;
  briefApprovedInSlack: boolean;
  approveBriefInSlack: () => void;
  legalSent: boolean;
  sendToLegal: () => void;
  legalApproved: boolean;
  approveLegal: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lifecycle, setLifecycle] = useState<LifecycleState>("month3");
  const [paused, setPaused] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [briefApprovedInSlack, setBriefApprovedInSlack] = useState(false);
  const [legalSent, setLegalSent] = useState(false);
  const [legalApproved, setLegalApproved] = useState(false);

  useEffect(() => {
    const saved = readSessionState();
    if (saved.lifecycle) setLifecycle(saved.lifecycle);
    if (saved.paused !== undefined) setPaused(saved.paused);
    if (saved.role !== undefined) setRole(saved.role);
    if (saved.briefApprovedInSlack !== undefined) {
      setBriefApprovedInSlack(saved.briefApprovedInSlack);
    }
    if (saved.legalSent !== undefined) setLegalSent(saved.legalSent);
    if (saved.legalApproved !== undefined) setLegalApproved(saved.legalApproved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeSessionState({
      lifecycle,
      paused,
      role,
      briefApprovedInSlack,
      legalSent,
      legalApproved,
    });
  }, [
    hydrated,
    lifecycle,
    paused,
    role,
    briefApprovedInSlack,
    legalSent,
    legalApproved,
  ]);

  const resetDemo = useCallback(() => {
    setLifecycle("month3");
    setPaused(false);
    setRole(null);
    setBriefApprovedInSlack(false);
    setLegalSent(false);
    setLegalApproved(false);
    clearSessionState();
  }, []);

  const value = useMemo<AppState>(
    () => ({
      lifecycle,
      setLifecycle,
      config: lifecycleConfigs[lifecycle],
      paused,
      togglePaused: () => setPaused((p) => !p),
      role,
      setRole,
      briefApprovedInSlack,
      approveBriefInSlack: () => {
        setBriefApprovedInSlack(true);
        setLegalSent(true);
      },
      legalSent,
      sendToLegal: () => setLegalSent(true),
      legalApproved,
      approveLegal: () => setLegalApproved(true),
      resetDemo,
    }),
    [
      lifecycle,
      paused,
      role,
      briefApprovedInSlack,
      legalSent,
      legalApproved,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
