import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import { get, post, put } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import notification from "../../../utility/notification";

function IdentityDetails({ hide }) {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [payload, setPayload] = useState({
    identityType: "",
    connectionMeans: "",
    specifyOrthers: "",
    identificationNumber: "",
    resisdentPermitNo: "",
    bvn: "",
    maidenName: "",
  });
  const [IdentityTypes, setIdentityTypes] = useState([]);
  const [connectionMeans, setConnectionMeans] = useState([]);

  useEffect(() => {
    getIdentity();
    getConnectionMeans();
    getIdentityTypes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, payload);

    if (name === 'bvn') {
      if (isNaN(value) || value.length > 11) {
        notification({ message: 'Please enter a valid BVN', type: "error" });
        return;
      }
    }

    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  };

  const submitPayload = async () => {
    const data = {
      ...payload,
      connectionMeans: Number(payload.connectionMeans) || '',
      identityType: Number(payload.identityType) || '',
    };

    const customFieldNames = {
      identityType: "Identity Type",
      connectionMeans: "Connection Means",
      identificationNumber: "Identification Number",
      resisdentPermitNo: "Resident Permit Number",
      bvn: "BVN",
      maidenName: "Maiden Name",
    };

    const validatePayload = (payload) => {
      const fieldsToCheck = Object.keys(payload).filter(field => field !== '');
      return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '' || payload[field] === null || payload[field] === undefined);
    };

    const invalidFields = validatePayload(data);

    if (invalidFields.length > 0) {
      const formattedFields = invalidFields.map(field => {
        if (customFieldNames[field]) {
          return customFieldNames[field];
        }
        return field.replace(/([a-z])([A-Z])/g, '$1 $2');
      });

      const errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
      notification({ message: errorMessage, type: "error" });
      return;
    }
    if (payload.bvn.length < 11) {
      notification({ message: 'BVN must be 11 digits', type: 'error' });
      return;
    }

    if (!patientId) {
      notification({ message: 'Can only add Identity details to a selected patient. Please create one or select one first.', type: 'error' });
      return;
    }

    let res = await post("/patients/add-patient-identity", { ...data, patientId: Number(patientId) });
    console.log(res);
    if (res.messages === "The patient identity has been updated successfully") {
      notification({ message: res?.messages, type: "success" });
      sessionStorage.setItem("patientId", res?.patientId);
    } else {
      notification({ message: 'Failed to create identity', type: "error" });
    }
  };

  const updateIdentity = async () => {
    const data = {
      ...payload,
      connectionMeans: Number(payload.connectionMeans) || '',
      identityType: Number(payload.identityType) || '',
    };

    const customFieldNames = {
      identityType: "Identity Type",
      connectionMeans: "Connection Means",
      identificationNumber: "Identification Number",
      resisdentPermitNo: "Resident Permit Number",
      bvn: "BVN",
      maidenName: "Maiden Name",
    };

    const validatePayload = (payload) => {
      const fieldsToCheck = Object.keys(payload).filter(field => field !== '');
      return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '' || payload[field] === null || payload[field] === undefined);
    };

    const invalidFields = validatePayload(data);

    if (invalidFields.length > 0) {
      const formattedFields = invalidFields.map(field => {
        if (customFieldNames[field]) {
          return customFieldNames[field];
        }
        return field.replace(/([a-z])([A-Z])/g, '$1 $2');
      });

      const errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
      notification({ message: errorMessage, type: "error" });
      return;
    }
    if (payload.bvn.length < 11) {
      notification({ message: 'BVN must be 11 digits', type: 'error' });
      return;
    }

    if (!patientId) {
      notification({ message: 'Can only add Identity details to a selected patient. Please create one or select one first.', type: 'error' });
      return;
    }

    let res = await put("/patients/update-patient-identity", { ...data, patientId: Number(patientId) });
    console.log(res);
    if (res.messages ==="The patient identity details have been updated") {
      notification({ message: res?.messages, type: "success" });
      sessionStorage.setItem("patientId", res?.patientId);
    } else {
      notification({ message: 'Failed to create identity', type: "error" });
    }
  };

  const getIdentity = async () => {
    try {
      let res = await get(`/patients/patient-identity-byId/${Number(patientId)}`);
      if (res) {
        setPayload(res);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const getConnectionMeans = async () => {
    try {
      let res = await get(`/patients/get-connection-means?pageIndex=1&pageSize=100`);
      if (res) {
        let temp = res?.map((doc) => {
          return { name: doc?.value, value: parseFloat(doc?.index) };
        });

        temp?.unshift({ name: "Select Connection Means", value: "" });
        setConnectionMeans(temp);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const getIdentityTypes = async () => {
    try {
      let res = await get(`/patients/get-identity-type?pageIndex=1&pageSize=100`);
      if (res) {
        let tempDoc = res?.map((doc) => {
          return { name: doc?.value, value: parseFloat(doc?.index) };
        });

        tempDoc?.unshift({ name: "Select Identification Type", value: "" });
        setIdentityTypes(tempDoc);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const findOptionValue = (options, value) => {
    if (value == 'NIN') {
      value = 'National Identification Number '
    }
    console.log(value)
    const formattedValue = value.replace(/\s+/g, '').toLowerCase();
    const option = options.find(opt => opt.name.replace(/\s+/g, '').toLowerCase() === formattedValue);
    return option ? option.value : "";
  };

  console.log(connectionMeans)


  return (
    <div className="w-50">
      <div className="m-t-40"></div>
      <div>
        {hide ?
          <TagInputs
            onChange={handleChange}
            disabled={hide}
            value={payload?.identityType || ''}
            name="identityType"
            label="Identity Type"
          />
          :
          <TagInputs
            onChange={handleChange}
            value={findOptionValue(IdentityTypes, payload?.identityType) || payload?.identityType || ''}
            name="identityType"
            label="Identity Type"
            options={IdentityTypes}
            type={'select'}
          />
        }
      </div>
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.specifyOrthers || ''} name="specifyOrthers" label="Specify Others" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.identificationNumber || ''} name="identificationNumber" label="Identification Number" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.resisdentPermitNo || ''} name="resisdentPermitNo" label="Resident Permit Number" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.bvn || payload?.phone} name="bvn" label="BVN" />
      <TagInputs onChange={handleChange} disabled={hide} value={payload?.maidenName || ''} name="maidenName" label="Maiden Name" />
      <div>
        {hide ?
          <TagInputs
            onChange={handleChange}
            disabled={hide}
            value={payload?.connectionMeans || ''}
            name="connectionMeans"
            label="Connection Means"
          />
          :
          <TagInputs
            onChange={handleChange}
            value={findOptionValue(connectionMeans, payload?.connectionMeans) || payload?.connectionMeans || ''}
            name="connectionMeans"
            label="Connection Means"
            options={connectionMeans}
            type={'select'}
          />
        }
      </div>

      {hide !== true &&
        <div>
          <button onClick={submitPayload} className="submit-btn  m-t-20 w-100" >Submit</button>
          <button onClick={updateIdentity} className="save-drafts  m-t-20 w-100" >Update</button>
        </div>
      }
    </div>
  );
}

export default IdentityDetails;
