import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import api, { formatINR } from "../lib/api";
import { toast } from "sonner";
import { ShieldCheck, Lock } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useStore();
  const shipping = subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shipping;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "",
    address_line: "", city: "", state: "", pincode: "",
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map((c) => ({
        product_id: c.id, slug: c.slug, name: c.name, price: c.price, quantity: c.qty, image: c.image,
      }));
      const { data } = await api.post("/orders", {
        ...form, items, subtotal, shipping, total,
      });
      // Razorpay placeholder — in production: call window.Razorpay() with key + razorpay_order_id from data
      toast.success("Order placed", { description: `Order ${data.order_number} — Razorpay checkout would launch here.` });
      clearCart();
      navigate(`/order-confirmed?id=${data.order_number}`);
    } catch (err) {
      toast.error("Could not place order. Please verify the details.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center" data-testid="checkout-empty">
        <h1 className="font-serif-display text-5xl mb-4">Your cart is empty.</h1>
        <Link to="/collections/studs" className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] border-b border-[#1A1918] pb-1">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div data-testid="page-checkout" className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="text-center mb-14">
        <p className="overline mb-3">Secure checkout</p>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light tracking-tight">Almost yours.</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <form onSubmit={placeOrder} className="lg:col-span-7 space-y-10" data-testid="checkout-form">
          <div>
            <p className="overline mb-5">Contact</p>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Full name" testid="checkout-name" value={form.customer_name} onChange={update("customer_name")} required />
              <Field label="Email" type="email" testid="checkout-email" value={form.email} onChange={update("email")} required />
              <Field label="Phone" testid="checkout-phone" value={form.phone} onChange={update("phone")} required />
            </div>
          </div>
          <div>
            <p className="overline mb-5">Delivery address</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field label="Address" testid="checkout-address" value={form.address_line} onChange={update("address_line")} required />
              </div>
              <Field label="City" testid="checkout-city" value={form.city} onChange={update("city")} required />
              <Field label="State" testid="checkout-state" value={form.state} onChange={update("state")} required />
              <Field label="Pincode" testid="checkout-pincode" value={form.pincode} onChange={update("pincode")} required />
            </div>
          </div>

          <div className="bg-[#F3F1EC] p-6 flex items-start gap-3">
            <Lock size={16} strokeWidth={1.5} className="mt-0.5 text-[#B89758]" />
            <div>
              <p className="text-sm font-medium">Razorpay Secure Checkout</p>
              <p className="text-xs text-[#5E5950] mt-1 leading-relaxed">
                Payment is processed via Razorpay (UPI, Cards, Netbanking, Wallets). This MVP uses a mock order — when a Razorpay key is added, checkout opens the real payment widget.
              </p>
            </div>
          </div>

          <button
            data-testid="place-order-btn"
            type="submit" disabled={loading}
            className="w-full bg-[#1A1918] text-[#FAF9F5] py-5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors disabled:opacity-60"
          >{loading ? "Placing order..." : `Place Order · ${formatINR(total)}`}</button>
        </form>

        <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start bg-[#F3F1EC] p-8" data-testid="order-summary">
          <p className="overline mb-5">Order summary</p>
          <ul className="space-y-5 max-h-[420px] overflow-y-auto">
            {cart.map((i) => (
              <li key={i.id} className="flex gap-4">
                <div className="w-16 h-20 bg-[#EAE5DC]"><img src={i.image} alt={i.name} className="w-full h-full object-cover"/></div>
                <div className="flex-1">
                  <p className="font-serif-display text-base leading-tight">{i.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950] mt-1">Qty {i.qty}</p>
                </div>
                <p className="text-sm">{formatINR(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-8 pt-6 border-t border-[#1A1918]/15 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping (insured)</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            <div className="flex justify-between font-serif-display text-2xl pt-3 border-t border-[#1A1918]/15"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
          </dl>
          <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#5E5950]">
            <ShieldCheck size={14} strokeWidth={1.5}/> Insured · BIS Hallmarked · Certificate Enclosed
          </div>
        </aside>
      </div>
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
