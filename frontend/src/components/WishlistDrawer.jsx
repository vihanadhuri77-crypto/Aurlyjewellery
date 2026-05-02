import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatINR } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, removeFromWishlist, addToCart } = useStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1A1918]/40 backdrop-blur-sm z-50"
            onClick={() => setWishlistOpen(false)}
            data-testid="wishlist-overlay"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[#FAF9F5] z-50 flex flex-col"
            data-testid="wishlist-drawer"
          >
            <div className="flex items-center justify-between px-7 py-6 border-b border-[#EAE5DC]">
              <h2 className="font-serif-display text-2xl font-medium">Wishlist</h2>
              <button data-testid="close-wishlist" onClick={() => setWishlistOpen(false)} aria-label="Close">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            {wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
                <p className="font-serif-display text-2xl text-[#1A1918] leading-tight max-w-[300px]">
                  Save the pieces that find you. Come back when you're ready.
                </p>
                <button
                  onClick={() => { setWishlistOpen(false); navigate("/collections/rings"); }}
                  className="mt-8 text-[11px] font-medium uppercase tracking-[0.22em] border-b border-[#1A1918] pb-1"
                >
                  Browse the Collection
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-7 py-5">
                <ul className="space-y-6">
                  {wishlist.map((item) => (
                    <li key={item.id} data-testid={`wishlist-item-${item.slug}`} className="flex gap-4">
                      <div className="w-24 h-28 bg-[#F3F1EC] flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <Link to={`/product/${item.slug}`} onClick={() => setWishlistOpen(false)} className="font-serif-display text-lg leading-tight">{item.name}</Link>
                        <p className="text-sm mt-1">{formatINR(item.price)}</p>
                        <div className="flex items-center gap-4 mt-auto">
                          <button
                            data-testid={`move-to-cart-${item.slug}`}
                            onClick={() => { addToCart({ ...item, images: [item.image] }); removeFromWishlist(item.id); setWishlistOpen(false); }}
                            className="text-[10.5px] font-medium uppercase tracking-[0.22em] border-b border-[#1A1918] pb-0.5"
                          >Add to Cart</button>
                          <button data-testid={`wishlist-remove-${item.slug}`} onClick={() => removeFromWishlist(item.id)} className="text-[#5E5950]"><Trash2 size={14} strokeWidth={1.5} /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
