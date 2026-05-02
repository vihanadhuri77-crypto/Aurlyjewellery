import React, { useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", order_number: "",
    enquiry_type: "Diamond advice", message: "",
  });
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success("Sent.", { description: data.message });
      setForm({ full_name: "", email: "", phone: "", order_number: "", enquiry_type: "Diamond advice", message: "" });
    } catch {
      toast.error("Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-contact">
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <p className="overline mb-4">Contact</p>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight max-w-3xl">
          We are here — <span className="italic">and we actually reply.</span>
        </h1>
        <p className="mt-8 text-[#5E5950] font-light leading-relaxed max-w-2xl">A question about your order. Advice on a diamond. Help choosing a gift. Planning a bespoke commission. Every message is answered personally — not by an automated system.</p>
      </section>

      <section className="max-w-[1300px] mx-auto px-6 md:px-12 pb-24 grid md:grid-cols-3 gap-10">
        {[
          {l: "Email", v: "support@cently.com", n: "Answered personally within a few hours, Mon–Sat."},
          {l: "WhatsApp", v: "+91 98XXX XXXXX", n: "Mon–Sat · 10am–7pm IST"},
          {l: "Visit Us", v: "Mumbai · Bengaluru · Delhi", n: "Private appointments available"},
        ].map((c) => (
          <div key={c.l} className="border-t border-[#1A1918] pt-6">
            <p className="overline mb-3">{c.l}</p>
            <p className="font-serif-display text-2xl text-[#1A1918]">{c.v}</p>
            <p className="text-sm text-[#5E5950] mt-2 font-light">{c.n}</p>
          </div>
        ))}
      </section>

      <section className="bg-[#F3F1EC] py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <p className="overline mb-4">Send us a message</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-12">Every message is read and responded to personally.</h2>
          <form onSubmit={submit} className="space-y-6 bg-[#FAF9F5] p-8 md:p-12" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Full name" testid="contact-name" value={form.full_name} onChange={update("full_name")} required />
              <Field label="Email" type="email" testid="contact-email" value={form.email} onChange={update("email")} required />
              <Field label="Phone" testid="contact-phone" value={form.phone} onChange={update("phone")} />
              <Field label="Order number (if applicable)" testid="contact-order" value={form.order_number} onChange={update("order_number")} />
            </div>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">I am enquiring about</span>
              <select
                data-testid="contact-enquiry"
                value={form.enquiry_type} onChange={update("enquiry_type")}
                className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm"
              >
                {["An existing order","A product","Diamond advice","A gift","A bespoke commission","Other"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Your message</span>
              <textarea
                data-testid="contact-message"
                rows={5} required value={form.message} onChange={update("message")}
                className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm resize-none"
              />
            </label>
            <button data-testid="contact-submit" disabled={loading} className="w-full bg-[#1A1918] text-[#FAF9F5] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors disabled:opacity-60">
              {loading ? "Sending..." : "Send Message"}
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
