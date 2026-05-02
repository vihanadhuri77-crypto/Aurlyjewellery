import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function Journal() {
  const [articles, setArticles] = useState([]);
  useEffect(() => { api.get("/journal").then((r) => setArticles(r.data)); }, []);

  return (
    <div data-testid="page-journal">
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <p className="overline mb-4">The Journal</p>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
          Stories about real gold, real diamonds, <span className="italic">and the women who wear them.</span>
        </h1>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32 grid md:grid-cols-2 gap-12 md:gap-16">
        {articles.map((a, i) => (
          <article key={a.slug} data-testid={`journal-${a.slug}`} className={i === 0 ? "md:col-span-2" : ""}>
            <div className={`bg-[#F3F1EC] overflow-hidden ${i === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
              <img src={a.image} alt={a.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="mt-6">
              <p className="overline mb-3">{a.date} · {a.read_time}</p>
              <h2 className={`font-serif-display font-light leading-tight ${i === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{a.title}</h2>
              <p className="mt-4 text-[#5E5950] font-light leading-relaxed max-w-2xl">{a.excerpt}</p>
              <Link to="/journal" className="mt-5 inline-block text-[11px] uppercase tracking-[0.22em] border-b border-[#1A1918] pb-1">Read More</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
