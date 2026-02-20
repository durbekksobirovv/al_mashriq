"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Phone, Clock, ChefHat, Info, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FOOD CARD COMPONENT ---
const FoodCard = ({ food, language = "uzb", onCardClick, isDark }) => {
  const [showHeart, setShowHeart] = useState(false);
  
  const handleDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: isDark ? "0 12px 24px rgba(0,0,0,0.4)" : "0 12px 24px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      onClick={() => onCardClick(food)}
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative group`}
      onDoubleClick={handleDoubleClick}
    >
      <div className={`relative aspect-square ${isDark ? 'bg-gray-700' : 'bg-gray-100'} overflow-hidden`}>
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
        
        {/* Discount Badge */}
        {food.discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{food.discount}%
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className={`font-bold text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>{food.nomi}</h3>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate italic mb-2.5`}>{food.title}</p>
        <div className="text-base font-bold text-red-600">{Number(food.narxi).toLocaleString()} so'm</div>
      </div>
    </motion.div>
  );
};

// --- FOOD DETAIL MODAL ---
const FoodDetailModal = ({ food, isOpen, onClose, language = "uzb", isDark }) => {
  if (!food) return null;

  const texts = {
    uzb: {
      close: "Yopish",
      narxi: "Narxi",
      tavsifi: "Tavsifi",
      tarkibi: "Tarkibi",
      back: "Orqaga",
    },
    rus: {
      close: "Закрыть",
      narxi: "Цена",
      tavsifi: "Описание",
      tarkibi: "Состав",
      back: "Назад",
    }
  };

  const t = texts[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className={`relative w-full aspect-video ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <img 
                src={food.rasmi || "https://via.placeholder.com/500"} 
                alt={food.nomi}
                className="w-full h-full object-cover"
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 ${isDark ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-white/90 hover:bg-white'} p-2 rounded-full transition-all shadow-lg`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
              </button>

              {/* Discount Badge */}
              {food.discount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  -{food.discount}%
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                {Number(food.narxi).toLocaleString()} so'm
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h1 className={`text-3xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{food.nomi}</h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg italic`}>{food.title}</p>
              </div>

              {/* Category */}
              {food.category && (
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'} rounded-full font-bold text-sm`}>
                    {food.category}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2 text-lg`}>{t.tavsifi}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {food.title || "Mahsulot haqida ma'lumot mavjud emas"}
                </p>
              </div>

              {/* Rating / Stats */}
              <div className={`grid grid-cols-3 gap-4 py-4 border-y ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">★★★★★</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Reyting</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>45</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Baho</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>1250+</div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Sotilgan</p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-4 space-y-3">
                {/* Info Box */}
                <div className={`${isDark ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-800' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100'} p-4 rounded-xl border`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} text-sm`}>Sifatli tayyorlandi</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Eng yangi ingredientlar bilan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN COMPONENT ---
const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(["Barchasi"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [language, setLanguage] = useState("uzb");
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodDetail, setShowFoodDetail] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const t = {
    uzb: {
      menu: "Menyu",
      search: "Qidirish...",
      info: "Restoran haqida",
      location: "Namangan, Almashriq",
      contact: "Aloqa",
      hours: "Ish vaqti",
      address: "Manzil",
      loading: "Yuklanmoqda...",
    },
    rus: {
      menu: "Меню",
      search: "Поиск...",
      info: "О ресторане",
      location: "Наманган, Алмашрик",
      contact: "Контакты",
      hours: "Время работы",
      address: "Адрес",
      loading: "Загрузка...",
    }
  };

  const texts = t[language];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, cRes] = await Promise.all([
          fetch("https://my-menu-backend-1.onrender.com/api/products"),
          fetch("https://my-menu-backend-1.onrender.com/api/categories")
        ]);
        const fData = await fRes.json();
        setFoods(fData);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(["Barchasi", ...cData.map(c => c.nomi)]);
        }
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const filtered = (Array.isArray(foods) ? foods : []).filter(f => 
    (selectedCategory === "Barchasi" || f.category === selectedCategory) && 
    f.nomi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (food) => {
    setSelectedFood(food);
    setShowFoodDetail(true);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* HEADER */}
      <header className={`sticky top-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b z-40 p-4 shadow-sm transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Menu</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{texts.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 transition-colors duration-300`}>
              <button
                onClick={() => setLanguage("uzb")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  language === "uzb" ? "bg-red-600 text-white" : isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                O'Z
              </button>
              <button
                onClick={() => setLanguage("rus")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  language === "rus" ? "bg-red-600 text-white" : isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                РУ
              </button>
            </div>
            <button 
              onClick={() => setShowInfo(true)}
              className={`p-2 ${isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100'} rounded-lg transition-all`}
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-all ${isDark ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <input 
            type="text" 
            placeholder={texts.search}
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className={`w-full ${isDark ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-red-500' : 'bg-gray-50 text-black border-gray-200 focus:ring-red-600'} rounded-xl py-2.5 pl-10 pr-10 outline-none text-sm focus:ring-2 border transition-colors duration-300`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} p-1 rounded-full transition-all`}
            >
              <X className={`w-3 h-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 pb-1">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat 
                    ? "bg-red-600 text-white shadow-md" 
                    : isDark ? "bg-gray-700 text-gray-300 border border-gray-600 hover:border-red-400" : "bg-white text-gray-700 border border-gray-200 hover:border-red-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-4 pb-8">
        {loading ? (
          <div className={`text-center py-20 font-bold flex items-center justify-center min-h-[400px] ${isDark ? 'text-gray-300' : 'text-black'}`}>
            <div className="flex flex-col items-center gap-3">
              <motion.div 
                className="animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChefHat className="w-8 h-8 text-red-600" />
              </motion.div>
              <span>{texts.loading}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Search className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                <p>{language === "uzb" ? "Hech narsa topilmadi" : "Ничего не найдено"}</p>
              </div>
            ) : (
              filtered.map((food, idx) => (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <FoodCard 
                    food={food} 
                    language={language}
                    onCardClick={handleCardClick}
                    isDark={isDark}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* FOOD DETAIL MODAL */}
      <FoodDetailModal 
        food={selectedFood}
        isOpen={showFoodDetail}
        onClose={() => setShowFoodDetail(false)}
        language={language}
        isDark={isDark}
      />

      {/* INFO MODAL */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto transition-colors duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{texts.info}</h2>
                  <button
                    onClick={() => setShowInfo(false)}
                    className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-all`}
                  >
                    <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-700'}`} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-600 p-3 rounded-2xl">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Menu</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{language === "uzb" ? "1994 yildan beri" : "С 1994 года"}</p>
                  </div>
                </div>

                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{language === "uzb" ? "Biz eng mazali va yangi milliy taomlarni taqdim etamiz. Bir qancha yil davomida Namangan aholisiga xizmat ko'rsatmoqdamiz." : "Предлагаем самую вкусную и свежую национальную кухню. Обслуживаем жителей Намангана в течение многих лет."}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`${isDark ? 'bg-red-900/30' : 'bg-red-100'} p-2 rounded-lg flex-shrink-0`}>
                      <MapPin className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-1`}>{texts.address}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Namangan, Almashriq</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`${isDark ? 'bg-red-900/30' : 'bg-red-100'} p-2 rounded-lg flex-shrink-0`}>
                      <Phone className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-1`}>{texts.contact}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>+998 99 123 45 67</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`${isDark ? 'bg-red-900/30' : 'bg-red-100'} p-2 rounded-lg flex-shrink-0`}>
                      <Clock className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-1`}>{texts.hours}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{language === "uzb" ? "Dushanba - Yakshanba" : "Понедельник - Воскресенье"}</p>
                      <p className="text-sm font-semibold text-red-600">7:00 - 23:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;