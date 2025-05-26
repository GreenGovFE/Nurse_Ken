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
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [admittedpatients, setAdmittedPatients] = useState(0)
  const [inPatients, setInpatients] = useState(0)
  const [patientsVisited, setPatientsVisited] = useState(0) 
  const [outPatients, setOutpatients] = useState(0)
  const [malePercentage, setMalePercentage] = useState(0)
  const [femalePercentage, setFemalePercentage] = useState(0)
  const [patientAdmission, setPatientAdmission] = useState([])
  const [availableStaff, setAvailableStaff] = useState(0)
  const [hmopatients, setHmoPatients] = useState(0);
  const [totalpatients, setTotalPatients] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))

  const navigate = useNavigate();

  const getAdmittedPatients = async () => {
    try {
      let res = await get("/dashboard/doctor/admittedpatients")
      setAdmittedPatients(res)
    } catch (error) {
      console.error('Error fetching in and out patients:', error);

    }
  }

  const token = sessionStorage.getItem('token');

  const getInAndOutPatients = async () => {
    try {
      let res = await get("/dashboard/AllOutPatientAndInPatientCount");
      setInpatients(res);
      setPatientsVisited(res?.monthlyStats)
      // setOutpatients(res?.outpatientCount);
    } catch (error) {
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getPatientAdmission = async () => {
    try {
      let res = await get("/dashboard/admission");
      setPatientAdmission(res);
    } catch (error) {
      console.error('Error fetching patient admission:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getAvailableStaff = async () => {
    try {
      let res = await get(`/dashboard/AvaliableStaff/${sessionStorage?.getItem("clinicId")}`);
      setAvailableStaff(res?.avaliableStaff);
    } catch (error) {
      console.error('Error fetching available staff:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getGenderDistribution = async () => {
    try {
      let res = await get("/dashboard/gender");
      setFemalePercentage(res?.femalePatientPercentage);
      setMalePercentage(res?.malePatientPercentage);
    } catch (error) {
      console.error('Error fetching gender distribution:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getHmoPatients = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      let res = await get("/dashboard/hmo-patient");
      setHmoPatients(res);
    } catch (error) {
      console.error('Error fetching HMO patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };
  const getTotalPatients = async () => {
    try {
      let res = await get("/dashboard/AllPatientCount");
      setTotalPatients(res);
    } catch (error) {
      console.error('Error fetching HMO patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const clicked = (path, type) => {

    if (type === "admit") {
    localStorage.setItem("admitPatients", true);

    }else if (type === "hmo") {
      localStorage.setItem("hmoPatients", true);
    }else{
      localStorage.setItem("patients", true);
    }
    navigate(path);

  }

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
    <div className="w-100 m-t-60">
      <div className="m-t-40">
        <div className="m-b-40">
          <span>Good Day</span>
          <h3>{userInfo?.firstName} {userInfo?.lastName}</h3>
          <span>{userInfo?.role}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>

          <div onClick={()=>clicked('/patients', 'admit')} className="col-3">
            <StatCard data={{
              number: admittedpatients,
              title: "Admitted Patients",
            }} icon={<RiHotelBedFill className="icon" size={32} />}
            />
          </div>
          {/* <div className="col-3">
            <StatCard data={{
              number: availableStaff,
              title: "Available Staff",
            }} icon={<RiAccountCircleFill className="icon" size={32} />}
            />
          </div> */}
          <div onClick={()=>clicked('/patients', 'hmo')}  className="col-3">
            <StatCard data={{
              number: hmopatients,
              title: "Patients with HMO",
            }} icon={<RiGroup2Fill className="icon" size={32} />}
            />
          </div>
          <div onClick={()=>clicked('/patients', 'patients')}  className=" col-3">
            <StatCard data={{
              number: totalpatients,
              title: "Total Patients",
            }} icon={<RiGroup2Fill className="icon" size={32} />}
            />
          </div>

        </div>
        <div className="w-100 gap-16 ">
          <div className="flex wrap space-between m-t-40">
            <div className="col-8">
              <OutAndInpatientGraph
                monthlyStats={patientsVisited}
              />
            </div>
            <div className="col-4 ">
              <GenderDistribution
                malePatientPercentage={malePercentage}
                femalePatientPercentage={femalePercentage}

              />
            </div>
          </div>
          <div className=" m-t-20 w-100">
            <div className="col-8">
              <PatientAdmission
                PatientAdmission={patientAdmission}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
