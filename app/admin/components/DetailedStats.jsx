"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Zap, Clock, TrendingUp, 
  BarChart3, Calendar, Activity, 
  Users, Target, ShoppingBag, ArrowUpRight,
  MousePointer2, Layers
} from 'lucide-react';

export const DetailedStats = ({ data, subTab, setSubTab, onBack }) => {
  // 1. Ma'lumotlarni sanaga qarab guruhlash (Eng muhim qismi)
  const groupedTrend = useMemo(() => {
    if (!data?.trend || !Array.isArray(data.trend)) return [];
    
    // Agar backend'dan tayyor guruhlangan kelsa, shuni qaytaramiz
    // Agar kelmasa, frontend'da dublikatlarni oldini olamiz
    const groups = {};
    data.trend.forEach(item => {
      const key = item.label; // "10/02", "11/02" va h.k.
      if (!groups[key]) {
        groups[key] = { ...item, total: 0 };
      }
      // Agar bitta kunda bir nechta ma'lumot bo'lsa, ularni qo'shmaymiz, 
      // balki oxirgi kelganini (yoki eng kattasini) olamiz.
      // Sizning holatda "total" allaqachon jamlangan bo'lishi kerak.
      groups[key].total = Number(item.total || 0);
    });
    
    return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
  }, [data.trend]);

  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (groupedTrend.length > 0) {
      setSelectedDay(groupedTrend[groupedTrend.length - 1]);
    }
  }, [groupedTrend]);

  const maxTotal = useMemo(() => {
    if (groupedTrend.length === 0) return 1;
    return Math.max(...groupedTrend.map(t => Number(t.total || 0)), 1);
  }, [groupedTrend]);

  if (!data) return null;
  const topProduct = data.sorted?.[0] || null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#F3F6FD] p-4 md:p-8 font-sans"
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* --- 1. HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3.5 rounded-2xl bg-slate-900 text-white hover:bg-red-500 transition-all shadow-lg">
              <ChevronLeft size={22}/>
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">FastMenu <span className="text-red-500">Analytics</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Real-time Data Sync</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            {['kunlik', 'haftalik', 'oylik'].map(t => (
              <button key={t} onClick={() => setSubTab(t)} className={`px-8 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${subTab === t ? 'bg-white text-red-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
            ))}
          </div>
        </header>

        {/* --- 2. ASOSIY GRAFIK (Grouped Bars) --- */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <section className="col-span-12 lg:col-span-9 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic mb-1">Savdo hajmi dinamikasi</p>
                <h2 className="text-4xl font-black text-slate-900 italic leading-none">
                  {data.summa?.toLocaleString()} <span className="text-sm font-normal text-slate-400 not-italic">UZS</span>
                </h2>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Savdo</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mijoz</span>
                 </div>
              </div>
            </div>

            <div className="h-[320px] flex items-end justify-between gap-4 md:gap-6 px-2 relative z-10">
              {groupedTrend.map((t, i) => {
                const heightPercent = (Number(t.total || 0) / maxTotal) * 100;
                const isSelected = selectedDay?.label === t.label;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end" onClick={() => setSelectedDay(t)}>
                    <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                      {/* Savdo ustuni */}
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${Math.max(heightPercent, 8)}%` }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 relative ${isSelected ? 'bg-red-500 shadow-xl shadow-red-100' : 'bg-red-100 group-hover:bg-red-200'}`}
                      >
                         {isSelected && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-bold">{(t.total/1000).toFixed(1)}k</div>}
                      </motion.div>
                      
                      {/* Mijoz ustuni (Vizual uchun) */}
                      <div className="w-full max-w-[12px] rounded-t-lg bg-slate-50 h-[20%] group-hover:bg-slate-100 transition-colors" />
                    </div>
                    <span className={`mt-6 text-[10px] font-black uppercase italic transition-all ${isSelected ? 'text-red-500 scale-110' : 'text-slate-300'}`}>{t.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT SIDE: TOP PRODUCT */}
          <div className="col-span-12 lg:col-span-3 bg-[#0F172A] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Zap size={180} fill="currentColor" />
            </div>
            <div>
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/20">
                <Zap size={28} fill="currentColor" />
              </div>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] italic mb-2">Eng ko'p sotilgan</p>
              <h4 className="text-3xl font-black italic uppercase leading-tight tracking-tighter">
                {topProduct?.name || "N/A"}
              </h4>
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex items-end justify-between">
              <div>
                <span className="text-5xl font-black italic text-red-400 leading-none">{topProduct?.qty || 0}</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase italic mt-1">Dona sotuvda</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-red-500 transition-all cursor-pointer">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. VAQT JADVALI VA MINI STATS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100">
                <Clock size={20} />
              </div>
              <h4 className="text-xs font-black text-slate-800 uppercase italic">SOATBAY TAHLIL: <span className="text-blue-500 underline underline-offset-4 decoration-2">{selectedDay?.label}</span></h4>
            </div>

            <div className="h-[140px] flex items-end justify-between gap-4 px-2">
              {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((h, i) => {
                const val = Number(selectedDay?.hourly?.[h] || 0);
                const maxH = Math.max(...Object.values(selectedDay?.hourly || {}).map(v => Number(v)), 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${Math.max((val/maxH)*100, 8)}%` }}
                      className={`w-full max-w-[35px] rounded-t-lg transition-all duration-500 ${val > 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-md shadow-blue-50' : 'bg-slate-50'}`}
                    />
                    <span className="mt-4 text-[8px] font-black text-slate-300 italic uppercase tracking-tighter">{h}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[
              { label: "Cheklar", val: `${data.count || 0} ta`, icon: <BarChart3 size={18}/>, bg: "bg-orange-50", tx: "text-orange-500" },
              { label: "O'rtacha", val: `${Math.round(data.summa / (data.count || 1)).toLocaleString()}`, icon: <Activity size={18}/>, bg: "bg-purple-50", tx: "text-purple-500" },
              { label: "Sana", val: selectedDay?.label || "---", icon: <Calendar size={18}/>, bg: "bg-red-50", tx: "text-red-500" },
              { label: "Mijozlar", val: Math.round((data.count || 0) * 0.8), icon: <Users size={18}/>, bg: "bg-blue-50", tx: "text-blue-500" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all">
                <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.tx} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase italic leading-none">{item.label}</p>
                  <p className="text-sm font-black text-slate-800 italic mt-1">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. FOOTER --- */}
        <div className="flex flex-wrap gap-4 mt-6 pb-12">
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase italic">System Online</span>
           </div>
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <Layers size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase italic">Data Grouped by Date</span>
           </div>
        </div>

      </div>
    </motion.div>
  );
};