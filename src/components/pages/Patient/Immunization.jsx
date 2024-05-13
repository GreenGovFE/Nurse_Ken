import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import UploadButton from "../../../Input/UploadButton";
import { RiDeleteBinLine } from "react-icons/ri"
import AllergyTable from "../../tables/AlllergyTable";
import { allergyData } from "../mockdata/PatientData";
import ImmunizationTable from "../../tables/immunizationTable";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";


function Immunization({setSelectedTab}) {
  const [documentArray,setdocumentArray]= useState([])
  const [docNames, setDocNames] = useState([])
  const [payload, setPayload] = useState()
  const [immunizationData, setImmunizationData] = useState([])

  const receiveImage = (value) => {
    console.log(value)
  }
  const deleteDoc = (doc) => {
    let newarr = documentArray.filter((id) => id.name !== doc)
    setdocumentArray(newarr)
}

const getImmunization = async () => {
  try {
    let res = await get(`/patients/getAllImmunizationRecordByPatientId?patientId=${sessionStorage?.getItem("patientId")}`);
    console.log(res);
    setImmunizationData(res);
  } catch (error) {
    console.error('Error fetching immunization data:', error);
    // Handle the error here, such as displaying an error message to the user
  }
}



const handleChange = (event) => {
  if (event.target.name === "quantity"  || event.target.name === "age"  || event.target.name === "weight"  || event.target.name === "temperature" ) {
    setPayload({...payload, [event.target.name]: parseFloat(event.target.value) })
  } else {
    setPayload({...payload, [event.target.name]: event.target.value })
  }

  console.log(payload)
}


const submitPayload = async () => {
  let res = await post("/patients/addImmunizationRecords", {...payload, patientId:Number(sessionStorage.getItem("patientId")) });
  console.log(res)
  if (res){
    notification({message:res?.message, type: "success"});
    getImmunization();
  }
}

const next = () => {
  setSelectedTab("visits")
}


const temperatureOptions = [
  { name: "select measurement", value: "" },
  { name: "Temperature (°C)", value: "celsius" },
  { name: "Temperature (°F)", value: "fahrenheit" },
];

const weightOptions = [
  { name: "select measurement", value: "" },
  { name: "Weight (kg)", value: "kg" },
  { name: "Weight (lbs)", value: "lbs" },
  { name: "Weight (g)", value: "g" },
  { name: "Weight (oz)", value: "oz" },
  { name: "Weight (mg)", value: "mg" },
];

const ageOptions = [
  { name: "select measurement", value: "" },
  { name: "Age (months)", value: "months" },
  { name: "Age (years)", value: "years" },
];

const quantityOptions = [
  { name: "select measurement", value: "" },
  { name: "drops (drps)", value: "drops" },
  { name: "Pieces (pcs)", value: "pieces" },
  { name: "Milliliters (ml)", value: "milliliters" },
  { name: "Liters (L)", value: "liters" },
  { name: "Centiliters (cl)", value: "centiliters" },
  { name: "Deciliters (dl)", value: "deciliters" },
  // Add more units as needed
];


useEffect(()=>{
  getImmunization();
}, [])

  return (
    <div className="">
      {" "}
      <div className="m-t-40">Immunization</div>
      <div className="w-100 flex p-20">
      
      <div className="w-40">
        <div><TagInputs onChange = {handleChange} name ="vaccine" label="Select Vaccine" /></div>
        <div><TagInputs onChange = {handleChange} name ="vaccineBrand" label="Vaccine Brand" /></div>
        <div><TagInputs onChange = {handleChange} name ="batchId" label="Batch #ID" /></div>
        <div className="flex">
          <div className="w-100">
            <TagInputs onChange = {handleChange} variation={true} name ="quantity" label="Quantity" />
          </div>
          {/* <div className="w-40 m-l-20">
            <TagInputs onChange = {handleChange}  options = {quantityOptions} type="select" />
          </div> */}
        </div>
        <div className="flex">
          <div className="w-100">
            <TagInputs onChange = {handleChange} variation={true} name ="age" label="Select Age" />
          </div>
          {/* <div className="w-40 m-l-20">
            <TagInputs onChange = {handleChange}  options = {ageOptions} name ="relationship" type="select" />
          </div> */}
        </div>
        <div className="flex">
          <div className="w-100">
            <TagInputs onChange = {handleChange} variation={true} name ="weight" label="Select Weight" />
          </div>
          {/* <div className="w-40 m-l-20">
            <TagInputs onChange = {handleChange}  options = {weightOptions} name ="relationship" type="select" />
          </div> */}
        </div><div className="flex">
          <div className="w-100">
            <TagInputs onChange = {handleChange} variation={true} name ="temperature" label="Temperature" />
          </div>
          {/* <div className="w-40 m-l-20">
            <TagInputs onChange = {handleChange}  options = {temperatureOptions} name ="relationship" type="select" />
          </div> */}
        </div>

        <div><TagInputs onChange = {handleChange} name ="dateGiven" label="Date Given" type="date" /></div>
        <div><TextArea
          label="Notes"
          name="notes"
          type="text"
          placeholder="Write your notes here..."
        //value={}
        onChange={
          handleChange
        }
        /></div>
        <div className="w-100 flex flex-h-end">
          <div className="m-t-20">
            <UploadButton
              setDocNames={setDocNames}
              setdocumentArray={setdocumentArray}
              sendImagg={receiveImage} />
          </div>

          {documentArray.map((item, index) => (
            <div key={index} className="m-t-10 flex" >
              <a href={item.path} target="_blank" className="m-r-10">
                {item.name}
              </a>
              <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
            </div>
          ))}
        </div>
        <div className="w-100 "> 
        <button onClick={submitPayload} className="submit-btn w-100 m-t-20"> Add Record</button>
        <button onClick={next} className="save-drafts w-100 m-t-20"> Continue</button>
         </div>

      </div>
      <div className="w-60 m-l-20">
      <ImmunizationTable data={immunizationData} />
      </div>
      </div>
    </div>
  );
}

export default Immunization;
