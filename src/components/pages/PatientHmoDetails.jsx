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

  const [pictureUrl, setPictureUrl] = useState('');
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([]);
  const [patientInformation, setPatientInfomation] = useState('');
  const [selectedTab, setSelectedTab] = useState("personal");

  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "personal":
        return <Personal renderTabContent={renderTabContent} />;
      case "contactDetails":
        return <ContactDetails renderTabContent={renderTabContent} />;
      case "membershipCover":
        return <MembershipCover renderTabContent={renderTabContent} />;
      default:
        return <Personal renderTabContent={renderTabContent} />;
    }
  };

  useEffect(() => {
    fetchPatientById();
  }, []);

  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/${patientId}/${pageNumber}/10/patient-payment-history`);
      console.log(response);
      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
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
      const hmo = await fetchHmoById(11);
      console.log("HMO details for ID", res?.hmoId, ":", hmo);
      setPatientInfomation({ data, hmo });
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
      <div style={{ marginTop: '80px' }}>
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{  display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '10px' }}>{`${patientInformation?.data?.firstName} ${patientInformation?.data?.lastName}`}</h2>
              <span style={{ marginBottom: '10px' }}>Patient ID: {patientId}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div>
              <TagInputs className="no-wrap" value={patientInformation?.hmo?.packages && patientInformation?.hmo?.packages.length > 0 ? patientInformation?.hmo?.packages[0].name : ''} disabled label="HMO Class" />
            </div>
            <div className="m-r-30">
              <TagInputs className="no-wrap " disabled label="Validity" />
            </div>
          </div>
        </div>

        <div className="col-5">
          <div style={{ flex: '50%' }}>
            <TagInputs className="no-wrap" value={`${patientInformation?.hmo?.vendorName || ''}  |  ${patientInformation?.hmo?.taxIdentityNumber || ''}`} disabled label="HMO Service Provider" />
          </div>
        </div>

        <div style={{ marginTop: '20px', fontWeight: 'bold', display: 'flex' }}>
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "personal" ? '2px  solid #3C7E2D' : 'none', color: selectedTab === "personal" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("personal")}
          >
            Personal
          </div>
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "contactDetails" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "contactDetails" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("contactDetails")}
          >
            Contact Details
          </div>
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "membershipCover" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "membershipCover" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("membershipCover")}
          >
            Membership Cover
          </div>
        </div>

        <div>
          {
            selectedTab === "personal" ? <Personal hide={false} setSelectedTab={setSelectedTab} /> :
              selectedTab === "contactDetails" ?
                <ContactDetails hide={false} setSelectedTab={setSelectedTab} /> :
                selectedTab === "membershipCover" ?
                  <MembershipCover setSelectedTab={setSelectedTab} /> : null
          }
        </div>
      </div>
    </div>
  );
}

export default PatientHMOetails;
