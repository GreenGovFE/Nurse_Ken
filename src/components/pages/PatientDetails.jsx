import React, { useEffect, useState } from "react";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import EmergencyContact from "./Patient/EmergencyContact";
import MedicalRecord from "./Patient/MedicalRecord";
import Immunization from "./Patient/Immunization";
import Treatments from "./Patient/Treatments";
import Labs from "./Patient/Labs";
import Finance_HMO from "./Patient/Finance_HMO";
import Appointment from "./Patient/Appointment";
import AppointmentModal from "../modals/AppointmentModal";
import { usePatient } from "../../contexts";
import { get } from "../../utility/fetch";
import Vitals from "./Patient/Vitals";
import AdmitCheck from "./Patient/AdmitCheck";

function PatientDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admit, setAdmit] = useState('appointment');
  const [appointment, setAppointment] = useState(false);
  const { patientId, patientName, patientInfo, nurseRoles } = usePatient();
  const fromVital = localStorage.getItem('from');
  const fromAdmit = localStorage.getItem('admit');
   const [selectedTab, setSelectedTab] = useState(fromAdmit ? 'treatment' : fromVital ? 'vitals' : nurseRoles?.includes('checkin') ? "personal" : nurseRoles?.includes('vitalnurse') ? 'vitals' : 'medicalRecord');
  const [combinedData, setCombinedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [admittedPatient, setAdmittedPatients] = useState([]);
  const showAddPatientTabs = localStorage.getItem("showAddPatientTabs") === "true";

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointment(false);
    sessionStorage.setItem("personalInfo", JSON.stringify({}));
    sessionStorage.setItem("patientId", '');
  };

  const selectRecord = () => () => {
    setIsModalOpen(true);
  };

  const getAllAdmittedPatients = async () => {
    try {
      let res = await get(`/patients/${patientId}/admited-patients?pageNumber=${currentPage}&pageSize=${10}`);
      setAdmittedPatients(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    }
  };

  const fetchData = async (currentPage) => {
    try {
      const response = await get(`/appointment/get-appointment-bypatientId/${patientId}?pageIndex=${currentPage}&pageSize=10`);
      setCombinedData(response?.data);
    } catch (e) {
      console.error('Error fetching appointments:', e);
    }
  };

  useEffect(() => {
    getAllAdmittedPatients(currentPage);
  }, [currentPage]);

  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "personal":
        return <Personal hide={true} setSelectedTab={setSelectedTab} renderTabContent={renderTabContent} />;
      case "contactDetails":
        return <ContactDetails setSelectedTab={setSelectedTab} hide={true} renderTabContent={renderTabContent} />;
      case "emergencyContact":
        return <EmergencyContact renderTabContent={renderTabContent} />;
          case "hmo":
        return <Finance_HMO renderTabContent={renderTabContent} />;
      case "medicalRecord":
        return <MedicalRecord renderTabContent={renderTabContent} />;
      case "immunization":
        return <Immunization renderTabContent={renderTabContent} />;
      case "vitals":
        return <Vitals renderTabContent={renderTabContent} />;
      case "treatment":
        return <Treatments renderTabContent={renderTabContent} />;
      case "labs":
        return <Labs renderTabContent={renderTabContent} />;
      // case "financeHmo":
      //   return <Finance_HMO />;
      case "appointment":
        return <Appointment data={combinedData} setCurrent={setCurrentPage} />;
      default:
        return <Personal setSelectedTab={setSelectedTab} renderTabContent={renderTabContent} />;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-80 flex flex-h-center flex-v-center space-between">
        <h3>{patientName}</h3>
        <div className="m-b-10 flex flex-h-center flex-v-center space-between float-right col-5">
          {/* {nurseRoles.includes('nurse') && patientInfo && (
            <button onClick={() => { setAppointment(true); setAdmit('admission'); }} className="save-drafts m-l-10">
              Admit Patient
            </button>
          )} */}
          {nurseRoles.includes('checkin') && patientInfo && (
            <button onClick={() => { setAppointment(true); setAdmit('appointment'); }} className="save-drafts m-l-10">
              Book an Appointment
            </button>
          )}
        </div>
      </div>

      <div className="tabs m-t-20 bold-text">
        <>
          {showAddPatientTabs ? (
            <>
              <div
                className={`tab-item ${selectedTab === "personal" ? "active" : ""}`}
                onClick={() => setSelectedTab("personal")}
              >
                Personal
              </div>
              <div
                className={`tab-item ${selectedTab === "contactDetails" ? "active" : ""}`}
                onClick={() => setSelectedTab("contactDetails")}
              >
                Contact Details
              </div>
              <div
                className={`tab-item ${selectedTab === "emergencyContact" ? "active" : ""}`}
                onClick={() => setSelectedTab("emergencyContact")}
              >
                Emergency Contact
              </div>
                <div
                className={`tab-item ${selectedTab === "hmo" ? "active" : ""}`}
                onClick={() => setSelectedTab("hmo")}
              >
                HMO
              </div>
            </>
          ) : (
            <>
              {nurseRoles.includes('checkin') && (
                <>
                  <div
                    className={`tab-item ${selectedTab === "personal" ? "active" : ""}`}
                    onClick={() => setSelectedTab("personal")}
                  >
                    Personal
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "contactDetails" ? "active" : ""}`}
                    onClick={() => setSelectedTab("contactDetails")}
                  >
                    Contact Details
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "emergencyContact" ? "active" : ""}`}
                    onClick={() => setSelectedTab("emergencyContact")}
                  >
                    Emergency Contact
                  </div>
                    <div
                className={`tab-item ${selectedTab === "hmo" ? "active" : ""}`}
                onClick={() => setSelectedTab("hmo")}
              >
                HMO
              </div>
                </>
              )}
              {nurseRoles.includes('vitalnurse') && patientInfo && (
                <div
                  className={`tab-item ${selectedTab === "vitals" ? "active" : ""}`}
                  onClick={() => setSelectedTab("vitals")}
                >
                  Vitals
                </div>
              )}
              {nurseRoles.includes('nurse') && (
                <>
                  <div
                    className={`tab-item ${selectedTab === "medicalRecord" ? "active" : ""}`}
                    onClick={() => setSelectedTab("medicalRecord")}
                  >
                    Medical Record
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "immunization" ? "active" : ""}`}
                    onClick={() => setSelectedTab("immunization")}
                  >
                    Immunization
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "vitals" ? "active" : ""}`}
                    onClick={() => setSelectedTab("vitals")}
                  >
                    Vitals
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "treatment" ? "active" : ""}`}
                    onClick={() => setSelectedTab("treatment")}
                  >
                    Treatment
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "appointment" ? "active" : ""}`}
                    onClick={() => setSelectedTab("appointment")}
                  >
                    Appointment/Visits
                  </div>
                  <div
                    className={`tab-item ${selectedTab === "labs" ? "active" : ""}`}
                    onClick={() => setSelectedTab("labs")}
                  >
                    Labs
                  </div>
                </>
              )}
            </>
          )}
        </>
      </div>

      <div>
        {renderTabContent(selectedTab)}
      </div>

      {appointment && (
        <AppointmentModal
          closeModal={closeModal}
          type={admit}
          fetchData={fetchData}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}

export default PatientDetails;
