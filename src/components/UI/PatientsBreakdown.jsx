import React from "react";
import { patientBreakdown } from "../pages/mockdata/PatientData";
import { RiHeartPulseLine } from "react-icons/ri";
function PatientsBreakdown() {
  return (
    <div className="container">
      <div className="flex flex-v-center w-100 space-between border-bottom p-b-20">
        {" "}
        <div className="bold-text">
          Patients Breakdown
        </div> <div>Today</div>{" "}
      </div>

      {patientBreakdown.map((patient, index) => (
        <div
          className="flex flex-v-center w-100 gap-10 border-bottom p-b-20 p-t-20"
          key={index}
        >
          <RiHeartPulseLine className="text-green" />

          <div className="flex wrap flex-v-center w-100 space-between ">
            <div>{patient?.name}</div>
            <div className="bold-text">{patient?.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PatientsBreakdown;
