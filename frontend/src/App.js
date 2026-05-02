import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";

import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import Product from "@/pages/Product";
import Checkout from "@/pages/Checkout";
import OrderConfirmed from "@/pages/OrderConfirmed";
import About from "@/pages/About";
import OurDiamonds from "@/pages/OurDiamonds";
import Bridal from "@/pages/Bridal";
import Gifting from "@/pages/Gifting";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Journal from "@/pages/Journal";
import SizeGuide from "@/pages/SizeGuide";
import Sustainability from "@/pages/Sustainability";
import Care from "@/pages/Care";
import Legal from "@/pages/Legal";

import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard, {
  AdminLayout, AdminOrders, AdminProducts,
  AdminNewsletter, AdminContact, AdminConsultations,
} from "@/pages/Admin";

import { StoreProvider } from "@/context/StoreContext";

function ScrollTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function StorefrontShell({ children }) {
  return (
    <>
      <Ticker />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center" data-testid="page-404">
      <p className="overline mb-3">404</p>
      <h1 className="font-serif-display text-5xl md:text-6xl font-light leading-tight">This page has stepped away.</h1>
      <p className="mt-6 text-[#5E5950]">But your next VVS diamond piece has not. Let us take you somewhere more beautiful.</p>
      <a href="/" className="mt-10 inline-block bg-[#1A1918] text-[#FAF9F5] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors">Back to the Collection</a>
    </div>
  );
}

function StorefrontRoutes() {
  return (
    <StorefrontShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:category" element={<Collection />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/about" element={<About />} />
        <Route path="/our-diamonds" element={<OurDiamonds />} />
        <Route path="/bridal" element={<Bridal />} />
        <Route path="/gifting" element={<Gifting />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/care" element={<Care />} />
        <Route path="/careers" element={<Contact />} />
        <Route path="/legal/:slug" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </StorefrontShell>
  );
}

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <BrowserRouter>
          <ScrollTop />
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="consultations" element={<AdminConsultations />} />
            </Route>
            <Route path="*" element={<StorefrontRoutes />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </div>
  );
}

export default App;
