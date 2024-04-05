import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { PatientData, stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import { RiCalendar2Fill } from "react-icons/ri";
import FinanceTable from "../tables/financeTable";

function PatientsFinance() {
 

  return (
    <div className="w-100 m-t-80">
      <h3>Patients Finance</h3>
      
      <div className="flex w-100 space-between">
        
        <div className="flex flex-v-center  w-50 m-t-20">
         
          <input type="text" className="" />
          <div className="dropdown-input w-25 ">
           
           
          </div>
        </div>
      </div>

      <div className="">
        <FinanceTable data={PatientData} />
      </div>
    </div>
  );
}

export default PatientsFinance;
