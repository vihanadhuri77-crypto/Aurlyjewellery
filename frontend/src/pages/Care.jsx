import React from "react";

export default function Care() {
  const sections = [
    ["Cleaning", "Warm water and one drop of mild dish soap. Leave for five minutes, then clean gently with a soft brush around the setting. Rinse and pat dry with a soft cloth. Do not use toothpaste — it will scratch the gold surface."],
    ["Storage", "Store each piece separately in the provided pouch or box to prevent scratching. Fasten clasps on chains and bracelets before storing."],
    ["What to Avoid", "Remove before swimming in chlorinated water or the sea. Avoid applying perfume, hairspray, or body lotion directly to the skin where the piece sits."],
    ["Your Diamonds", "Clean the underside of stone settings regularly — grease collects there and reduces the light entering the stone. Check settings annually. If a prong appears lifted, bring it to us before wearing further."],
    ["Professional Cleaning", "Send any Cently piece to us at any time for professional cleaning, stone inspection, and setting check. Free. Always. For life."],
    ["Your Certificate", "Keep it safely — in a bank locker, fireproof safe, or with important documents. It is the permanent, internationally recognised record of your diamond's specifications. We recommend keeping a scanned copy as a digital backup."],
  ];

  return (
    <div data-testid="page-care" className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <p className="overline mb-4">Jewellery Care</p>
      <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
        Care for your Cently. <span className="italic">It will last a lifetime.</span>
      </h1>
      <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-14">
        {sections.map(([t, b]) => (
          <div key={t} className="border-t border-[#1A1918] pt-6">
            <h3 className="font-serif-display text-2xl md:text-3xl font-medium">{t}</h3>
            <p className="mt-3 text-[#5E5950] font-light leading-relaxed">{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
