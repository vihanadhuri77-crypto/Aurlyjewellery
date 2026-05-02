import React from "react";

export default function SizeGuide() {
  return (
    <div data-testid="page-size-guide" className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <p className="overline mb-4">Size Guide</p>
      <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight mb-16">Find Your Perfect Fit.</h1>

      <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-6">Ring Size Guide</h2>
      <div className="overflow-x-auto border border-[#EAE5DC]">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F1EC]">
            <tr className="text-left">
              {["Indian Size", "US Size", "Diameter (mm)", "Circumference (mm)"].map((h) => (
                <th key={h} className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[["6","3","14.1","44.2"],["8","4","14.9","46.8"],["10","5","15.7","49.3"],["12","6","16.5","51.9"],["14","7","17.3","54.4"],["16","8","18.2","57.0"],["18","9","19.0","59.5"],["20","10","19.8","62.1"]].map((r, i) => (
              <tr key={i} className="border-t border-[#EAE5DC]">
                {r.map((c, j) => <td key={j} className="px-5 py-4 font-serif-display text-lg">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-16 mb-4">How to Measure at Home</h3>
      <p className="text-[#5E5950] leading-relaxed font-light max-w-2xl">Wrap a thin strip of paper around your finger at the widest point — usually just above the knuckle. Mark where the ends meet. Measure the length in millimetres and match to the circumference column above.</p>
      <p className="text-[#5E5950] leading-relaxed font-light max-w-2xl mt-3">Measure in the evening when fingers are slightly larger. If between sizes, go up for wider bands and down for slim bands.</p>

      <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-20 mb-6">Bracelet Size Guide</h2>
      <p className="text-[#5E5950] leading-relaxed font-light max-w-2xl mb-6">Measure around your wrist with a soft tape. Add 1cm for a comfortable fit, 1.5cm for a looser feel.</p>
      <div className="overflow-x-auto border border-[#EAE5DC] max-w-md">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F1EC]">
            <tr className="text-left">
              <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Wrist</th>
              <th className="px-5 py-4 font-medium uppercase tracking-[0.2em] text-[10px]">Size</th>
            </tr>
          </thead>
          <tbody>
            {[["Up to 14cm","XS"],["14–16cm","S"],["16–18cm","M"],["18–20cm","L"]].map((r, i) => (
              <tr key={i} className="border-t border-[#EAE5DC]">
                {r.map((c, j) => <td key={j} className="px-5 py-4 font-serif-display text-lg">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
