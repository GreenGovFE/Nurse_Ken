import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";

function ContactDetails({setSelectedTab}) {

  const [payload, setPayload] = useState({});
  const [contact, setContact] = useState({})

  const handleChange = (event) => {
    setPayload({...payload, [event.target.name]: event.target.value })
    console.log(payload)
  }

  useEffect(() => {
    getContact()
  }, [])

  const submitPayload = async () => {
    let res = await post("/patients/updateContact", {...payload, patientId:Number(sessionStorage.getItem("patientId")) })
  console.log(res)
    if (res){
      notification({message:res?.messages, type: "success"})
      setSelectedTab("emergencyContact")
    }
  }

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(sessionStorage.getItem("patientId"))}/contact`)
      if (res) {
        setContact(res)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }


  return (
    <div>
      <div className="w-50">
        {" "}
        <div className="m-t-40"></div>
        <TagInputs onChange = {handleChange} value ={contact?.stateOfResidence} name ="stateOfResidence"  label="State Of Residence" />
        <TagInputs onChange = {handleChange} value ={contact?.lgaResidence} name ="lgaResidence" label="LGA" />
        <TagInputs onChange = {handleChange} value ={contact?.city} name ="city" label="City" />
        <TagInputs onChange = {handleChange} value ={contact?.homeAddress} name ="homeAddress" label="Home Address" />
        <TagInputs onChange = {handleChange} value ={contact?.phone} name ="phone" label="Phone Number" />
        <TagInputs onChange = {handleChange} value ={contact?.email} name ="email" label="Email Address" />
        <TagInputs onChange = {handleChange} value ={contact?.altPhone} name ="altPhone" label="Alt Phone Number" />

        <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Continue</button>

      </div>
    </div>
  );
}

export default ContactDetails;