import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import api, { formatINR } from "../lib/api";
import { LogOut, Package, Mail, MessageSquare, Calendar, BarChart3, Box } from "lucide-react";
import { toast } from "sonner";

function useAdminGuard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("cently_admin_token");
    if (!token) { navigate("/admin/login"); return; }
    api.get("/auth/me").then((r) => setMe(r.data)).catch(() => {
      localStorage.removeItem("cently_admin_token");
      navigate("/admin/login");
    });
  }, [navigate]);
  return me;
}

export function AdminLayout() {
  const me = useAdminGuard();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("cently_admin_token");
    localStorage.removeItem("cently_admin_user");
    toast.success("Signed out");
    navigate("/admin/login");
  };

  if (!me) return <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-sm text-[#5E5950]">Verifying access…</div>;

  const links = [
    { to: "/admin", icon: BarChart3, label: "Overview", end: true },
    { to: "/admin/orders", icon: Package, label: "Orders" },
    { to: "/admin/products", icon: Box, label: "Products" },
    { to: "/admin/newsletter", icon: Mail, label: "Newsletter" },
    { to: "/admin/contact", icon: MessageSquare, label: "Messages" },
    { to: "/admin/consultations", icon: Calendar, label: "Consultations" },
  ];

  return (
    <div data-testid="admin-layout" className="min-h-screen bg-[#FAF9F5] grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex flex-col bg-[#1A1918] text-[#FAF9F5] p-7">
        <p className="font-serif-display text-2xl tracking-[0.42em]">CENTLY</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4B882] mt-1">Admin</p>
        <nav className="mt-10 flex-1 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              data-testid={`admin-nav-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-[#FAF9F5]/10 text-[#D4B882]" : "text-[#FAF9F5]/75 hover:text-[#FAF9F5]"}`
              }
            >
              <Icon size={16} strokeWidth={1.5} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t border-[#FAF9F5]/10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#FAF9F5]/50">Signed in as</p>
          <p className="mt-1 text-sm">{me.name}</p>
          <p className="text-xs text-[#FAF9F5]/60">{me.email}</p>
          <button data-testid="admin-logout" onClick={logout} className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#D4B882] hover:text-[#FAF9F5]">
            <LogOut size={14} strokeWidth={1.5}/> Logout
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-12">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);

  const cards = stats ? [
    { l: "Products", v: stats.products },
    { l: "Orders", v: stats.orders },
    { l: "Newsletter", v: stats.newsletter_subscribers },
    { l: "Messages", v: stats.contact_messages },
    { l: "Consultations", v: stats.consultations },
  ] : [];

  return (
    <div data-testid="admin-dashboard">
      <p className="overline mb-2">Overview</p>
      <h1 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight">Welcome back.</h1>
      <p className="text-[#5E5950] mt-2">A quick read of the showroom — orders, leads, and conversations.</p>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.l} data-testid={`stat-${c.l.toLowerCase()}`} className="bg-[#F3F1EC] p-6 border border-[#EAE5DC]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">{c.l}</p>
            <p className="font-serif-display text-5xl mt-3">{c.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-[#EAE5DC] pt-10">
        <h2 className="font-serif-display text-2xl">Quick links</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li><NavLink to="/admin/orders" className="link-reveal">→ View all orders</NavLink></li>
          <li><NavLink to="/admin/consultations" className="link-reveal">→ Pending consultation requests</NavLink></li>
          <li><NavLink to="/admin/contact" className="link-reveal">→ New contact messages</NavLink></li>
        </ul>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/admin/orders").then((r) => setOrders(r.data)); }, []);

  return (
    <div data-testid="admin-orders">
      <p className="overline mb-2">Orders</p>
      <h1 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight">{orders.length} {orders.length === 1 ? "order" : "orders"}</h1>
      {orders.length === 0 ? (
        <p className="mt-12 text-[#5E5950]">No orders yet.</p>
      ) : (
        <div className="mt-10 overflow-x-auto border border-[#EAE5DC]">
          <table className="w-full text-sm">
            <thead className="bg-[#F3F1EC] text-left">
              <tr>{["Order","Customer","Total","Status","Date"].map((h) => <th key={h} className="px-5 py-4 text-[10px] uppercase tracking-[0.22em]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[#EAE5DC]">
                  <td className="px-5 py-4 font-mono text-xs">{o.order_number}</td>
                  <td className="px-5 py-4">
                    <p className="font-serif-display text-base">{o.customer_name}</p>
                    <p className="text-xs text-[#5E5950]">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 font-serif-display text-base">{formatINR(o.total)}</td>
                  <td className="px-5 py-4 text-[10px] uppercase tracking-[0.2em]">{o.status}</td>
                  <td className="px-5 py-4 text-xs text-[#5E5950]">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminProducts() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/admin/products").then((r) => setItems(r.data)); }, []);

  return (
    <div data-testid="admin-products">
      <p className="overline mb-2">Products</p>
      <h1 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight">{items.length} pieces in catalogue</h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <div key={p.id} className="border border-[#EAE5DC] bg-[#FAF9F5]">
            <div className="aspect-square bg-[#F3F1EC] overflow-hidden"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <p className="font-serif-display text-lg">{p.name}</p>
              <p className="text-xs text-[#5E5950] uppercase tracking-[0.18em]">{p.category}</p>
              <p className="mt-2 text-sm">{formatINR(p.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSection({ title, endpoint, columns }) {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(endpoint).then((r) => setItems(r.data)); }, [endpoint]);
  return (
    <div data-testid={`admin-${title.toLowerCase()}`}>
      <p className="overline mb-2">{title}</p>
      <h1 className="font-serif-display text-4xl md:text-5xl font-light tracking-tight">{items.length} {items.length === 1 ? "entry" : "entries"}</h1>
      {items.length === 0 ? (
        <p className="mt-12 text-[#5E5950]">No entries yet.</p>
      ) : (
        <div className="mt-10 overflow-x-auto border border-[#EAE5DC]">
          <table className="w-full text-sm">
            <thead className="bg-[#F3F1EC] text-left">
              <tr>{columns.map((c) => <th key={c.key} className="px-5 py-4 text-[10px] uppercase tracking-[0.22em]">{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id || i} className="border-t border-[#EAE5DC] align-top">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-4 text-sm text-[#1A1918]">
                      {c.render ? c.render(it[c.key], it) : (it[c.key] || "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminNewsletter() {
  return <ListSection
    title="Newsletter"
    endpoint="/admin/newsletter"
    columns={[
      { key: "email", label: "Email" },
      { key: "created_at", label: "Subscribed", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
    ]}
  />;
}

export function AdminContact() {
  return <ListSection
    title="Messages"
    endpoint="/admin/contact"
    columns={[
      { key: "full_name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "enquiry_type", label: "Type" },
      { key: "message", label: "Message", render: (v) => <span className="block max-w-md text-[#5E5950]">{v}</span> },
      { key: "created_at", label: "Date", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
    ]}
  />;
}

export function AdminConsultations() {
  return <ListSection
    title="Consultations"
    endpoint="/admin/consultations"
    columns={[
      { key: "full_name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "consultation_type", label: "Type" },
      { key: "mode", label: "Mode" },
      { key: "preferred_date", label: "Preferred" },
      { key: "created_at", label: "Booked", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
    ]}
  />;
}
