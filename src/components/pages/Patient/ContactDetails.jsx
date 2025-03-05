import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import axios from "axios";

function ContactDetails({ setSelectedTab, hide }) {
  const { patientId } = usePatient();
  const [states, setStates] = useState(null);

  const [payload, setPayload] = useState({});

  useEffect(() => {
    getContact();
    fetchStates();
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
    stateOfResidence: "State Of Residence",
    lgaResidence: "LGA",
    city: "City",
    homeAddress: "Home Address",
    phone: "Phone Number",
    email: "Email Address",
    altPhone: "Alt Phone Number"
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

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
    return missingFields;
  };

  const submitPayload = async () => {
    // Validate phone number
    
    // const missingFields = checkMissingFields(payload);
    // if (missingFields.length > 0) {
    //   const missingFieldLabels = missingFields.map(field => requiredFields[field]);
    //   notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
    //   return;
    // }
    
    // if (!payload.phone || payload.phone.length !== 11 || isNaN(payload.phone)) {
    //   notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!payload.altPhone || payload.altPhone.length !== 11 || isNaN(payload.altPhone)) {
    //   notification({ message: 'Please make sure alt phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter a valid email address', type: "error" });
    //   return;
    // }

    try {
      let res = await post("/patients/updateContact", { ...payload, patientId: Number(patientId) });
      if (res) {
        notification({ message: res?.messages, type: "success" });
        setSelectedTab("emergencyContact");
      }
    } catch (error) {
      notification({ message: error?.response?.data?.errorData[0] || error?.message, type: "error" });
    }
  };
  

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(patientId)}/contact`);
      if (res) {
        setPayload(res);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  return (
    <div>
      <div className="w-50">
        <div className="m-t-40"></div>
        <TagInputs type={'select'} onChange={handleChange} disabled={!hide} options = {states} value={payload?.stateOfResidence || ''} name="stateOfResidence" label="State Of Residence" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.lgaResidence || ''} name="lgaResidence" label="LGA" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.city || ''} name="city" label="City" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.homeAddress || ''} name="homeAddress" label="Home Address" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.phone || ''} name="phone" label="Phone Number" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.email || ''} name="email" label="Email Address" />
        <TagInputs onChange={handleChange} disabled={!hide} value={payload?.altPhone || ''} name="altPhone" label="Alt Phone Number" />

        {hide === true &&
          <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">Continue</button>
        }
      </div>
    </div>
  );
}

export default ContactDetails;
