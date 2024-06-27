import React, { useEffect, useState } from "react";
import HMOTable from "../../tables/HMOTable";
import { PatientData } from "../mockdata/PatientData";
import HeaderSearch from "../../../Input/HeaderSearch";
import SelectInput from "../../../Input/SelectInput";
import { AiOutlinePlus } from "react-icons/ai";
import { Navigate } from "react-router";
import TagInputs from "../../layouts/TagInputs";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import axios from "axios";
import HMOTableHistory from "../../tables/HMO_Table_Payment_History";
import { usePatient } from "../../../contexts";

function FinanceDetails() {
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([]);
  const { patientId, patientName, patientPage, hmoId } = usePatient();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    getPaymentHistory();
    getHmo();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${patientId}/${currentPage}/10/patient-payment-history`);
      console.log(response);
      setPaymentHistory(response?.data?.resultList);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const getHmo = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/${hmoId}`);
      console.log(response);
      setHmo(response?.data);
    } catch (error) {
      console.error("Error fetching HMO:", error);
    }
  };

  const containerStyle = {
    padding: "20px",
    width: "100%",
    marginTop: "40px",
  };

  const headerStyle = {
    marginTop: "20px",
    marginBottom: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: isMobile ? "wrap" : "nowrap",
  };

  const patientInfoStyle = {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "column",

  };

  const patientDetailsStyle = {
    marginBottom: "10px",
  };

  const hmoDetailsStyle = {
    display: "flex",
    marginTop: "10px",

    justifyContent: "space-between",
    flexDirection: "column",
    flexWrap: isMobile ? "wrap" : "nowrap",
  };

  const hmoItemStyle = {
    flex: isMobile ? "1 1 100%" : "1 1 45%",
    margin: "10px 0",
  };

  const historicalPaymentsStyle = {
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={patientInfoStyle}>
          <h2 style={patientDetailsStyle}>{patientName}</h2>
        </div>

      </div>
      <h3>Payment Breakdown</h3>
      <div style={hmoDetailsStyle}>
        <div className="col-5">
          <TagInputs
            className="no-wrap"
            value={`${hmo?.vendorName || ''}  |  ${hmo?.taxIdentityNumber || ''}`}
            disabled
            label="HMO Service Provider"
          />
        </div>
      </div>
      <div>
        <HMOTableHistory data={paymentHistory} />
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

export default FinanceDetails;
