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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    getPaymentHistory();
    getHmo();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${patientId}/${pageNumber}/10/patient-payment-history`);
      console.log(response);
      setPaymentHistory(response?.data?.resultList);
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
    marginTop: "80px",
  };

  const headerStyle = {
    marginTop: "20px",
    marginBottom: "20px",
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
    justifyContent: "space-between",
    flexDirection: "column",
    flexWrap: isMobile ? "wrap" : "nowrap",
  };

  const hmoItemStyle = {
    flex: isMobile ? "1 1 100%" : "1 1 45%",
    margin: "10px 0",
  };

  const historicalPaymentsStyle = {
    marginTop: "40px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={patientInfoStyle}>
          <h2 style={patientDetailsStyle}>{patientName}</h2>
          <span style={patientDetailsStyle}>Patient ID: {patientId}</span>
        </div>
        <div className="col-4 float-right">
          <div style={hmoDetailsStyle}>
            <div style={hmoItemStyle}>
              <TagInputs
                className="no-wrap"
                value={hmo?.packages && hmo.packages.length > 0 ? hmo.packages[0].name : ""}
                disabled
                label="HMO Class"
              />
            </div>
            <div style={hmoItemStyle}>
              <TagInputs className="no-wrap" disabled label="Validity" />
            </div>
          </div>
        </div>
      </div>
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
      <div style={historicalPaymentsStyle}>
        <h3>Historical Payments</h3>
        <HMOTableHistory data={paymentHistory} />
      </div>
    </div>
  );
}

export default FinanceDetails;
