"use client";

import React, { useState } from 'react';
import { Search, ShoppingBasket, Clock, Star, Heart, ClipboardList, User, Plus, Check, X, Minus, Trash2 } from 'lucide-react';

// --- MAHSULOT KARTASI ---
const FoodCard = ({ food, onToggle, isAdded }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleDoubleClick = () => {
    setIsLiked(!isLiked);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm animate-in fade-in zoom-in duration-300 border border-gray-50">
      <div className="relative h-32 w-full cursor-pointer select-none" onDoubleClick={handleDoubleClick}>
        <img src={food.img} alt={food.title} className="w-full h-full rounded-t-xl object-cover shadow-sm" />
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center z-10 animate-bounce">
            <Heart size={40} className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-gray-400'} drop-shadow-lg`} />
          </div>
        )}
        <button 
          onClick={() => onToggle(food)} 
          className={`absolute -top-1 -right-1 p-1.5 rounded-full transition-all duration-300 shadow-md border-2 border-white z-20 
          ${isAdded ? 'bg-orange-500 text-white scale-110' : 'bg-red-800 text-white active:scale-95'}`}
        >
          {isAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
        </button>
      </div>
      <div className="px-3 pb-4 pt-2">
        <h3 className="font-bold text-gray-800 text-xs mb-1 truncate">{food.title}</h3>
        <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-gray-400">
          <div className="flex items-center text-red-600 italic"><Clock size={10} className="mr-1" /> {food.time}</div>
          <div className="flex items-center text-orange-500"><Star size={10} className="mr-1 fill-orange-400" /> {food.rating}</div>
        </div>
        <div className="text-sm font-black text-gray-900">{food.price.toLocaleString()} so'm</div>
      </div>
    </div>
  );
};

