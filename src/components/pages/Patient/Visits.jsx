import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import VisitsTable from "../../tables/VisitsTable";
import { allergyData } from "../mockdata/PatientData";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";



function Visits({ setSelectedTab }) {
  const [documentArray, setdocumentArray] = useState([])
  const [docNames, setDocNames] = useState([])
  const [payload, setPayload] = useState({})
  const [nurses, setNurses] = useState([])
  const [doctors, setDoctors] = useState([])
  const [visits, setVisits] = useState([])

  const handleChange = (event) => {
    if(event.target.name === "age" || event.target.name === "temperature" || event.target.name === "heartPulse" || event.target.name === "height" || event.target.name === "nurseEmployeeId" || event.target.name === "doctorEmployeeId" || event.target.name === "careType" || event.target.name === "weight"){
      setPayload({ ...payload, [event.target.name]: parseFloat(event.target.value )})

    }
    else{
      setPayload({ ...payload, [event.target.name]: event.target.value })
    }
    console.log(payload)
  }

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem("clinicId")}&pageIndex=1&pageSize=10`);
      console.log(res);
      let tempNurses = res?.data?.map((nurse, idx) => {
        return {
          name: nurse?.username, value: parseFloat(nurse?.employeeId)
        };
      });
  
      tempNurses?.unshift({
        name: "Select Nurse", value: ""
      });
  
      setNurses(tempNurses);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };
  
  const getDoctors = async () => {
    try {
      let res = await get(`/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem("clinicId")}&pageIndex=1&pageSize=30`);
      console.log(res);
      let tempDoc = res?.data?.map((doc, idx) => {
        return {
          name: doc?.username, value: parseFloat(doc?.employeeId)
        };
      });
  
      tempDoc?.unshift({
        name: "Select Doctor", value: ""
      });
  
      setDoctors(tempDoc);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };
  
  const temperatureOptions = [
    { name: "select measurement", value: "" },
    { name: "Temperature (°C)", value: "celsius" },
    { name: "Temperature (°F)", value: "fahrenheit" },
  ];

  const weightOptions = [
    { name: "select measurement", value: "" },
    { name: "Weight (kg)", value: "kg" },
    { name: "Weight (lbs)", value: "lbs" },
    { name: "Weight (g)", value: "g" },
    { name: "Weight (oz)", value: "oz" },
    { name: "Weight (mg)", value: "mg" },
  ];

  const heightOptions = [
    { name: "select measurement", value: "" },
    { name: "Height (cm)", value: "cm" },
    { name: "Height (m)", value: "m" },
    { name: "Height (ft)", value: "ft" },
   
  ];

  const careTypes = [
    { name: "Select Care Type", value: "" },
    { name: "In patient", value: 1 },
    { name: "Out patient", value: 2},
    
   
  ];

  const getVisitationDetails = async () => {
    try {
      let res = await get(`/patients/GetAllVisitationRecordByPatientId?patientId=${sessionStorage.getItem("patientId")}`);
      console.log(res);
      setVisits(res);
    } catch (error) {
      console.error('Error fetching visitation details:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  }
  


  const submitPayload = async () => {
    try {
      let res = await post("/patients/AddVisitationRecords", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), PatientId: parseFloat(sessionStorage.getItem("patientId")) })
      if (res) {
        notification({ message: res?.messages, type: "success" });
        getVisitationDetails();
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" })
    }

  }


  const next = () =>{
    setSelectedTab("treatment")
  }

  const receiveImage = (value) => {
    console.log(value)
  }
  const deleteDoc = (doc) => {
    let newarr = documentArray.filter((id) => id.name !== doc)
    setdocumentArray(newarr)
  }

  useEffect(() => {
    getNurses()
    getDoctors()
    getVisitationDetails()
  }, [])


  return (
    <div className="">
      {" "}
      <div className="m-t-40">Visit Record | Vital</div>
      <div className="w-100 flex p-20">

        <div className="w-40">
          <div><TagInputs onChange={handleChange} name="dateOfVisit" label="Visit Date" type="date" /></div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange}  name="temperature" label="Temperature" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} options = {temperatureOptions} name="firstName" type="select" />
            </div> */}
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="bloodPressure" label="Blood Pressure" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div> */}
          </div><div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="heartPulse" label="Heart Pulse" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div> */}
          </div><div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="respiratory" label="Respiratory" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div> */}
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange}  name="height" label="Height" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} options = {heightOptions} name="firstName" type="select" />
            </div> */}
          </div>
            <div className="w-100">
              <TagInputs onChange={handleChange} name="weight" label="Weight" />
            </div>
            {/* <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} options = {weightOptions} name="firstName" type="select" />
            </div> */}

          <div><TagInputs onChange={handleChange} type = 'select' options = {careTypes} name="careType" label="Care Type"  /></div>
          <div><TagInputs onChange={handleChange} options = {doctors} name="doctorEmployeeId" label="Assign Doctor" type="select" /></div>
          <div><TagInputs onChange={handleChange} name="nurseEmployeeId" label="Assign Nurse" options={nurses} type="select" /></div>
          <div><TextArea
            label="Notes"
            type="text"
            placeholder="Write your notes here..."
            onChange={handleChange}
            name="notes"
          //value={}
          // onChange={(e) =>
          //   handleInputChange(index, "comment", e.target.value)
          // }
          /></div>

          <div className="w-100 ">
            <button onClick={submitPayload} className="btn w-100 m-t-20"> Add Vitals</button>
            <button onClick={next} className="pointer w-100 m-t-20"> Continue</button>
          </div>

        </div>
        <div className="w-60 m-l-20">
          <VisitsTable data={visits} />
        </div>
      </div>
    </div>
  );
}

export default Visits;
