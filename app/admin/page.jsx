"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Sidebar } from "./components/Sidebar";
import { StatsView } from "./components/StatsView";
import { ProductCard } from "./components/ProductCard";
import { LoginScreen } from "./components/LoginScreen";
import { AddProductForm } from "./components/AddProductForm";
import { CategoryManager } from "./components/CategoryManager";
import { DetailedStats } from "./components/DetailedStats";

import {
  Loader2,
  Menu,
  ChefHat,
  Sun,
  Moon,
  ShoppingBag,
  Users,
  BarChart3,
  TrendingUp,
  Package,
  Star,
  Trash2,
  Eye,
  X,
  UserPlus,
  Edit2,
  CheckCircle,
  ArrowUpRight,
  Search,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ===== THEME CONTEXT =====
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

// ===== UTILS =====
const ls = {
  get: (k, def = null) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
const fmt = (n) => Number(n || 0).toLocaleString("uz-UZ");
const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ===== ORDER DETAIL MODAL =====
const OrderDetailModal = ({ order, onClose, isDark }) => {
  if (!order) return null;
  const items = order.items || order.products || [];
  const total =
    Number(order.totalPrice || order.summa || order.total || 0) ||
    items.reduce(
      (s, i) =>
        s + Number(i.narxi || i.price || 0) * Number(i.soni || i.quantity || 1),
      0,
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"} rounded-3xl w-full max-w-md shadow-2xl overflow-hidden`}
      >
        <div
          className={`p-5 border-b ${isDark ? "border-gray-800" : "border-gray-100"} flex items-center justify-between`}
        >
          <div>
            <h2
              className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}
            >
              #{order.orderNumber || order._id?.slice(-4).toUpperCase() || "—"}{" "}
              — Buyurtma
            </h2>
            <p
              className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {fmtDate(order.date || order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <X
              className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <p
                className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Mijoz
              </p>
              <p
                className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {order.user?.name || order.clientName || "—"}
              </p>
              <p
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {order.user?.phone || ""}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${isDark ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50"}`}
            >
              <p
                className={`text-xs mb-1 ${isDark ? "text-blue-400" : "text-blue-500"}`}
              >
                Ofisiant
              </p>
              <p
                className={`font-bold text-sm ${isDark ? "text-blue-300" : "text-blue-700"}`}
              >
                {order.waiter?.name || order.waiterName || "Belgilanmagan"}
              </p>
              {order.table && (
                <p
                  className={`text-xs ${isDark ? "text-blue-500" : "text-blue-400"}`}
                >
                  Stol #{order.table}
                </p>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl overflow-hidden border ${isDark ? "border-gray-700" : "border-gray-100"}`}
          >
            <div
              className={`px-4 py-2.5 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Mahsulotlar
              </p>
            </div>
            {items.length === 0 ? (
              <p
                className={`p-4 text-sm text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Ma'lumot yo'q
              </p>
            ) : (
              items.map((it, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-4 py-2.5 border-t ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}`}
                >
                  <div>
                    <p
                      className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {it.nomi || it.name || it.title}
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      × {it.soni || it.quantity || 1}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-red-600">
                    {fmt(
                      Number(it.narxi || it.price || 0) *
                        Number(it.soni || it.quantity || 1),
                    )}{" "}
                    so'm
                  </p>
                </div>
              ))
            )}
          </div>

          <div
            className={`flex justify-between items-center p-4 rounded-xl ${isDark ? "bg-red-900/20 border border-red-800/30" : "bg-red-50 border border-red-100"}`}
          >
            <span
              className={`font-black text-lg ${isDark ? "text-red-300" : "text-red-700"}`}
            >
              Jami to'lov
            </span>
            <span className="font-black text-xl text-red-600">
              {fmt(total)} so'm
            </span>
          </div>

          {order.note && (
            <div
              className={`p-3 rounded-xl text-sm ${isDark ? "bg-yellow-900/20 text-yellow-300" : "bg-yellow-50 text-yellow-700"}`}
            >
              📝 {order.note}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===== ORDERS SECTION =====
const OrdersSection = ({ orders, onDelete, isDark }) => {
  const [search, setSearch] = useState("");
  const [filterWaiter, setFilterWaiter] = useState("Barchasi");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const waiterNames = [
    "Barchasi",
    ...Array.from(
      new Set(
        orders.map((o) => o.waiter?.name || o.waiterName || "Belgilanmagan"),
      ),
    ),
  ];

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.user?.name || o.clientName || "").toLowerCase().includes(q) ||
      (o.waiter?.name || o.waiterName || "").toLowerCase().includes(q) ||
      (o._id || "").toLowerCase().includes(q);
    const matchWaiter =
      filterWaiter === "Barchasi" ||
      (o.waiter?.name || o.waiterName || "Belgilanmagan") === filterWaiter;
    return matchSearch && matchWaiter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm flex-1 min-w-[200px] ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200"}`}
        >
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            className="bg-transparent outline-none flex-1 placeholder-gray-400 text-sm"
            placeholder="Qidirish (mijoz, ofisiant...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filterWaiter}
          onChange={(e) => setFilterWaiter(e.target.value)}
          className={`px-3 py-2 rounded-xl border text-sm font-semibold outline-none ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          {waiterNames.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </div>

      <div
        className={`rounded-2xl overflow-hidden border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        {/* Table Header */}
        <div
          className={`hidden sm:grid grid-cols-[48px_160px_1fr_1fr_120px_80px] gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}
        >
          <div>#</div>
          <div>Sana</div>
          <div>Mijoz</div>
          <div>Ofisiant</div>
          <div className="text-right">Summa</div>
          <div className="text-center">Amal</div>
        </div>

        {filtered.length === 0 ? (
          <div
            className={`text-center py-16 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Buyurtmalar topilmadi</p>
          </div>
        ) : (
          filtered.map((order, idx) => {
            const items = order.items || order.products || [];
            const total =
              Number(order.totalPrice || order.summa || order.total || 0) ||
              items.reduce(
                (s, i) =>
                  s +
                  Number(i.narxi || i.price || 0) *
                    Number(i.soni || i.quantity || 1),
                0,
              );
            const waiterName = order.waiter?.name || order.waiterName || "—";

            return (
              <motion.div
                key={order._id || idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: idx * 0.03 }}
                className={`border-t transition-colors ${isDark ? "border-gray-800 hover:bg-gray-800/60" : "border-gray-100 hover:bg-gray-50"}`}
              >
                {/* Mobile */}
                <div className="sm:hidden p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-black text-sm text-red-600">
                      {fmt(total)} so'm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {order.user?.name || "Noma'lum"}
                      </p>
                      <p
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {fmtDate(order.date || order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${waiterName === "—" ? (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500") : isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                    >
                      {waiterName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}
                    >
                      Ko'rish
                    </button>
                    <button
                      onClick={() => onDelete(order._id || order.id)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[48px_160px_1fr_1fr_120px_80px] gap-2 items-center px-4 py-3.5">
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                  >
                    #{idx + 1}
                  </span>
                  <p
                    className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {fmtDate(order.date || order.createdAt)}
                  </p>
                  <div>
                    <p
                      className={`text-sm font-semibold truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {order.user?.name || "Noma'lum"}
                    </p>
                    {order.table && (
                      <p
                        className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Stol #{order.table}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-block w-fit text-xs font-bold px-2 py-1 rounded-lg ${waiterName === "—" ? (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500") : isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                  >
                    {waiterName}
                  </span>
                  <div className="text-right">
                    <span className="font-black text-sm text-red-600">
                      {fmt(total)} so'm
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className={`p-1.5 rounded-lg ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order._id || order.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== WAITERS SECTION =====
const WaitersSection = ({ waiters, setWaiters, orders, isDark }) => {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveWaiters = (list) => {
    setWaiters(list);
    ls.set("admin_waiters", list);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      saveWaiters(
        waiters.map((w) => (w.id === editId ? { ...w, ...form } : w)),
      );
      setEditId(null);
    } else {
      saveWaiters([
        ...waiters,
        { id: Date.now(), ...form, joinedAt: new Date().toISOString() },
      ]);
    }
    setForm({ name: "", phone: "" });
    setShowForm(false);
  };

  const waiterStats = useMemo(() => {
    const stats = {};
    orders.forEach((order) => {
      const wName = order.waiter?.name || order.waiterName;
      if (!wName) return;
      if (!stats[wName]) stats[wName] = { count: 0, total: 0 };
      const items = order.items || order.products || [];
      const total =
        Number(order.totalPrice || order.summa || order.total || 0) ||
        items.reduce(
          (s, i) =>
            s +
            Number(i.narxi || i.price || 0) * Number(i.soni || i.quantity || 1),
          0,
        );
      stats[wName].count++;
      stats[wName].total += total;
    });
    return stats;
  }, [orders]);

  const inp = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDark ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-red-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500"}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setShowForm((p) => !p);
            setEditId(null);
            setForm({ name: "", phone: "" });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-600/20"
        >
          <UserPlus className="w-4 h-4" /> Ofisiant qo'shish
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden rounded-2xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
          >
            <div className="p-4 space-y-3">
              <h3
                className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {editId ? "Tahrirlash" : "Yangi ofisiant"}
              </h3>
              <input
                className={inp}
                placeholder="Ism *"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                className={inp}
                placeholder="Telefon"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Saqlash
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-sm ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}
                >
                  Bekor
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {waiters.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl border ${isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}
        >
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Hali ofisiant qo'shilmagan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {waiters.map((w, idx) => {
            const stat = waiterStats[w.name] || { count: 0, total: 0 };
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <span className="text-white font-black text-lg">
                        {w.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {w.name}
                      </p>
                      <p
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {w.phone || "Telefon yo'q"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditId(w.id);
                        setForm({ name: w.name, phone: w.phone || "" });
                        setShowForm(true);
                      }}
                      className={`p-1.5 rounded-lg ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("O'chirilsinmi?"))
                          saveWaiters(waiters.filter((wt) => wt.id !== w.id));
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`p-2.5 rounded-xl text-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <p className="font-black text-lg text-blue-500">
                      {stat.count}
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Buyurtma
                    </p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl text-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <p className={`font-black text-sm text-red-500 truncate`}>
                      {fmt(stat.total)}
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      so'm
                    </p>
                  </div>
                </div>
                {w.joinedAt && (
                  <p
                    className={`mt-2 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Qo'shilgan:{" "}
                    {new Date(w.joinedAt).toLocaleDateString("uz-UZ")}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ===== DASHBOARD =====
const DashboardSection = ({ orders, products, waiters, isDark }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    let totalRevenue = 0,
      todayRevenue = 0,
      weekRevenue = 0,
      monthRevenue = 0;
    const itemCount = {},
      waiterCount = {};

    orders.forEach((order) => {
      const items = order.items || order.products || [];
      const price =
        Number(order.totalPrice || order.summa || order.total || 0) ||
        items.reduce(
          (s, i) =>
            s +
            Number(i.narxi || i.price || 0) * Number(i.soni || i.quantity || 1),
          0,
        );
      const oDate = new Date(order.date || order.createdAt);
      const oStr = oDate.toISOString().split("T")[0];

      totalRevenue += price;
      if (oStr === todayStr) todayRevenue += price;
      if (oDate >= weekAgo) weekRevenue += price;
      if (oDate >= monthAgo) monthRevenue += price;

      items.forEach((it) => {
        const name = it.nomi || it.name || it.title || "Mahsulot";
        itemCount[name] =
          (itemCount[name] || 0) + Number(it.soni || it.quantity || 1);
      });

      const wName = order.waiter?.name || order.waiterName;
      if (wName) {
        if (!waiterCount[wName]) waiterCount[wName] = { count: 0, total: 0 };
        waiterCount[wName].count++;
        waiterCount[wName].total += price;
      }
    });

    return {
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      topProducts: Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      topWaiters: Object.entries(waiterCount)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5),
      totalOrders: orders.length,
    };
  }, [orders]);

  const cards = [
    {
      label: "Bugungi daromad",
      value: `${fmt(stats.todayRevenue)} so'm`,
      icon: TrendingUp,
      col: isDark
        ? "from-green-600 to-emerald-700"
        : "from-green-500 to-emerald-600",
      bg: isDark
        ? "bg-green-900/20 border-green-800/30"
        : "bg-green-50 border-green-100",
    },
    {
      label: "Haftalik daromad",
      value: `${fmt(stats.weekRevenue)} so'm`,
      icon: BarChart3,
      col: "from-blue-500 to-blue-700",
      bg: isDark
        ? "bg-blue-900/20 border-blue-800/30"
        : "bg-blue-50 border-blue-100",
    },
    {
      label: "Oylik daromad",
      value: `${fmt(stats.monthRevenue)} so'm`,
      icon: ArrowUpRight,
      col: "from-purple-500 to-purple-700",
      bg: isDark
        ? "bg-purple-900/20 border-purple-800/30"
        : "bg-purple-50 border-purple-100",
    },
    {
      label: "Jami buyurtmalar",
      value: stats.totalOrders,
      icon: ShoppingBag,
      col: "from-red-500 to-red-700",
      bg: isDark
        ? "bg-red-900/20 border-red-800/30"
        : "bg-red-50 border-red-100",
    },
    {
      label: "Mahsulotlar",
      value: products.length,
      icon: Package,
      col: "from-orange-500 to-orange-600",
      bg: isDark
        ? "bg-orange-900/20 border-orange-800/30"
        : "bg-orange-50 border-orange-100",
    },
    {
      label: "Ofisiantlar",
      value: waiters.length,
      icon: Users,
      col: "from-sky-500 to-sky-600",
      bg: isDark
        ? "bg-sky-900/20 border-sky-800/30"
        : "bg-sky-50 border-sky-100",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border p-4 ${c.bg}`}
          >
            <div
              className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${c.col} mb-3`}
            >
              <c.icon className="w-4 h-4 text-white" />
            </div>
            <p
              className={`text-xs font-semibold mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {c.label}
            </p>
            <p
              className={`text-lg font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {c.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div
          className={`rounded-2xl border p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-500" />
            <h3
              className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Ko'p sotilgan mahsulotlar
            </h3>
          </div>
          {stats.topProducts.length === 0 ? (
            <p
              className={`text-sm text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Ma'lumot yo'q
            </p>
          ) : (
            stats.topProducts.map(([name, qty], i) => (
              <div
                key={name}
                className="flex items-center gap-3 mb-2.5 last:mb-0"
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black flex-shrink-0 ${
                    i === 0
                      ? "bg-amber-500 text-white"
                      : i === 1
                        ? "bg-gray-400 text-white"
                        : i === 2
                          ? "bg-orange-600 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p
                      className={`text-sm font-semibold truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {name}
                    </p>
                    <span className="text-xs font-bold text-red-600 ml-2 flex-shrink-0">
                      {qty} ta
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(qty / stats.topProducts[0][1]) * 100}%`,
                      }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top Waiters */}
        <div
          className={`rounded-2xl border p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-500" />
            <h3
              className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Eng faol ofisiantlar
            </h3>
          </div>
          {stats.topWaiters.length === 0 ? (
            <p
              className={`text-sm text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Ma'lumot yo'q
            </p>
          ) : (
            stats.topWaiters.map(([name, data], i) => (
              <div
                key={name}
                className={`flex items-center gap-3 mb-2.5 last:mb-0 p-2.5 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black text-white flex-shrink-0 bg-gradient-to-br ${
                    i === 0
                      ? "from-amber-400 to-amber-600"
                      : i === 1
                        ? "from-gray-400 to-gray-500"
                        : "from-blue-500 to-blue-700"
                  }`}
                >
                  {name[0]?.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {name}
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {data.count} ta buyurtma
                  </p>
                </div>
                <p className="text-sm font-black text-red-600 flex-shrink-0">
                  {fmt(data.total)} so'm
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Total Revenue Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-700 p-5 text-white shadow-lg shadow-red-600/20">
        <p className="text-sm font-semibold opacity-80 mb-1">
          Umumiy foyda (barcha vaqt)
        </p>
        <p className="text-3xl font-black">{fmt(stats.totalRevenue)} so'm</p>
        <p className="text-xs opacity-60 mt-1">
          {stats.totalOrders} ta buyurtmadan
        </p>
      </div>
    </div>
  );
};

// ===== MAIN =====
export default function AdminPanel() {
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin_theme") === "dark",
  );
  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("admin_theme", next ? "dark" : "light");
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statsSubTab, setStatsSubTab] = useState("kunlik");
  const [waiters, setWaiters] = useState(() => ls.get("admin_waiters", []));

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    nomi: "",
    title: "",
    narxi: "",
    category: "",
    rasmi: "",
  });
  const [newCatName, setNewCatName] = useState("");

  const loadData = useCallback(async (isSilent = false) => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("is_admin_authenticated") !== "true") return;
    if (!isSilent) setLoading(true);
    try {
      const [oRes, pRes, cRes] = await Promise.all([
        fetch("https://my-menu-backend-1.onrender.com/api/orders").then((r) =>
          r.json(),
        ),
        fetch("https://my-menu-backend-1.onrender.com/api/products").then((r) =>
          r.json(),
        ),
        fetch("https://my-menu-backend-1.onrender.com/api/categories").then(
          (r) => r.json(),
        ),
      ]);
      const freshOrders = Array.isArray(oRes)
        ? oRes
        : oRes.orders || oRes.data?.orders || [];
      if (freshOrders.length > 0) {
        const existingArchive = JSON.parse(
          localStorage.getItem("orders_archive") || "[]",
        );
        const newToArchive = freshOrders.filter(
          (fo) =>
            !existingArchive.some(
              (ao) => (ao._id || ao.id) === (fo._id || fo.id),
            ),
        );
        if (newToArchive.length > 0)
          localStorage.setItem(
            "orders_archive",
            JSON.stringify([...existingArchive, ...newToArchive]),
          );
      }
      setOrders(freshOrders);
      setProducts(Array.isArray(pRes) ? pRes : pRes.products || []);
      setCategories(Array.isArray(cRes) ? cRes : cRes.categories || []);
    } catch (err) {
      console.error("Yuklashda xato:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("is_admin_authenticated") === "true")
      setIsAdmin(true);
  }, []);
  useEffect(() => {
    if (isAdmin) {
      loadData();
      const interval = setInterval(() => loadData(true), 15000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, loadData]);

  const processedStats = useMemo(() => {
    const report = {
      kunlik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] },
      haftalik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] },
      oylik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] },
    };
    const archive =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("orders_archive") || "[]")
        : [];
    const now = new Date();

    // Safe ISO date — undefined/null/invalid ga qarshi himoya
    const getLocalISO = (d) => {
      if (!d) return null;
      const t = new Date(d);
      if (isNaN(t.getTime())) return null;
      t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      return t.toISOString().split("T")[0];
    };

    const todayStr = getLocalISO(now);
    const setupTrend = (period, days) => {
      report[period].trend = [];
      for (let i = days; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = getLocalISO(d);
        if (key)
          report[period].trend.push({
            key,
            label: `${d.getDate()}/${d.getMonth() + 1}`,
            total: 0,
          });
      }
    };
    setupTrend("kunlik", 6);
    setupTrend("haftalik", 7);
    setupTrend("oylik", 29);
    if (archive.length === 0) return report;
    archive.forEach((order) => {
      let price = Number(order.totalPrice || order.summa || order.total || 0);
      const orderItems = order.items || order.products || [];
      if (price === 0 && orderItems.length > 0)
        price = orderItems.reduce(
          (acc, it) =>
            acc +
            Number(it.narxi || it.price || 0) *
              Number(it.soni || it.quantity || 1),
          0,
        );

      // Sana xavfsiz olish
      const rawDate = order.date || order.createdAt || order.timestamp;
      const oKey = getLocalISO(rawDate);
      if (!oKey || !todayStr) return; // noto'g'ri sana bo'lsa o'tkazib yubor

      const diffDays = Math.round(
        (new Date(todayStr).getTime() - new Date(oKey).getTime()) / 86400000,
      );
      const add = (period) => {
        report[period].summa += price;
        report[period].count++;
        const pt = report[period].trend.find((t) => t.key === oKey);
        if (pt) pt.total += price;
        orderItems.forEach((it) => {
          const name = it.nomi || it.name || it.title || "Mahsulot";
          report[period].items[name] =
            (report[period].items[name] || 0) +
            Number(it.soni || it.quantity || 1);
        });
      };
      if (oKey === todayStr) add("kunlik");
      if (diffDays >= 0 && diffDays <= 7) add("haftalik");
      if (diffDays >= 0 && diffDays <= 30) add("oylik");
    });
    ["kunlik", "haftalik", "oylik"].forEach((p) => {
      report[p].sorted = Object.entries(report[p].items)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 10);
    });
    return report;
  }, [orders]);

  const handleAddProduct = async (e) => {
    if (e) e.preventDefault();
    if (!productForm.nomi || !productForm.narxi)
      return alert("Nom va narx majburiy!");
    setLoading(true);
    try {
      const res = await fetch(
        "https://my-menu-backend-1.onrender.com/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        },
      );
      if (res.ok) {
        setProductForm({
          nomi: "",
          title: "",
          narxi: "",
          category: "",
          rasmi: "",
        });
        setActiveTab("products");
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://my-menu-backend-1.onrender.com/api/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomi: newCatName }),
        },
      );
      if (res.ok) {
        setNewCatName("");
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("O'chirilsinmi?")) return;
    try {
      const res = await fetch(
        `https://my-menu-backend-1.onrender.com/api/${type}/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) loadData(true);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "orders", label: "🛒 Buyurtmalar" },
    { id: "waiters", label: "👨‍🍳 Ofisiantlar" },
    { id: "products", label: "📦 Mahsulotlar" },
    { id: "add-product", label: "➕ Mahsulot qo'sh" },
    { id: "categories", label: "🗂 Kategoriyalar" },
    { id: "stats", label: "📈 Statistika" },
  ];

  if (!isAdmin)
    return (
      <ThemeContext.Provider value={{ dark, toggle: toggleTheme }}>
        <LoginScreen setIsAdmin={setIsAdmin} />
      </ThemeContext.Provider>
    );

  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleTheme }}>
      <div
        className={`flex min-h-screen transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* HEADER */}
          <header
            className={`sticky top-0 border-b z-40 p-4 shadow-sm transition-colors duration-300 ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-xl">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    Menu Admin
                  </h1>
                  <p
                    className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Boshqaruv paneli
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-5 h-5 text-red-600" />
                  </motion.div>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => loadData(true)}
                  className={`p-2 rounded-xl border ${dark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-600"}`}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl border transition-colors ${dark ? "bg-gray-800 border-gray-700 text-amber-400" : "bg-blue-50 border-blue-100 text-blue-600"}`}
                >
                  {dark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </motion.button>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border ${dark ? "bg-red-950 border-red-900" : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"}`}
                >
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span
                    className={`text-xs font-bold uppercase ${dark ? "text-red-400" : "text-red-700"}`}
                  >
                    FAOL
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2 pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                        : dark
                          ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-red-600 hover:text-red-400"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <DashboardSection
                    orders={orders}
                    products={products}
                    waiters={waiters}
                    isDark={dark}
                  />
                </motion.div>
              )}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <OrdersSection
                    orders={orders}
                    onDelete={(id) => deleteItem(id, "orders")}
                    isDark={dark}
                  />
                </motion.div>
              )}
              {activeTab === "waiters" && (
                <motion.div
                  key="waiters"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <WaitersSection
                    waiters={waiters}
                    setWaiters={setWaiters}
                    orders={orders}
                    isDark={dark}
                  />
                </motion.div>
              )}
              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20"
                >
                  {products.length === 0 && !loading && (
                    <div
                      className={`col-span-full text-center py-20 text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Mahsulotlar topilmadi
                    </div>
                  )}
                  {products.map((p, idx) => (
                    <motion.div
                      key={p._id || p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ProductCard
                        item={p}
                        onDelete={(id) => deleteItem(id, "products")}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {activeTab === "add-product" && (
                <motion.div
                  key="add-product"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <AddProductForm
                    form={productForm}
                    setForm={setProductForm}
                    categories={categories}
                    onSubmit={handleAddProduct}
                  />
                </motion.div>
              )}
              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <CategoryManager
                    categories={categories}
                    onAdd={handleAddCategory}
                    onDelete={(id) => deleteItem(id, "categories")}
                    newCat={newCatName}
                    setNewCat={setNewCatName}
                  />
                </motion.div>
              )}
              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <StatsView
                    data={processedStats[statsSubTab]}
                    subTab={statsSubTab}
                    setSubTab={setStatsSubTab}
                    onDetailClick={() => setActiveTab("detailed-stats")}
                  />
                </motion.div>
              )}
              {activeTab === "detailed-stats" && (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <DetailedStats
                    data={processedStats[statsSubTab]}
                    subTab={statsSubTab}
                    setSubTab={setStatsSubTab}
                    onBack={() => setActiveTab("stats")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
