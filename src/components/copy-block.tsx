"use client";

import { useState } from "react";

export function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative mt-3">
      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 pr-28 text-sm leading-relaxed text-slate-100">
        {code}
      </pre>
      <button
        onClick={() => void copy()}
        className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
          copied ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-100 hover:bg-slate-600"
        }`}
      >
        {copied ? "✓ Copiado" : "Copiar"}
      </button>
    </div>
  );
}
