'use client';
import PreAddToCartButton from "@/components/menu/PreAddToCartButton";
import Image from "next/image";

export default function MenuItemTile({ onPreAddToCart, ...item }) {
  const {
    image,            // URL ảnh đúng (thay vì imageUrl)
    description,
    name,
    basePrice,
    sizes,
    extraIngredientPrices,
  } = item;

  return (
    <div
      className="
        bg-gray-200 p-4 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all
      "
    >
      <div className="w-[200px] h-[200px] mx-auto relative">
        {/* Chỉ render Image khi image tồn tại và khác chuỗi rỗng */}
        {image ? (
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="rounded-lg"
          />
        ) : (
          /* Placeholder khi chưa có ảnh */
          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description}
      </p>

      <PreAddToCartButton
        image={image}
        onClick={onPreAddToCart}
        basePrice={basePrice}
      />
    </div>
  );
}
