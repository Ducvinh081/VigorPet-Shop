'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useProfile} from "@/components/UseProfile";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {cartProducts, removeCartProduct} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const {data:profileData} = useProfile();
  const shippingfee = 30000;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Thanh toán thất bại 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const {phone, streetAddress, city, postalCode, country} = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  
  function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }
  
  async function proceedToCheckout(ev) {
    ev.preventDefault();
    // address and shopping cart products
    if ((!address.phone || !address.phone.trim()) || (!address.streetAddress || !address.streetAddress.trim())) {
      toast.error('Số điện thoại và số đường không được để trống!');
      return;
    }
    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
          shippingfee
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: 'Preparing your order...',
      success: 'Redirecting to payment...',
      error: 'Something went wrong... Please try again later',
    })
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Giỏ hàng đang trống. 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Giỏ hàng" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div>{"Không có sản phẩm nào"}</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <CartProduct
              key={`${product._id}-${index}`} // Better key for unique identification
              product={product}
              onRemove={removeCartProduct}
              index={index}
            />
          ))}
          <div className="py-4 pr-4 flex justify-end items-center border-t">
            <div className="text-gray-500 text-right">
              Giá tạm tính<br />
              Giá ship<br />
              <span className="font-semibold text-black">Giá tổng</span>
            </div>
            <div className="font-semibold pl-4 text-right">
              {subtotal.toLocaleString()}đ<br />
              {shippingfee.toLocaleString()}đ<br />
              <span className="text-lg">{(subtotal + shippingfee).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button 
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Thanh toán {(subtotal+shippingfee).toLocaleString()}đ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}