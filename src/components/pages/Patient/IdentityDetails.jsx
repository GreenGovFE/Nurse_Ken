import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TagInputs from "../../layouts/TagInputs";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import notification from "../../../utility/notification";

function IdentityDetails({ hide }) {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [payload, setPayload] = useState(
    {
      identityType: "",
      connectionMeans: "",
      specifyOrthers: "",
      identificationNumber: "",
      resisdentPermitNo: "",
      bvn: "",
      maidenName: "",
      
    }
  )
  const [IdentityTypes, setIdentityTypes] = useState([])
  const [connectionMeans, setConnetionMeans] = useState([])


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

  useEffect(() => {
    getIdentity()
    getConnectionMeans()
    getIdentityTypes()
  }, [])


  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, payload)

    if (name === 'bvn') {
      if (isNaN(value) || value.length > 11) {
        notification({ message: 'Please enter a valid BVN', type: "error" })
        return;
      }
    }

    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  }


  const submitPayload = async () => {

    
    const data = {
      ...payload,
      connectionMeans: Number(payload.connectionMeans),
      identityType: Number(payload.identityType),
    }
    
    const customFieldNames = {
      identityType: "Identity Type",
      connectionMeans: "Connetion Means",
      // specifyOrthers: "Specify Others",
      identificationNumber: "Identification Number",
      resisdentPermitNo: "Resident Permit Number",
      bvn: "BVN",
      maidenName: "Maiden Name",
      
    };
    
    // Validation function to check for fields that are 0 or empty 
    const validatePayload = (payload) => {
      const fieldsToCheck = Object.keys(payload).filter(field => field !== 'specifyOrthers');
      return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '');
    };
    
    const invalidFields = validatePayload(data);
    
    if (invalidFields.length > 0) {
      const formattedFields = invalidFields.map(field => {
        if (customFieldNames[field]) {
          return customFieldNames[field];
        }
        // Add space between camelCased words
        return field.replace(/([a-z])([A-Z])/g, '$1 $2');
      });
      
      const errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
      notification({ message: errorMessage, type: "error" });
      return;
    }
    if (payload.bvn.length < 11) {
      notification({ message: 'BVN must be 11 digits', type: 'error' })
      return
    }

    if (!patientId) {
      notification({ message: 'Can only add Identity details to a selected patient please create one or select one first', type: 'error' })
      return
    }

    let res = await post("/patients/add-patient-identity", { ...data, patientId: Number(patientId) })
    console.log(res)
    if (res.messages == "The patient identity has been updated successfully") {
      notification({ message: res?.messages, type: "success" })
      sessionStorage.setItem("patientId", res?.patientId)
    } else {
      notification({ message: 'Failed to create identity', type: "error" })

    }
  }

  const getIdentity = async () => {
    try {
      let res = await get(`/patients/patient-identity-byId/${Number(patientId)}`)
      if (res) {
        setPayload(res)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }

  const getConnectionMeans = async () => {
    try {
      let res = await get(`/patients/get-connection-means?pageIndex=1&pageSize=100`)
      if (res) {
        let temp = res?.map((doc) => {
          return { name: doc?.value, value: parseFloat(doc?.index) };
        });

        temp?.unshift({ name: "Select Cennection means", value: "" });
        setConnetionMeans(temp)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }

  const getIdentityTypes = async () => {
    try {
      let res = await get(`/patients/get-identity-type?pageIndex=1&pageSize=100`)
      if (res) {
        let tempDoc = res?.map((doc) => {
          return { name: doc?.value, value: parseFloat(doc?.index) };
        });

        tempDoc?.unshift({ name: "Select Identification Type", value: "" });
        setIdentityTypes(tempDoc)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }



  return (
    <div className="w-50">
      <div className="m-t-40"></div>
      <div>
        {hide ?
          <TagInputs onChange={handleChange} disabled={hide} value={payload?.identityType || ''} name="identityType" label="Identity Type" options={IdentityTypes} />
          :
          <TagInputs onChange={handleChange} value={payload?.identityType || ''} name="identityType" label="Identity Type" options={IdentityTypes} type={'select'} />

        }
      </div>
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.specifyOrthers || ''} name="specifyOrthers" label="Specify Others" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.identificationNumber || ''} name="identificationNumber" label="Identification Number" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.resisdentPermitNo || ''} name="resisdentPermitNo" label="Resident Permit Number" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.bvn || payload?.phone} name="bvn" label="BVN" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.maidenName || ''} name="maidenName" label="Maiden Name" />
      <div>
        {hide ?
          <TagInputs onChange={handleChange} disabled={hide} value={payload?.connectionMeans || ''} name="connectionMeans" label="Conection Means" options={connectionMeans} />
          :
          <TagInputs onChange={handleChange} value={payload?.connectionMeans || ''} name="connectionMeans" label="Conection Means" options={connectionMeans} type={'select'} />

        }
      </div>

      {hide !== true &&
        <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Submit</button>
      }

    </div>
  );
}

export default IdentityDetails;

