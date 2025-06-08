'use client';
import { useEffect, useState } from "react";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        // --- Fetch categories ---
        const resCat = await fetch('/api/categories');
        if (resCat.ok) {
          const categoriesData = await resCat.json();
          setCategories(categoriesData);
        } else {
          console.error('Failed to fetch categories, status:', resCat.status);
        }

        // --- Fetch menu items ---
        const resItems = await fetch('/api/menu-items');
        if (resItems.ok) {
          const itemsData = await resItems.json();
          setMenuItems(itemsData);
        } else {
          console.error('Failed to fetch menu items, status:', resItems.status);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
      }
    }

    loadData();
  }, []);

  const handleCategoryChange = (event) => {
    setCurrentCategory(event.target.value);
  };

  const filteredMenuItems = currentCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === currentCategory);

  const currentCategoryName = currentCategory === 'all' 
    ? 'My Menu' 
    : categories.find(c => c._id === currentCategory)?.name;

  return (
    <section className="mt-8">
      <div>
        <label>Select Category: </label>
        <select value={currentCategory} onChange={handleCategoryChange}>
          <option value="all">All</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      {filteredMenuItems.length > 0 && (
        <div>
          <div className="text-center">
            <SectionHeaders mainHeader={currentCategoryName} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {filteredMenuItems.map(item => (
              <MenuItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}