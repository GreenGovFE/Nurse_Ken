import React, { useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
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
function Personal({ setSelectedTab }) {
  const [payload, setPayload] = useState({})

  const handleChange = (event) => {
    setPayload({ ...payload, [event.target.name]: event.target.value })
    console.log(payload)
  }


  const submitPayload = async () => {
    try {
      let res = await post("/patients/AddPatient", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")) })
      if (res.patientId) {
        notification({ message: res?.messages, type: "success" })
        setSelectedTab("contactDetails")
        sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" })
    }

  }

  return (
    <div className="w-50">
      {" "}
      <div className="m-t-40"></div>
      <TagInputs onChange={handleChange} name="firstName" label="First Name" />
      <TagInputs onChange={handleChange} name="lastName" label="Last Name" />
      <TagInputs onChange={handleChange} name="gender" type="select" label="Gender" options={gender} />
      <TagInputs onChange={handleChange} name="dateOfBirth" type="date" label="Date Of Birth" />
      <TagInputs onChange={handleChange} name="email" label="Email" />
      <TagInputs onChange={handleChange} name="phoneNumber" label="Phone Number" />
      <TagInputs onChange={handleChange} name="nationality" label="Nationality" />
      <TagInputs onChange={handleChange} name="stateOfOrigin" label="State Of Origin" />
      <TagInputs onChange={handleChange} name="lga" label="LGA" />
      <TagInputs onChange={handleChange} name="placeOfBirth" label="Place Of Birth" />
      <TagInputs onChange={handleChange} name="maritalStatus" type="select" label="Marital Status" options={maritalStatus} />

      <button onClick={submitPayload} className="btn  m-t-20 w-100" >Continue</button>
    </div>
  );
}

export default Personal;
