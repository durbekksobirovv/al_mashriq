"use client";
import React, { useState, useEffect } from 'react';

// 1. Asosiy komponentni yaratamiz (Nomi katta harf bilan)
const AddCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Siz yuborgan kodni shu yerga joylashtiramiz
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("https://my-menu-backend-1.onrender.com/api/products"),
        fetch("https://my-menu-backend-1.onrender.com/api/categories")
      ]);

      if (!prodRes.ok || !catRes.ok) {
        throw new Error(`API xatosi: ${prodRes.status} yoki ${catRes.status}`);
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      
    } catch (err) {
      console.error("Ma'lumot yuklashda xato bo'ldi:", err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Ekranda nima ko'rinishini belgilaymiz
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Kategoriya boshqaruvi</h1>
      {loading ? <p>Yuklanmoqda...</p> : (
        <ul className="mt-4">
          {categories.map(cat => (
            <li key={cat._id} className="border-b py-2">{cat.nomi}</li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default AddCategoryPage;