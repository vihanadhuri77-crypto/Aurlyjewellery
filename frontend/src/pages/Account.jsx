import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { formatINR } from "../lib/api";
import { LogOut, User, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function AccountLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-sm text-[#5E5950]">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  const links = [
    { to: "/account", icon: User, label: "Overview", end: true },
    { to: "/account/orders", icon: Package, label: "Orders" },
    { to: "/account/circle", icon: Sparkles, label: "Cently Circle" },
    { to: "/account/profile", icon: User, label: "Profile" },
  ];

  return (
    <div data-testid="account-layout" className="max-w-[1500px] mx-auto px-6 md:px-12 py-12 md:py-16 grid lg:grid-cols-[280px_1fr] gap-12">
      <aside className="lg:sticky lg:top-24 self-start">
        <p className="overline mb-3">My Account</p>
        <h2 className="font-serif-display text-3xl md:text-4xl font-light leading-tight">Welcome back, <span className="italic">{(user.name || "").split(" ")[0] || "friend"}.</span></h2>
        <div className="mt-5 inline-flex items-center gap-2 bg-[#F3F1EC] px-4 py-2.5 border border-[#EAE5DC]">
          <Sparkles size={14} strokeWidth={1.5} className="text-[#B89758]" />
          <span className="text-[10.5px] uppercase tracking-[0.22em]">{user.loyalty_points || 0} points</span>
        </div>
        <nav className="mt-10 space-y-1 border-t border-[#EAE5DC]" data-testid="account-nav">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              data-testid={`account-nav-${label.toLowerCase().replace(/ /g, '-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 border-b border-[#EAE5DC] text-sm transition-colors ${isActive ? "text-[#B89758]" : "text-[#1A1918] hover:text-[#5E5950]"}`
              }
            >
              <Icon size={15} strokeWidth={1.5} /> {label}
            </NavLink>
          ))}
          <button data-testid="account-logout" onClick={() => { logout(); toast.success("Signed out"); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-3 border-b border-[#EAE5DC] text-sm text-[#5E5950] hover:text-[#1A1918]">
            <LogOut size={15} strokeWidth={1.5} /> Sign out
          </button>
        </nav>
      </aside>
      <main className="min-w-0"><Outlet /></main>
    </div>
  );
}

export function AccountOverview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/account/orders").then((r) => setOrders(r.data)); }, []);
  const recent = orders.slice(0, 3);

  return (
    <div data-testid="account-overview" className="space-y-12">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Cently Circle Points" value={user.loyalty_points || 0} suffix="pts" />
        <Stat label="Lifetime Orders" value={orders.length} />
        <Stat label="Wishlist" value="—" suffix="" hint="Saved in your browser" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif-display text-2xl md:text-3xl font-light">Recent orders</h3>
          <Link to="/account/orders" className="text-[11px] uppercase tracking-[0.22em] link-reveal">View all</Link>
        </div>
        {recent.length === 0 ? (
          <div className="border border-[#EAE5DC] p-10 text-center">
            <p className="font-serif-display text-2xl">No orders yet — your first VVS piece is waiting.</p>
            <Link to="/collections/studs" className="mt-6 inline-block bg-[#1A1918] text-[#FAF9F5] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em]">Browse the collection</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((o) => <OrderRow key={o.id} order={o} />)}
          </ul>
        )}
      </section>

      <section className="bg-[#1A1918] text-[#FAF9F5] p-8 md:p-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="overline text-[#D4B882] mb-3">Cently Circle</p>
          <h3 className="font-serif-display text-3xl md:text-4xl font-light leading-tight">Earn 1 point on every ₹100. Redeem at checkout.</h3>
          <p className="mt-3 text-sm text-[#FAF9F5]/75">Members get early access to new collections and private sales.</p>
        </div>
        <Link to="/account/circle" className="justify-self-start md:justify-self-end bg-[#D4B882] text-[#1A1918] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#FAF9F5] transition-colors">View your benefits</Link>
      </section>
    </div>
  );
}

function Stat({ label, value, suffix = "", hint = "" }) {
  return (
    <div className="bg-[#F3F1EC] p-6 border border-[#EAE5DC]" data-testid={`stat-${label.toLowerCase().replace(/ /g, '-')}`}>
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">{label}</p>
      <p className="font-serif-display text-4xl mt-2 leading-none">{value}{suffix && <span className="text-base ml-1 text-[#5E5950]">{suffix}</span>}</p>
      {hint && <p className="text-[11px] text-[#5E5950] mt-2">{hint}</p>}
    </div>
  );
}

