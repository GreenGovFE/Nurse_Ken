import React, { useEffect, useState } from "react";
import ProfilePix from "../../assets/images/profile-pix.jpg";
import axios from "axios";
import { usePatient } from "../../contexts/index";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import MembershipCover from "./Patient/MembershipCover";
import IdentityDetails from "./Patient/IdentityDetails";
import Spinner from "../UI/Spinner";

function PatientHMOetails() {
  const { patientId, patientInfo, hmoDetails, setHmoDetails } = usePatient();

  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hmo, setHmo] = useState([]);
  const [patientInformation, setPatientInfomation] = useState('');
  const [selectedTab, setSelectedTab] = useState("personal");
  const [loading, setLoading] = useState(true); // Add loading state

  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "personal":
        return <Personal renderTabContent={renderTabContent} />;
      case "contactDetails":
        return <ContactDetails renderTabContent={renderTabContent} />;
      case "membershipCover":
        return <MembershipCover renderTabContent={renderTabContent} />;
      case "identityDetails":
        return <IdentityDetails renderTabContent={renderTabContent} />;
      default:
        return <Personal renderTabContent={renderTabContent} />;
    }
  };

  useEffect(() => {
    fetchPatientById();
    getHmobyId()
  }, []);

  const getHmobyId = async () => {
    await get(`/HMO/get-patient-hmo/${patientId}`)
      .then(res => {
        setHmoDetails(res?.data);
      })
      .catch(err => {
        console.error('Error fetching HMO details:', err);
      });
  }

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
    setLoading(true);
    try {
      const res = await get(`/patients/AllPatientById?patientId=${patientId}`);
      const data = res;
      const hmo = await fetchHmoById(res?.hmoId);
      setPatientInfomation({ data, hmo });
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
      {loading ? (
        <div className="m-t-80"><Spinner /></div>
      ) : (
        <div style={{ marginTop: '40px' }}>
          <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '10px' }}>{`${patientInfo?.firstName} ${patientInfo?.lastName}`}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div>
                <TagInputs className="no-wrap" value={hmoDetails?.hmoPackageName || ''} disabled label="HMO Class" />
              </div>
              <div className="w-100">
                <TagInputs
                  className="no-wrap"
                  value={hmoDetails?.membershipValidity ? new Date(hmoDetails.membershipValidity).toDateString() : ''}
                  disabled
                  label="Validity"
                />
              </div>
            </div>
          </div>

          <div className="col-5">
            <div style={{ flex: '50%' }}>
              <TagInputs className="no-wrap" value={`${hmoDetails?.hmoProviderName || ''}  |  ${patientInformation?.hmo?.taxIdentityNumber || ''}`} disabled label="HMO Service Provider" />
            </div>
          </div>

          <div style={{ marginTop: '20px', fontWeight: 'bold', display: 'flex' }}>
            <div
              style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTab === "personal" ? '2px solid #3C7E2D' : 'none', color: selectedTab === "personal" ? '#3C7E2D' : '#393939' }}
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

          <div>
            {
              selectedTab === "personal" ? <Personal hide={false} setSelectedTab={setSelectedTab} /> :
                selectedTab === "contactDetails" ?
                  <ContactDetails hide={false} setSelectedTab={setSelectedTab} /> :
                  selectedTab === "identityDetails" ?
                    <IdentityDetails hide={true} setSelectedTab={setSelectedTab} /> :
                    selectedTab === "membershipCover" ?
                      <MembershipCover hide={true} setSelectedTab={setSelectedTab} /> : null
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHMOetails;
