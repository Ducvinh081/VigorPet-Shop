'use client';
import Link from "next/link";
import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import { useContext, useState, useEffect } from "react";

function AuthLinks({ status, userName, onSignOut }) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          <>
            {'Xin chào '}{userName} {/* Thêm khoảng trắng */}
          </>
        </Link>
        <button
          onClick={onSignOut}
          className="bg-primary rounded-full text-white px-8 py-2">
          {"Thoát"}
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'}>{"Đăng nhập"}</Link>
        <Link href={'/register'} className="bg-primary rounded-full text-white px-8 py-2">
          {"Đăng ký"}
        </Link>
      </>
    );
  }
  // If status is 'loading', return null or a placeholder to avoid rendering issues
  return null;
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts, resetCartProducts } = useContext(CartContext);

  const [isClient, setIsClient] = useState(false); // State để kiểm tra nếu đang ở client
  const [displayCartCount, setDisplayCartCount] = useState(0); // State để lưu số lượng hiển thị

  useEffect(() => {
    // Chỉ chạy trên client sau khi hydration
    setIsClient(true);
    // Tính tổng quantity của tất cả sản phẩm trong giỏ hàng
    const totalQuantity = cartProducts.reduce((total, product) => {
      return total + (product.quantity || 1);
    }, 0);
    setDisplayCartCount(totalQuantity);
  }, [cartProducts]); // Theo dõi sự thay đổi của cartProducts từ Context

  const handleSignOut = async () => {
      // Thực hiện đăng xuất - Cart sẽ tự động được reset trong AppContext
      await signOut({ callbackUrl: '/' });
      resetCartProducts();
  }
// ----------------------------------
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>
          VigorPet
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {/* Sử dụng isClient và displayCartCount ở đây */}
            {isClient && displayCartCount > 0 && ( // Chỉ render badge nếu ở client VÀ có sản phẩm
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-none flex items-center justify-center min-w-[18px] h-4">
                {displayCartCount}
              </span>
            )}
            {!isClient && ( // Render một span ẩn trên server để giữ cấu trúc DOM
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-none flex items-center justify-center min-w-[18px] h-4 opacity-0">
                 0
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Trang chủ</Link>
          <Link href={'/menu'}>Sản phẩm</Link>
          <Link href={'/#about'}>Giới thiệu</Link>
          <Link href={'/#contact'}>Liên hệ</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={'/'}>
            VigorPet
          </Link>
          <Link className="whitespace-nowrap" href={'/'}>Trang chủ</Link>
          <Link className="whitespace-nowrap" href={'/menu'}>Sản phẩm</Link>
          <Link className="whitespace-nowrap" href={'/#about'}>Giới thiệu</Link>
          <Link className="whitespace-nowrap" href={'/#contact'}>Liên hệ</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} onSignOut={handleSignOut}/>
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {/* Sử dụng isClient và displayCartCount ở đây cho desktop */}
            {isClient && displayCartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-none flex items-center justify-center min-w-[18px] h-4">
                {displayCartCount}
              </span>
            )}
            {!isClient && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-none flex items-center justify-center min-w-[18px] h-4 opacity-0">
                 0
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}