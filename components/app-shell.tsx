"use client";

import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { NavRail } from "./nav-rail";
import { TopBar } from "./top-bar";

function PausedBanner() {
  const { paused } = useApp();
  if (!paused) return null;
  return (
    <div className="flex items-center gap-2 bg-red-600 px-6 py-2 text-sm font-medium text-white">
      <AlertTriangle size={16} />
      All scheduled sends paused — use for a recall or PR crisis. Nothing ships until resumed.
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Onboarding + Slack inbox + legal are full-bleed — their own environments.
  if (
    pathname === "/welcome" ||
    pathname === "/inbox" ||
    pathname === "/setup" ||
    pathname === "/legal"
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <NavRail />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <PausedBanner />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-slate-100/40">
          {children}
        </main>
        <footer className="border-t border-slate-100 bg-white/60 px-6 py-2 text-center text-[11px] text-slate-400">
          Nothing invented · Nothing sent without you · Nothing kept once it&apos;s stale
        </footer>
      </div>
    </div>
  );
}
