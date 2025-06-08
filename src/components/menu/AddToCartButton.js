
export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) 
{
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary text-white rounded-full px-8 py-2"
    >
      <span>Thêm vào{basePrice}đ</span>
    </button>
  );
}