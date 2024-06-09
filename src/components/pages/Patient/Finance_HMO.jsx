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
import MembershipCover from "./MembershipCover";


function Finance_HMO() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const personalInfo = patientInfo;
  const [pictureUrl, setPictureUrl] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([])

  useEffect(() => {
    getPaymentHistory()
    getHmo()
  }, [])
  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${personalInfo?.patientId}/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  const getHmo = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/${personalInfo?.hmoId}`);
      console.log(response)

      setHmo(response?.data);
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
              <span className="m-b-10">Patient Name: {patientName}</span>
              <span className="m-b-10">Patient ID: {patientId}</span>
              {/* <span>Visit Date:</span> */}
            </div>
          </div>
        </div>

        <h3 className="m-t-40 m-b-40">HMO Details</h3>
        <div className="">
        <MembershipCover hide={false}/> 
        </div>
      </div>
    </div>
  );
}

export default Finance_HMO;
