'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import UserTabs from "@/components/layout/UserTabs";

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const { loading, data: profile } = useProfile();
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const {id} = useParams();
  const shippingfee = 30000;
  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?_id='+id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      })
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={profile.admin} />
      
      {loadingOrder && (
        <div>Đang tải...</div>
      )}
      {order && (
        <div className="mt-8">
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map(product => (
              <CartProduct key={product._id} product={product} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Tạm tính:&nbsp; 
              <span className="text-black font-bold inline-block w-8">{subtotal.toLocaleString()}đ</span>
              <br />
             Phí ship:&nbsp; 
              <span className="text-black font-bold inline-block w-8">{shippingfee.toLocaleString()}đ</span>
              <br />
             Tổng cộng:&nbsp; 
              <span className="text-black font-bold inline-block w-8">
                {(subtotal + shippingfee).toLocaleString()}đ
              </span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs
                disabled={true}
                addressProps={order}
              />
            </div>
          </div>
        </div>
        </div>
      )}
    </section>
  );
}