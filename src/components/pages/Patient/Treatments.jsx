import React from "react";
import TreatmentTable from "../../tables/TreatmentTable";
import { allergyData } from "../mockdata/PatientData";

function Treatments() {
  return (
    <div>
      <div className="m-t-40">Treatments</div>
      <div className="w-100">
        <TreatmentTable data={allergyData} />
      </div>
    </div>
  );
}

export default Treatments;
