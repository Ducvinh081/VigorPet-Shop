'use client';
import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function MenuItem(menuItem) {

  const {
    image, name, description, basePrice,
    sizes, extraIngredientPrices,
  } = menuItem;
  const [
    selectedSize, setSelectedSize
  ] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  function handlePreAddToCartButtonClick() {
    // Reset quantity and selections when opening the popup
    setSelectedQuantity(1);
    setSelectedSize(sizes?.[0] || null);
    setSelectedExtras([]);
    setShowPopup(true);
  }

  async function handleAddToCartButtonClick() {
    addToCart(menuItem, selectedSize, selectedExtras, selectedQuantity);
    setShowPopup(false);
  }

  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }

  // Helper function to calculate current item price
  let currentCalculatedPrice = basePrice;
  if (selectedSize) {
    currentCalculatedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      currentCalculatedPrice += extra.price;
    }
  }
  const finalPrice = currentCalculatedPrice * selectedQuantity;

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative transform transition-all duration-300 ease-out scale-100 opacity-100">
            <div
              className="overflow-y-auto pr-2"
              style={{ maxHeight: 'calc(100vh - 100px)' }}>

              <div className="relative w-full pb-[75%] mb-4 rounded-lg overflow-hidden shadow-sm"> {/* NEW: Container for aspect ratio */}
                <Image
                  src={image}
                  alt={name}
                  fill={true} // Use fill prop with Next.js Image
                  className="object-cover" // Ensures image covers the area, cropping if needed
                />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{name}</h2>
              <p className="text-justify text-gray-600 text-sm mb-4 leading-relaxed"> {/* MODIFIED: text-justify */}
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">{"Chọn loại"}</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          onChange={() => setSelectedSize(size)}
                          checked={selectedSize?._id === size._id}
                          name="size"
                          className="form-radio h-5 w-5 text-primary" />
                        <span className="text-base text-gray-800">{size.name}</span>
                      </span>
                      <span className="text-base font-semibold text-gray-800">
                        ${basePrice + size.price}đ
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Any extras?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={ev => handleExtraThingClick(ev, extraThing)}
                          checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                          name={extraThing.name}
                          className="form-checkbox h-5 w-5 text-primary rounded" />
                        <span className="text-base text-gray-800">{extraThing.name}</span>
                      </span>
                      <span className="text-base font-semibold text-gray-800">
                        +{extraThing.price}đ
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="py-2 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Số lượng</h3>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                    className="p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 w-10 h-10 flex items-center justify-center text-xl font-bold"
                    type="button">
                    -
                  </button>
                  <span className="text-2xl font-extrabold w-16 text-center text-gray-900">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(prev => prev + 1)}
                    className="p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 w-10 h-10 flex items-center justify-center text-xl font-bold"
                    type="button">
                    +
                  </button>
                </div>
              </div>

              <button
                className="mt-6 bg-primary text-white py-3 px-6 rounded-full w-full text-lg font-semibold shadow-md hover:bg-primary-dark transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-70"
                onClick={handleAddToCartButtonClick}>
                Thêm vào giỏ {finalPrice}đ
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onPreAddToCart={handlePreAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}