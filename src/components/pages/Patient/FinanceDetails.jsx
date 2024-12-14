import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import axios from "axios";
import { usePatient } from "../../../contexts";
import { RiCloseFill } from "react-icons/ri";
import Spinner from "../../UI/Spinner";
import PaymentHistory from "../../tables/Patient_Payment_History";
import Paginate from "../../UI/paginate";

function FinanceDetails({ closeModal }) {
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [hmo, setHmo] = useState([]);
  const { patientId, patientName, patientPage, hmoId } = usePatient();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    getHmo();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getPaymentHistory()
  }, [currentPage])

  const getPaymentHistory = async () => {
    setLoading(true)
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${patientId}/${currentPage}/10/patient-payment-history`, options);
      setPaymentHistory(response?.data?.resultList);
      setTotalPages(response?.data?.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setLoading(false)
    }
  };

  const getHmo = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/${hmoId}`, options);
      setHmo(response?.data);
    } catch (error) {
      console.error("Error fetching HMO:", error);
    }
  };

  const headerStyle = {
    marginTop: "20px",
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

  return (
    <div className="overlay" >
      <RiCloseFill className='close-btn pointer' onClick={() => closeModal(false)} />
      <div className="modal-content p-20">
        <>
          {loading ? <Spinner /> :
            <>
              <div style={headerStyle}>
                <div style={patientInfoStyle}>
                  <h2 style={patientDetailsStyle}>{patientName}</h2>
                </div>

              </div>
              <div style={hmoDetailsStyle}>
                <>
                  {hmo?.vendorName &&
                    <div className="col-5">
                      <TagInputs
                        className="no-wrap"
                        value={`${hmo?.vendorName || ''}  |  ${hmo?.taxIdentityNumber || ''}`}
                        disabled
                        label="HMO Provider"
                      />
                    </div>
                  }
                </>
              </div>
              <h3 className="m-b-10">Payment History</h3>
              <div>
                <PaymentHistory data={paymentHistory} />
                <div className="m-t-20">
                  <Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
              </div>

            </>
          }
        </>
      </div>
    </div>
  );
}

export default FinanceDetails;
