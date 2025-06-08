"use client";
import { cartProductPrice } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman, dbTimeForHumanDay } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "@/components/Pagination";

export default function StaticsPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [topSpendingUsers, setTopSpendingUsers] = useState([]);
  const itemsPerPage = 6;


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(startDate, endDate);
  };

  const handleFillClick = () => {
    fetchOrders(startDate, endDate);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders(startDate, endDate) {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((allOrders) => {
        let filteredOrders;
        if (startDate && endDate) {
          const start = startDate.getTime(); // convert to timestamp
          const end = endDate.getTime();
          filteredOrders = allOrders.filter((order) => {
            if (!order.createdAt) {
              return false;
            }
            const orderDateStr = dbTimeForHumanDay(order.createdAt);
            const [day, month, year] = orderDateStr.split("/");
            const orderDate = new Date(year, month - 1, day).getTime(); // convert to timestamp
            return orderDate >= start && orderDate <= end;
          });
        } else {
          filteredOrders = allOrders;
        }
        setOrders(filteredOrders.reverse());
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedOrders(filteredOrders.slice(start, end));
        setLoadingOrders(false);

        const userSpending = {};

        filteredOrders.forEach((order) => {
          if (order.paid) {
            if (!userSpending[order.userEmail]) {
              userSpending[order.userEmail] = 0;
            }

            let orderTotal = 0;
            for (const product of order.cartProducts) {
              orderTotal += cartProductPrice(product);
            }

            userSpending[order.userEmail] += orderTotal;
          }
        });

        // Chuyển đổi object thành một mảng các cặp key-value
        const userSpendingEntries = Object.entries(userSpending);

        // Sắp xếp mảng dựa trên số tiền đã tiêu
        userSpendingEntries.sort((a, b) => b[1] - a[1]);

        // Lấy top 3 users có doanh thu cao nhất
        const topSpendingUsers = userSpendingEntries.slice(0, 3);

        // Set state
        setTopSpendingUsers(topSpendingUsers);
      });
    });
  }

  const totalRevenue = orders.reduce((total, order) => {
    let orderTotal = 0;
    if (order.cartProducts && order.paid) {
      // Check if the order is paid
      for (const product of order.cartProducts) {
        orderTotal += cartProductPrice(product);
      }
    }
    return total + orderTotal;
  }, 0);

  const totalPaidOrders = orders.filter((order) => order.paid).length;

  return (
    <section className="mt-8 max-w-3xl mx-auto">
      <UserTabs isAdmin={profile.admin} />
      {loadingOrders && <div>Loading statics...</div>}

    
      <div className="mt-8">
        <h2 className="text-2xl text-primary font-bold mb-4">Top 3 người dùng</h2>
        {topSpendingUsers.map(([userEmail, totalSpent], index) => (
          <div key={index} className={`p-4 mb-4 rounded-lg border-2 ${index === 0 ? 'border-gold' : index === 1 ? 'border-silver' : 'border-bronze'}`}>
            <h3 className="font-bold text-lg">{userEmail}</h3>
            <p className="mt-2">{"Chi tiêu"}: {totalSpent}đ</p>
          </div>
        ))}
      </div>

      <div className="mt-8 content-center">
        <div className="flex mx-auto gap-2 flex-wrap justify-center">
          <div className="flex p-2 items-center border rounded-full">
            <h1 className="flex m-2 p-2 ">Ngày bắt đầu </h1>
            <div className="mx-4 mt-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex p-2 items-center border rounded-full">
            <h1 className="flex m-2 p-2">Ngày kết thúc </h1>
            <div className="mx-4 mt-2">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-md mt-4 mx-auto">
        <button onClick={handleFillClick} className="bg-primary text-white">
          Tìm kiếm
        </button>
      </div>

      <div className="flex col-3 mx-5 gap-10 justify-center">
        <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
          <h1>Tổng doanh thu</h1>
          <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
           Tổng doanh thu
          </h1>
        </div>
        <div className="flex-1 p-5 m-5 text-center rounded-md bg-slate-200">
          <h1>Tổng đơn hàng</h1>
          <h1 className="p-5" style={{ fontSize: "2em", fontWeight: "bold" }}>
            {totalPaidOrders}
          </h1>
        </div>
      </div>

      <div className="mt-8">
        {paginatedOrders?.length > 0 ? (
          paginatedOrders.map((order) => (
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
                    {order.paid ? <>{"Đã thanh toán"}</> : <>{"Chưa thanh toán"}</>}
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
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link href={"/orders/" + order._id} className="button">
                  Hiện
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>{"Không tìm thấy"}</div>
        )}
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
