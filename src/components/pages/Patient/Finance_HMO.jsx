import React from "react";
import HMOTable from "../../tables/HMOTable";
import { PatientData } from "../mockdata/PatientData";
import HeaderSearch from "../../../Input/HeaderSearch";
import SelectInput from "../../../Input/SelectInput";
import { AiOutlinePlus } from "react-icons/ai";
import { Navigate } from "react-router";
import TagInputs from "../../layouts/TagInputs";

function Finance_HMO() {
  return (
    <div>
      {" "}
      <div className="w-100 m-t-80">
      <h3>Payment Breakdown</h3>
      
      <div className="flex w-100">
        
      <div className="flex  w-100 space-between">
        <div className="flex-50"><TagInputs className ="no-wrap" label = "HMO Service Provider"/></div>
          <div className="m-l-10 flex-20"><HeaderSearch /></div>
          <div className="m-l-10 flex-20"><SelectInput/></div>
          
        </div>
      </div>

      <div className="">
        <HMOTable data={PatientData} />
      </div>
    </div>
    </div>
  );
}

export default Finance_HMO;
