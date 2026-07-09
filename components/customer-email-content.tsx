"use client";

import { draft } from "@/lib/seed";
import { clientConfig } from "@/lib/client-config";

type EmailScale = "desktop" | "phone" | "phone-compact";

const scaleStyles: Record<
  EmailScale,
  {
    hero: string;
    badge: string;
    brand: string;
    preheader: string;
    body: string;
    greeting: string;
    productBox: string;
    productEmoji: string;
    price: string;
    wasPrice: string;
    terms: string;
    cta: string;
    legal: string;
    urgency: string;
  }
> = {
  desktop: {
    hero: "h-36",
    badge: "top-3 right-3 px-2.5 py-1 text-[10px]",
    brand: "text-xs",
    preheader: "text-sm",
    body: "text-sm leading-relaxed",
    greeting: "text-sm",
    productBox: "h-20 w-14",
    productEmoji: "text-3xl",
    price: "text-3xl",
    wasPrice: "text-sm",
    terms: "text-xs",
    cta: "py-3 text-sm",
    legal: "text-[11px]",
    urgency: "text-[11px] px-3 py-1.5",
  },
  phone: {
    hero: "h-24",
    badge: "top-2 right-2 px-1.5 py-0.5 text-[8px]",
    brand: "text-[9px]",
    preheader: "text-[10px]",
    body: "text-[11px] leading-relaxed",
    greeting: "text-[11px]",
    productBox: "h-12 w-9",
    productEmoji: "text-lg",
    price: "text-xl",
    wasPrice: "text-[10px]",
    terms: "text-[9px]",
    cta: "py-2 text-[11px]",
    legal: "text-[9px]",
    urgency: "text-[9px] px-2 py-1",
  },
  "phone-compact": {
    hero: "h-16",
    badge: "top-1.5 right-1.5 px-1 py-0.5 text-[7px]",
    brand: "text-[8px]",
    preheader: "text-[8px]",
    body: "text-[8px] leading-relaxed",
    greeting: "text-[8px]",
    productBox: "h-9 w-7",
    productEmoji: "text-sm",
    price: "text-sm",
    wasPrice: "text-[8px]",
    terms: "text-[7px]",
    cta: "py-1 text-[8px]",
    legal: "text-[7px]",
    urgency: "text-[7px] px-1.5 py-0.5",
  },
};

export function CustomerEmailContent({
  scale = "desktop",
  flaggedText,
  truncateBody = false,
}: {
  scale?: EmailScale;
  flaggedText?: string;
  truncateBody?: boolean;
}) {
  const s = scaleStyles[scale];
  const wasPrice = draft.offer.wasPrice;

  return (
    <>
      <div className={`relative overflow-hidden ${s.hero}`}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${clientConfig.brandPrimaryHex} 0%, #1d4ed8 45%, #dc2626 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        <span
          className={`absolute rounded-full bg-amber-300 font-bold uppercase tracking-wide text-amber-950 shadow-sm ${s.badge}`}
        >
          July 4
        </span>
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-lg border border-white/40 bg-white/95 shadow-lg ${s.productBox}`}
            >
              <span className={s.productEmoji} aria-hidden>
                🥜
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-4 py-3 text-white sm:px-6"
        style={{ backgroundColor: clientConfig.brandPrimaryHex }}
      >
        <p className={`font-medium uppercase tracking-widest opacity-80 ${s.brand}`}>
          {clientConfig.clientName}
        </p>
        <p className={`mt-0.5 opacity-95 ${s.preheader}`}>{draft.preheader}</p>
      </div>

      <div className={`space-y-3 px-4 py-4 text-slate-700 sm:space-y-4 sm:px-6 sm:py-5 ${s.body}`}>
        <p className={s.greeting}>{draft.greeting}</p>
        {draft.bodyBlocks.map((block) => {
          const isFlagged = flaggedText === block;
          const text =
            truncateBody && scale !== "desktop" ? `${block.slice(0, 48)}…` : block;
          return (
            <p
              key={block}
              className={
                isFlagged
                  ? "rounded bg-amber-50 px-2 py-1 ring-1 ring-amber-200"
                  : undefined
              }
            >
              {text}
            </p>
          );
        })}

        <div
          className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 font-semibold text-red-700 ring-1 ring-red-100 ${s.urgency}`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
          Ends July 6 · Limit 4 per household
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm">
          <div className="border-b border-slate-100 bg-white px-4 py-3 text-center sm:px-5">
            {wasPrice && (
              <p className={`text-slate-400 line-through ${s.wasPrice}`}>{wasPrice}</p>
            )}
            <p className={`font-bold tracking-tight text-slate-900 ${s.price}`}>
              {draft.offer.price}
            </p>
            <p className={`mt-0.5 text-slate-500 ${s.terms}`}>Family multipack · free pickup</p>
          </div>
          <div className="p-3 sm:p-4">
            <button
              type="button"
              className={`w-full rounded-lg font-semibold text-white shadow-md transition hover:brightness-110 ${s.cta}`}
              style={{ backgroundColor: clientConfig.brandPrimaryHex }}
            >
              {draft.ctaLabel}
            </button>
            <p className={`mt-2 text-center text-slate-400 ${s.terms}`}>{draft.offer.terms}</p>
          </div>
        </div>

        <p className={`border-t border-slate-100 pt-3 text-slate-400 ${s.legal}`}>
          {draft.legalLine.text}
        </p>
      </div>
    </>
  );
}
