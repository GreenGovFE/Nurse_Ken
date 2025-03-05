import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import { get, post, put } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import UploadPic from "../../UI/UploadPic";
import { usePatient } from "../../../contexts";
import axios from "axios";
import Spinner from "../../UI/Spinner";

function Personal({ setSelectedTab, hide }) {
  const { patientId, patientInfo, setPatientId, setPatientInfo } = usePatient();
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    stateOfOrigin: "",
    lga: "",
    placeOfBirth: "",
    maritalStatus: "",
    nationality: 'Nigerian',
    clinicId: 0,
    pictureUrl: ""
  });
  const [pictureUrl, setPictureUrl] = useState(null);
  const [fileName, setFilename] = useState('');
  const [states, setStates] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader , setLoader] = useState(false);

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
    if (patientInfo) {
      setPayload({
        firstName: patientInfo?.firstName || "",
        lastName: patientInfo?.lastName || "",
        gender: patientInfo?.gender || "",
        dateOfBirth: patientInfo?.dateOfBirth || "",
        email: patientInfo?.email || "",
        phoneNumber: patientInfo?.phoneNumber || "",
        stateOfOrigin: patientInfo?.stateOfOrigin || "",
        lga: patientInfo?.lga || "",
        placeOfBirth: patientInfo?.placeOfBirth || "",
        maritalStatus: patientInfo?.maritalStatus || "",
        nationality: patientInfo?.nationality || 'Nigerian',
        clinicId: patientInfo?.clinicId || 0,
        pictureUrl: patientInfo?.pictureUrl || ""
      });
    } else {
      setPayload({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        stateOfOrigin: "",
        lga: "",
        placeOfBirth: "",
        maritalStatus: "",
        nationality: 'Nigerian',
        clinicId: 0,
        pictureUrl: ""
      });
    }
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
    // email: "Email",
    // gender: "Gender",
    lastName: "Last Name",
    firstName: "First Name",
    // nationality: "Nationality",
    phoneNumber: "Phone Number",
    dateOfBirth: 'Date Of Birth',
    // maritalStatus: "Marital Status"
  };

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
    return missingFields;
  };

  const submitPayload = async () => {
    // const missingFields = checkMissingFields(payload);
    // if (missingFields.length > 0) {
    //   const missingFieldLabels = missingFields.map(field => requiredFields[field]);
    //   notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
    //   return;
    // }

    if (patientInfo) {
      setSelectedTab("contactDetails");
      return;
    }

    // if (!payload.phoneNumber || payload.phoneNumber.length !== 11 || isNaN(payload.phoneNumber)) {
    //   notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter valid email', type: "error" });
    //   return;
    // }
    setLoader(true);
    try {
      let res = await post("/patients/AddPatient", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), pictureUrl });
      if (res?.patientId) {
        notification({ message: res?.messages || 'Patient added successfully', type: "success" });
        setSelectedTab("contactDetails");
        setPatientId(res.patientId);
        setPatientInfo(payload)
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      if (error.status && error.status === 409) {
        notification({ message: 'Patient already exists', type: "error" });
      } else {
        notification({ message: 'An error occurred while adding the patient', type: "error" });
      }
    } finally {
      setLoader(false);
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
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/state/list/1/100`, options);
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
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/nationality/list/1/100`, options);
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

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter valid email', type: "error" });
    //   return;
    // }
    setLoader(true);
    try {
      let res = await post("/patients/UpdatePatient", { ...payload, clinicId: Number(sessionStorage.getItem("clinicId")), pictureUrl, patientRef: patientInfo?.patientRef });
      if (res.patientId) {
        notification({ message: res?.messages || 'Patient updated successfully', type: "success" });
        setPatientId(res.patientId);
        setPatientInfo(payload)
        fetchPatientById(res.patientId);
      }
    } catch (error) {
      notification({ message: 'An error occurred while updating patient', type: "error" });
    } finally {
      setLoader(false);
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
      <div className="flex wrap space-between">
        <div className="col-7">
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.firstName || ''} name="firstName" label="First Name*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.lastName || ''} name="lastName" label="Last Name*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.gender || ''} name="gender" type="select" label="Gender*" options={gender} />
          <TagInputs onChange={handleChange} disabled={!hide} value={formatDate(payload?.dateOfBirth) || ''} name="dateOfBirth" dateRestriction={'past'} type="date" label="Date Of Birth*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.email || ''} name="email" label="Email*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.phoneNumber || ''} name="phoneNumber" label="Phone Number*" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.nationality || ''} name="nationality" type="select" label="Nationality*" options={nationality} />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.stateOfOrigin || ''} name="stateOfOrigin" type="select" label="State Of Origin" options={states} />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.lga || ''} name="lga" label="LGA" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.placeOfBirth || ''} name="placeOfBirth" label="Place Of Birth" />
          <TagInputs onChange={handleChange} disabled={!hide} value={payload?.maritalStatus || ''} name="maritalStatus" type="select" label="Marital Status*" options={maritalStatus} />
        </div>
        <div className="col-4">
          <>
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  <p className="m-b-20">Profile Picture</p>
                  <div className="m-t-20" style={{ width: "180px", height: "180px", overflow: "hidden", position: "relative" }}>
                    <img
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                      onError={addDefaultSrc}
                      src={payload?.pictureUrl || pictureUrl || ProfilePix}
                      alt={fileName || "Profile Picture"}
                    />
                  </div>
                </>
              )
            }
          </>

          <div>
            <div className="flex space-between m-t-20 m-b-10">
              <div className="flex-col no-margin">
                <UploadPic setLoading={setLoading} handlePicChange={setPictureUrl} name={setFilename} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {hide === true && (
          <>
            <button onClick={submitPayload} disabled={loader} className="submit-btn m-t-20 col-7">Continue</button>
            {patientId !== 0 && patientId !== (null) &&
              <button onClick={updatePatient} disabled={loader} className="save-drafts col-7">Update</button>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default Personal;
