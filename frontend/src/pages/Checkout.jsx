import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import api, { formatINR } from "../lib/api";
import { toast } from "sonner";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useStore();
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redeem, setRedeem] = useState(0);
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "",
    address_line: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (user && user.id) {
      setForm((f) => ({
        ...f,
        customer_name: f.customer_name || user.name || "",
        email: f.email || user.email || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  const maxRedeem = user && user.id
    ? Math.min(user.loyalty_points || 0, Math.floor(subtotal * 0.10))
    : 0;
  const safeRedeem = Math.min(redeem, maxRedeem);
  const shipping = subtotal >= 2999 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - safeRedeem);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map((c) => ({
        product_id: c.id, slug: c.slug, name: c.name, price: c.price,
        quantity: c.qty, image: c.image,
        engraving: c.engraving || null,
      }));
      const { data } = await api.post("/orders", {
        ...form, items, subtotal, shipping, total,
        redeemed_points: safeRedeem,
      });
      toast.success("Order placed", { description: `Order ${data.order_number} · +${data.points_earned} Cently Circle points` });
      clearCart();
      if (user && user.id) refresh();
      navigate(`/order-confirmed?id=${data.order_number}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Could not place order. Please verify the details.";
      toast.error(typeof msg === "string" ? msg : "Order failed");
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
        {!user && (
          <p className="mt-4 text-sm text-[#5E5950]">
            Have an account? <Link to={{ pathname: "/login" }} state={{ next: "/checkout" }} className="underline">Sign in</Link> to redeem Cently Circle points.
          </p>
        )}
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

          {user && user.id && maxRedeem > 0 && (
            <div className="bg-[#1A1918] text-[#FAF9F5] p-6" data-testid="redeem-block">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} strokeWidth={1.5} className="text-[#D4B882]" />
                  <div>
                    <p className="overline text-[#D4B882]">Cently Circle</p>
                    <p className="font-serif-display text-xl mt-0.5">Redeem your points</p>
                  </div>
                </div>
                <p className="text-sm text-[#FAF9F5]/75">Available: <span className="text-[#D4B882]">{user.loyalty_points} pts</span></p>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <input
                  data-testid="redeem-slider"
                  type="range" min="0" max={maxRedeem} step="1"
                  value={safeRedeem} onChange={(e) => setRedeem(parseInt(e.target.value))}
                  className="flex-1 accent-[#D4B882]"
                />
                <p className="text-sm font-serif-display text-2xl w-28 text-right text-[#D4B882]">−{formatINR(safeRedeem)}</p>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#FAF9F5]/55">Up to 10% of order can be paid in points · 1 point = ₹1</p>
            </div>
          )}

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
              <li key={i.lineKey || i.id} className="flex gap-4">
                <div className="w-16 h-20 bg-[#EAE5DC]"><img src={i.image} alt={i.name} className="w-full h-full object-cover"/></div>
                <div className="flex-1">
                  <p className="font-serif-display text-base leading-tight">{i.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950] mt-1">Qty {i.qty}</p>
                  {i.engraving && <p className="text-[10.5px] italic text-[#B89758] mt-0.5">"{i.engraving}"</p>}
                </div>
                <p className="text-sm">{formatINR(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-8 pt-6 border-t border-[#1A1918]/15 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping (insured)</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            {safeRedeem > 0 && (
              <div className="flex justify-between text-[#B89758]"><dt>Cently Circle points</dt><dd>−{formatINR(safeRedeem)}</dd></div>
            )}
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
