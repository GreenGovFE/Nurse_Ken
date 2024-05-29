import React, { useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { get, post, put } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";

import UploadPic from "../../UI/UploadPic";
function Personal({ setSelectedTab }) {
  const [personalInfo, setPersonalInfo] = useState(JSON.parse(sessionStorage.getItem("personalInfo")));
  const [payload, setPayload] = useState(personalInfo || {});

  const [pictureUrl, setPictureUrl] = useState(personalInfo?.pictureUrl || '')
  const [fileName, setFilename] = useState('')

  const patientId = Number(sessionStorage.getItem("patientId"))


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
  // const getMedRecords = async () => {
  //   try {
  //     let res = await get(`/patients/${patientId}/medicalRecord`)
  //     if (res) {
  //       setPersonalInfo(res)
  //       notification({ message: res?.messages, type: "success" })
  //       // sessionStorage.setItem("patientId", res?.patientId)
  //     }
  //   } catch (error) {
  //     notification({ message: error?.detail, type: "error" })
  //   }

  // }



  let patientType = [{ value: "New", name: "New" }, { value: "Referred", name: "Referred" }]

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
    }else if(name === 'phoneNumber'){
      if((value.length <= 11 && isNaN(value))|| value.length > 11){
        notification({ message: 'Please enter a valid phone number', type: "error" })
        return;
      }
    }
  
    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  }
  

  console.log(personalInfo)


  const submitPayload = async () => {
    try {
      let res = await post("/patients/AddPatient", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), pictureUrl: pictureUrl })
      if (res.patientId) {
        notification({ message: res?.messages, type: "success" })
        setSelectedTab("contactDetails")
        sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" })
    }

  }


  const fetchPatientById = async (id) => {
    try {
      let res = await get(`/patients/AllPatientById?patientId=${id}`)
      notification({ message: res?.messages, type: "success" })
      setPayload(res)
      sessionStorage.setItem("personalInfo", JSON.stringify(res))

    } catch (error) {
      notification({ message: error?.detail, type: "error" })
    }

  }



  const updatePatient = async () => {
    try {
      let res = await put("/patients/UpdatePatient", { ...payload, pictureUrl: pictureUrl })
      if (res.patientId) {
        notification({ message: res?.messages, type: "success" })
        sessionStorage.setItem("patientId", res?.patientId)
        fetchPatientById(res?.patientId)
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" })
    }

  }

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return
    }
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };


  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };

  return (
    <div className="w-80">
      {" "}
      <div className="m-t-40 "></div>
      <div className="flex space-between">
        <div className="col-7">
          <TagInputs onChange={handleChange} name="referal" label="New or Referred" type="select" options={patientType} />
          <TagInputs onChange={handleChange} value={payload?.firstName || ''} name="firstName" label="First Name" />
          <TagInputs onChange={handleChange} value={payload?.lastName || ''} name="lastName" label="Last Name" />
          <TagInputs onChange={handleChange} value={payload?.gender || ''} name="gender" type="select" label="Gender" options={gender} />
          <TagInputs onChange={handleChange} value={formatDate(payload?.dateOfBirth) || ''} name="dateOfBirth" type="date" label="Date Of Birth" />
          <TagInputs onChange={handleChange} value={payload?.email || ''} name="email" label="Email" />
          <TagInputs onChange={handleChange} value={payload?.phoneNumber || ''} name="phoneNumber" label="Phone Number" />
          <TagInputs onChange={handleChange} value={payload?.nationality || ''} name="nationality" label="Nationality" />
          <TagInputs onChange={handleChange} value={payload?.stateOfOrigin || ''} name="stateOfOrigin" label="State Of Origin" />
          <TagInputs onChange={handleChange} value={payload?.lga || ''} name="lga" label="LGA" />
          <TagInputs onChange={handleChange} value={payload?.placeOfBirth || ''} name="placeOfBirth" label="Place Of Birth" />
          <TagInputs onChange={handleChange} value={payload?.maritalStatus || ''} name="maritalStatus" type="select" label="Marital Status" options={maritalStatus} />
        </div>
        <div className="col-4">
          <p className="m-b-20">Profile Picture</p>
          <div className="m-t-20" style={{ width: "180px", height: "180px", overflow: "hidden", position: "relative" }}>
            <img
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "100%", maxHeight: "100%" }}
              onError={addDefaultSrc}
              src={pictureUrl || payload?.pictureUrl || ProfilePix}
              alt={fileName}
            />

          </div>
          <div>
            <div className="flex space-between m-t-20 m-b-10">
              <div className="flex-col no-margin">
                <div>
                  <UploadPic handlePicChange={setPictureUrl} name={setFilename} />
                </div>
                {/* <p className="m-t-10 center-text">{fileName}</p> */}

              </div>
            </div>
          </div>
        </div>




      </div>
      <button onClick={updatePatient} className="submit-btn  m-t-20 col-7" >Update</button>
      <button onClick={submitPayload} className="submit-btn  m-t-20 col-7" >Continue</button>
    </div>
  );
}

export default Personal;
