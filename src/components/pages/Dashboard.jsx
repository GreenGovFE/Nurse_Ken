import React, { useEffect, useState } from "react";
import { stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import PatientsBreakdown from "../UI/PatientsBreakdown";
import PatientAdmission from "../UI/PatientAdmission";

import GenderDistribution from "../UI/GenderDistribution";
import OutAndInpatientGraph from "../UI/OutAndInpatientGraph";
import { get } from "../../utility/fetch";
import { RiAccountCircleFill, RiGroup2Fill, RiHotelBedFill } from "react-icons/ri";
import axios from "axios";

function Dashboard() {

  const [admittedpatients, setAdmittedPatients] = useState(0)
  const [inPatients, setInpatients] = useState(0)
  const [outPatients, setOutpatients] = useState(0)
  const [malePercentage, setMalePercentage] = useState(0)
  const [femalePercentage, setFemalePercentage] = useState(0)
  const [patientAdmission, setPatientAdmission] = useState([])
  const [availableStaff, setAvailableStaff] = useState(0)
  const [hmopatients, setHmoPatients] = useState(0);
  const [totalpatients, setTotalPatients] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))


  const getAdmittedPatients = async () => {
    try {
      let res = await get("/dashboard/doctor/admittedpatients")
      console.log(res)
      setAdmittedPatients(res)

    } catch (error) {
      console.error('Error fetching in and out patients:', error);

    }
  }


  console.log(userInfo)

  const token = sessionStorage.getItem('token');

  const getInAndOutPatients = async () => {
    try {
      let res = await get("/dashboard/AllOutPatientAndInPatientCount");
      console.log(res);
      setInpatients(res);
      // setOutpatients(res?.outpatientCount);
    } catch (error) {
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getPatientAdmission = async () => {
    try {
      let res = await get("/dashboard/admission");
      console.log(res);
      setPatientAdmission(res);
    } catch (error) {
      console.error('Error fetching patient admission:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getAvailableStaff = async () => {
    try {
      let res = await get(`/dashboard/AvaliableStaff/${sessionStorage?.getItem("clinicId")}`);
      console.log(res);
      setAvailableStaff(res?.avaliableStaff);
    } catch (error) {
      console.error('Error fetching available staff:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getGenderDistribution = async () => {
    try {
      let res = await get("/dashboard/gender");
      console.log(res);
      setFemalePercentage(res?.femalePatientPercentage);
      setMalePercentage(res?.malePatientPercentage);
    } catch (error) {
      console.error('Error fetching gender distribution:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getHmoPatients = async () => {
    try {
      let res = await axios.get("https://edogoverp.com/healthfinanceapi/api/dashboard/patients-with-hmo");
      console.log(res);
      setHmoPatients(res.data);
    } catch (error) {
      console.error('Error fetching HMO patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };
  const getTotalPatients = async () => {
    try {
      let res = await axios.get("https://edogoverp.com/healthfinanceapi/api/dashboard/total-patients");
      console.log(res);
      setTotalPatients(res.data);
    } catch (error) {
      console.error('Error fetching HMO patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  console.log(inPatients)

  useEffect(() => {
    getAdmittedPatients()
    getHmoPatients()
    getInAndOutPatients()
    getGenderDistribution()
    getPatientAdmission()
    getAvailableStaff()
    getTotalPatients()

  }, []);
  return (
    <div className="w-100 m-t-80">
      <div className="m-t-20">
        <div className="m-b-40">
          <span>Good Day</span>
          <h3>{userInfo?.firstName} {userInfo?.lastName}</h3>
          <span>{userInfo?.role}</span>
        </div>
        <div className="flex">

          <div className="m-r-20">
            <StatCard data={{
              number: admittedpatients,
              title: "Admitted Patients",
            }} icon={<RiHotelBedFill className="icon" size={32} />}
            />
          </div>
          <div className="m-r-20">
            <StatCard data={{
              number: availableStaff,
              title: "Available Staff",
            }} icon={<RiAccountCircleFill className="icon" size={32} />}
            />
          </div>
          <div className="m-r-20">
            <StatCard data={{
              number: hmopatients,
              title: "Patients with HMO",
            }} icon={<RiGroup2Fill className="icon" size={32} />}
            />
          </div>
          <div className="m-r-20">
            <StatCard data={{
              number: totalpatients,
              title: "Total Patients",
            }} icon={<RiGroup2Fill className="icon" size={32} />}
            />
          </div>

        </div>
        <div className="w-100 gap-16 flex">
          <div className="col-8  m-t-40">
            <OutAndInpatientGraph
              InPatients={inPatients}
              OutPatients={outPatients}
            />
            <div className="flex m-t-20 w-100">
              <div className="m-r-20 w-50">
                <PatientAdmission
                  PatientAdmission={patientAdmission}
                />
              </div>
              <div className="w-50">
                <PatientsBreakdown />
              </div>
            </div>
          </div>
          <div className="col-4 m-t-40 ">
            <GenderDistribution
              malePatientPercentage={malePercentage}
              femalePatientPercentage={femalePercentage}

            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
