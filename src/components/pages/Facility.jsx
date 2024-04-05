import React, { useState } from "react";
import FacilityCard from "../UI/FacilityCard";

function Facility() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("beds");
  const data = [
    {
      patientName: "William Humphrey",
      facilityId: "A1",
      occupied: true,
    },

    {
      patientName: "John Smith",
      facilityId: "A2",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "A3",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "A4",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "A5",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "A6",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B1",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B2",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B3",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B4",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B5",
      occupied: false,
    },
    {
      patientName: "John Smith",
      facilityId: "B6",
      occupied: true,
    },
    {
      patientName: "John Smith",
      facilityId: "B6",
      occupied: true,
    },
    {
      patientName: "John Smith",
      facilityId: "B6",
      occupied: true,
    },
    {
      patientName: "John Smith",
      facilityId: "B6",
      occupied: true,
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "beds":
        return (
          <div className="grid gap-16 m-t-20">
            {data.map((patient, index) => (
              <FacilityCard key={index} data={patient} />
            ))}
          </div>
        );
      case "equipments":
        // Render equipment content here
        return <div>Equipment Content</div>;
      case "ambulance":
        // Render ambulance content here
        return <div>Ambulance Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="m-t-20 bold-text">Facility | Bed Management</div>

      <div className="tabs m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "beds" ? "active" : ""}`}
          onClick={() => setSelectedTab("beds")}
        >
          Beds
        </div>

        <div
          className={`tab-item ${selectedTab === "equipments" ? "active" : ""}`}
          onClick={() => setSelectedTab("equipments")}
        >
          Equipments
        </div>

        <div
          className={`tab-item ${selectedTab === "ambulance" ? "active" : ""}`}
          onClick={() => setSelectedTab("ambulance")}
        >
          Ambulance
        </div>
      </div>

      <div className="dropdown-input w-25 m-t-20 ">
        <select>
          <option value="Ward A">Ward A</option>
          <option value="Ward B">Ward B</option>
          <option value="Ward C">Ward C</option>
          <option value="Ward D">Ward D</option>
        </select>
      </div>

      <div className="m-t-20 bold-text">
        Assigned Patients location | Ward A
      </div>

      {renderTabContent()}
    </div>
  );
}

export default Facility;
