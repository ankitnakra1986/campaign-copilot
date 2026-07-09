import Link from "next/link";
import { Home } from "lucide-react";

/** Always visible escape hatch — cold URL users won't feel lost. */
export function DemoHomeLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/welcome"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 ${className}`}
    >
      <Home size={13} /> Demo home
    </Link>
  );
}
