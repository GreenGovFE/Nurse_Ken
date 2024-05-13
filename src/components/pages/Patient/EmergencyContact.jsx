import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";

function EmergencyContact({setSelectedTab}) {

  const [payload, setPayload] = useState()
  const [emergencyContact, setEmergencyContact] = useState({})

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

  useEffect(()=>{
    getContact()
  }, [])


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
    }else{
      notification({ message: res?.messages, type: "error" })

    }
  }

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(sessionStorage.getItem("patientId"))}/emergencycontact`)
      if (res) {
        setEmergencyContact(res)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }



  return (
    <div className="w-50">
      {" "}
      <div className="m-t-40"></div>
      <TagInputs onChange = {handleChange} value = {emergencyContact?.relationship} name ="relationship" label="Relationship" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.firstName} name ="firstName" label="First Name" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.lastName} name ="lastName" label="Last Name" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.gender} name ="gender" options={gender} type = "select" label="Gender" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.dateOfBirth} name ="dateOfBirth" type = "date" label="Date Of Birth" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.phoneNumber} name ="phoneNumber" label="Phone Number" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.Nationality} name ="Nationality" label="Nationality" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.email} name ="email" label="Email" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.contactAddress} name ="contactAddress"  label="Contact Address" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.stateOfResidence} name ="stateOfResidence"  label="State Of Residence" />
      <TagInputs onChange={handleChange} nvalue = {emergencyContact?.maritalStatus} ame="maritalStatus" type="select" label="Marital Status" options={maritalStatus} />

      <TagInputs onChange = {handleChange} value = {emergencyContact?.lga} name ="lga"  label="LGA" />
      <TagInputs onChange = {handleChange} value = {emergencyContact?.altPhone} name ="altPhone" label="Alternative Phone Number" />

      <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Continue</button>

    </div>
  );
}

export default EmergencyContact;

