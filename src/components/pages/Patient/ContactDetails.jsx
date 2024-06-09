import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function ContactDetails({setSelectedTab, hide}) {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [payload, setPayload] = useState({});
  const [contact, setContact] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
  
      if (selectedDate >= currentDate) {
        console.log("Invalid input");
        notification({ message: 'Please select appropriate date', type: "error" })
        return;
      }
    }else if(name === 'phone' || name === 'altPhone'){
      if((value.length <= 11 && isNaN(value))|| value.length > 11){
        notification({ message: 'Please enter a valid phone number', type: "error" })
        return;
      }
    }
  
    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  }

  useEffect(() => {
    getContact()
  }, [])

  const submitPayload = async () => {
    
    let res = await post("/patients/updateContact", {...payload, patientId:Number(patientId) })
  console.log(res)
    if (res){
      notification({message:res?.messages, type: "success"})
      setSelectedTab("emergencyContact")
    }
  }

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(patientId)}/contact`)
      if (res) {
        setPayload(res)
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
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.stateOfResidence} name ="stateOfResidence"  label="State Of Residence" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.lgaResidence} name ="lgaResidence" label="LGA" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.city} name ="city" label="City" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.homeAddress} name ="homeAddress" label="Home Address" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.phone} name ="phone" label="Phone Number" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.email} name ="email" label="Email Address" />
        <TagInputs onChange = {handleChange}  disabled ={!hide} value ={payload?.altPhone} name ="altPhone" label="Alt Phone Number" />

        { hide === true &&
          <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Continue</button>
        }

      </div>
    </div>
  );
}

export default ContactDetails;