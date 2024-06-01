import React, { useEffect, useState } from "react";
import ProfilePix from "../../assets/images/profile-pix.jpg";
import axios from "axios";
import HMOTableHistory from "../../components/tables/HMO_Table_Payment_History";
import { usePatient } from "../../contexts/index";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import MembershipCover from "./Patient/MembershipCover";


function PatientHMOetails() {
  const { patientId, patientName, hmoId, patientInfo, setPatientInfo } = usePatient();

  const [pictureUrl, setPictureUrl] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([])
  const [patientInformation, setPatientInfomation] = useState('')
  const [selectedTab, setSelectedTab] = useState("personal");


  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "personal":
        return <Personal renderTabContent={renderTabContent} />;

      case "contactDetails":
        return <ContactDetails renderTabContent={renderTabContent} />;

      // case "emergencyContact":
      //   return <EmergencyContact renderTabContent={renderTabContent} />;

      case "membershipCover":
        return <MembershipCover renderTabContent={renderTabContent} />;

      default:
        return <Personal renderTabContent={renderTabContent} />;
    }
  };

  useEffect(() => {
    fetchPatientById()
  }, [])
  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${patientId}/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const fetchHmoById = async (hmoId) => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/${hmoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching HMO details:', error);
      return null;
    }
  };

  const fetchPatientById = async () => {
    try {
      const res = await get(`/patients/AllPatientById?patientId=${patientId}`);
      const data = res;

      // Fetch HMO details
      const hmo = await fetchHmoById(11);
      console.log("HMO details for ID", res?.hmoId, ":", hmo); // Log HMO details
      setPatientInfomation({ data, hmo });
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };




  console.log(patientInformation)

  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };
  return (
    <div>
      {" "}
      <div className="w-100 m-t-80">

        <div className=" m-t-20 m-b-20 flex space-between flex-h-center">
          <div className="flex space-between flex-v-center ">
            <div style={{ border: '4px solid #3C7E2D', boxShadow: '1px 4px 11px 0px #CEBDE440', borderRadius: '6px', width: "120px", height: "120px", overflow: "hidden", position: "relative" }}>
              <img
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "100%", maxHeight: "100%" }}
                onError={addDefaultSrc}
                src={patientInformation?.data?.pictureUrl || ProfilePix}
                alt={pictureUrl}
              />

            </div>
            <div className="m-l-10 flex flex-direction-v ">
              <span className="m-b-10">Patient Name: {`${patientInformation?.data?.firstName} ${patientInformation?.data?.lastName}`}</span>

              <span className="m-b-10">Patient ID: {patientId}</span>
              <span>Visit Date:</span>
            </div>
          </div>
          <div className="col-4 float-right">
            <div className="flex-50"><TagInputs className="no-wrap" value={patientInformation?.hmo?.packages && patientInformation?.hmo?.packages.length > 0 ? patientInformation?.hmo?.packages[0].name : ''} disabled label="HMO Class" /></div>
            <div className="flex-50"><TagInputs className="no-wrap" disabled label="Validity" /></div>
          </div>
        </div>


        <div className="flex w-100">

          <div className="flex  w-100 space-between">
            <div className="flex-50"><TagInputs className="no-wrap" value={`${patientInformation?.hmo?.vendorName || ''}  |  ${patientInformation?.hmo?.taxIdentityNumber || ''}`} disabled label="HMO Service Provider" /></div>
          </div>

        </div>
        <div className=" tabs m-t-20 bold-text">
          <div
            className={`tab-item ${selectedTab === "personal" ? "active" : ""}`}
            onClick={() => setSelectedTab("personal")}
          >
            Personal
          </div>

          <div
            className={`tab-item ${selectedTab === "contactDetails" ? "active" : ""
              }`}
            onClick={() => setSelectedTab("contactDetails")}
          >
            Contact Details
          </div>

          {/* <div
          className={`tab-item ${selectedTab === "emergencyContact" ? "active" : ""
            }`}
          onClick={() => setSelectedTab("emergencyContact")}
        >
          Emergency Contact
        </div> */}

          <div
            className={`tab-item ${selectedTab === "membershipCover" ? "active" : ""
              }`}
            onClick={() => setSelectedTab("membershipCover")}
          >
            Membership Cover
          </div>

        </div>

        <div>
          {
            selectedTab === "personal" ? <Personal setSelectedTab={setSelectedTab} /> :
              selectedTab === "contactDetails" ?
                <ContactDetails setSelectedTab={setSelectedTab} /> :
                // selectedTab === "emergencyContact" ?
                //   <EmergencyContact setSelectedTab={setSelectedTab} /> :
                selectedTab === "membershipCover" ?
                  <MembershipCover setSelectedTab={setSelectedTab} /> : null

          }
        </div>
      </div>
    </div>
  );
}

export default PatientHMOetails;


