const Pagination = ({ currentPage, totalPages, handlePageChange, generatePageNumbers }) => {
    console.log(totalPages)
    return (
        <div className="pagination flex space-between float-right col-4 m-t-20">
            <div className="flex gap-8">
                <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
            </div>
            <div className="flex gap-8">
                <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {"Previous"}
                </button>

                {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                    <button
                        key={`page-${index}`}
                        className={`pagination-btn ${currentPage === page ? 'bg-green text-white' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    {"Next"}
                </button>
            </div>
        </div>
    )
}

export default Pagination;