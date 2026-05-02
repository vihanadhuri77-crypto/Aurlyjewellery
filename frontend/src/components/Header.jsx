import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";

const collections = [
  { slug: "studs", name: "Studs" },
  { slug: "earrings", name: "Earrings" },
  { slug: "rings", name: "Rings" },
  { slug: "necklaces", name: "Necklaces" },
  { slug: "bracelets", name: "Bracelets" },
  { slug: "bridal", name: "Bridal" },
];

const allCollections = [
  { slug: "studs", name: "Studs" },
  { slug: "earrings", name: "Earrings" },
  { slug: "rings", name: "Rings" },
  { slug: "lockets", name: "Lockets" },
  { slug: "necklaces", name: "Necklaces" },
  { slug: "bracelets", name: "Bracelets" },
  { slug: "accessories", name: "Accessories" },
  { slug: "bridal", name: "Bridal" },
];

export default function Header() {
  const { setCartOpen, setWishlistOpen, itemCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const left = collections.slice(0, 3);
  const right = collections.slice(3);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-all border-b border-[#EAE5DC] bg-[#FAF9F5]/90 backdrop-blur-xl ${scrolled ? "py-3" : "py-4"}`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-[auto_1fr_auto] lg:grid-cols-3 items-center gap-6">
        {/* LEFT: mobile menu + desktop nav */}
        <div className="flex items-center gap-7">
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <nav className="hidden lg:flex items-center gap-7" data-testid="primary-nav">
            {left.map((c) => (
              <NavLink
                key={c.slug}
                data-testid={`nav-${c.slug}`}
                to={`/collections/${c.slug}`}
                className={({ isActive }) =>
                  `text-[11.5px] font-medium tracking-[0.2em] uppercase link-reveal ${isActive ? "text-[#B89758]" : "text-[#1A1918]"}`
                }
              >
                {c.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* CENTER: logo */}
        <Link to="/" data-testid="brand-logo" className="font-serif-display text-[22px] md:text-[26px] tracking-[0.42em] text-[#1A1918] text-center justify-self-center">
          CENTLY
        </Link>

        {/* RIGHT: nav + actions */}
        <div className="flex items-center justify-end gap-7">
          <nav className="hidden lg:flex items-center gap-7">
            {right.map((c) => (
              <NavLink
                key={c.slug}
                data-testid={`nav-${c.slug}`}
                to={`/collections/${c.slug}`}
                className={({ isActive }) =>
                  `text-[11.5px] font-medium tracking-[0.2em] uppercase link-reveal ${isActive ? "text-[#B89758]" : "text-[#1A1918]"}`
                }
              >
                {c.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4 md:gap-5 lg:border-l lg:border-[#EAE5DC] lg:pl-6">
            <Link to="/journal" data-testid="nav-journal" className="hidden md:inline-block text-[11.5px] font-medium tracking-[0.2em] uppercase link-reveal">
              Journal
            </Link>
            <button data-testid="open-wishlist" onClick={() => setWishlistOpen(true)} className="relative" aria-label="Wishlist">
              <Heart size={19} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span data-testid="wishlist-count" className="absolute -top-1.5 -right-2 text-[9px] bg-[#1A1918] text-[#FAF9F5] rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </button>
            <button data-testid="open-cart" onClick={() => setCartOpen(true)} className="relative" aria-label="Cart">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span data-testid="cart-count" className="absolute -top-1.5 -right-2 text-[9px] bg-[#B89758] text-[#FAF9F5] rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col px-6 py-5 overflow-y-auto"
            data-testid="mobile-drawer"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif-display text-xl tracking-[0.42em]">CENTLY</span>
              <button data-testid="mobile-menu-close" onClick={() => setMobileOpen(false)}><X size={22} strokeWidth={1.5} /></button>
            </div>
            <nav className="mt-12 flex flex-col gap-1">
              {allCollections.map((c) => (
                <Link
                  key={c.slug}
                  data-testid={`mobile-nav-${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  to={`/collections/${c.slug}`}
                  className="font-serif-display text-3xl py-3 border-b border-[#EAE5DC]"
                >
                  {c.name}
                </Link>
              ))}
              <Link onClick={() => setMobileOpen(false)} to="/journal" className="font-serif-display text-3xl py-3 border-b border-[#EAE5DC]">Journal</Link>
              <Link onClick={() => setMobileOpen(false)} to="/about" className="font-serif-display text-3xl py-3 border-b border-[#EAE5DC]">About</Link>
              <Link onClick={() => setMobileOpen(false)} to="/contact" className="font-serif-display text-3xl py-3 border-b border-[#EAE5DC]">Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
