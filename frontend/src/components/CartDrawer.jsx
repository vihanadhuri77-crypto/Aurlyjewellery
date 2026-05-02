import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatINR } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal } = useStore();
  const navigate = useNavigate();
  const remaining = Math.max(0, 2999 - subtotal);

  const checkout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1A1918]/40 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
            data-testid="cart-overlay"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FAF9F5] z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between px-7 py-6 border-b border-[#EAE5DC]">
              <h2 className="font-serif-display text-2xl font-medium">Your Cart</h2>
              <button data-testid="close-cart" onClick={() => setCartOpen(false)} aria-label="Close">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
                <p className="font-serif-display text-2xl text-[#1A1918] leading-tight max-w-[320px]">
                  Your VVS diamond collection starts here.
                </p>
                <button
                  data-testid="cart-shop-cta"
                  onClick={() => { setCartOpen(false); navigate("/collections/studs"); }}
                  className="mt-8 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1A1918] border-b border-[#1A1918] pb-1"
                >
                  Browse the Collection
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-7 py-5">
                  {remaining > 0 ? (
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#5E5950] mb-5 pb-5 border-b border-[#EAE5DC]">
                      You are <span className="text-[#B89758]">{formatINR(remaining)}</span> away from free insured shipping.
                    </div>
                  ) : (
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#4A6E53] mb-5 pb-5 border-b border-[#EAE5DC]">
                      ✦ Free insured shipping unlocked
                    </div>
                  )}

                  <ul className="space-y-6">
                    {cart.map((item) => {
                      const key = item.lineKey || item.id;
                      return (
                      <li key={key} data-testid={`cart-item-${item.slug}`} className="flex gap-4">
                        <div className="w-24 h-28 bg-[#F3F1EC] flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <Link to={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="font-serif-display text-lg leading-tight">{item.name}</Link>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#5E5950] mt-1">VVS · 9ct Gold</p>
                          {item.engraving && (
                            <p className="text-[11px] text-[#B89758] mt-1 font-serif-display italic">Engraving: "{item.engraving}"</p>
                          )}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="inline-flex items-center border border-[#EAE5DC]">
                              <button data-testid={`qty-decr-${item.slug}`} onClick={() => updateQty(key, item.qty - 1)} className="px-2 py-1.5"><Minus size={12} strokeWidth={1.5}/></button>
                              <span className="px-3 text-sm">{item.qty}</span>
                              <button data-testid={`qty-incr-${item.slug}`} onClick={() => updateQty(key, item.qty + 1)} className="px-2 py-1.5"><Plus size={12} strokeWidth={1.5}/></button>
                            </div>
                            <p className="text-sm">{formatINR(item.price * item.qty)}</p>
                          </div>
                        </div>
                        <button data-testid={`cart-remove-${item.slug}`} onClick={() => removeFromCart(key)} className="text-[#5E5950] hover:text-[#1A1918] self-start">
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="px-7 py-6 border-t border-[#EAE5DC] bg-[#F3F1EC]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[#5E5950]">Subtotal</span>
                    <span data-testid="cart-subtotal" className="font-serif-display text-2xl">{formatINR(subtotal)}</span>
                  </div>
                  <p className="text-[11px] text-[#5E5950] leading-relaxed mb-5">
                    BIS Hallmarked gold · VVS certified diamonds · Insured · Dispatched within 24 hours.
                  </p>
                  <button
                    data-testid="cart-checkout-btn"
                    onClick={checkout}
                    className="w-full bg-[#1A1918] text-[#FAF9F5] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
