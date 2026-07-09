import type { Confidence } from "@/lib/types";

const styles: Record<Confidence, string> = {
  High: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-500 border-slate-200",
};

export function ConfidencePill({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles[confidence]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Confidence: {confidence}
    </span>
  );
}
