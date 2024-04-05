import React, { useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { post } from "../../../utility/fetch";
import notification from "../../../utility/notification";

function EmergencyContact({setSelectedTab}) {

  const [payload, setPayload] = useState()

  let gender = [
    { value: "choose", name: "Choose Gender" },
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },                                                                          
    
  ]

  let maritalStatus = [
    { value: "choose", name: "Choose Marital Status" },
    { value: "Single", name: "Single" },
    { value: "Married", name: "Married" },
  ]


  const handleChange = (event) => {
    setPayload({...payload, [event.target.name]: event.target.value })
    console.log(payload)
  }

  
  const submitPayload = async () => {
    let res = await post("/patients/emergencyContact", {...payload, patientId:Number(sessionStorage.getItem("patientId")) })
    console.log(res.patientId)
    if (res.patientId){
      notification({message:res?.messages, type: "success"})
      setSelectedTab("medicalRecord")
      sessionStorage.setItem("patientId", res?.patientId)
    }
  }



  return (
    <div className="w-50">
      {" "}
      <div className="m-t-40"></div>
      <TagInputs onChange = {handleChange} name ="relationship" label="Relationship" />
      <TagInputs onChange = {handleChange} name ="firstName" label="First Name" />
      <TagInputs onChange = {handleChange} name ="lastName" label="Last Name" />
      <TagInputs onChange = {handleChange} name ="gender" options={gender} type = "select" label="Gender" />
      <TagInputs onChange = {handleChange} name ="dateOfBirth" type = "date" label="Date Of Birth" />
      <TagInputs onChange = {handleChange} name ="phoneNumber" label="Phone Number" />
      <TagInputs onChange = {handleChange} name ="Nationality" label="Nationality" />
      <TagInputs onChange = {handleChange} name ="email" label="Email" />
      <TagInputs onChange = {handleChange} name ="contactAddress"  label="Contact Address" />
      <TagInputs onChange = {handleChange} name ="stateOfResidence"  label="State Of Residence" />
      <TagInputs onChange={handleChange} name="maritalStatus" type="select" label="Marital Status" options={maritalStatus} />

      <TagInputs onChange = {handleChange} name ="lga"  label="LGA" />
      <TagInputs onChange = {handleChange} name ="altPhone" label="Alternative Phone Number" />

      <button onClick={submitPayload} className="btn  m-t-20 w-100" >Continue</button>

    </div>
  );
}

export default EmergencyContact;

