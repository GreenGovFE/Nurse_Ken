import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { PatientData, stats } from "./mockdata/PatientData";
import InsuranceTable from "../tables/insuranceTable";
import { get } from "../../utility/fetch";

function PatientsInsurance() {
  

  return (
    <div className="w-100 m-t-80">
      <h3>HMO/Insurance Management</h3>

      <div className="flex w-100 space-between">

        <div className="flex flex-v-center  w-50 m-t-20">

          <input type="text" className="" />
          <div className="dropdown-input w-25 ">


          </div>
        </div>
      </div>

      <div className="">
        <InsuranceTable />
      </div>
    </div>
  );
}

export default PatientsInsurance;
