"use client";

export type FriendRow = {
  label: string;
  body: string;
};

export function AgentFriendSummary({
  intro,
  rows,
}: {
  intro?: string;
  rows: FriendRow[];
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white px-4 py-3.5">
      {intro && (
        <p className="text-[14px] font-medium leading-snug text-slate-800">{intro}</p>
      )}
      <dl className={`grid gap-2.5 sm:grid-cols-2 ${intro ? "mt-3" : ""}`}>
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-[13px] leading-snug text-slate-700">{r.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
