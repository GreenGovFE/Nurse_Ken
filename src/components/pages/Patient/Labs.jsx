import React from "react";
import LabsTable from "../../tables/LabsTable";
import { allergyData } from "../mockdata/PatientData";
function Labs() {
  return (
    <div>
      {" "}
      <div className="m-t-40">Labs</div>
      <div className="w-100">
        <LabsTable data={allergyData} />
      </div>
    </div>
  );
}

export default Labs;
