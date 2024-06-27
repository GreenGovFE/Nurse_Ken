import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function EmergencyContact({ setSelectedTab }) {
  const { patientId } = usePatient();

  const [payload, setPayload] = useState({});

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

  useEffect(() => {
    getContact();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if ((name === 'phone' || name === 'altPhone') && (isNaN(value) || value.length > 11)) {
      notification({ message: 'Please enter a valid phone number', type: "error" });
      return;
    }
  
    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  };
  

  const requiredFields = {
    relationship: "Relationship",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    email: "Email",
    contactAddress: "Contact Address",
    stateOfResidence: "State Of Residence",
    lga: "LGA",
    city: "City"
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
    if (!payload.phone || payload.phone.length !== 11 || isNaN(payload.phone)) {
      notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
      return;
    }

    try {
      let res = await post("/patients/emergencyContact", { ...payload, patientId: Number(patientId) });
      if (res.patientId) {
        notification({ message: res?.messages, type: "success" });
        setSelectedTab("medicalRecord");
        sessionStorage.setItem("patientId", res?.patientId);
      } else {
        notification({ message: res?.messages, type: "error" });
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" });
    }
  };

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(patientId)}/emergencycontact`);
      if (res) {
        setPayload(res);
      }
    } catch (error) {
      console.error('Error fetching emergency contact details:', error);
    }
  };

  return (
    <div className="w-50">
      <div className="m-t-40"></div>
      <TagInputs onChange={handleChange} value={payload?.relationship || ''} name="relationship" label="Relationship" />
      <TagInputs onChange={handleChange} value={payload?.firstName || ''} name="firstName" label="First Name" />
      <TagInputs onChange={handleChange} value={payload?.lastName || ''} name="lastName" label="Last Name" />
      <TagInputs onChange={handleChange} value={payload?.phoneNumber || payload?.phone || ''} name="phone" label="Phone Number" />
      <TagInputs onChange={handleChange} value={payload?.email || ''} name="email" label="Email" />
      <TagInputs onChange={handleChange} value={payload?.contactAddress || ''} name="contactAddress" label="Contact Address" />
      <TagInputs onChange={handleChange} value={payload?.stateOfResidence || ''} name="stateOfResidence" label="State Of Residence" />
      <TagInputs onChange={handleChange} value={payload?.lga || ''} name="lga" label="LGA" />
      <TagInputs onChange={handleChange} value={payload?.city || ''} name="city" label="City" />
      <TagInputs onChange={handleChange} value={payload?.altPhone || ''} name="altPhone" label="Alternative Phone Number" />

      <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">Continue</button>
    </div>
  );
}

export default EmergencyContact;
