import React from "react";
import { useParams } from "react-router-dom";

const PAGES = {
  terms: {
    title: "Terms & Conditions",
    body: "By using this website, you agree to these terms. Product descriptions and diamond specifications are stated as accurately as possible. Minor natural variations may occur in handcrafted pieces. Prices are subject to change without prior notice. The price at the time of order confirmation is the price charged. All website content belongs to Cently and may not be reproduced without written permission. Cently's liability is limited to the value of the product purchased.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "We collect your name, email address, phone number, and delivery address solely to process and fulfil your order. We do not sell, rent, or share your personal data. Payment information is processed through encrypted, PCI-compliant gateways — we do not store card details. You may request access to, correction of, or deletion of your personal data at any time by writing to support@cently.com.",
  },
  shipping: {
    title: "Shipping Policy",
    body: "Standard delivery across India within 5–7 business days. Express delivery in 2–3 business days in select cities. Engraved and personalised pieces within 10–14 business days. Free insured shipping on orders above ₹2,999. A standard shipping fee applies on orders below this amount. All shipments are fully insured and tracked. A tracking link is sent the moment your order is dispatched.",
  },
  returns: {
    title: "Return & Refund Policy",
    body: "15-day return window from date of delivery. Pieces must be unworn, in original condition, with packaging and certificate enclosed. Engraved and custom pieces are not eligible unless defective. Refunds are processed to the original payment method within 5–7 working days of receiving the returned item. Damaged or incorrect items must be reported within 48 hours with photographs.",
  },
  warranty: {
    title: "Warranty & Aftercare",
    body: "Every Cently piece is quality-checked before dispatch. Manufacturing defects — broken clasps, loose settings, or structural failure under normal daily wear — are repaired or replaced at no cost within 6 months of purchase. Damage from improper care or physical impact is not covered. Complimentary professional cleaning, stone inspection, and setting check are available for the life of every Cently piece.",
  },
  cancellation: {
    title: "Cancellation Policy",
    body: "Orders may be cancelled within 24 hours of placement for a full refund. After 24 hours, cancellation may not be possible if the order has entered the packing or dispatch process. Engraved and bespoke orders cannot be cancelled once crafting has begun. Write to support@cently.com immediately if you wish to cancel.",
  },
};

export default function Legal() {
  const { slug } = useParams();
  const page = PAGES[slug] || PAGES.terms;
  return (
    <div data-testid={`page-legal-${slug}`} className="max-w-[860px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <p className="overline mb-4">Legal</p>
      <h1 className="font-serif-display text-4xl md:text-6xl font-light leading-tight tracking-tight">{page.title}</h1>
      <p className="mt-10 text-[#5E5950] font-light leading-relaxed text-lg">{page.body}</p>
      <div className="mt-12 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-[#5E5950]">
        {Object.entries(PAGES).map(([k, v]) => (
          <a key={k} href={`/legal/${k}`} className="border-b border-transparent hover:border-[#1A1918] pb-0.5">{v.title}</a>
        ))}
      </div>
    </div>
  );
}
