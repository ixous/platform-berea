"use client";

import { useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";

type Bank = { bank?: string; account?: string; clabe?: string };

export function BankInfoCard({ banks }: { banks: Bank[] }) {
  const [copied, setCopied] = useState<null | string>(null);

  const handleCopy = async (key: string, value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const isSingle = banks.length === 1;

  return (
    <div
      className={`mx-auto grid w-full gap-6 ${
        isSingle ? "max-w-2xl grid-cols-1" : "max-w-4xl sm:grid-cols-2"
      }`}
    >
      {banks.map((b, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-3xl bg-section-navy shadow-xl"
        >
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-berea-gold to-transparent" />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Landmark className="h-7 w-7 text-berea-gold" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-berea-gold">
                  Banco
                </p>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {b.bank || "Cuenta bancaria"}
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {b.account && (
                <Field
                  label="Número de cuenta"
                  value={b.account}
                  copied={copied === `${i}-account`}
                  onCopy={() => handleCopy(`${i}-account`, b.account)}
                />
              )}
              {b.clabe && (
                <Field
                  label="CLABE"
                  value={b.clabe}
                  copied={copied === `${i}-clabe`}
                  onCopy={() => handleCopy(`${i}-clabe`, b.clabe)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-berea-gold/90">
          {label}
        </p>
        <p className="mt-0.5 break-all font-mono text-sm text-white sm:text-base">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copiar ${label}`}
        title={`Copiar ${label}`}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
          copied
            ? "bg-white/10 text-berea-gold ring-1 ring-berea-gold/30"
            : "bg-berea-gold text-white shadow-md shadow-berea-gold/20 hover:-translate-y-0.5 hover:bg-berea-gold/90"
        }`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
