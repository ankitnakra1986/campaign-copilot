"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, ListChecks, Brain, Sparkles } from "lucide-react";
import { clientConfig } from "@/lib/client-config";
import { useApp } from "@/lib/app-context";
import { personaForRole, type Role } from "@/lib/personas";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  match: (p: string) => boolean;
  roles: Role[];
};

// Each persona sees only their world. No more "Diane's Overview" showing up for Maria.
const items: NavItem[] = [
  {
    href: "/overview",
    label: "Overview",
    icon: LayoutDashboard,
    match: (p) => p === "/overview",
    roles: ["vp"],
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: Inbox,
    match: (p) => p.startsWith("/inbox") || p.startsWith("/campaign/"),
    roles: ["manager"],
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    icon: ListChecks,
    match: (p) => p === "/campaigns",
    roles: ["vp", "manager"],
  },
  {
    href: "/memory",
    label: "Memory",
    icon: Brain,
    match: (p) => p === "/memory",
    roles: ["vp", "manager"],
  },
];

export function NavRail() {
  const pathname = usePathname();
  const { role } = useApp();
  const effectiveRole: Role = role ?? "vp";
  const home = personaForRole(effectiveRole).landing;
  const visible = items.filter((i) => i.roles.includes(effectiveRole));

  return (
    <nav className="flex w-[76px] flex-col items-center gap-1 border-r border-slate-200 bg-white py-5">
      <Link
        href={home}
        aria-label="Campaign Copilot home"
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20"
      >
        <Sparkles size={20} />
      </Link>
      {visible.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`group relative flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10.5px] font-medium transition-all ${
              active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600" />
            )}
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </Link>
        );
      })}

      {/* Engine is shared; client config is what changes */}
      <div
        className="mt-auto flex flex-col items-center gap-0.5 px-1 text-center"
        title={`Campaign Copilot · configured for ${clientConfig.clientName}`}
      >
        <span className="text-[10px] font-semibold tracking-tight text-slate-400">
          Copilot
        </span>
        <span className="text-[8px] leading-tight text-slate-300">configured</span>
      </div>
    </nav>
  );
}
