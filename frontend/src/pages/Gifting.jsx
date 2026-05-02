import React from "react";
import { Link } from "react-router-dom";
import { Gift, Heart, Calendar, Cake, Sparkles } from "lucide-react";

const occasions = [
  { icon: Cake, t: "For Her Birthday", b: "Give her something that does not age with her. A certified VVS diamond in real gold — a locket with her initials, a solitaire on her right hand, a bracelet she will still be wearing on every birthday after this one." },
  { icon: Heart, t: "For Your Anniversary", b: "A continuous circle of diamonds with no beginning and no end. Our eternity bands are named for what they mean — and made with VVS diamonds that will look exactly this beautiful every anniversary that follows." },
  { icon: Sparkles, t: "For a Daughter", b: "Her first piece of real gold jewellery is a moment she remembers for life. A VVS diamond stud, a gold locket, a midi ring — any of them will be the finest diamond she has ever received." },
  { icon: Gift, t: "For a Mother", b: "She has given everything. Give her something that asks nothing except to be worn and loved. A solid gold locket holding her children's photographs. A diamond pendant she reaches for every morning." },
  { icon: Calendar, t: "For a Best Friend", b: "The women who know us best deserve the pieces that reflect that knowledge. A VVS diamond bracelet. A hoop she puts in and never takes out." },
];

export default function Gifting() {
  return (
    <div data-testid="page-gifting">
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <p className="overline mb-4">Gifting</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight max-w-4xl">
            Give something that <span className="italic">never diminishes.</span>
          </h1>
          <p className="mt-8 text-[#5E5950] font-light leading-relaxed max-w-3xl text-lg">
            A gift of VVS diamonds in real gold is a permanent act — something given today that will still be worn, examined, and treasured decades from now. Every Cently gift arrives in premium presentation packaging with the diamond certificate sealed inside and a personalised message card if requested.
          </p>
        </div>
      </section>

      <section className="bg-[#F3F1EC] py-24 md:py-32">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-x-16 gap-y-14">
          {occasions.map(({ icon: Icon, t, b }) => (
            <div key={t} className="border-t border-[#1A1918] pt-7" data-testid={`gift-${t.replace(/\s/g, '-').toLowerCase()}`}>
              <Icon size={22} strokeWidth={1.2} className="text-[#B89758] mb-4" />
              <h3 className="font-serif-display text-3xl font-medium">{t}</h3>
              <p className="mt-3 text-[#5E5950] font-light leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
        <p className="overline mb-4">Gift cards</p>
        <h2 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight">The gift when you are not sure what to choose.</h2>
        <p className="mt-6 text-[#5E5950] font-light leading-relaxed">Cently gift cards are delivered digitally — instantly, beautifully, and ready to use on any piece in the collection. Real gold. VVS diamonds. Her choice.</p>
        <Link to="/contact" className="mt-10 inline-block bg-[#1A1918] text-[#FAF9F5] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors">Request a Gift Card</Link>
        <p className="mt-6 text-xs text-[#5E5950]">Gift cards valid 12 months from purchase. Non-refundable. Redeemable on all Cently products at checkout.</p>
      </section>
    </div>
  );
}
