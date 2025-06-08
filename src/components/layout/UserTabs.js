'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path.includes ('/profile') ? 'active' : ''}
        href={'/profile'}
      >
        {"Profile"}
      </Link>
      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path.includes ('/categories') ? 'active' : ''}
          >
            Quản lý danh mục
          </Link>
          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Quản lý sản phẩm
          </Link>
          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Quản lý người dùng
          </Link>
          <Link
            className={path.includes('/statics') ? 'active' : ''}
            href={'/statics'}
          >
            Thống kê
          </Link>
        </>
      )}
      <Link
        className={path.includes ('/orders') ? 'active' : ''}
        href={'/orders'}
      >
        Quản lý đơn hàng
      </Link>
    </div>
  );
}