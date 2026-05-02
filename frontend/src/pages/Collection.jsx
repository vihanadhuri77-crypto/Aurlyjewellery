import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

const taglines = {
  studs: "The one she never takes off.",
  earrings: "Every silhouette. One standard throughout.",
  rings: "For every finger. For every meaning.",
  lockets: "The piece worn closest to the heart.",
  necklaces: "Sits closest to the collarbone. Always noticed.",
  bracelets: "Always on her wrist.",
  accessories: "Every piece. The same standard.",
  bridal: "Real Gold. Real Diamonds. For every moment after.",
};

const headers = {
  studs: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=2000&auto=format&fit=crop",
  earrings: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=2000&auto=format&fit=crop",
  rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=2000&auto=format&fit=crop",
  lockets: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=2000&auto=format&fit=crop",
  necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=2000&auto=format&fit=crop",
  bracelets: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=2000&auto=format&fit=crop",
  accessories: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=2000&auto=format&fit=crop",
  bridal: "https://images.unsplash.com/photo-1613966561243-c6959a886009?crop=entropy&cs=srgb&fm=jpg&w=2000&q=85",
};

export default function Collection() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${category}`).then((r) => setProducts(r.data)).finally(() => setLoading(false));
  }, [category]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div data-testid={`page-collection-${category}`}>
      <section className="relative h-[58vh] min-h-[420px] overflow-hidden">
        <img src={headers[category]} alt={category} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1918]/30 via-transparent to-[#FAF9F5]" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-16 text-[#1A1918]">
            <p className="overline mb-3">Collection</p>
            <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight capitalize leading-none">{category}</h1>
            <p className="mt-5 font-serif-display italic text-2xl md:text-3xl text-[#5E5950] max-w-2xl">{taglines[category] || ""}</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-10 border-b border-[#EAE5DC] pb-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#5E5950]">{products.length} pieces</p>
          <select
            data-testid="sort-select"
            value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-[11px] uppercase tracking-[0.22em] text-[#1A1918] border border-[#EAE5DC] py-2 px-4 focus:outline-none focus:border-[#1A1918]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price · Low to High</option>
            <option value="price-desc">Price · High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] shimmer" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif-display text-3xl mb-6">More pieces coming soon.</p>
            <Link to="/collections/studs" className="text-[11px] uppercase tracking-[0.22em] border-b border-[#1A1918] pb-1">Browse Studs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" data-testid="product-grid">
            {sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
