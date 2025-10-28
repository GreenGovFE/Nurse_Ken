import React, { useEffect, useState } from "react";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import axios from "axios";
import { usePatient } from "../../../contexts";
import MembershipCover from "./MembershipCover";
import IdentityDetails from "./IdentityDetails";
import { get } from "../../../utility/fetch";


function Finance_HMO() {
  const { patientId, patientName, hmoId, patientInfo, setHmoDetails } = usePatient();

  const personalInfo = patientInfo;
  const [pictureUrl, setPictureUrl] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([])
  const [selectedTab, setSelectedTab] = useState("membershipCover");

  useEffect(() => {
    getHmo()
    getHmobyId()
  }, [])


  const getHmo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/hmo/${personalInfo?.hmoId}`);
      setHmo(response?.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const getHmobyId = async () => {
    await get(`/HMO/get-patient-hmo/${patientId}`)
      .then(res => {
        setHmoDetails(res?.data);
      })
      .catch(err => {
        console.error('Error fetching HMO details:', err);
      });
  }

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

  return (
    <div>
      <div className="w-100 ">
        <div className="flex m-l-10 m-t-40">
          {/* <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "identityDetails" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "identityDetails" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("identityDetails")}
          >
            Identity Details
          </div> */}
          <div
            style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "membershipCover" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "membershipCover" ? '#3C7E2D' : '#393939' }}
            onClick={() => setSelectedTab("membershipCover")}
          >
            Membership Cover
          </div>
        </div>
        <div className="">
          {
            // selectedTab === "identityDetails" ?
            //   <IdentityDetails hide={false} setSelectedTab={setSelectedTab} /> :
              selectedTab === "membershipCover" ?
                <MembershipCover hide={false} setSelectedTab={setSelectedTab} /> : null
          }
        </div>
      </div>
    </div>
  );
}

export default Finance_HMO;
