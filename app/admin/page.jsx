"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsView } from './components/StatsView';
import { ProductCard } from './components/ProductCard';
import { LoginScreen } from './components/LoginScreen';
import { OrdersView } from './components/OrdersView';
import { AddProductForm } from './components/AddProductForm';
import { CategoryManager } from './components/CategoryManager';
import { DetailedStats } from './components/DetailedStats';

import { Loader2, Menu, ChefHat, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // ✅ default: products
  const [statsSubTab, setStatsSubTab] = useState('kunlik');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [productForm, setProductForm] = useState({ nomi: "", title: "", narxi: "", category: "", rasmi: "" });
  const [newCatName, setNewCatName] = useState("");

  // 📥 MA'LUMOTLARNI YUKLASH VA ARXIVGA SAQLASH
  const loadData = useCallback(async (isSilent = false) => {
    if (typeof window === 'undefined') return;
    const auth = localStorage.getItem("is_admin_authenticated");
    if (auth !== "true") return;

    if (!isSilent) setLoading(true); 

    try {
      const [oRes, pRes, cRes] = await Promise.all([
        fetch("https://my-menu-backend-1.onrender.com/api/orders").then(r => r.json()),
        fetch("https://my-menu-backend-1.onrender.com/api/products").then(r => r.json()),
        fetch("https://my-menu-backend-1.onrender.com/api/categories").then(r => r.json())
      ]);

      const freshOrders = Array.isArray(oRes) ? oRes : (oRes.orders || oRes.data?.orders || []);
      
      // 🔥 STATISTIKA O'CHIB KETMASLIGI UCHUN ARXIVLASH
      if (freshOrders.length > 0) {
        const existingArchive = JSON.parse(localStorage.getItem('orders_archive') || '[]');
        const newToArchive = freshOrders.filter(fo => 
          !existingArchive.some(ao => (ao._id || ao.id) === (fo._id || fo.id))
        );
        
        if (newToArchive.length > 0) {
          localStorage.setItem('orders_archive', JSON.stringify([...existingArchive, ...newToArchive]));
        }
      }

      setOrders(freshOrders);
      setProducts(Array.isArray(pRes) ? pRes : (pRes.products || []));
      setCategories(Array.isArray(cRes) ? cRes : (cRes.categories || []));
    } catch (err) {
      console.error("Yuklashda xato:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("is_admin_authenticated") === "true") setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
      const interval = setInterval(() => loadData(true), 15000); 
      return () => clearInterval(interval);
    }
  }, [isAdmin, loadData]);

  // 📊 STATISTIKANI ARXIVDAN HISOBLASH
  const processedStats = useMemo(() => {
    const report = {
      kunlik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] },
      haftalik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] },
      oylik: { summa: 0, count: 0, trend: [], items: {}, sorted: [] }
    };

    const archive = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orders_archive') || '[]') : [];
    
    const now = new Date();
    const getLocalISO = (d) => {
      const target = new Date(d);
      target.setMinutes(target.getMinutes() - target.getTimezoneOffset());
      return target.toISOString().split('T')[0];
    };
    const todayStr = getLocalISO(now);

    const setupTrend = (period, days) => {
      report[period].trend = [];
      for (let i = days; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i);
        const key = getLocalISO(d);
        report[period].trend.push({ key, label: `${d.getDate()}/${d.getMonth()+1}`, total: 0 });
      }
    };

    setupTrend('kunlik', 6);
    setupTrend('haftalik', 7);
    setupTrend('oylik', 29);

    if (archive.length === 0) return report;

    archive.forEach(order => {
      let price = Number(order.totalPrice || order.summa || order.total || 0);
      const orderItems = order.items || order.products || [];

      if (price === 0 && orderItems.length > 0) {
        price = orderItems.reduce((acc, it) => acc + (Number(it.narxi || it.price || 0) * Number(it.soni || it.quantity || 1)), 0);
      }

      const rawDate = order.date || order.createdAt || order.timestamp;
      let oDate = new Date(rawDate);
      const oKey = getLocalISO(isNaN(oDate.getTime()) ? new Date() : oDate);
      const diffDays = Math.round((new Date(todayStr).getTime() - new Date(oKey).getTime()) / (1000 * 60 * 60 * 24));

      const addToPeriod = (period) => {
        report[period].summa += price;
        report[period].count++;
        const point = report[period].trend.find(t => t.key === oKey);
        if (point) point.total += price;
        orderItems.forEach(it => {
          const name = it.nomi || it.name || it.title || "Mahsulot";
          report[period].items[name] = (report[period].items[name] || 0) + Number(it.soni || it.quantity || 1);
        });
      };

      if (oKey === todayStr) addToPeriod('kunlik');
      if (diffDays >= 0 && diffDays <= 7) addToPeriod('haftalik');
      if (diffDays >= 0 && diffDays <= 30) addToPeriod('oylik');
    });

    ['kunlik', 'haftalik', 'oylik'].forEach(p => {
      report[p].sorted = Object.entries(report[p].items)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty).slice(0, 10);
    });

    return report;
  }, [orders]);

  const handleAddProduct = async (e) => {
    if (e) e.preventDefault();
    if (!productForm.nomi || !productForm.narxi) return alert("Nom va narx majburiy!");
    setLoading(true);
    try {
      const res = await fetch("https://my-menu-backend-1.onrender.com/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        setProductForm({ nomi: "", title: "", narxi: "", category: "", rasmi: "" });
        setActiveTab('products');
        loadData(true);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://my-menu-backend-1.onrender.com/api/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomi: newCatName })
      });
      if (res.ok) { setNewCatName(""); loadData(true); }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("O'chirilsinmi?")) return;
    try {
      const res = await fetch(`https://my-menu-backend-1.onrender.com/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) loadData(true);
    } catch (err) { console.error(err); }
  };

  if (!isAdmin) return <LoginScreen setIsAdmin={setIsAdmin} />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-40 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Menu Admin</h1>
                <p className="text-xs text-gray-500">Boshqaruv paneli</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Loader2 className="w-5 h-5 text-red-600" />
                </motion.div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-200">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-700 uppercase">FAOL</span>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-1">
              {[
                { id: 'products',     label: 'Mahsulotlar' },
                { id: 'add-product',  label: "Mahsulot Qo'sh" },
                { id: 'categories',   label: 'Kategoriyalar' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20"
              >
                {products.length === 0 && !loading && (
                  <div className="col-span-full text-center text-gray-400 py-20 text-sm">
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
                      onDelete={(id) => deleteItem(id, 'products')} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'add-product' && (
              <motion.div
                key="add-product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AddProductForm 
                  form={productForm} 
                  setForm={setProductForm} 
                  categories={categories} 
                  onSubmit={handleAddProduct} 
                />
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryManager 
                  categories={categories} 
                  onAdd={handleAddCategory} 
                  onDelete={(id) => deleteItem(id, 'categories')} 
                  newCat={newCatName} 
                  setNewCat={setNewCatName} 
                />
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrdersView 
                  orders={orders} 
                  onDelete={(id) => deleteItem(id, 'orders')} 
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div 
                key="stats" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StatsView 
                  data={processedStats[statsSubTab]} 
                  subTab={statsSubTab} 
                  setSubTab={setStatsSubTab}
                  onDetailClick={() => setActiveTab('detailed-stats')} 
                />
              </motion.div>
            )}

            {activeTab === 'detailed-stats' && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetailedStats 
                  data={processedStats[statsSubTab]} 
                  subTab={statsSubTab} 
                  setSubTab={setStatsSubTab} 
                  onBack={() => setActiveTab('stats')} 
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}