import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

client.interceptors.request.use((cfg) => {
  const url = cfg.url || "";
  let token = null;
  if (url.includes("/admin/")) {
    token = localStorage.getItem("cently_admin_token");
  } else if (url.includes("/account/") || url === "/auth/me") {
    token = localStorage.getItem("cently_customer_token") || localStorage.getItem("cently_admin_token");
  } else if (url.includes("/orders") && !url.includes("/admin/")) {
    // optional: attach customer token if present (for loyalty)
    token = localStorage.getItem("cently_customer_token");
  }
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
