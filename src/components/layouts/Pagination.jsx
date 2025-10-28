const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  generatePageNumbers,
}) => {
  return (
    <div
      className="pagination flex ju gap-12 m-t-20"
      style={{ justifyContent: "space-between" }}
    >
      

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

        {generatePageNumbers(currentPage, totalPages).map((page, index) => (
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

      <div className="flex flex-v-center gap-8">
        <span className="bold-text">Page</span>
        <span>
          {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
