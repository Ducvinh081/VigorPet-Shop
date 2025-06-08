import React from 'react';
import Left from "@/components/icons/Left";
import Right from "@/components/icons/Right"; 

const Pagination = ({ currentPage, handlePageChange, items, itemsPerPage }) => (
  <div className="max-w-sm mx-auto flex justify-center items-center my-4">
    <button
      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
      className="flex mx-1 px-3 py-2 rounded-full focus:outline-none bg-white text-gray-700"
    >
      <><Left/>Previous</>
    </button>

    {currentPage > 3 && <div className="mx-2">...</div>}

    {[...Array(Math.ceil(items.length / itemsPerPage)).keys()].slice(currentPage < 3 ? 0 : currentPage - 3, currentPage < 3 ? 5 : currentPage + 2).map(page => (
      <button
        key={page}
        onClick={() => handlePageChange(page + 1)}
        className={`flex mx-1 px-3 py-2 focus:outline-none ${currentPage === page + 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        {page + 1}
      </button>
    ))}

    {currentPage < Math.ceil(items.length / itemsPerPage) - 2 && <div className="mx-2">...</div>}

    <button
      onClick={() => currentPage < Math.ceil(items.length / itemsPerPage) && handlePageChange(currentPage + 1)}
      className="flex mx-1 px-3 py-2 rounded-full focus:outline-none bg-white text-gray-700"
    >
      Next <Right/>
    </button>
  </div>
);

export default Pagination;