function OrderRow({ order }) {
  return (
    <li className="border border-[#EAE5DC] p-5 flex flex-col sm:flex-row sm:items-center gap-4" data-testid={`order-row-${order.order_number}`}>
      <div className="flex -space-x-3">
        {order.items.slice(0, 3).map((it, i) => (
          <div key={i} className="w-14 h-14 bg-[#F3F1EC] border-2 border-[#FAF9F5] overflow-hidden">
            <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="w-14 h-14 bg-[#1A1918] text-[#FAF9F5] text-xs flex items-center justify-center border-2 border-[#FAF9F5]">+{order.items.length - 3}</div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Order {order.order_number}</p>
        <p className="font-serif-display text-lg mt-0.5">{order.items.map((i) => i.name).join(" · ")}</p>
        <p className="text-xs text-[#5E5950] mt-1">{new Date(order.created_at).toLocaleDateString()} · {order.status.replace(/_/g, ' ')}</p>
      </div>
      <p className="font-serif-display text-2xl">{formatINR(order.total)}</p>
    </li>
  );
}

export function AccountOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/account/orders").then((r) => setOrders(r.data)); }, []);

  return (
    <div data-testid="account-orders">
      <p className="overline mb-3">Orders</p>
      <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">Every Cently piece, every order.</h2>
      <div className="mt-10 space-y-4">
        {orders.length === 0 ? (
          <p className="text-[#5E5950]">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <details key={o.id} className="border border-[#EAE5DC]" data-testid={`order-detail-${o.order_number}`}>
              <summary className="cursor-pointer p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Order {o.order_number} · {new Date(o.created_at).toLocaleDateString()}</p>
                  <p className="font-serif-display text-xl mt-1">{o.items.length} {o.items.length === 1 ? "piece" : "pieces"} · {o.status.replace(/_/g, ' ')}</p>
                </div>
                <p className="font-serif-display text-2xl">{formatINR(o.total)}</p>
              </summary>
              <ul className="border-t border-[#EAE5DC] divide-y divide-[#EAE5DC]">
                {o.items.map((it, i) => (
                  <li key={i} className="p-5 flex gap-4 bg-[#FAF9F5]">
                    <div className="w-20 h-24 bg-[#F3F1EC]"><img src={it.image} alt={it.name} className="w-full h-full object-cover"/></div>
                    <div className="flex-1">
                      <p className="font-serif-display text-lg">{it.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950] mt-1">Qty {it.quantity}</p>
                      {it.engraving && <p className="text-xs italic text-[#B89758] mt-1">Engraving: "{it.engraving}"</p>}
                    </div>
                    <p className="text-sm">{formatINR(it.price * it.quantity)}</p>
                  </li>
                ))}
                <li className="p-5 bg-[#F3F1EC] grid grid-cols-2 gap-y-1 text-sm">
                  <span>Subtotal</span><span className="text-right">{formatINR(o.subtotal)}</span>
                  <span>Shipping</span><span className="text-right">{o.shipping === 0 ? "Free" : formatINR(o.shipping)}</span>
                  {!!o.points_redeemed && (<><span>Points redeemed</span><span className="text-right text-[#B89758]">−{formatINR(o.points_redeemed)}</span></>)}
                  <span className="font-serif-display text-xl">Total</span><span className="text-right font-serif-display text-xl">{formatINR(o.total)}</span>
                  {!!o.points_earned && <p className="col-span-2 text-[11px] uppercase tracking-[0.22em] text-[#B89758] mt-2">+{o.points_earned} Cently Circle points earned</p>}
                </li>
              </ul>
            </details>
          ))
        )}
      </div>
    </div>
  );
}

export function AccountProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="account-profile" className="max-w-lg">
      <p className="overline mb-3">Profile</p>
      <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight">Your details.</h2>
      <form onSubmit={submit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Full name</span>
          <input data-testid="profile-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm" />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Email</span>
          <input value={user.email} disabled
            className="mt-2 w-full bg-transparent border-0 border-b border-[#EAE5DC] py-2.5 text-sm text-[#5E5950]" />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">Phone</span>
          <input data-testid="profile-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm" />
        </label>
        <button data-testid="profile-save" disabled={loading} className="bg-[#1A1918] text-[#FAF9F5] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] disabled:opacity-60">
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export function AccountCircle() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/account/loyalty").then((r) => setData(r.data)); }, []);

  const tier = (user.loyalty_points || 0) >= 1000 ? "Gold" : (user.loyalty_points || 0) >= 250 ? "Silver" : "Bronze";

  return (
    <div data-testid="account-circle" className="space-y-12">
      <div className="bg-[#1A1918] text-[#FAF9F5] p-10 md:p-14 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#D4B882]/20 blur-3xl"/>
        <p className="overline text-[#D4B882] mb-4">Cently Circle</p>
        <p className="font-serif-display text-2xl md:text-3xl text-[#FAF9F5]/80">You have</p>
        <p className="font-serif-display text-7xl md:text-9xl font-light leading-none mt-2 tracking-tight">
          {user.loyalty_points || 0}<span className="text-2xl text-[#D4B882] ml-3">points</span>
        </p>
        <p className="mt-4 text-sm text-[#FAF9F5]/75">Worth {data ? formatINR(data.value_inr) : "—"} at checkout · Tier: <span className="text-[#D4B882]">{tier}</span></p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Benefit n="01" t="Earn" b="1 point on every ₹100 spent. Points credit instantly when your order is confirmed."/>
        <Benefit n="02" t="Redeem" b="Use points at checkout — up to 10% of your order value, in any combination."/>
        <Benefit n="03" t="Privileges" b="Early access to new collections, private sale invitations, and complimentary engraving on qualifying orders."/>
      </div>

      <div className="border-t border-[#EAE5DC] pt-8">
        <h3 className="font-serif-display text-2xl">Tiers</h3>
        <p className="text-sm text-[#5E5950] mt-1">Earn more, unlock more.</p>
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {[["Bronze","0 – 249 pts","Welcome circle benefits"],["Silver","250 – 999 pts","Free engraving on every order"],["Gold","1000+ pts","Private bridal styling · early collection drops"]].map(([n, p, b]) => (
            <div key={n} className={`p-5 border ${tier === n ? "border-[#1A1918] bg-[#F3F1EC]" : "border-[#EAE5DC]"}`}>
              <p className="font-serif-display text-2xl">{n}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950] mt-1">{p}</p>
              <p className="mt-2 text-sm text-[#5E5950]">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Benefit({ n, t, b }) {
  return (
    <div className="border-t border-[#1A1918] pt-5">
      <p className="font-serif-display text-3xl text-[#B89758] italic">{n}</p>
      <p className="font-serif-display text-2xl mt-2">{t}</p>
      <p className="text-sm text-[#5E5950] mt-2 font-light leading-relaxed">{b}</p>
    </div>
  );
}
