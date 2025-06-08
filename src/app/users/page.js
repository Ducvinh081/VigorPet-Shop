"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";

import Pagination from "@/components/Pagination";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, data } = useProfile();

  function fetchUsers() {
    fetch(`/api/users?search=${searchTerm}`).then(res => {
      res.json().then(users => {
        setUsers(users);
      });
    })
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin";
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
      {users?.length > 0 &&
          users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow">
                <div className="text-gray-900">
                  {!!user.name && <span>{user.name}</span>}
                  {!user.name && <span className="italic">GUEST</span>}
                </div>
                <div className="text-gray-500">
                  <div>{user.email}</div>
                  {user.userInfo && <div>{user.userInfo.phone}</div>}
                </div>
              </div>
              <div className="whitespace-nowrap">
                <Link className="button" href={"/users/" + user._id}>
                  Sửa
                </Link>
              </div>
            </div>
          ))}
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          items={users}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </section>
  );
}