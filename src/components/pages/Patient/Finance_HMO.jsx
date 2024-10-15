import React, { useEffect, useState } from "react";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import axios from "axios";
import { usePatient } from "../../../contexts";
import MembershipCover from "./MembershipCover";
import IdentityDetails from "./IdentityDetails";


function Finance_HMO() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const personalInfo = patientInfo;
  const [pictureUrl, setPictureUrl] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([])
  const [selectedTab, setSelectedTab] = useState("identityDetails");

  useEffect(() => {
    // getPaymentHistory()
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

  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "membershipCover":
        return <MembershipCover renderTabContent={renderTabContent} />;
      case "identityDetails":
        return <IdentityDetails renderTabContent={renderTabContent} />;
      default:
        return <IdentityDetails renderTabContent={renderTabContent} />;
    }
  };

  console.log(paymentHistory)

  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };
  return (
    <div>
      <div className="w-100 ">
        <div className="flex m-t-40">
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "identityDetails" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "identityDetails" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("identityDetails")}
          >
            Identity Details
          </div>
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "membershipCover" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "membershipCover" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("membershipCover")}
          >
            Membership Cover
          </div>
        </div>
        <div className="">
          {
            selectedTab === "identityDetails" ?
              <IdentityDetails hide={false} setSelectedTab={setSelectedTab} /> :
              selectedTab === "membershipCover" ?
                <MembershipCover hide={false} setSelectedTab={setSelectedTab} /> : null
          }
        </div>
      </div>
    </div>
  );
}

export default Finance_HMO;
