import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/newsletter", { email });
      toast.success(data.message || "Subscribed", { description: "Use code CENTLY10 at checkout." });
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="site-footer" className="bg-[#1A1918] text-[#FAF9F5] mt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <h3 className="font-serif-display text-4xl md:text-5xl font-light leading-[1.05] tracking-tight">
              The finest things,<br/>first.
            </h3>
            <p className="mt-5 text-sm font-light text-[#FAF9F5]/70 max-w-md leading-relaxed">
              New collections, exclusive offers, and diamond education — straight to your inbox before anyone else sees them.
            </p>
            <form onSubmit={subscribe} data-testid="footer-newsletter-form" className="mt-8 flex border-b border-[#FAF9F5]/30 max-w-md">
              <input
                data-testid="footer-newsletter-email"
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border-0 outline-none text-sm py-3 placeholder:text-[#FAF9F5]/40 text-[#FAF9F5]"
              />
              <button
                data-testid="footer-newsletter-submit"
                disabled={loading}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4B882] hover:text-[#FAF9F5] transition-colors px-2"
              >
                {loading ? "..." : "Join — 10% off"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2">
            <p className="overline mb-5 text-[#D4B882]">Shop</p>
            <ul className="space-y-3 text-sm text-[#FAF9F5]/80">
              <li><Link to="/collections/studs" className="link-reveal">Studs</Link></li>
              <li><Link to="/collections/earrings" className="link-reveal">Earrings</Link></li>
              <li><Link to="/collections/rings" className="link-reveal">Rings</Link></li>
              <li><Link to="/collections/necklaces" className="link-reveal">Necklaces</Link></li>
              <li><Link to="/collections/bracelets" className="link-reveal">Bracelets</Link></li>
              <li><Link to="/collections/bridal" className="link-reveal">Bridal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="overline mb-5 text-[#D4B882]">Cently</p>
            <ul className="space-y-3 text-sm text-[#FAF9F5]/80">
              <li><Link to="/about" className="link-reveal">About</Link></li>
              <li><Link to="/our-diamonds" className="link-reveal">Our Diamonds</Link></li>
              <li><Link to="/sustainability" className="link-reveal">Sustainability</Link></li>
              <li><Link to="/journal" className="link-reveal">Journal</Link></li>
              <li><Link to="/careers" className="link-reveal">Careers</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="overline mb-5 text-[#D4B882]">Care & Help</p>
            <ul className="space-y-3 text-sm text-[#FAF9F5]/80">
              <li><Link to="/size-guide" className="link-reveal">Size Guide</Link></li>
              <li><Link to="/care" className="link-reveal">Jewellery Care</Link></li>
              <li><Link to="/faq" className="link-reveal">FAQ</Link></li>
              <li><Link to="/contact" className="link-reveal">Contact</Link></li>
              <li><Link to="/legal/shipping" className="link-reveal">Shipping & Returns</Link></li>
              <li><Link to="/legal/terms" className="link-reveal">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[#FAF9F5]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-serif-display text-2xl tracking-[0.42em] text-[#D4B882]">CENTLY</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#FAF9F5]/50">
            © {new Date().getFullYear()} Cently · Real Diamonds. Real Gold. Every Day.
          </p>
          <div className="flex gap-5 text-[11px] uppercase tracking-[0.22em] text-[#FAF9F5]/50">
            <a href="#" className="link-reveal">Instagram</a>
            <a href="#" className="link-reveal">Pinterest</a>
            <a href="#" className="link-reveal">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
