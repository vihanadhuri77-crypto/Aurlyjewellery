import React, { useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export default function Bridal() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    consultation_type: "bridal", mode: "video", preferred_date: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/consultation", form);
      toast.success("Consultation requested", { description: data.message });
      setForm({ full_name: "", email: "", phone: "", consultation_type: "bridal", mode: "video", preferred_date: "", notes: "" });
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-bridal">
      <section className="relative h-[68vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613966561243-c6959a886009?crop=entropy&cs=srgb&fm=jpg&w=2000&q=85"
          alt="Bride wearing fine gold jewellery" className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/55 to-transparent" />
        <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 text-[#FAF9F5]">
          <p className="overline text-[#D4B882] mb-4">Bridal</p>
          <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight max-w-4xl">
            Your Wedding Jewellery. Real Gold. Real Diamonds. <span className="italic">For Every Moment After.</span>
          </h1>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-12 py-24 space-y-6 text-[#1A1918]/85 font-light leading-relaxed text-lg">
        <p>Your wedding jewellery will be in every photograph. It will be examined by everyone who loves you on the most documented day of your life. And if it is made properly — in solid 9ct gold with VVS certified diamonds — it will look exactly as extraordinary on your thirtieth anniversary as it does on your wedding morning.</p>
        <p>Cently bridal jewellery is crafted to that standard. VVS clarity. E–F colour. Independently certified. Solid 9ct gold. BIS Hallmarked. For the bride who wants her jewellery to be genuinely, verifiably real.</p>
      </section>

      <section className="max-w-[1300px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          {[
            {t: "The Bridal Set", b: "Matching necklace, earrings, and bangle — designed as a complete look in solid 9ct gold with VVS diamonds throughout."},
            {t: "The Engagement Ring", b: "Solitaire, halo, and three-stone settings. VVS clarity, E–F colour, GIA or IGI certified. The ring she says yes to — and yes to, every morning after."},
            {t: "The Wedding Band", b: "Channel-set VVS diamonds in solid 9ct gold — worn alongside the engagement ring or alone as the complete symbol."},
            {t: "The Modern Mangalsutra", b: "Solid 9ct gold with VVS diamond accents — reimagined for the woman who wants her mangalsutra to be as fine as everything else she wears."},
          ].map((s, i) => (
            <div key={i} className="border-t border-[#1A1918] pt-6">
              <h3 className="font-serif-display text-2xl md:text-3xl font-medium">{s.t}</h3>
              <p className="mt-3 text-[#5E5950] font-light leading-relaxed">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Form */}
      <section className="bg-[#F3F1EC] py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16">
          <div>
            <p className="overline mb-4">Book a consultation</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">Planning your wedding jewellery deserves more than browsing alone.</h2>
            <p className="mt-6 text-[#5E5950] font-light leading-relaxed">Our team offers private bridal consultations — in-store or by video call — to help you find every piece, from the engagement ring to the last bangle.</p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#5E5950]">No fee. No obligation. Just clarity.</p>
          </div>

          <form onSubmit={submit} className="bg-[#FAF9F5] p-8 md:p-10 space-y-6" data-testid="consultation-form">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name" testid="cons-name" value={form.full_name} onChange={update("full_name")} required />
              <Field label="Phone" testid="cons-phone" value={form.phone} onChange={update("phone")} required />
            </div>
            <Field label="Email" type="email" testid="cons-email" value={form.email} onChange={update("email")} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Consultation" testid="cons-type" value={form.consultation_type} onChange={update("consultation_type")}>
                <option value="bridal">Bridal</option>
                <option value="diamond">Diamond Advice</option>
              </Select>
              <Select label="Mode" testid="cons-mode" value={form.mode} onChange={update("mode")}>
                <option value="video">Video Call</option>
                <option value="in-store">In-store</option>
              </Select>
            </div>
            <Field label="Preferred date" type="date" testid="cons-date" value={form.preferred_date} onChange={update("preferred_date")} />
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Anything we should know?</span>
              <textarea
                data-testid="cons-notes"
                rows={3} value={form.notes} onChange={update("notes")}
                className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm placeholder:text-[#5E5950]/50 resize-none"
              />
            </label>
            <button data-testid="cons-submit" disabled={loading} className="w-full bg-[#1A1918] text-[#FAF9F5] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors disabled:opacity-60">
              {loading ? "Submitting..." : "Book Consultation"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, testid, ...rest }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">{label}</span>
      <input
        data-testid={testid}
        {...rest}
        className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm placeholder:text-[#5E5950]/50"
      />
    </label>
  );
}

function Select({ label, testid, children, ...rest }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">{label}</span>
      <select
        data-testid={testid} {...rest}
        className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm appearance-none"
      >
        {children}
      </select>
    </label>
  );
}
