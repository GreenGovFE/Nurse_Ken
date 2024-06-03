import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";
import UploadButton from "../../../Input/UploadButton";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

function MembershipCover({ setSelectedTab }) {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [payload, setPayload] = useState({});
  const [documentArray, setdocumentArray] = useState([]);
  const [docNames, setDocNames] = useState([]);
  const [hmoList, setHmoList] = useState([]);
  const [selectedHmoPackages, setSelectedHmoPackages] = useState([]);
  const [packageId, setPackageId] = useState({});
  const [categories, setCategories] = useState([]);

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

  const findCategoryName = (id) => {
    const category = categories.find(cat => cat.value === id);
    return category ? category.name : 'Unknown Category';
  };

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
    const hmoDetails = JSON.parse(payload?.hmoProviderId);
    
    const Payload = {
      ...payload,
      patientId: Number(patientId),
      hmoProviderId: hmoDetails?.id,
      patientHMOCardDocumentUrl: documentArray[0]?.path,
      hmoPackageId: Number(packageId.id),
      patientHMOId: Number(payload?.patientHMOId)
    };

    console.log(packageId);

    let res = await post("/HMO/AddHMOPlan", Payload);
    console.log(res.patientId);
    if (res.patientId) {
      notification({ message: 'Added HMO to patient', type: "success" });
    } else {
      notification({ message: 'Failed to add HMO to patient', type: "error" });
    }
  };

  const getHmoList = async () => {
    try {
      let res = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/list/1/100`);
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
        <TagInputs onChange={handleChange}
          options={[
            { value: '', name: 'Select HMO Provider' },
            ...hmoList?.map((item) => {
              return { value: JSON.stringify(item), name: item.vendorName }
            })
          ]}
          name="hmoProviderId" label="Select HMO Provider" type={'select'}
        />
        <TagInputs onChange={handleChange} 
          options={[
            { value: '', name: 'Select HMO Provider' },
            ...selectedHmoPackages?.map((item, index) => {
              return { value: JSON.stringify({ index: index, id: item.id }), name: item.name }
            })
          ]}
          name="hmoPackageId" label="Select Package" type={'select'} />
        <TagInputs onChange={handleChange} value={payload?.patientHMOId || ''} name="patientHMOId" label="Patient's HMO ID" />
        <TagInputs onChange={handleChange} value={payload?.membershipValidity || payload?.phone} name="membershipValidity" type={'date'} label="Membership Validity" />
        <TagInputs onChange={handleChange} value={payload?.notes || ''} name="notes" label="Notes" type={'textArea'} />
        <div className="w-100 flex flex-h-end flex-direction-v m-t-10">
          <div className="m-t-20 m-b-20">
            <UploadButton
              setDocNames={setDocNames}
              setdocumentArray={setdocumentArray}
              sendImagg={receiveImage} />
          </div>

          {documentArray?.map((item, index) => (
            <div key={index} className="m-t-10 flex">
              <a href={item.path} target="_blank" className="m-r-10">
                {item.name}
              </a>
              <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
            </div>
          ))}
        </div>
        <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">Add HMO</button>
      </div>
      {packageId && packageId.index !== -1 &&
        <div className="w-100 none-flex-item m-t-40 m-l-20">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>S/N</th>
                <th>Benefits</th>
                <th>Benefit Cover</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody className="white-bg view-det-pane">
              {Array.isArray(selectedHmoPackages[packageId.index]?.packageBenefits) && selectedHmoPackages[Number(packageId?.index)]?.packageBenefits?.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.benefitProvision}</td>
                  <td>{row.benefitLimit}</td>
                  <td>{findCategoryName(row.categoryId)}</td>
                  
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
