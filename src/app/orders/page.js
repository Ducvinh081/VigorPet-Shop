"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import DeleteButton from "@/components/DeleteButton";
import { useProfile } from "@/components/UseProfile";
import { cartProductPrice } from "@/components/AppContext";
import { dbTimeForHuman } from "@/libs/datetime";
import Pagination from "@/components/Pagination";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/orders");
    const orders = await res.json();
    setOrders(orders.reverse());
    setLoadingOrders(false);
  };

  const calculateOrderTotal = (order) => {
    return order.cartProducts.reduce(
      (total, product) => total + cartProductPrice(product),
      5,
    );
  };

  const handleDeleteClick = async (_id) => {
    const promise = fetch("/api/orders?_id=" + _id, { method: "DELETE" });
    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    });
    fetchOrders();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="mt-8 max-w-3xl mx-auto">
      <UserTabs isAdmin={profile.admin} />
      <div className="mt-8">
        {loadingOrders && <div>Loading orders...</div>}
        {orders
          ?.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          )
          .map((order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={
                      (order.paid ? "bg-green-500" : "bg-red-400") +
                      " p-2 rounded-md text-white w-24 text-center"
                    }
                  >
                    {order.paid ? <>{"Thanh toán"}</> : <>{"Chưa thanh toán"}</>}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.userEmail}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Tổng cộng {calculateOrderTotal(order)}đ
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link href={"/orders/" + order._id} className="button">
                  Xem hóa đơn
                </Link>
                <div>
                  {profile.admin && (
                    <DeleteButton
                      label={"Xóa"}
                      onDelete={() => handleDeleteClick(order._id)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          items={orders}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </section>
  );
}