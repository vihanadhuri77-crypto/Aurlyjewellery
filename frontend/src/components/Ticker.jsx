import React from "react";
import Marquee from "react-fast-marquee";

const items = [
  "Solid 9ct Gold",
  "VVS Clarity",
  "E–F Colour",
  "Certified Natural Diamonds",
  "BIS Hallmarked",
  "Conflict-Free",
  "Free Shipping on Orders Above ₹2,999",
];

export default function Ticker() {
  return (
    <div data-testid="ticker-bar" className="bg-[#1A1918] text-[#FAF9F5]/90 py-2.5 border-b border-[#1A1918]">
      <Marquee speed={40} gradient={false} pauseOnHover>
        {items.concat(items).map((t, i) => (
          <span key={i} className="text-[10.5px] font-medium uppercase tracking-[0.28em] mx-10 inline-flex items-center">
            <span className="text-[#B89758] mr-3">✦</span>{t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
