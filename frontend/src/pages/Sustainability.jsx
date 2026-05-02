import React from "react";

export default function Sustainability() {
  return (
    <div data-testid="page-sustainability" className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <p className="overline mb-4">Sustainability & Ethics</p>
      <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
        Jewellery made with care. <span className="italic">Beyond the piece itself.</span>
      </h1>
      <div className="mt-12 space-y-6 text-[#1A1918]/85 font-light leading-relaxed text-lg max-w-3xl">
        <p>We believe jewellery made with care should extend that care beyond the piece itself.</p>
        <p>Every Cently diamond is conflict-free and sourced in full compliance with the Kimberley Process — a globally recognised framework ensuring diamonds are free from association with violence or exploitation. Our supply chain is fully traceable from origin to setting.</p>
        <p>We are committed to responsible manufacturing, minimal packaging waste, and doing business in a way we are genuinely proud of. Our packaging is recyclable. Our gold is sourced from verified ethical suppliers.</p>
        <p className="font-serif-display italic text-2xl text-[#1A1918]">We are not perfect yet. But we are deliberate — and we are always improving.</p>
      </div>
    </div>
  );
}
