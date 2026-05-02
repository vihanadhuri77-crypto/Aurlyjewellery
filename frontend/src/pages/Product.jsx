import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { formatINR } from "../lib/api";
import { useStore } from "../context/StoreContext";
import { Heart, ShieldCheck, Truck, Award, RefreshCw, Plus, Minus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ENGRAVING_MAX = 20;

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");
  const [activeImg, setActiveImg] = useState(0);
  const [engravingOn, setEngravingOn] = useState(false);
  const [engraving, setEngraving] = useState("");
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  useEffect(() => {
    setProduct(null); setQty(1); setActiveImg(0); setEngravingOn(false); setEngraving("");
    api.get(`/products/${slug}`).then((r) => setProduct(r.data)).catch(() => setProduct(false));
  }, [slug]);

  if (product === null) {
    return <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24"><div className="aspect-[4/5] shimmer max-w-md" /></div>;
  }
  if (product === false) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif-display text-5xl mb-4">This page has stepped away.</h1>
        <p className="text-[#5E5950]">But your next VVS diamond piece has not.</p>
        <Link to="/collections/studs" className="mt-8 inline-block text-[11px] uppercase tracking-[0.22em] border-b border-[#1A1918] pb-1">Back to the Collection</Link>
      </div>
    );
  }

  const wished = isWishlisted(product.id);

  const onAdd = () => {
    const text = engravingOn ? engraving.trim().slice(0, ENGRAVING_MAX) : "";
    addToCart(product, qty, { engraving: text });
    toast.success("Added to cart", {
      description: `${product.name}${text ? ` · "${text}"` : ""} — ${formatINR(product.price * qty)}`,
    });
  };

  return (
    <div data-testid={`page-product-${product.slug}`} className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#5E5950] mb-8">
        <Link to="/" className="link-reveal">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/collections/${product.category}`} className="link-reveal capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1A1918]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 self-start">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="aspect-square lg:aspect-[4/5] bg-[#F3F1EC] overflow-hidden"
          >
            <img
              src={product.images[activeImg]}
              alt={`${product.name} view ${activeImg + 1}`}
              className="w-full h-full object-cover"
              data-testid="product-main-image"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2" data-testid="product-thumbnails">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  data-testid={`thumb-${i}`}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#1A1918]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {product.badges?.map((b) => (
              <span key={b} className="text-[10px] uppercase tracking-[0.22em] border border-[#1A1918] px-3 py-1.5">{b}</span>
            ))}
          </div>
          <h1 className="font-serif-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">{product.name}</h1>
          <p className="mt-4 font-serif-display italic text-2xl text-[#5E5950]">{formatINR(product.price)}</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#5E5950] mt-1">Inclusive of all taxes</p>

          <p className="mt-8 text-base text-[#1A1918]/85 leading-relaxed font-light">{product.description}</p>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[#EAE5DC] py-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Metal</p>
              <p className="mt-1 font-serif-display text-lg">{product.metal}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Diamond</p>
              <p className="mt-1 font-serif-display text-lg">VVS · {product.diamond_colour} Colour</p>
            </div>
            {product.carat_weight && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Carat Weight</p>
                <p className="mt-1 font-serif-display text-lg">{product.carat_weight}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Certification</p>
              <p className="mt-1 font-serif-display text-lg">{product.certification}</p>
            </div>
          </div>

          {/* Engraving block */}
          {product.engravable && (
            <div className="mt-8 border border-[#EAE5DC] bg-[#F3F1EC]/60 p-5" data-testid="engraving-block">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  data-testid="engraving-toggle"
                  type="checkbox"
                  checked={engravingOn}
                  onChange={(e) => setEngravingOn(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1918]"
                />
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1A1918]">
                  <Sparkles size={14} strokeWidth={1.5} className="text-[#B89758]" /> Add complimentary engraving
                </span>
              </label>
              {engravingOn && (
                <div className="mt-4">
                  <input
                    data-testid="engraving-input"
                    type="text"
                    maxLength={ENGRAVING_MAX}
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="A name, a date, an initial…"
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] focus:border-[#1A1918] outline-none px-4 py-3 text-base font-serif-display italic text-[#1A1918] placeholder:text-[#5E5950]/50"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Letters, numbers, ampersand. Adds 7–10 days to dispatch.</p>
                    <p className="text-[10px] tracking-[0.18em] text-[#5E5950]">{engraving.length} / {ENGRAVING_MAX}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border border-[#1A1918]">
              <button data-testid="qty-decr" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3"><Minus size={14} strokeWidth={1.5}/></button>
              <span data-testid="qty-value" className="px-5 text-sm">{qty}</span>
              <button data-testid="qty-incr" onClick={() => setQty((q) => q + 1)} className="px-3 py-3"><Plus size={14} strokeWidth={1.5}/></button>
            </div>
            <button
              data-testid="add-to-cart-btn"
              onClick={onAdd}
              className="flex-1 bg-[#1A1918] text-[#FAF9F5] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors"
            >Add to Cart · {formatINR(product.price * qty)}</button>
            <button
              data-testid="product-wishlist-toggle"
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 border flex items-center justify-center transition-colors ${wished ? "border-[#B89758] text-[#B89758]" : "border-[#1A1918] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#FAF9F5]"}`}
              aria-label="wishlist"
            ><Heart size={16} strokeWidth={1.5} fill={wished ? "#B89758" : "none"} /></button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase tracking-[0.2em] text-[#5E5950]">
            <div className="flex items-center gap-2"><ShieldCheck size={15} strokeWidth={1.5}/> Lifetime Care</div>
            <div className="flex items-center gap-2"><Truck size={15} strokeWidth={1.5}/> Insured Shipping</div>
            <div className="flex items-center gap-2"><Award size={15} strokeWidth={1.5}/> BIS Hallmarked</div>
            <div className="flex items-center gap-2"><RefreshCw size={15} strokeWidth={1.5}/> 15-Day Returns</div>
          </div>

          <div className="mt-12 border-t border-[#EAE5DC]">
            <div className="flex gap-8 mt-6">
              {[["details", "Details"], ["care", "Care"], ["sizing", "Size & Fit"]].map(([k, l]) => (
                <button
                  key={k}
                  data-testid={`tab-${k}`}
                  onClick={() => setTab(k)}
                  className={`text-[11px] uppercase tracking-[0.22em] pb-2 border-b ${tab === k ? "border-[#1A1918] text-[#1A1918]" : "border-transparent text-[#5E5950]"}`}
                >{l}</button>
              ))}
            </div>
            <div className="mt-6 text-sm text-[#5E5950] font-light leading-relaxed">
              {tab === "details" && (
                <p>Set with a certified natural VVS clarity, E–F colour diamond in solid 9ct gold. BIS Hallmarked. Conflict-free. Independent certificate enclosed.{product.engravable ? " Complimentary engraving available." : ""}</p>
              )}
              {tab === "care" && (
                <p>Clean gently with warm water and a soft brush. Store separately in the pouch provided. Avoid prolonged contact with perfume, chlorine, and harsh chemicals. Free professional cleaning, for life — at any Cently address.</p>
              )}
              {tab === "sizing" && (
                <p>Rings are available in sizes 4–13. Bracelets and bangles are adjustable. View the full <Link to="/size-guide" className="underline">size guide</Link> at checkout.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
