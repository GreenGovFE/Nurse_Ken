import React, { useEffect, useState } from "react";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import EmergencyContact from "./Patient/EmergencyContact";
import MedicalRecord from "./Patient/MedicalRecord";
import Immunization from "./Patient/Immunization";
import Visits from "./Patient/Visits";
import Treatments from "./Patient/Treatments";
import { allergyData } from "./mockdata/PatientData";
import Labs from "./Patient/Labs";
import Finance_HMO from "./Patient/Finance_HMO";
import { AiOutlinePlus } from "react-icons/ai";
import ReferralModal from "../modals/RefferalModal";

function PatientDetails() {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

 

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectRecord = () => () => {
    setIsModalOpen(true);
  };

  
  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "personal":
        return <Personal hide={true} renderTabContent={renderTabContent} />;

      case "contactDetails":
        return <ContactDetails hide={true} renderTabContent={renderTabContent} />;

      case "emergencyContact":
        return <EmergencyContact renderTabContent={renderTabContent} />;

      case "medicalRecord":
        return <MedicalRecord renderTabContent={renderTabContent} />;

      case "immunization":
        return <Immunization renderTabContent={renderTabContent} />;

      case "visits":
        return <Visits renderTabContent={renderTabContent} />;

      case "treatment":
        return <Treatments renderTabContent={renderTabContent} />;

      case "labs":
        return <Labs renderTabContent={renderTabContent} />;

      case "financeHmo":
        return <Finance_HMO />;

      default:
        return <Personal renderTabContent={renderTabContent} />;
    }
  };
  return (
    <div className="w-100">
      <div className="m-t-80">
      <div className="m-b-10 float-right col-2">
            <button onClick={() => { setIsModalOpen(true); sessionStorage.setItem("personalInfo", JSON.stringify({})); sessionStorage.setItem("patientId", '') }} className="submit-btn">
              <div className="flex flex-h-center flex-v-center">
                <AiOutlinePlus size={24} color="white" />
                <p className="m-l-10 m-r-10">Refer Patient</p>
              </div>
            </button>
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

        <div
          className={`tab-item ${selectedTab === "emergencyContact" ? "active" : ""
            }`}
          onClick={() => setSelectedTab("emergencyContact")}
        >
          Emergency Contact
        </div>

        <div
          className={`tab-item ${selectedTab === "medicalRecord" ? "active" : ""
            }`}
          onClick={() => setSelectedTab("medicalRecord")}
        >
          Medical Record
        </div>

        <div
          className={`tab-item ${selectedTab === "immunization" ? "active" : ""
            }`}
          onClick={() => setSelectedTab("immunization")}
        >
          Immunization
        </div>
        <div
          className={`tab-item ${selectedTab === "visits" ? "active" : ""}`}
          onClick={() => setSelectedTab("visits")}
        >
          Visits
        </div>
        <div
          className={`tab-item ${selectedTab === "treatment" ? "active" : ""}`}
          onClick={() => setSelectedTab("treatment")}
        >
          Treatment
        </div>
        {/* <div
          className={`tab-item ${selectedTab === "medication" ? "active" : ""}`}
          onClick={() => setSelectedTab("medication")}
        >
          Medication
        </div>
        <div
          className={`tab-item ${selectedTab === "appointment" ? "active" : ""
            }`}
          onClick={() => setSelectedTab("appointment")}
        >
          Appointment
        </div> */}
        <div
          className={`tab-item ${selectedTab === "labs" ? "active" : ""}`}
          onClick={() => setSelectedTab("labs")}
        >
          Labs
        </div>
        <div
          className={`tab-item ${selectedTab === "financeHmo" ? "active" : ""}`}
          onClick={() => setSelectedTab("financeHmo")}
        >
          Hmo
        </div>
      </div>

      <div>
        {
          selectedTab === "personal" ? <Personal hide={true} setSelectedTab={setSelectedTab} /> :
            selectedTab === "contactDetails" ?
              <ContactDetails hide={true} setSelectedTab={setSelectedTab} /> :
              selectedTab === "emergencyContact" ?
                <EmergencyContact  setSelectedTab={setSelectedTab} /> :
                selectedTab === "medicalRecord" ?
                  <MedicalRecord setSelectedTab={setSelectedTab} /> :
                  selectedTab === "immunization" ?
                    <Immunization setSelectedTab={setSelectedTab} /> :
                    selectedTab === "visits" ?
                      <Visits setSelectedTab={setSelectedTab} /> :
                      selectedTab === "treatment" ?
                        <Treatments setSelectedTab={setSelectedTab} /> :
                        selectedTab === "labs" ?
                          <Labs setSelectedTab={setSelectedTab} /> :
                          selectedTab === "financeHmo" ?
                            <Finance_HMO /> : null

        }
      </div>

      {isModalOpen &&
        <ReferralModal
          closeModal={closeModal}
        />
      }
    </div>
  )
}

export default PatientDetails;
