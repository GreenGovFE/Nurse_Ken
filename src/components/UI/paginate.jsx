const Paginate = ({ currentPage, totalPages, setCurrentPage }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;
  };

  return (
    <div
      className="pagination flex flex-v-center gap-12 m-t-20 m-b-80"
      style={{ justifyContent: "space-between" }}
    >
      <div className="flex flex-v-center gap-8">
        <span className="bold-text">Page</span>
        <span>
          {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex flex-v-center gap-4">
        <button
          className={`pagination-btn-small ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
            color: currentPage === 1 ? "#999" : "#333",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        {generatePageNumbers().map((page, index) => (
          <button
            key={`page-${index}`}
            className={`pagination-btn-small ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
            style={{
              padding: "6px 10px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === page ? "#007bff" : "#fff",
              color: currentPage === page ? "#fff" : "#333",
              cursor: "pointer",
              minWidth: "32px",
            }}
          >
            {page}
          </button>
        ))}

        <button
          className={`pagination-btn-small ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
            color: currentPage === totalPages ? "#999" : "#333",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Paginate;