// --- ASOSIY SAHIFA ---
const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const categories = ["Barchasi", "Fastfud", "Ichimliklar", "Shirinliklar", "Sog'lom taomlar"];

  const foods = [



    // Sog'lom taomlar



    { id: 1, title: "Nok va Apelsin", category: "Sog'lom taomlar", time: "20 daqiqa", rating: "4.8", price: 35000, img: "https://images.unsplash.com/photo-1547517023-7ca0c162f816?q=80&w=300" },



    { id: 3, title: "Tuxum va Non", category: "Sog'lom taomlar", time: "10 daqiqa", rating: "4.7", price: 25000, img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=300" },



    { id: 7, title: "Avokado Salati", category: "Sog'lom taomlar", time: "15 daqiqa", rating: "4.9", price: 42000, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300" },



    { id: 8, title: "Gretsiya Yogurti", category: "Sog'lom taomlar", time: "5 daqiqa", rating: "4.6", price: 15000, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=300" },







    // Fastfud



    { id: 2, title: "Go'shtli Burger", category: "Fastfud", time: "30 daqiqa", rating: "5.0", price: 65000, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300" },



    { id: 6, title: "Hot-dog", category: "Fastfud", time: "15 daqiqa", rating: "4.2", price: 22000, img: "https://images.unsplash.com/photo-1541232390620-8e11096973e4?q=80&w=300" },



    { id: 9, title: "Fri kartoshkasi", category: "Fastfud", time: "12 daqiqa", rating: "4.5", price: 18000, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=300" },



    { id: 10, title: "Pitsa Pepperoni", category: "Fastfud", time: "25 daqiqa", rating: "4.8", price: 85000, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=300" },



    { id: 11, title: "Klab Sendvich", category: "Fastfud", time: "20 daqiqa", rating: "4.4", price: 32000, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=300" },







    // Ichimliklar



    { id: 5, title: "Coca-Cola", category: "Ichimliklar", time: "5 daqiqa", rating: "4.5", price: 12000, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300" },



    { id: 12, title: "Muzli Kofe", category: "Ichimliklar", time: "8 daqiqa", rating: "4.7", price: 20000, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=300" },



    { id: 13, title: "Apelsin Sharbati", category: "Ichimliklar", time: "10 daqiqa", rating: "4.9", price: 18000, img: "https://images.unsplash.com/photo-1613478223719-2ab80260f423?q=80&w=300" },



    { id: 14, title: "Ko'k Choy", category: "Ichimliklar", time: "5 daqiqa", rating: "4.3", price: 10000, img: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=300" },



    { id: 15, title: "Reza mevali Smuzi", category: "Ichimliklar", time: "12 daqiqa", rating: "4.8", price: 28000, img: "https://images.unsplash.com/photo-1536304953492-f1230fe5ee42?q=80&w=300" },







    // Shirinliklar



    { id: 4, title: "Shirin quymoqlar", category: "Shirinliklar", time: "10 daqiqa", rating: "4.9", price: 18000, img: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=300" },



    { id: 16, title: "Shokoladli Tort", category: "Shirinliklar", time: "15 daqiqa", rating: "5.0", price: 45000, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300" },



    { id: 17, title: "Muzqaymoq", category: "Shirinliklar", time: "5 daqiqa", rating: "4.7", price: 12000, img: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=300" },



    { id: 18, title: "Ponchik", category: "Shirinliklar", time: "5 daqiqa", rating: "4.5", price: 8000, img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=300" },



    { id: 19, title: "Chizkeyk", category: "Shirinliklar", time: "20 daqiqa", rating: "4.9", price: 38000, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=300" },



    { id: 20, title: "Makaron (5 dona)", category: "Shirinliklar", time: "5 daqiqa", rating: "4.8", price: 55000, img: "https://images.unsplash.com/photo-1569153131329-87c672f05a10?q=80&w=300" },



  ];

  const toggleBasket = (food) => {
    setBasket(prev => {
      const existing = prev.find(item => item.id === food.id);
      if (existing) return prev.filter(item => item.id !== food.id);
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setBasket(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => setBasket(prev => prev.filter(item => item.id !== id));

  const totalPrice = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredFoods = foods.filter(f => {
    const matchesCategory = selectedCategory === "Barchasi" || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      <div className="w-full max-w-[450px] bg-white shadow-2xl h-[100vh] flex flex-col relative overflow-hidden font-sans">
        
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar scroll-smooth">
          
          {/* 1. HEADER (Savat olib tashlandi) */}
          <div className="p-6 pb-2 bg-white">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Menyu</h1>
              <div className="p-2 bg-gray-100 rounded-xl text-gray-800 active:scale-95 transition-transform">
                <User size={24} />
              </div>
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchQuery || ""} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 focus:ring-2 focus:ring-red-500 outline-none" 
              />
            </div>
          </div>

          {/* 2. STICKY CATEGORIES */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                    ${selectedCategory === cat ? 'bg-red-800 text-white border-red-800 shadow-sm' : 'bg-white text-gray-400 border-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. PRODUCTS */}
          <div className="bg-[#b7d5d4] min-h-full rounded-t-[3rem] p-6 pt-8 -mt-1">
            <div className="grid grid-cols-2 gap-4">
              {filteredFoods.map    ((food) => (
                <FoodCard 
                  key={food.id} 
                  food={food} 
                  onToggle={toggleBasket} 
                  isAdded={basket.some(i => i.id === food.id)} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV (Savat endi shu yerda) */}
        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-4 flex justify-around items-center z-40">
          <button className="flex flex-col items-center gap-1 text-red-800 font-bold">
            <ClipboardList size={22} /><span className="text-[10px]">Menyu</span>
          </button>
          
          {/* MARKAZIY SAVAT TUGMASI */}
          <button 
            onClick={() => setIsBasketOpen(true)}
            className="flex flex-col items-center gap-1 relative text-gray-400 active:scale-90 transition-transform"
          >
            <div className="relative">
              <ShoppingBasket size={24} className={basket.length > 0 ? "text-orange-500" : ""} />
              {basket.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-[9px] font-bold text-white w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {basket.length}
                </span>
              )}
            </div>
            <span className="text-[10px]">Savat</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-300">
            <User size={22} /><span className="text-[10px]">Profil</span>
          </button>
        </div>

        {/* SAVAT MODAL OYNASI */}
        {isBasketOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={() => setIsBasketOpen(false)}>
            <div 
              className="w-full bg-white rounded-t-[2.5rem] p-6 shadow-2xl max-h-[85%] flex flex-col animate-in slide-in-from-bottom duration-300" 
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800">Savat</h2>
                <button onClick={() => setIsBasketOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {basket.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBasket size={60} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">Savat bo'sh</p>
                  </div>
                ) : (
                  basket.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-white">
                      <img src={item.img} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={item.title} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-800 truncate">{item.title}</h4>
                        <p className="text-red-700 font-black text-xs">{item.price.toLocaleString()} so'm</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">-</button>
                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-400"><Trash2 size={20} /></button>
                    </div>
                  ))
                )}
              </div>

              {basket.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm font-bold uppercase">Jami:</span>
                    <span className="text-xl font-black text-gray-900">{totalPrice.toLocaleString()} so'm</span>
                  </div>
                  <button className="w-full bg-red-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all">
                    Buyurtma berish
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;