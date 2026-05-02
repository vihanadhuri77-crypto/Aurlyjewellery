import React from "react";

export default function About() {
  return (
    <div data-testid="page-about">
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
        <p className="overline mb-5">About Cently</p>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
          Built for the Woman Who Wants Real <span className="italic">— Every Single Day.</span>
        </h1>
      </section>

      <section className="max-w-[860px] mx-auto px-6 md:px-12 pb-24 space-y-7 text-[#1A1918]/85 font-light leading-relaxed text-lg">
        <p>We built Cently around a simple belief — that the finest diamonds should not be saved for special occasions.</p>
        <p>Too often, jewellery is either too precious to wear daily or not real enough to last. We wanted something better. So we built Cently around clarity — real diamonds, real gold, and honest design.</p>
        <p>Every piece is made using certified natural diamonds of VVS clarity and E–F colour, set in solid 9ct gold. No unnecessary markups. No hidden grading. No compromises. What you see is exactly what you get — and the certificate inside your box confirms every word of it.</p>
        <p className="font-serif-display italic text-2xl text-[#1A1918]">This is Cently. Real jewellery for real life.</p>
      </section>

      <section className="bg-[#F3F1EC] py-24 md:py-32">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <p className="overline mb-4">Our four standards</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight max-w-2xl mb-14">One standard. Always.</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {t: "Near-Flawless Diamonds", b: "VVS clarity — inclusions invisible to the naked eye, detectable only under magnification by a trained gemologist. Our standard on every piece, at every price."},
              {t: "Colourless. Always.", b: "E–F colour — the colourless tier. Pure, brilliant white in any light, any setting, any outfit. Not G, not H. Always E or F."},
              {t: "Certified & Transparent", b: "Every diamond piece comes with an independent GIA, IGI, or SGL certificate confirming carat weight, clarity, colour, and conflict-free origin."},
              {t: "Solid Gold. Hallmarked.", b: "Every piece is solid 9ct gold — BIS Hallmarked by the Government of India. Not plated. Not filled. Real."},
            ].map((s, i) => (
              <div key={i} className="border-t border-[#1A1918] pt-6">
                <h3 className="font-serif-display text-2xl md:text-3xl font-medium">{s.t}</h3>
                <p className="mt-3 text-[#5E5950] leading-relaxed font-light">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <p className="overline mb-4">Why 9ct gold</p>
        <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-8">9ct gold is the most durable form of real gold for daily wear.</h2>
        <p className="text-[#5E5950] font-light leading-relaxed max-w-2xl">Harder than 18ct or 22ct. More scratch-resistant. Built to hold VVS diamonds securely for a lifetime. Real gold that fits real life.</p>

        <div className="mt-12 overflow-x-auto border border-[#EAE5DC]">
          <table className="w-full text-sm" data-testid="gold-comparison-table">
            <thead className="bg-[#F3F1EC]">
              <tr className="text-left">
                <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]"></th>
                <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">9ct</th>
                <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">18ct</th>
                <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">22ct</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Gold Purity", "37.5%", "75%", "91.6%"],
                ["Daily Wear", "Ideal", "Good", "Delicate"],
                ["Scratch Resistance", "High", "Moderate", "Low"],
                ["Stone Security", "Excellent", "Very Good", "Moderate"],
                ["BIS Hallmarked", "Yes", "Yes", "Yes"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-[#EAE5DC]">
                  {row.map((c, j) => (
                    <td key={j} className={`px-5 py-4 ${j === 0 ? "text-[11px] uppercase tracking-[0.2em] text-[#5E5950]" : "font-serif-display text-lg"}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
