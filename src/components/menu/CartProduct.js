'use client';
import { useContext, useState } from "react";
import { CartContext, cartProductPrice } from "@/components/AppContext";
import Image from "next/image";
import Trash from "@/components/icons/Trash";

export default function CartProduct({ product, onRemove, index }) {
  const { updateCartProductQuantity, addToCart } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size || product.sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState(product.extras || []);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Tạo menuItem object từ product để sử dụng trong popup
  const menuItem = {
    image: product.image,
    name: product.name,
    description: product.description || "Sản phẩm ngon tuyệt vời",
    basePrice: product.basePrice || 0,
    sizes: product.sizes || [],
    extraIngredientPrices: product.extraIngredientPrices || []
  };

  function handleProductClick() {
    setSelectedQuantity(1);
    setSelectedSize(product.size || product.sizes?.[0] || null);
    setSelectedExtras(product.extras || []);
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

  // Tính giá cho popup
  let currentCalculatedPrice = menuItem.basePrice;
  if (selectedSize) {
    currentCalculatedPrice += selectedSize.price || 0;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      currentCalculatedPrice += extra.price || 0;
    }
  }
  const finalPrice = currentCalculatedPrice * selectedQuantity;
  
  return (
    <>
      {/* Popup Modal - Copy từ MenuItem */}
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

              <div className="relative w-full pb-[75%] mb-4 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={menuItem.image}
                  alt={menuItem.name}
                  fill={true}
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{menuItem.name}</h2>
              <p className="text-justify text-gray-600 text-sm mb-4 leading-relaxed">
                {menuItem.description}
              </p>
              
              {menuItem.sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">{"Chọn loại"}</h3>
                  {menuItem.sizes.map(size => (
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
                        {menuItem.basePrice + size.price}đ
                      </span>
                    </label>
                  ))}
                </div>
              )}
              
              {menuItem.extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Any extras?</h3>
                  {menuItem.extraIngredientPrices.map(extraThing => (
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

      {/* Cart Product Item */}
      <div className="flex items-center gap-4 border-b border-gray-100 py-6 hover:bg-gray-50 transition-colors duration-200">
        {/* Clickable Image */}
        <div 
          className="w-20 h-20 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleProductClick}
        >
          <Image 
            src={product.image} 
            alt={product.name} 
            width={80} 
            height={80}
            className="rounded-lg object-cover w-full h-full shadow-sm"
          />
        </div>
        
        <div className="flex-1">
          {/* Clickable Product Name */}
          <h3 
            className="font-semibold text-gray-800 cursor-pointer hover:text-primary transition-colors mb-1"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>
          
          {product.size && (
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-medium">Size:</span> {product.size.name}
            </div>
          )}
          
          {product.extras?.length > 0 && (
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Extras:</span> {product.extras.map(extra => extra.name).join(', ')}
            </div>
          )}
          
          {/* Improved Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Số lượng:</span>
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <button
                type="button"
                onClick={() => updateCartProductQuantity(index, -1)}
                className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.quantity <= 1}
              >
                −
              </button>
              <span className="px-4 py-1 bg-white text-gray-800 font-semibold min-w-[3rem] text-center">
                {product.quantity || 1}
              </span>
              <button
                type="button"
                onClick={() => updateCartProductQuantity(index, 1)}
                className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800">
            {cartProductPrice(product).toLocaleString()}đ
          </div>
        </div>
        
        {/* Improved Delete Button */}
        <div className="ml-3">
          <button 
            type="button" 
            onClick={() => onRemove(index)} 
            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-200 group"
            title="Xóa sản phẩm"
          >
            <Trash className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </>
  );
}