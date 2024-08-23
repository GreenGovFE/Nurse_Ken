import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import { get, post, put } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import UploadPic from "../../UI/UploadPic";
import { usePatient } from "../../../contexts";
import axios from "axios";

function Personal({ setSelectedTab, hide }) {
  const { patientId, patientInfo, setPatientId, setPatientInfo } = usePatient();
  const [payload, setPayload] = useState({
      firstName: null,
      lastName: null,
      gender: null,
      dateOfBirth: "2024-06-28",
      email: "user@example.com",
      phoneNumber: null,
      stateOfOrigin: null,
      lga: null,
      placeOfBirth: null,
      maritalStatus: null,
      nationality: 19,
      clinicId: 0,
      pictureUrl: null    
  });
  const [pictureUrl, setPictureUrl] = useState('');
  const [fileName, setFilename] = useState('');
  const [states, setStates] = useState([]);
  const [nationality, setNationality] = useState([]);

  const gender = [
    { value: "choose", name: "Choose Gender" },
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" }
  ];

  const maritalStatus = [
    { value: "choose", name: "Choose Marital Status" },
    { value: "Single", name: "Single" },
    { value: "Married", name: "Married" }
  ];

  const patientType = [
    { value: "New", name: "New" },
    { value: "Referred", name: "Referred" }
  ];

  useEffect(() => {
    setPayload(patientInfo || {firstName: null,
      lastName: null,
      gender: null,
      dateOfBirth: null,
      email: null,
      phoneNumber: null,
      stateOfOrigin: null,
      lga: null,
      placeOfBirth: null,
      maritalStatus: null,
      nationality: "Nigerian",
      clinicId: Number(sessionStorage.getItem("clinicId")),
      pictureUrl: null    });
    fetchNationality();
    fetchStates();
  }, [patientInfo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate >= currentDate) {
        notification({ message: 'Date selected cannot be a future date', type: "error" });
        return;
      }
    } else if (name === 'phoneNumber') {
      if ((value.length <= 11 && isNaN(value)) || value.length > 11) {
        notification({ message: 'Please enter a valid phone number', type: "error" });
        return;
      }
    }

    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  };

  const requiredFields = {
    email: "Email",
    gender: "Gender",
    lastName: "Last Name",
    firstName: "First Name",
    nationality: "Nationality",
    phoneNumber: "Phone Number",
    dateOfBirth: 'Date Of Birth',
    maritalStatus: "Marital Status"
  };

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
    return missingFields;
  };

  const submitPayload = async () => {
    const missingFields = checkMissingFields(payload);
    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map(field => requiredFields[field]);
      notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
      return;
    }

    if (patientInfo) {
      setSelectedTab("contactDetails");
      return;
    }

    if (!payload.phoneNumber || payload.phoneNumber.length !== 11 || isNaN(payload.phoneNumber)) {
      notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
      return;
    }

    if (!isValidEmail(payload.email)) {
      notification({ message: 'Please enter valid email', type: "error" });
      return;
    }

    try {
      let res = await post("/patients/AddPatient", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), pictureUrl });
      if (res.patientId) {
        notification({ message: res?.messages || 'Patient added successfully', type: "success" });
        setSelectedTab("contactDetails");
        setPatientId(res.patientId);
        setPatientInfo(payload)
      }
    } catch (error) {
      console.log(error);
      if (error.status && error.status === 409) {
        notification({ message: 'Patient already exists', type: "error" });
      } else {
        notification({ message: 'An error occurred while adding the patient', type: "error" });
      }
    }
  };

  const fetchPatientById = async (id) => {
    try {
      let res = await get(`/patients/AllPatientById?patientId=${id}`);
      setPayload(res);
      setPatientInfo(res);
    } catch (error) {
    }
  };

  const fetchStates = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      notification({ message: 'Token not found in session storage', type: "error" });
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      let res = await axios.get(`https://edogoverp.com/clinicapi/api/profile/state/list/1/100`, options);
      let tempDoc = res?.data?.resultList.map((doc) => {
        return { name: doc?.name, value: doc?.name };
      });

      tempDoc?.unshift({ name: "Select State", value: "" });
      setStates(tempDoc);
    } catch (error) {
    }
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const fetchNationality = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      notification({ message: 'Token not found in session storage', type: "error" });
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      let res = await axios.get(`https://edogoverp.com/clinicapi/api/profile/nationality/list/1/100`, options);
      let tempDoc = res?.data?.resultList.map((doc) => {
        return { name: doc?.name, value: doc?.name };
      });

      tempDoc?.unshift({ name: "Select Nationality", value: "" });
      setNationality(tempDoc);
    } catch (error) {
      notification({ message: 'An error occurred while fetching nationality', type: "error" });
    }
  };

  const updatePatient = async () => {
    const missingFields = checkMissingFields(payload);
    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map(field => requiredFields[field]);
      notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
      return;
    }

    if (!payload.phoneNumber || payload.phoneNumber.length !== 11 || isNaN(payload.phoneNumber)) {
      notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
      return;
    }

    if (!isValidEmail(payload.email)) {
      notification({ message: 'Please enter valid email', type: "error" });
      return;
    }

    try {
      let res = await put("/patients/UpdatePatient", { ...payload, pictureUrl });
      if (res.patientId) {
        notification({ message: res?.messages || 'Patient updated successfully', type: "success" });
        setPatientId(res.patientId);
        setPatientInfo(payload)
        fetchPatientById(res.patientId);
      }
    } catch (error) {
      console.log(error);
      notification({ message: 'An error occurred while updating patient', type: "error" });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return;
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
      <div className="m-t-40 "></div>
      <div className="flex space-between">
        <div className="col-7">
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.firstName || ''} name="firstName" label="First Name*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.lastName || ''} name="lastName" label="Last Name*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.gender || ''} name="gender" type="select" label="Gender*" options={gender} />
          <TagInputs onChange={handleChange} disabled={!hide} value={formatDate(payload?.dateOfBirth) || ''} name="dateOfBirth" type="date" label="Date Of Birth*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.email || ''} name="email" label="Email*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.phoneNumber || ''} name="phoneNumber" label="Phone Number*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.nationality || ''} name="nationality" type="select" label="Nationality*" options={nationality} />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.stateOfOrigin || ''} name="stateOfOrigin" type="select" label="State Of Origin" options={states} />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.lga || ''} name="lga" label="LGA" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.placeOfBirth || ''} name="placeOfBirth" label="Place Of Birth" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.maritalStatus || ''} name="maritalStatus" type="select" label="Marital Status*" options={maritalStatus} />
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
                <UploadPic handlePicChange={setPictureUrl} name={setFilename} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {hide === true && (
          <>
            <button onClick={submitPayload} className="submit-btn m-t-20 col-7">Continue</button>
            {patientId !== 0 &&
              <button onClick={updatePatient} className="save-drafts col-7">Update</button>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default Personal;
