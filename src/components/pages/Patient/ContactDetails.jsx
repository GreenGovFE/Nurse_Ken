import React, { useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { post } from "../../../utility/fetch";

function ContactDetails({setSelectedTab}) {

  const [payload, setPayload] = useState();

  const handleChange = (event) => {
    setPayload({...payload, [event.target.name]: event.target.value })
    console.log(payload)
  }

  const submitPayload = async () => {
    let res = await post("/patients/updateContact", {...payload, patientId:Number(sessionStorage.getItem("patientId")) })
  console.log(res)
    if (res){
      notification({message:res?.messages, type: "success"})
      setSelectedTab("emergencyContact")
    }
  }

  return (
    <div>
      <div className="w-50">
        {" "}
        <div className="m-t-40"></div>
        <TagInputs onChange = {handleChange} name ="stateOfResidence"  label="State Of Residence" />
        <TagInputs onChange = {handleChange} name ="lgaResidence" label="LGA" />
        <TagInputs onChange = {handleChange} name ="city" label="City" />
        <TagInputs onChange = {handleChange} name ="homeAddress" label="Home Address" />
        <TagInputs onChange = {handleChange} name ="phone" label="Phone Number" />
        <TagInputs onChange = {handleChange} name ="email" label="Email Address" />
        <TagInputs onChange = {handleChange} name ="altPhone" label="Alt Phone Number" />

        <button onClick={submitPayload} className="btn  m-t-20 w-100" >Continue</button>

      </div>
    </div>
  );
}

export default ContactDetails;