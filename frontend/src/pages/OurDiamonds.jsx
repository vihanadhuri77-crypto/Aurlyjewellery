import React from "react";

export default function OurDiamonds() {
  return (
    <div data-testid="page-our-diamonds">
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <p className="overline mb-4">Our diamonds</p>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
          VVS Clarity. <span className="italic">E–F Colour.</span> On every piece.
        </h1>
      </section>

      <section className="bg-[#F3F1EC] py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-5">What is VVS?</h2>
            <p className="text-[#5E5950] font-light leading-relaxed">Very Very Slightly Included — near-flawless. Inclusions so microscopic they are invisible to the naked eye. Only detectable under 10x magnification by a trained gemologist. Every Cently diamond. Every price point.</p>
            <p className="mt-4 text-[#5E5950] font-light leading-relaxed">Most jewellery sold in India contains SI clarity — where inclusions are sometimes visible without magnification. Cently uses VVS clarity on every piece, always.</p>
          </div>
          <div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-5">What is E–F Colour?</h2>
            <p className="text-[#5E5950] font-light leading-relaxed">The colourless tier of the GIA scale. No yellow. No tint. Pure, icy-white brilliance in any light. Most Indian jewellery uses G–J colour. Cently uses only E and F.</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-6">The Certificate</h2>
        <p className="text-[#5E5950] font-light leading-relaxed max-w-3xl">Every diamond piece arrives with an independent certificate from GIA, IGI, or SGL — sealed inside your box. Your stone's carat weight, clarity grade, colour grade, and conflict-free status — confirmed. Verifiable. Yours forever.</p>

        <ul className="mt-10 grid md:grid-cols-2 gap-4 text-base">
          {["Natural. Earth-mined.", "VVS Clarity. E–F Colour.", "Independently Certified.", "Conflict-Free."].map((t) => (
            <li key={t} className="border-t border-[#1A1918] pt-4 flex gap-3"><span className="text-[#B89758]">◆</span>{t}</li>
          ))}
        </ul>
      </section>

      <section className="bg-[#1A1918] text-[#FAF9F5] py-24 md:py-32">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <p className="overline text-[#D4B882] mb-4">Diamond grade at every price</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-12">One standard. Always.</h2>
          <div className="overflow-x-auto border border-[#FAF9F5]/15">
            <table className="w-full text-sm" data-testid="diamond-grade-table">
              <thead>
                <tr className="text-left text-[#D4B882]">
                  <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Price Range</th>
                  <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Carat Weight</th>
                  <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Clarity</th>
                  <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Colour</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["₹1,999–₹3,999", "0.03–0.10ct", "VVS1/VVS2", "E or F"],
                  ["₹4,000–₹7,999", "0.08–0.20ct", "VVS1/VVS2", "E or F"],
                  ["₹8,000–₹14,999", "0.15–0.40ct", "VVS1/VVS2", "E or F"],
                  ["₹15,000–₹40,000", "0.30–3.00ct", "VVS1/VVS2", "E or F"],
                ].map((r, i) => (
                  <tr key={i} className="border-t border-[#FAF9F5]/10">
                    {r.map((c, j) => <td key={j} className="px-5 py-5 font-serif-display text-lg">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
