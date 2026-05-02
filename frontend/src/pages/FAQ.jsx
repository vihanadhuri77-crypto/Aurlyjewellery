import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  {
    title: "About Our Diamonds",
    items: [
      ["Is it real gold?", "Yes. Every Cently piece is solid 9ct gold — BIS Hallmarked on every piece. Not plated. Not filled. Real gold, stamped and verified."],
      ["What are VVS diamonds?", "VVS — Very Very Slightly Included — is the near-flawless tier of the GIA clarity scale. Inclusions are invisible to the naked eye and detectable only under magnification by a trained gemologist. Cently uses VVS clarity on every piece."],
      ["What is E–F colour?", "The colourless tier of the GIA scale. Pure, brilliant white with no yellow tint in any light. Every Cently diamond is E or F colour — not G, not H. Always."],
      ["Do I receive a certificate?", "Yes. Every diamond piece comes with an independent certificate from GIA, IGI, or SGL confirming the carat weight, VVS clarity grade, E–F colour grade, and conflict-free origin. Sealed inside your box."],
      ["Are your diamonds natural?", "Yes. Every Cently diamond is a natural, earth-mined stone. Not lab-grown. Not simulated. Conflict-free and fully traceable."],
      ["Can I wear it every day?", "Yes. Every Cently piece is designed and tested for daily, uninterrupted wear."],
    ],
  },
  {
    title: "Orders & Delivery",
    items: [
      ["How long does delivery take?", "Standard across India: 5–7 business days. Express (2–3 days) available at checkout in select cities. Engraved and personalised pieces: 10–14 business days."],
      ["Is delivery insured?", "Yes. Every order is dispatched fully insured. Loss or damage in transit is replaced at no additional cost."],
      ["Do you offer free shipping?", "Complimentary insured shipping on all orders above ₹2,999. International delivery available to 50+ countries."],
      ["Can I track my order?", "Yes. A tracking link is sent by email the moment your order is dispatched."],
    ],
  },
  {
    title: "Returns & Aftercare",
    items: [
      ["Can I return my order?", "Yes. 15-day returns on unworn pieces in original condition with packaging and certificate enclosed. Engraved and bespoke pieces are not eligible."],
      ["What if my piece arrives damaged?", "Write to us at support@cently.com with your order number and a photograph within 48 hours. We resolve it immediately at no cost."],
      ["Do you offer jewellery cleaning?", "Yes — complimentary, for life. Send any Cently piece to us at any time for professional cleaning, stone inspection, and setting check."],
      ["Can pieces be engraved?", "Yes. Engraving available on lockets, rings, bracelets, and bangles. Complimentary on qualifying orders. Allow additional time for engraved pieces."],
      ["Do you ship internationally?", "Yes. Cently ships to 50+ countries. Rates calculated at checkout."],
    ],
  },
];

function Item({ q, a, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#EAE5DC]" data-testid={`faq-item-${idx}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left py-6 group">
        <span className="font-serif-display text-xl md:text-2xl pr-6">{q}</span>
        {open ? <Minus size={18} strokeWidth={1.5}/> : <Plus size={18} strokeWidth={1.5}/>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }} className="overflow-hidden"
          >
            <p className="pb-6 text-[#5E5950] font-light leading-relaxed max-w-3xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div data-testid="page-faq">
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <p className="overline mb-4">FAQ</p>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">Everything you might want to know.</h1>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 md:px-12 pb-32 space-y-20">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-6">{s.title}</h2>
            <div>
              {s.items.map(([q, a], i) => <Item key={q} q={q} a={a} idx={`${s.title}-${i}`} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
