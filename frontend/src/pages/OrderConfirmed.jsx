import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";

export default function OrderConfirmed() {
  const [params] = useSearchParams();
  const orderId = params.get("id") || "—";

  return (
    <div data-testid="page-order-confirmed" className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-16 h-16 border border-[#B89758] rounded-full flex items-center justify-center mx-auto mb-8">
        <Check size={26} strokeWidth={1.5} className="text-[#B89758]" />
      </div>
      <p className="overline mb-3">Confirmation</p>
      <h1 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight leading-[1.1]">
        Your Cently jewellery — and its certificate — are on their way.
      </h1>
      <p className="mt-6 text-[#5E5950] font-light leading-relaxed">
        Order <span className="font-medium text-[#1A1918]">{orderId}</span> is confirmed.
        You will receive a dispatch notification with your tracking link as soon as it leaves us.
      </p>
      <p className="mt-3 text-sm text-[#5E5950]">Real gold. VVS diamonds. On their way to you.</p>
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link to="/collections/studs" className="bg-[#1A1918] text-[#FAF9F5] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors">Continue Shopping</Link>
        <Link to="/" className="border border-[#1A1918] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#1A1918] hover:text-[#FAF9F5] transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
