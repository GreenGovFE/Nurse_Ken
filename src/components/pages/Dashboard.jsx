import React, { useEffect, useState } from "react";
import { stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import PatientsBreakdown from "../UI/PatientsBreakdown";
import PatientAdmission from "../UI/PatientAdmission";

import GenderDistribution from "../UI/GenderDistribution";
import OutAndInpatientGraph from "../UI/OutAndInpatientGraph";
import { get } from "../../utility/fetch";
import { RiGroup2Fill, RiHotelBedFill } from "react-icons/ri";

function Dashboard() {

  const [admittedpatients, setAdmittedPatients] = useState(0)
  const getAdmittedPatients = async () => {
    let res = await get("/dashboard/doctor/admittedpatients")
    console.log(res)
    setAdmittedPatients(res)

  }
  const [hmopatients, setHmoPatients] = useState(0)
  const getHmoPatients = async () => {
    let res = await get("/dashboard/hmo-patient")
    console.log(res)
    setHmoPatients(res)

  }
  useEffect(() => {
    getAdmittedPatients()
    getHmoPatients()

  }, []);
  return (
    <div className="w-100 m-t-80">
      <div className="m-t-20">
        <div className="flex">
          {" "}

          <div className="m-r-20">
            <StatCard data={{
              number: admittedpatients,
              title: "Admitted Patients",
            }} icon={<RiHotelBedFill className="icon" size={32} />}
            />
          </div>
          <div className="m-r-20">
            <StatCard data={{
              number: hmopatients,
              title: "Patients with HMO",
            }} icon={<RiGroup2Fill className="icon" size={32} />}
            />
          </div>

        </div>
        <div className="w-100 gap-16 flex">
          <div className="w-80  m-t-40">
            <OutAndInpatientGraph />
            <div className="flex m-t-20 w-100">
              <div className="m-r-20 w-50">
                <PatientAdmission />
              </div>
              <div className="w-50">
                <PatientsBreakdown />
              </div>
            </div>
          </div>
          <div className="w-20 m-t-40">
            <GenderDistribution />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
