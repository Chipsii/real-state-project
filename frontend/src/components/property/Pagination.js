"use client";
import React from "react";

const Pagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  loading = false,
}) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const currentPage = Math.min(Math.max(1, Number(page) || 1), safeTotalPages);

  const handlePageClick = (p) => {
    if (loading) return;
    const next = Math.min(Math.max(1, p), safeTotalPages);
    if (next === currentPage) return;
    onPageChange?.(next);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(safeTotalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    return pageNumbers;
  };

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation">
        <li className="page-item">
          <span
            className="page-link pointer"
            onClick={() => handlePageClick(currentPage - 1)}
            style={{ opacity: currentPage === 1 || loading ? 0.5 : 1 }}
          >
            <span className="fas fa-angle-left" />
          </span>
        </li>

        {generatePageNumbers().map((p) => (
          <li key={p} className={`page-item${p === currentPage ? " active" : ""}`}>
            <span
              className="page-link pointer"
              onClick={() => handlePageClick(p)}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {p}
            </span>
          </li>
        ))}

        <li className="page-item pointer">
          <span
            className="page-link"
            onClick={() => handlePageClick(currentPage + 1)}
            style={{ opacity: currentPage === safeTotalPages || loading ? 0.5 : 1 }}
          >
            <span className="fas fa-angle-right" />
          </span>
        </li>
      </ul>

      <p className="mt10 pagination_page_count text-center">
        {startItem}-{endItem} of {total} property available
      </p>
    </div>
  );
};

export default Pagination;
