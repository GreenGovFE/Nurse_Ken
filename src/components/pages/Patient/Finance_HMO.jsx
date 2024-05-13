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


function Finance_HMO() {
  const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo"));
  const [pictureUrl, setPictureUrl] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    getPaymentHistory()
  }, [])
  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/32/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  const getHmo = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/32/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  console.log(paymentHistory)

  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };
  return (
    <div>
      {" "}
      <div className="w-100 m-t-80">

        <div className=" m-t-20 m-b-20 flex space-between flex-h-center">
          <div className="flex space-between flex-v-center ">
            <div style={{ border:'4px solid #3C7E2D', boxShadow: '1px 4px 11px 0px #CEBDE440', borderRadius: '6px', width: "120px", height: "120px", overflow: "hidden", position: "relative" }}>
              <img
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "100%", maxHeight: "100%" }}
                onError={addDefaultSrc}
                src={pictureUrl || personalInfo?.pictureUrl || ProfilePix}
                alt={pictureUrl}
              />

            </div>
            <div className="m-l-10 flex flex-direction-v ">
              <span className="m-b-10">Patient Name: {sessionStorage?.getItem("patientName")}</span>
              <span className="m-b-10">Patient ID: {sessionStorage.getItem("patientId")}</span>
              <span>Visit Date:</span>
            </div>
          </div>
          <div className="col-4 float-right">
            <div className="flex-50"><TagInputs className="no-wrap" label="HMO Class" /></div>
            <div className="flex-50"><TagInputs className="no-wrap" label="Validity" /></div>
          </div>
        </div>


        <div className="flex w-100">

          <div className="flex  w-100 space-between">
            <div className="flex-50"><TagInputs className="no-wrap" label="HMO Service Provider" /></div>
          </div>

        </div>

        <h3 className="m-t-40">Payment Breakdown</h3>
        <div className="">
          <HMOTable data={PatientData} />
        </div>

        <h3 className="m-t-40">Historical Payments</h3>
        <div className="">
          <HMOTableHistory data={paymentHistory} />
        </div>
      </div>
    </div>
  );
}

export default Finance_HMO;
