import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
};

export default function Home() {
  const [bestsellers, setBestsellers] = useState([]);
  const [newsEmail, setNewsEmail] = useState("");

  useEffect(() => {
    api.get("/products?bestseller=true").then((r) => setBestsellers(r.data)).catch(() => {});
  }, []);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    try {
      const { data } = await api.post("/newsletter", { email: newsEmail });
      toast.success(data.message, { description: "Use code CENTLY10 at checkout." });
      setNewsEmail("");
    } catch {
      toast.error("Could not subscribe.");
    }
  };

  return (
    <div data-testid="page-home">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1589713680561-1d0b6945a582?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHdlYXJpbmclMjBmaW5lJTIwbWluaW1hbCUyMGdvbGQlMjBkaWFtb25kJTIwamV3ZWxyeSUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NzI2NTMxM3ww&ixlib=rb-4.1.0&q=85"
          alt="Woman wearing fine gold and diamond jewellery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/60 via-[#1A1918]/15 to-transparent" />
        <motion.div
          initial="hidden" animate="show" variants={fadeUp}
          className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-20 md:pb-28 text-[#FAF9F5]"
        >
          <p className="overline text-[#D4B882] mb-6 [text-shadow:_0_1px_8px_rgba(0,0,0,0.45)]">Real diamonds. Real gold. Every day.</p>
          <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[110px] font-light leading-[0.92] tracking-tight max-w-5xl">
            Wear It Every Day.<br/>
            <span className="italic font-light">Not Just Someday.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg font-light text-[#FAF9F5]/85 leading-relaxed">
            Certified natural diamonds in VVS clarity and E–F colour, set in solid 9ct gold.
            Crafted for the woman who wants fine jewellery that lives with her — not waiting in a box for the right occasion.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/collections/studs"
              data-testid="hero-cta-shop"
              className="inline-flex items-center gap-3 bg-[#FAF9F5] text-[#1A1918] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#D4B882] hover:text-[#1A1918] transition-colors"
            >
              Shop Now <ArrowRight size={14} strokeWidth={1.5}/>
            </Link>
            <Link
              to="/our-diamonds"
              data-testid="hero-cta-explore"
              className="inline-flex items-center gap-3 border border-[#FAF9F5]/70 text-[#FAF9F5] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#FAF9F5] hover:text-[#1A1918] transition-colors"
            >
              Our Diamonds
            </Link>
          </div>
        </motion.div>
      </section>

      {/* BRAND BELIEF */}
      <section className="py-24 md:py-32 max-w-[1100px] mx-auto px-6 md:px-12 text-center">
        <p className="overline mb-6">Cently believes</p>
        <p className="font-serif-display text-3xl md:text-5xl font-light leading-[1.15] tracking-tight">
          Fine jewellery should feel effortless. Something you reach for without thinking — to work, to coffee, to dinner, to <span className="italic">everything in between</span>.
        </p>
        <p className="mt-8 text-base text-[#5E5950] font-light leading-relaxed max-w-2xl mx-auto">
          At Cently, every piece is set with certified natural diamonds in VVS clarity and E–F colour, crafted in solid 9ct gold. No plating. No shortcuts. Just real jewellery, made for the life you actually live.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F3F1EC] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <p className="overline mb-4">How it works</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight max-w-2xl mb-16">Three considered steps. From browsing to wearing.</h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {n: "01", t: "Choose Your Piece", b: "Browse our collections and find the piece that feels like yours. Every item lists exact diamond specifications and gold details — no surprises."},
              {n: "02", t: "Place Your Order", b: "Checkout securely in under two minutes. Every order is fully insured from the moment it leaves us."},
              {n: "03", t: "Wear It Every Day", b: "Your piece arrives in Cently presentation packaging with the diamond certificate sealed inside. Put it on. Keep it on."},
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="border-t border-[#1A1918] pt-7"
                data-testid={`how-step-${s.n}`}
              >
                <p className="font-serif-display text-3xl text-[#B89758] italic">{s.n}</p>
                <h3 className="mt-4 font-serif-display text-2xl md:text-3xl font-medium">{s.t}</h3>
                <p className="mt-3 text-sm text-[#5E5950] font-light leading-relaxed">{s.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR PILLARS - Bento */}
      <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="overline mb-4">Our four standards</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">One standard. Always. Everywhere.</h2>
        </div>
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-7 md:row-span-2 bg-[#1A1918] text-[#FAF9F5] p-10 md:p-14 flex flex-col justify-end relative overflow-hidden min-h-[480px]">
            <img
              src="https://images.pexels.com/photos/30541177/pexels-photo-30541177.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200"
              alt="VVS Diamond" className="absolute inset-0 w-full h-full object-cover opacity-65"
            />
            <div className="relative z-10">
              <p className="overline text-[#D4B882] mb-4">Pillar 01</p>
              <h3 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">Near-Flawless Diamonds</h3>
              <p className="mt-4 text-sm md:text-base text-[#FAF9F5]/85 max-w-md font-light leading-relaxed">
                Every Cently diamond is VVS clarity — inclusions so minute they are invisible to the naked eye, detectable only under magnification by a trained gemologist.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#F3F1EC] p-10 md:p-12 flex flex-col justify-between min-h-[230px]">
            <p className="overline">Pillar 02</p>
            <div>
              <h3 className="font-serif-display text-3xl md:text-4xl font-light leading-tight">Colourless. Always.</h3>
              <p className="mt-3 text-sm text-[#5E5950] font-light leading-relaxed">
                E–F colour — the colourless tier of the GIA scale. No tint. No warmth. Just the full brilliance of a diamond that is exactly what it should be.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#EAE5DC] p-10 md:p-12 flex flex-col justify-between min-h-[230px]">
            <p className="overline">Pillar 03</p>
            <div>
              <h3 className="font-serif-display text-3xl md:text-4xl font-light leading-tight">Certified & Transparent</h3>
              <p className="mt-3 text-sm text-[#5E5950] font-light leading-relaxed">
                Every diamond piece comes with an independent certificate from GIA, IGI, or SGL — confirming clarity, colour, carat weight, and conflict-free origin.
              </p>
            </div>
          </div>

          <div className="md:col-span-12 bg-[#FAF9F5] border border-[#EAE5DC] p-10 md:p-14 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <p className="overline">Pillar 04</p>
              <h3 className="font-serif-display text-3xl md:text-4xl font-light leading-tight mt-2">Solid Gold. Hallmarked.</h3>
              <p className="mt-3 text-sm text-[#5E5950] font-light leading-relaxed max-w-2xl">
                Every Cently piece is crafted in solid 9ct gold — BIS Hallmarked and government-verified. Not plated. Not filled. Real gold, built to hold the finest diamonds and last a lifetime.
              </p>
            </div>
            <Link
              to="/our-diamonds"
              className="inline-flex items-center gap-3 border border-[#1A1918] text-[#1A1918] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#1A1918] hover:text-[#FAF9F5] transition-colors whitespace-nowrap"
            >Read Full Standard <ArrowRight size={14} strokeWidth={1.5}/></Link>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="overline mb-3">Bestsellers</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">Worn most. Loved most.</h2>
          </div>
          <Link to="/collections/studs" className="hidden md:inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] link-reveal">
            Shop All <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" data-testid="bestseller-grid">
          {bestsellers.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* COMPLETE THE LOOK */}
      <section className="bg-[#1A1918] text-[#FAF9F5] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1757033534539-0a0cead70908?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHw0fHxmaW5lJTIwZGlhbW9uZCUyMGdvbGQlMjByaW5nJTIwbmVja2xhY2UlMjBjbG9zZSUyMHVwfGVufDB8fHx8MTc3NzI2NTMxMnww&ixlib=rb-4.1.0&q=85"
              alt="Diamond gold layered necklace" className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="overline text-[#D4B882] mb-4">Complete the look</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-[1.05] tracking-tight">
              Some pieces are made to stand alone. Some are made to be <span className="italic">discovered together.</span>
            </h2>
            <p className="mt-6 text-[#FAF9F5]/80 font-light leading-relaxed">
              The Classic Stud pairs beautifully with the Diamond Hoop. The Solitaire Ring sits perfectly alongside a Plain Gold Stacking Band. The Tennis Bracelet and Gold Bangle — worn together — is one of the most considered wrist combinations in fine jewellery.
            </p>
            <p className="mt-4 text-[#FAF9F5]/80 font-light leading-relaxed">
              Build your collection one piece at a time. There is no wrong combination when the gold is real and the diamonds are certified.
            </p>
            <Link
              to="/collections/bracelets"
              className="mt-10 inline-flex items-center gap-3 bg-[#D4B882] text-[#1A1918] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#FAF9F5] transition-colors"
            >Explore Pairings <ArrowRight size={14} strokeWidth={1.5}/></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12">
        <p className="overline mb-4">Customer love</p>
        <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-16 max-w-3xl">From the women who wear Cently every day.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {q: "I wear my Cently studs every single day. My jeweller friend examined them and said the stones were exceptional. She didn't believe the price.", n: "Divya R.", c: "Mumbai"},
            {q: "Finally found jewellery I can wear daily without worrying. It still looks exactly as it did the day it arrived.", n: "Ananya S.", c: "Delhi"},
            {q: "The packaging alone made me emotional. Then I read the certificate. VVS1. E colour. I didn't expect something this real.", n: "Meera P.", c: "Hyderabad"},
            {q: "Clean, simple, and goes with everything. Put it on once — you won't want to take it off.", n: "Priya T.", c: "Bengaluru"},
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-t border-[#1A1918] pt-7"
              data-testid={`testimonial-${i}`}
            >
              <p className="text-[#B89758] tracking-[0.4em] text-xs">✦ ✦ ✦ ✦ ✦</p>
              <p className="mt-5 font-serif-display text-xl italic font-light leading-snug text-[#1A1918]">"{r.q}"</p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#5E5950]">— {r.n} · {r.c}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-[#F3F1EC] py-12">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10.5px] uppercase tracking-[0.22em] text-[#5E5950]">
          {["VVS Clarity", "E–F Colourless Grade", "GIA / IGI / SGL Certified", "Solid 9ct Gold", "BIS Hallmarked", "Conflict-Free", "15-Day Returns", "Lifetime Care"].map((t) => (
            <span key={t} className="inline-flex items-center"><span className="text-[#B89758] mr-2">✦</span>{t}</span>
          ))}
        </div>
      </section>

      {/* GIFT BANNER */}
      <section className="py-24 md:py-32 max-w-[1600px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[5/4] overflow-hidden">
          <img
            src="https://images.pexels.com/photos/30978810/pexels-photo-30978810.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200"
            alt="Luxury jewelry packaging" className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="overline mb-4">Gifting</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-[1.05] tracking-tight">
            The gift that gets <span className="italic">more beautiful</span> every year.
          </h2>
          <p className="mt-6 text-[#5E5950] font-light leading-relaxed max-w-lg">
            Real gold. VVS diamonds. A certificate inside the box. Every Cently piece arrives in premium, gift-ready packaging — no wrapping required.
            From studs to tennis bracelets, there is a piece for every person and every occasion.
          </p>
          <Link
            to="/gifting"
            className="mt-8 inline-flex items-center gap-3 bg-[#1A1918] text-[#FAF9F5] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors"
          >Find the Perfect Gift <ArrowRight size={14} strokeWidth={1.5}/></Link>
        </div>
      </section>

      {/* NEWSLETTER (centered) */}
      <section className="bg-[#EAE5DC] py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="overline mb-4">Newsletter</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-[1.05] tracking-tight">The finest things, first.</h2>
          <p className="mt-6 text-[#5E5950] font-light">New collections, exclusive offers, and diamond education — straight to your inbox.</p>
          <form onSubmit={subscribe} data-testid="home-newsletter-form" className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              data-testid="home-newsletter-email"
              type="email" required value={newsEmail} onChange={(e) => setNewsEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b-2 border-[#1A1918]/30 focus:border-[#1A1918] outline-none px-1 py-3 text-sm placeholder:text-[#5E5950]/60"
            />
            <button data-testid="home-newsletter-submit" className="bg-[#1A1918] text-[#FAF9F5] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors">
              Join — 10% off
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
