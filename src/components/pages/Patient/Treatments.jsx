import React, { useEffect, useState } from "react";
import TreatmentTable from "../../tables/TreatmentTable";
import { allergyData } from "../mockdata/PatientData";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function Treatments() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([])
  const [currenttreatmentrecord, setCurrenttreatmentrecord] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false)
  

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

  useEffect(() => {
    getTreatment()
    getTreatmentHistory()
  }, [currentPage])

  useEffect(() => {
    getTreatment()
    getTreatmentHistory()
  }, [reset])

  const getTreatmentHistory = async () => {
    try {
      let res = await get(`/patients/${patientId}/currenttreatmentrecord?pageNumber=${currentPage}&pageSize=10`);
      setCurrenttreatmentrecord(res?.data);
      setTotalPages(res?.pageCount)
    } catch (error) {
      console.error('Error fetching treatment records:', error);
    }
  }

  const getTreatment = async () => {
    try {
      let res = await get(`/patients/${patientId}/treatmentrecord?pageNumber=${currentPage}&pageSize=10`);
      setTreatment(res?.data);
      setTotalPages(res?.pageCount)
    } catch (error) {
      console.error('Error fetching treatment records:', error);
    }
  }

  return (
    <div>
      <div className="w-100">
        <TreatmentTable data={treatment} reset={setReset}/>
        <div className="pagination flex space-between float-right col-3 m-t-20">
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

            {generatePageNumbers().map((page, index) => (
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
      </div>
    </div>
  );
}

export default Treatments;
