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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [topSpendingUsers, setTopSpendingUsers] = useState([]);
  const itemsPerPage = 6;
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'paid', 'unpaid', 'recent'

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFillClick = () => {
    fetchOrders(startDate, endDate);
  };

  const handleFilterChange = (filterType) => {
    setOrderFilter(filterType);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [orders, orderFilter, currentPage]);

  function applyFilter() {
    let filtered = [...orders];
    
    switch (orderFilter) {
      case 'paid':
        filtered = orders.filter(order => order.paid);
        break;
      case 'unpaid':
        filtered = orders.filter(order => !order.paid);
        break;
      case 'recent':
        filtered = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        filtered = orders;
        break;
    }
    
    setFilteredOrders(filtered);
    
    // Apply pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedOrders(filtered.slice(start, end));
  }

  function fetchOrders(startDate, endDate) {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((allOrders) => {
        let dateFilteredOrders;
        if (startDate && endDate) {
          const start = startDate.getTime(); // convert to timestamp
          const end = endDate.getTime();
          dateFilteredOrders = allOrders.filter((order) => {
            if (!order.createdAt) {
              return false;
            }
            const orderDateStr = dbTimeForHumanDay(order.createdAt);
            const [day, month, year] = orderDateStr.split("/");
            const orderDate = new Date(year, month - 1, day).getTime(); // convert to timestamp
            return orderDate >= start && orderDate <= end;
          });
        } else {
          dateFilteredOrders = allOrders;
        }
        setOrders(dateFilteredOrders.reverse());
        setLoadingOrders(false);

        const userSpending = {};

        dateFilteredOrders.forEach((order) => {
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

  // Tính tổng sản phẩm đã bán
  const totalProductsSold = orders.reduce((total, order) => {
    if (order.paid && order.cartProducts) {
      return total + order.cartProducts.reduce((orderTotal, product) => {
        return orderTotal + (product.quantity || 1);
      }, 0);
    }
    return total;
  }, 0);

  // Tính tổng số người dùng duy nhất
  const uniqueUsers = new Set(orders.map(order => order.userEmail));
  const totalUniqueUsers = uniqueUsers.size;

  return (
    <section className="mt-8 max-w-3xl mx-auto">
      <UserTabs isAdmin={profile.admin} />
      {loadingOrders && <div>Loading statics...</div>}

      <div className="mt-8">
        <h2 className="text-2xl text-primary font-bold mb-4">Top 3 người dùng</h2>
        {topSpendingUsers.map(([userEmail, totalSpent], index) => (
          <div key={index} className={`p-4 mb-4 rounded-lg border-2 ${index === 0 ? 'border-gold' : index === 1 ? 'border-silver' : 'border-bronze'}`}>
            <h3 className="font-bold text-lg">{userEmail}</h3>
            <p className="mt-2">{"Chi tiêu"}: {totalSpent.toLocaleString()}&nbsp;đ</p>
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

      {/* Thống kê tổng quan - Cập nhật với 4 cột */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-5 mt-8">
        <div className="p-5 text-center rounded-md bg-slate-200">
          <h1 className="text-sm font-medium">Tổng doanh thu</h1>
          <h1 className="p-2 text-xl font-bold">
            {totalRevenue.toLocaleString()}đ
          </h1>
        </div>
        <div className="p-5 text-center rounded-md bg-slate-200">
          <h1 className="text-sm font-medium">Tổng đơn hàng</h1>
          <h1 className="p-2 text-xl font-bold">
            {totalPaidOrders}
          </h1>
        </div>
        {/* <div className="p-5 text-center rounded-md bg-slate-200">
          <h1 className="text-sm font-medium">Tổng sản phẩm</h1>
          <h1 className="p-2 text-xl font-bold">
            {totalProductsSold}
          </h1>
        </div> */}
        {/* <div className="p-5 text-center rounded-md bg-slate-200">
          <h1 className="text-sm font-medium">Tổng người dùng</h1>
          <h1 className="p-2 text-xl font-bold">
            {totalUniqueUsers}
          </h1>
        </div> */}
      </div>

      {/* Filter buttons */}
      <div className="mt-8 mb-4">
        <h3 className="text-lg font-semibold mb-3">Lọc đơn hàng:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full border transition-colors ${
              orderFilter === 'all' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => handleFilterChange('paid')}
            className={`px-4 py-2 rounded-full border transition-colors ${
              orderFilter === 'paid' 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Đã thanh toán
          </button>
          <button
            onClick={() => handleFilterChange('unpaid')}
            className={`px-4 py-2 rounded-full border transition-colors ${
              orderFilter === 'unpaid' 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Chưa thanh toán
          </button>
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
          items={filteredOrders}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </section>
  );
}