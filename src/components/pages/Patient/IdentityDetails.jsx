import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";

function IdentityDetails({setSelectedTab}) {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [payload, setPayload] = useState()
  const [IdentityDetails, setIdentityDetails] = useState({})

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
    const { name, value } = event.target;
    console.log(name, value, payload)
  
    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
  
      if (selectedDate >= currentDate) {
        console.log("Invalid input");
        notification({ message: 'Please select appropriate date', type: "error" })
        return;
      }
    }else if(name == 'phone' || name == 'altPhone'){
      if((value.length <= 11 && isNaN(value)) || value.length > 11){
        notification({ message: 'Please enter a valid phone number', type: "error" })
        return;
      }
    }
    
    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  }

  
  const submitPayload = async () => {
    let res = await post("/patients/IdentityDetails", {...payload, patientId:Number(patientId) })
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
      let res = await get(`/patients/${Number(patientId)}/IdentityDetails`)
      if (res) {
        setPayload(res)
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
      <TagInputs onChange = {handleChange} value = {payload?.relationship || ''} name ="relationship" label="Relationship" />
      <TagInputs onChange = {handleChange} value = {payload?.firstName || ''} name ="firstName" label="First Name" />
      <TagInputs onChange = {handleChange} value = {payload?.lastName || ''} name ="lastName" label="Last Name" />
      <TagInputs onChange = {handleChange} value = {payload?.phoneNumber || payload?.phone} name ="phone" label="Phone Number" />
      <TagInputs onChange = {handleChange} value = {payload?.email || ''} name ="email" label="Email" />
      <TagInputs onChange = {handleChange} value = {payload?.contactAddress || ''} name ="contactAddress"  label="Contact Address" />
      <TagInputs onChange = {handleChange} value = {payload?.stateOfResidence || ''} name ="stateOfResidence"  label="State Of Residence" />
      <TagInputs onChange = {handleChange} value = {payload?.lga || ''} name ="lga"  label="LGA" />
      <TagInputs onChange = {handleChange} value = {payload?.stateOfResidence || ''} name ="city"  label="City" />
      <TagInputs onChange = {handleChange} value = {payload?.altPhone || ''} name ="altPhone" label="Alternative Phone Number" />

      <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Continue</button>

    </div>
  );
}

export default IdentityDetails;

