import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";
import UploadButton from "../../../Input/UploadButton";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

function MembershipCover({ setSelectedTab, hide }) {
  const { patientId, patientName, hmoId, patientInfo, hmoDetails } = usePatient();

  const [payload, setPayload] = useState({});
  const [documentArray, setdocumentArray] = useState([]);
  const [docNames, setDocNames] = useState([]);
  const [hmoList, setHmoList] = useState([]);
  const [selectedHmoPackages, setSelectedHmoPackages] = useState([]);
  const [packageId, setPackageId] = useState({});
  const [categories, setCategories] = useState([]);
  const [Package, setPackage] = useState({});

  const receiveImage = (value) => {
    console.log(value);
  };

  const deleteDoc = (doc) => {
    let newarr = documentArray.filter((id) => id.name !== doc);
    setdocumentArray(newarr);
  };

  useEffect(() => {
    getHmoList();
    getAllCategories();
  }, []);

  useEffect(() => {
    if (hmoDetails) {
      const hmoProvider = findHmoProvider(hmoDetails.hmoProviderId);
      console.log(hmoProvider)
      if (hmoProvider) {
        setSelectedHmoPackages(hmoProvider.packages || []);
        const hmoPackage = findHmoPackage(hmoProvider.packages, hmoDetails.hmoPackageId);
        if (hmoPackage) {
          setPackage(hmoPackage);
          setPackageId({ id: hmoPackage.id, index: hmoProvider.packages.indexOf(hmoPackage) });
        }
      }
    }
  }, [hmoDetails,hmoList]);

  const getAllCategories = async () => {
    try {
      let res = await get(`/patients/get-all-categories`);
      console.log(res);

      let temp = res?.map((item, idx) => {
        return {
          name: item?.name,
          value: parseFloat(item?.id)
        };
      });

      temp?.unshift({
        name: "Select Category",
        value: ""
      });
      setCategories(temp);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const findHmoProvider = (providerId) => {
    return hmoList.find(hmo => hmo.id == providerId);
  };

  const findHmoPackage = (packages, packageId) => {
    return packages.find(pkg => pkg.id == packageId);
  };

  // const findCategoryName = (id) => {
  //   const category = categories.find(cat => cat.value === id);
  //   return category ? category.name : 'Unknown Category';
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, payload);

    if (name === "hmoProviderId") {
      if (value) {
        const hmoDetails = JSON.parse(value);
        setSelectedHmoPackages(hmoDetails.packages || []);
        setPackageId({});
      } else {
        setSelectedHmoPackages([]);
      }
    }

    if (name === "hmoPackageId") {
      if (value) {
        const hmoPackageId = JSON.parse(value);
        setPackageId(hmoPackageId || { id: '', index: -1 });
        const hmoPackage = findHmoPackage(selectedHmoPackages, hmoPackageId.id);
        if (hmoPackage) {
          setPackage(hmoPackage);
        }
      } else {
        setPackageId({});
      }
    }

    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate >= currentDate) {
        console.log("Invalid input");
        notification({ message: 'Please select appropriate date', type: "error" });
        return;
      }
    } else if (name === 'phone' || name === 'altPhone') {
      if ((value.length <= 11 && isNaN(value)) || value.length > 11) {
        notification({ message: 'Please enter a valid phone number', type: "error" });
        return;
      }
    }

    setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
  };

  console.log(packageId?.index);

  const submitPayload = async () => {
    const hmoDetails = payload?.hmoProviderId ? JSON.parse(payload?.hmoProviderId) : '';

    const Payload = {
      ...payload,
      patientId: Number(patientId),
      hmoProviderId: hmoDetails?.id ? hmoDetails?.id : 0,
      patientHMOCardDocumentUrl: documentArray[0]?.path,
      hmoPackageId: packageId?.id ? Number(packageId.id) : 0,
      membershipValidity: payload?.membershipValidity ? payload?.membershipValidity : "",
      patientHMOId: payload?.patientHMOId ? Number(payload?.patientHMOId) : 0
    };

    console.log(packageId, hmoDetails);

    // Custom mapping for specific field names
    const customFieldNames = {
      hmoPackageId: "HMO Package",
      patientHMOId: "Patient HMO ID",
      hmoProviderId: "HMO Provider",
      membershipValidity: "Membership Validity",

    };

    // Validation function to check for fields that are 0 or empty 
    const validatePayload = (payload) => {
      const fieldsToCheck = Object.keys(payload).filter(field => field !== 'notes' && field !== 'patientId');
      return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '');
    };

    const invalidFields = validatePayload(Payload);

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

    let res = await post("/HMO/AddHMOPlan", Payload);
    console.log(res);

    if (res.message === 'Successfully assigned the patientHMO') {
      notification({ message: 'Added HMO to patient', type: "success" });
      setPayload({});
      setSelectedHmoPackages([])
      setPackageId([])
    } else {

      notification({ message: 'Failed to add HMO to patient', type: "error" });
    }
  };

  const getHmoList = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      let res = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/list/1/100`, options);
      console.log(res);
      if (res) {
        setHmoList(res.data?.resultList);
      }
    } catch (error) {
      console.error('Error fetching HMO list:', error);
    }
  };

  return (
    <div className="flex ">
      <div className="w-50">
        <div className="m-t-40"></div>
        {
          hmoDetails ?
            <div>
              <TagInputs value = {hmoDetails?.hmoProviderName} label="HMO Provider" disabled={hide}/>
              <TagInputs value = {hmoDetails?.hmoPackageName}
               
                name="hmoPackageId" disabled={hide} label="HMO Package"  />
              <TagInputs onChange={handleChange} disabled={hide} value={hmoDetails?.patientHMOId || ''} name="patientHMOId" label="Patient's HMO ID" />
              <TagInputs onChange={handleChange} disabled={hide} value={hmoDetails?.membershipValidity ? new Date(hmoDetails?.membershipValidity).toDateString() : ''} name="membershipValidity"  label="Membership Validity" />
              <div className="w-100 flex flex-h-end flex-direction-v m-t-10">
                {hide !== true &&
                  <div className="m-t-20 m-b-20">
                    <UploadButton
                      setDocNames={setDocNames}
                      setdocumentArray={setdocumentArray}
                      sendImagg={receiveImage} />
                  </div>
                }

                {documentArray?.map((item, index) => (
                  <div key={index} className="m-t-10 flex">
                    <a href={item.path} target="_blank" className="m-r-10">
                      {item.name}
                    </a>
                    <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
                  </div>
                ))}
              </div>
            </div>
            :
            <div>
              <TagInputs onChange={handleChange}

                options={[
                  { value: '', name: 'Select HMO Provider' },
                  ...hmoList?.map((item) => {
                    return { value: JSON.stringify(item), name: item.vendorName }
                  })
                ]}
                name="hmoProviderId" disabled={hide} label="Select HMO Provider" type={'select'}
              />
              <TagInputs onChange={handleChange}
                options={[
                  { value: '', name: 'Select HMO Package' },
                  ...selectedHmoPackages?.map((item, index) => {
                    return { value: JSON.stringify({ index: index, id: item.id }), name: item.name }
                  })
                ]}
                name="hmoPackageId" disabled={hide} label="Select HMO Package" type={'select'} />
              <TagInputs onChange={handleChange} disabled={hide} value={payload?.patientHMOId || ''} name="patientHMOId" label="Patient's HMO ID" />
              <TagInputs onChange={handleChange} disabled={hide} value={payload?.membershipValidity || ''} name="membershipValidity" type={'date'} label="Membership Validity" />
              <TagInputs onChange={handleChange} disabled={hide} value={payload?.notes || ''} name="notes" label="Notes" type={'textArea'} />
              <div className="w-100 flex flex-h-end flex-direction-v m-t-10">
                {hide !== true &&
                  <div className="m-t-20 m-b-20">
                    <UploadButton
                      setDocNames={setDocNames}
                      setdocumentArray={setdocumentArray}
                      sendImagg={receiveImage} />
                  </div>
                }

                {documentArray?.map((item, index) => (
                  <div key={index} className="m-t-10 flex">
                    <a href={item.path} target="_blank" className="m-r-10">
                      {item.name}
                    </a>
                    <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
                  </div>
                ))}
              </div>
            </div>
        }

        {hide !== true &&
          <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">Add HMO</button>
        }
      </div>
      {packageId && packageId.index !== -1 &&
        <div className="w-100 none-flex-item m-t-40 m-l-20">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th className="center-text">S/N</th>
                <th className="center-text">Category</th>
                <th className="center-text">Benefit Provision</th>
                <th className="center-text">Benefit Limit</th>
              </tr>
            </thead>

            <tbody className="white-bg view-det-pane">
              {Array.isArray(selectedHmoPackages[packageId.index]?.packageBenefits) && selectedHmoPackages[Number(packageId?.index)]?.packageBenefits?.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.category.name}</td>
                  <td>{row.benefitProvision}</td>
                  <td>{row.benefitLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

export default MembershipCover;
