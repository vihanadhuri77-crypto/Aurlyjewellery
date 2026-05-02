import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatINR } from "../lib/api";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.4, 0, 0.2, 1] }}
      data-testid={`product-card-${product.slug}`}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[#F3F1EC] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.badges?.includes("Bestseller") && (
            <span className="absolute top-4 left-4 text-[9.5px] font-medium tracking-[0.22em] uppercase text-[#1A1918] bg-[#FAF9F5] px-3 py-1.5">
              Bestseller
            </span>
          )}
          {product.badges?.includes("New In") && !product.badges?.includes("Bestseller") && (
            <span className="absolute top-4 left-4 text-[9.5px] font-medium tracking-[0.22em] uppercase text-[#FAF9F5] bg-[#1A1918] px-3 py-1.5">
              New In
            </span>
          )}
          <button
            data-testid={`wishlist-toggle-${product.slug}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#FAF9F5]/90 backdrop-blur-sm transition-all hover:bg-[#FAF9F5] ${wished ? "text-[#B89758]" : "text-[#1A1918]"}`}
            aria-label="Toggle wishlist"
          >
            <Heart size={15} strokeWidth={1.5} fill={wished ? "#B89758" : "none"} />
          </button>
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif-display text-lg md:text-xl font-medium text-[#1A1918] truncate">{product.name}</h3>
          </Link>
          <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-[#5E5950]">
            {product.diamond_clarity?.includes("VVS") ? "VVS · " : ""}{product.metal?.split("·")[0]?.trim()}
          </p>
        </div>
        <p className="font-sans-display text-base text-[#1A1918] whitespace-nowrap">{formatINR(product.price)}</p>
      </div>
    </motion.div>
  );
}
