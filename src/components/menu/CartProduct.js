// components/menu/CartProduct.js (This is a simplified example)
import Image from "next/image";
import Link from "next/link"; // Import Link
import Trash from "@/components/icons/Trash"; // Assuming you have this icon

export default function CartProduct({ product, onRemove, index }) {
  // ... product details extraction

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image src={product.image} alt={product.name} width={240} height={240} />
      </div>
      <div className="grow">
        <h3>{product.name}</h3>
        {/* ... size and extras details */}
      </div>
      <div className="text-lg font-semibold">{product.basePrice}đ</div> {/* This might need adjustment */}
      <div className="ml-2">
        <button type="button" onClick={() => onRemove(index)} className="p-2">
          <Trash />
        </button>
      </div>
    </div>
  );
}