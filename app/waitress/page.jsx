"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  MapPin,
  Phone,
  Clock,
  ChefHat,
  Info,
  Moon,
  Sun,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  LogOut,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== UTILS ====================
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

// ==================== AUTH SCREEN ====================
const AuthScreen = ({ onAuth, isDark }) => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inp = `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all duration-200 ${
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-red-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20`;

  const handleSubmit = () => {
    setError("");
    setSuccess("");
    const users = ls.get("menu_users", []);

    if (mode === "register") {
      if (!form.name.trim()) return setError("Ismingizni kiriting");
      if (!form.phone.trim() || form.phone.length < 9)
        return setError("Telefon raqam noto'g'ri");
      if (!form.password || form.password.length < 4)
        return setError("Parol kamida 4 ta belgidan iborat bo'lsin");
      if (users.find((u) => u.phone === form.phone))
        return setError("Bu raqam allaqachon ro'yxatdan o'tgan");

      const newUser = {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        password: form.password,
      };
      ls.set("menu_users", [...users, newUser]);
      ls.set("menu_current_user", newUser);
      setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! 🎉");
      setTimeout(() => onAuth(newUser), 1000);
    } else {
      if (!form.phone.trim() || !form.password)
        return setError("Barcha maydonlarni to'ldiring");
      const user = users.find(
        (u) => u.phone === form.phone && u.password === form.password,
      );
      if (!user) return setError("Telefon raqam yoki parol noto'g'ri");
      ls.set("menu_current_user", user);
      onAuth(user);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-gradient-to-br from-red-50 via-orange-50 to-amber-50"}`}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 rounded-3xl shadow-2xl shadow-red-600/30">
          <ChefHat className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`w-full max-w-sm rounded-3xl shadow-xl p-6 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}
      >
        <h1
          className={`text-2xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {mode === "login" ? "Xush kelibsiz 👋" : "Ro'yxatdan o'tish"}
        </h1>
        <p
          className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {mode === "login" ? "Hisobingizga kiring" : "Yangi hisob yarating"}
        </p>

        <div className="space-y-3">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <input
                className={inp}
                placeholder="Ismingiz"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </motion.div>
          )}
          <input
            className={inp}
            placeholder="+998 __ ___ __ __"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            type="tel"
          />
          <div className="relative">
            <input
              className={inp}
              placeholder="Parol"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              type={showPass ? "text" : "password"}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={() => setShowPass((p) => !p)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {showPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> {success}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full mt-5 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm"
        >
          {mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <div
          className={`mt-5 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          {mode === "login" ? (
            <>
              Hisobingiz yo'qmi?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                  setForm({ name: "", phone: "", password: "" });
                }}
                className="text-red-600 font-bold hover:underline"
              >
                Ro'yxatdan o'ting
              </button>
            </>
          ) : (
            <>
              Hisobingiz bormi?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                  setForm({ name: "", phone: "", password: "" });
                }}
                className="text-red-600 font-bold hover:underline"
              >
                Kirish
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ==================== FOOD CARD ====================
const FoodCard = ({ food, isDark, onCardClick, onAddToCart }) => {
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: isDark
          ? "0 12px 24px rgba(0,0,0,0.4)"
          : "0 12px 24px rgba(0,0,0,0.1)",
      }}
      transition={{ duration: 0.2 }}
      className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group relative`}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`relative aspect-square ${isDark ? "bg-gray-700" : "bg-gray-100"} overflow-hidden`}
        onClick={() => onCardClick(food)}
      >
        <img
          src={food.rasmi || "https://via.placeholder.com/300"}
          alt={food.nomi}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showHeart && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-4xl"
            >
              ❤️
            </motion.div>
          </motion.div>
        )}
        {food.discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{food.discount}%
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3
          className={`font-bold text-sm ${isDark ? "text-gray-100" : "text-gray-900"} truncate`}
        >
          {food.nomi}
        </h3>
        <p
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} truncate italic mb-2.5`}
        >
          {food.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-red-600">
            {Number(food.narxi).toLocaleString()} so'm
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(food);
            }}
            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CART DRAWER ====================
const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  setCart,
  user,
  isDark,
  language,
}) => {
  const [orderStep, setOrderStep] = useState("cart"); // "cart" | "confirm" | "success"
  const [note, setNote] = useState("");
  const [table, setTable] = useState("");

  const total = cart.reduce((s, i) => s + i.narxi * i.qty, 0);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const sendOrder = async () => {
    const orderData = {
      user: { name: user.name, phone: user.phone },
      items: cart.map((i) => ({ nomi: i.nomi, narxi: i.narxi, soni: i.qty })),
      totalPrice: total,
      table,
      note,
      date: new Date().toISOString(),
    };
    try {
      await fetch("https://my-menu-backend-1.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } catch (e) {
      console.error(e);
    }

    // Save to local order history
    const history = ls.get("menu_order_history", []);
    ls.set(
      "menu_order_history",
      [{ ...orderData, id: Date.now() }, ...history].slice(0, 20),
    );

    setCart([]);
    setOrderStep("success");
  };

  const inp = `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-red-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full max-w-sm z-[80] flex flex-col shadow-2xl ${isDark ? "bg-gray-900" : "bg-white"}`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}
            >
              <h2
                className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {orderStep === "success"
                  ? "✅ Buyurtma yuborildi!"
                  : orderStep === "confirm"
                    ? "Tasdiqlash"
                    : "🛒 Savat"}
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                <X
                  className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {orderStep === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: 2, duration: 0.5 }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>
                  <h3
                    className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Rahmat, {user.name}!
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Buyurtmangiz qabul qilindi. Tez orada tayyorlaymiz!
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setOrderStep("cart");
                      setNote("");
                      setTable("");
                      onClose();
                    }}
                    className="mt-4 px-6 py-3 bg-red-600 text-white font-bold rounded-xl"
                  >
                    Yopish
                  </motion.button>
                </motion.div>
              )}

              {orderStep === "confirm" && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                  >
                    <h4
                      className={`font-bold text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Buyurtma tafsiloti
                    </h4>
                    {cart.map((i) => (
                      <div
                        key={i._id}
                        className={`flex justify-between text-sm py-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <span>
                          {i.nomi} × {i.qty}
                        </span>
                        <span className="font-semibold">
                          {(i.narxi * i.qty).toLocaleString()} so'm
                        </span>
                      </div>
                    ))}
                    <div
                      className={`mt-3 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"} flex justify-between font-black text-red-600`}
                    >
                      <span>Jami</span>
                      <span>{total.toLocaleString()} so'm</span>
                    </div>
                  </div>

                  <input
                    className={inp}
                    placeholder="Stol raqami (ixtiyoriy)"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                  />
                  <textarea
                    className={`${inp} resize-none`}
                    rows={3}
                    placeholder="Qo'shimcha izoh..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  <div
                    className={`p-3 rounded-xl text-xs ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                  >
                    <span className="font-bold">Mijoz:</span> {user.name} ·{" "}
                    {user.phone}
                  </div>
                </div>
              )}

              {orderStep === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                      <ShoppingCart
                        className={`w-16 h-16 ${isDark ? "text-gray-700" : "text-gray-200"}`}
                      />
                      <p
                        className={`font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Savat bo'sh
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                        >
                          <div
                            className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                          >
                            <img
                              src={
                                item.rasmi || "https://via.placeholder.com/100"
                              }
                              alt={item.nomi}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-bold text-sm truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                              {item.nomi}
                            </p>
                            <p className="text-xs font-semibold text-red-600">
                              {(item.narxi * item.qty).toLocaleString()} so'm
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQty(item._id, -1)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span
                              className={`w-6 text-center text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {item.qty}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQty(item._id, 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-600 text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {orderStep !== "success" && cart.length > 0 && (
              <div
                className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"} space-y-3`}
              >
                {orderStep === "cart" && (
                  <div
                    className={`flex justify-between text-sm font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <span>Jami</span>
                    <span className="text-red-600">
                      {total.toLocaleString()} so'm
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  {orderStep === "confirm" && (
                    <button
                      onClick={() => setOrderStep("cart")}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"}`}
                    >
                      ← Orqaga
                    </button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      orderStep === "cart"
                        ? setOrderStep("confirm")
                        : sendOrder()
                    }
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                  >
                    {orderStep === "cart" ? (
                      <>
                        <span>Buyurtma berish</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Tasdiqlash</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== FOOD DETAIL MODAL ====================
const FoodDetailModal = ({ food, isOpen, onClose, isDark, onAddToCart }) => {
  if (!food) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[75] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full aspect-video ${isDark ? "bg-gray-700" : "bg-gray-200"} overflow-hidden`}
            >
              <img
                src={food.rasmi || "https://via.placeholder.com/500"}
                alt={food.nomi}
                className="w-full h-full object-cover"
              />
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 ${isDark ? "bg-gray-800/90" : "bg-white/90"} p-2 rounded-full shadow-lg`}
              >
                <X
                  className={`w-5 h-5 ${isDark ? "text-gray-200" : "text-gray-700"}`}
                />
              </button>
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg">
                {Number(food.narxi).toLocaleString()} so'm
              </div>
            </div>
            <div className="p-5">
              <h1
                className={`text-2xl font-black mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {food.nomi}
              </h1>
              <p
                className={`${isDark ? "text-gray-400" : "text-gray-500"} italic mb-4`}
              >
                {food.title}
              </p>
              {food.category && (
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-600"}`}
                >
                  {food.category}
                </span>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onAddToCart(food);
                  onClose();
                }}
                className="w-full mt-5 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <ShoppingCart className="w-4 h-4" /> Savatga qo'shish
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== MAIN PAGE ====================
const MenuPage = () => {
  const [user, setUser] = useState(() => ls.get("menu_current_user", null));
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(["Barchasi"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [language, setLanguage] = useState("uzb");
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodDetail, setShowFoodDetail] = useState(false);
  const [isDark, setIsDark] = useState(() => ls.get("menu_theme") === "dark");
  const [cart, setCart] = useState(() => ls.get("menu_cart", []));
  const [showCart, setShowCart] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    ls.set("menu_cart", cart);
  }, [cart]);
  // Sync theme
  useEffect(() => {
    ls.set("menu_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, cRes] = await Promise.all([
          fetch("https://my-menu-backend-1.onrender.com/api/products"),
          fetch("https://my-menu-backend-1.onrender.com/api/categories"),
        ]);
        const fData = await fRes.json();
        setFoods(fData);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(["Barchasi", ...cData.map((c) => c.nomi)]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = useCallback((food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === food._id);
      if (existing)
        return prev.map((i) =>
          i._id === food._id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...food, qty: 1 }];
    });
  }, []);

  const handleLogout = () => {
    if (window.confirm("Hisobdan chiqishni xohlaysizmi?")) {
      ls.set("menu_current_user", null);
      setUser(null);
      setCart([]);
    }
  };

  const filtered = (Array.isArray(foods) ? foods : []).filter(
    (f) =>
      (selectedCategory === "Barchasi" || f.category === selectedCategory) &&
      f.nomi?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ---- AUTH GATE ----
  if (!user) return <AuthScreen onAuth={setUser} isDark={isDark} />;

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}
    >
      {/* HEADER */}
      <header
        className={`sticky top-0 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} border-b z-40 p-4 shadow-sm transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                Menu
              </h1>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Salom,{" "}
                <span className="text-red-500 font-semibold">{user.name}</span>!
                👋
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language */}
            <div
              className={`flex items-center ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg p-1`}
            >
              {["uzb", "rus"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${language === l ? "bg-red-600 text-white" : isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {l === "uzb" ? "O'Z" : "РУ"}
                </button>
              ))}
            </div>
            {/* Info */}
            <button
              onClick={() => setShowInfo(true)}
              className={`p-2 ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"} rounded-lg`}
            >
              <Info className="w-5 h-5" />
            </button>
            {/* Dark mode */}
            <button
              onClick={() => setIsDark((d) => !d)}
              className={`p-2 rounded-lg transition-all ${isDark ? "bg-yellow-600/20 text-yellow-400" : "bg-blue-100 text-blue-600"}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg ${isDark ? "bg-gray-700 text-gray-400 hover:text-red-400" : "bg-gray-100 text-gray-600 hover:text-red-600"} transition-colors`}
            >
              <LogOut className="w-5 h-5" />
            </button>
            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCart(true)}
              className="relative bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-colors shadow-lg shadow-red-600/30"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          />
          <input
            type="text"
            placeholder={language === "uzb" ? "Qidirish..." : "Поиск..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-gray-50 text-black border-gray-200"} rounded-xl py-2.5 pl-10 pr-10 outline-none text-sm focus:ring-2 focus:ring-red-500/30 border transition-colors`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "bg-gray-600" : "bg-gray-200"} p-1 rounded-full`}
            >
              <X
                className={`w-3 h-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 pb-1">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-md"
                    : isDark
                      ? "bg-gray-700 text-gray-300 border border-gray-600 hover:border-red-400"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-red-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-4 pb-8">
        {loading ? (
          <div
            className={`text-center py-20 flex flex-col items-center gap-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ChefHat className="w-8 h-8 text-red-600" />
            </motion.div>
            <span className="font-bold text-sm">
              {language === "uzb" ? "Yuklanmoqda..." : "Загрузка..."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.length === 0 ? (
              <div
                className={`col-span-full text-center py-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>
                  {language === "uzb"
                    ? "Hech narsa topilmadi"
                    : "Ничего не найдено"}
                </p>
              </div>
            ) : (
              filtered.map((food, idx) => (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <FoodCard
                    food={food}
                    isDark={isDark}
                    onCardClick={(f) => {
                      setSelectedFood(f);
                      setShowFoodDetail(true);
                    }}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      <FoodDetailModal
        food={selectedFood}
        isOpen={showFoodDetail}
        onClose={() => setShowFoodDetail(false)}
        isDark={isDark}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        setCart={setCart}
        user={user}
        isDark={isDark}
        language={language}
      />

      {/* INFO MODAL */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className={`${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {language === "uzb" ? "Restoran haqida" : "О ресторане"}
                  </h2>
                  <button
                    onClick={() => setShowInfo(false)}
                    className={`p-2 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"} rounded-full`}
                  >
                    <X
                      className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    />
                  </button>
                </div>
                {[
                  {
                    icon: MapPin,
                    label: language === "uzb" ? "Manzil" : "Адрес",
                    value: "Namangan, Almashriq",
                  },
                  {
                    icon: Phone,
                    label: language === "uzb" ? "Aloqa" : "Контакты",
                    value: "+998 99 123 45 67",
                  },
                  {
                    icon: Clock,
                    label: language === "uzb" ? "Ish vaqti" : "Время работы",
                    value: "07:00 – 23:00",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${isDark ? "bg-red-900/30" : "bg-red-100"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {label}
                      </p>
                      <p
                        className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
