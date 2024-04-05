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
  const [visits, setVisits] = useState([])

  const handleChange = (event) => {
    if(event.target.name === "age" || event.target.name === "temperature" || event.target.name === "heartPulse" || event.target.name === "height" || event.target.name === "nurseEmployeeId" || event.target.name === "weight"){
      setPayload({ ...payload, [event.target.name]: parseFloat(event.target.value )})

    }
    else{
      setPayload({ ...payload, [event.target.name]: event.target.value })
    }
    console.log(payload)
  }

  const getNurses = async () => {
    let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem("clinicId")}&pageIndex=1&pageSize=10`)
    console.log(res);
    let tempNurses = res?.data?.map((nurse, idx) => {
      return {
          name: nurse?.username, value: parseFloat(nurse?.employeeId)
        }
      })

      tempNurses?.unshift({
        name:"Select Nurse", value:""
      })

    setNurses(tempNurses)

  }

  const getVisitationDetails = async () =>{
    let res = await get(`/patients/GetAllVisitationRecordByPatientId?patientId=${sessionStorage.getItem("patientId")}`)
    console.log(res)
    setVisits(res)

  }


  const submitPayload = async () => {
    try {
      let res = await post("/patients/AddVisitationRecords", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), PatientId: 33 })
      if (res.patientId) {
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
  }, [])


  return (
    <div className="">
      {" "}
      <div className="m-t-40">Visit Record | Vital</div>
      <div className="w-100 flex p-20">

        <div className="w-40">
          <div><TagInputs onChange={handleChange} name="dateOfVisit" label="Visit Date" type="date" /></div>
          <div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="temperature" label="Temperature" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div>
          </div>
          <div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="bloodPressure" label="Blood Pressure" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div>
          </div><div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="heartPulse" label="Heart Pulse" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div>
          </div><div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="respiratory" label="Respiratory" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div>
          </div><div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="height" label="Height" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div></div><div className="flex">
            <div className="w-60">
              <TagInputs onChange={handleChange} name="weight" label="Weight" />
            </div>
            <div className="w-40 m-l-20">
              <TagInputs onChange={handleChange} name="firstName" type="select" />
            </div>
          </div>

          <div><TagInputs onChange={handleChange} name="doctorEmployeeId" label="Assign Doctor" type="select" /></div>
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
