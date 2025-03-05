import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import VisitsTable from "../../tables/VisitsTable";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";
import AppointmentModal from "../../modals/AppointmentModal";
import Paginate from "../../UI/paginate";
import { checkIfAppointmentPassed } from "../../../utility/general";
import UploadButton from "../../../Input/UploadButton";
import { RiDeleteBinLine } from "react-icons/ri";
import EDMSFiles from "../../UI/EDMSFiles";
import { useNavigate } from "react-router-dom";
import SpeechToTextButton from "../../UI/SpeechToTextButton";

function Vitals({ setSelectedTab }) {
  const { patientId, } = usePatient();
  
  const [documentArray, setDocumentArray] = useState([]);
  const [payload, setPayload] = useState({
    dateOfVisit: "",
    temperature: "",
    bloodPressure: "",
    heartPulse: "",
    respiratory: "",
    height: 0,
    weight: 0,
    careType: 0,
    VitalNurseEmployeeId: Number(sessionStorage.getItem('userId')),
    appointmentId: null,
    notes: "",
    vitalDocuments: [],
    bloodSugar: '',
    oxygenSaturation: '',

  });
  const [nurses, setNurses] = useState([]);
    const [docNames, setDocNames] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [Appointments, setAppointments] = useState([]);
  const [viewing, setViewing] = useState(false);
  const [selectedMfiles, setSelectedMfiles] = useState([]);
  const [add, setAdd] = useState(false)
  const [appointmentPassed, setAppointmentPassed] = useState(false);
  const navigate = useNavigate();
  


  const deleteDoc = (doc) => {
    let newArr = documentArray.filter((id) => id.name !== doc);
    setDocumentArray(newArr);
  };

  const handleEdit = (recordId) => {
    setViewing(parseInt(recordId));
    setAdd(true);
  }

  const closeModal = () => {
    setAdd(false)
  };

  const fieldLabels = {
    dateOfVisit: "Visit Date",
    temperature: "Temperature",
    bloodPressure: "Blood Pressure",
    heartPulse: "Heart Pulse",
    respiratory: "Respiratory",
    VitalNurseEmployeeId: "Assigned Nurse",
    appointmentId: 'Appointment',
    notes: "Notes",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "dateOfVisit") {
      const selectedDate = new Date(value);
      const currentDate = new Date();


      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate > currentDate) {
        notification({ message: 'Date selected cannot be a future date', type: "error" });

        // Reset the date input to an empty string
        event.target.value = "";
        setPayload(prevPayload => ({ ...prevPayload, [name]: "" }));
        return;
      }
    }
    const parsedValue = ["age", "temperature", "heartPulse", "height", "VitalNurseEmployeeId", "careType", "weight",].includes(name)
      ? parseFloat(value)
      : value;
    setPayload(prevPayload => ({ ...prevPayload, [name]: parsedValue }));
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempNurses = res?.data
        ?.filter((nurse) => nurse?.username)
        .map((nurse) => {
          return { name: nurse?.username, value: parseFloat(nurse?.employeeId) };
        });

      tempNurses?.unshift({ name: "Select Nurse", value: "" });
      setNurses(tempNurses);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };


  const getDoctors = async () => {
    try {
      let res = await get(`/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempDoc = res?.data
        ?.filter((doc) => doc?.username)
        .map((doc) => {
          return { name: doc?.username, value: parseFloat(doc?.employeeId) };
        });

      tempDoc?.unshift({ name: "Select Doctor", value: "" });
      setDoctors(tempDoc);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };


  const getVitalsDetails = async (currentPage) => {
    try {
      let res = await get(`/patients/vital-by-patientId?patientId=${patientId}&pageIndex=${currentPage}&pageSize=10`);
      setVisits(res.data);
      setTotalPages(res.pageCount)

    } catch (error) {
      console.error("Error fetching visitation details:", error);
    }
  };

  const validatePayload = () => {
    let validationErrors = {};
    let missingFields = [];

    Object.keys(fieldLabels).forEach((field) => {
      if (field === 'appointmentId') {
        return;
      }

      if (!payload[field]) {
        validationErrors[field] = `${fieldLabels[field]} is required`;
        missingFields.push(fieldLabels[field]);
      }
    });

    if (missingFields.length > 0) {
      const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
      notification({ message: errorMessage, type: "error" });
    }

    return Object.keys(validationErrors).length === 0;
  };


  const careTypes = [
    { name: "Select Care Type", value: "" },
    { name: "In patient", value: 1 },
    { name: "Out patient", value: 2 },
  ];

  const submitPayload = async () => {
    if (!validatePayload()) {
      return;
    }

    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    const dateTimeOfVisit = `${payload.dateOfVisit} ${timeString}`;

    const vitalDocs = [
      ...(documentArray?.map((doc) => ({
        docName: doc?.name,
        docPath: doc?.path,
      })) || []),
      {
        docName: selectedMfiles?.fileName,
        docPath: selectedMfiles?.filePath,
      }
    ];
    


    try {
      let res = await post("/patients/AddVitalsRecord", {
        ...payload,
        dateOfVisit: dateTimeOfVisit,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        PatientId: parseFloat(patientId),
        appointmentId: Number(payload?.appointmentId),
        doctorId: Number(payload?.doctorId),
        careType: 2,
        VitalNurseEmployeeId: Number(sessionStorage.getItem('userId')),
        vitalDocuments:vitalDocs,
      });

      if (res.message === "The Vital record was added successfully") {
        notification({ message: res.message, type: "success" });
        setPayload({
          dateOfVisit: "",
          temperature: "",
          bloodPressure: "",
          heartPulse: "",
          respiratory: "",
          height: "",
          weight: "",
          careType: 0,
          VitalNurseEmployeeId: 0,
          appointmentId: null,
          notes: "",
          docName: "",
          docPath: "",
          bloodSugar: '',
          oxygenSaturation: '',
          vitalDocuments: [],
        })
        setSelectedMfiles([]);
        setDocumentArray([]);
        getVitalsDetails(currentPage);
        navigate('/patients')
      } else if (res.StatusCode === 401) {
        notification({ message: "Unauthorized Session", type: "error" });
      } else if (res.StatusCode === 500) {
        notification({ message: "Internal Server Error", type: "error" });
      } else {
        let errorMessage = "Failed to add Vitals ";

        if (res && res.errors) {
          const errors = res.errors;
          const customFieldNames = {
            VitalNurseEmployeeId: "Assigned Nurse",
            // appointmentId: 'Appointment',
          };

          const missingFields = Object.keys(errors).filter((field) => {
            return errors[field].some((errorMsg) => /is required/i.test(errorMsg));
          });
          if (missingFields.length > 0) {
            const formattedFields = missingFields.map((field) => {
              if (customFieldNames[field]) {
                return customFieldNames[field];
              }
              return field.replace(/([a-z])([A-Z])/g, "$1 $2");
            });

            errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
          }
        }

        notification({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      console.log(error)
      notification({ message: "Failed to add Vital record", type: "error" });
    }
  };

  const fetchData = async () => {
    try {
      const response = await get(`/appointment/get-appointment-bypatientId/${patientId}?pageIndex=${1}&pageSize=1000`);

      let tempDoc = response?.data
        ?.filter(item => item?.tracking === 'AwaitingVitals')
        ?.map((item, idx) => {
          const appointTime = item?.appointTime === '00:00' ? '(Visit)' : `at ${item?.appointTime}`;
          const doctorText = item?.doctorId ? `with ${item?.doctor}` : '';

          return {
            name: `${item?.appointDate} ${appointTime} ${doctorText}`.trim(),
            value: parseFloat(item?.id)
          };
        });


      tempDoc?.unshift({ name: "Select Appointment", value: "" });
      setAppointments(tempDoc);
      setPayload(prevPayload => ({ ...prevPayload, appointmentId: '' }))
      setAppointmentPassed(false);

    } catch (e) {
    }
  };

  const next = () => {
    setSelectedTab("treatment");
  };

  useEffect(() => {
    getNurses();
    getDoctors();
    fetchData();
    getVitalsDetails(currentPage);
  }, []);

  useEffect(() => {
    getVitalsDetails(currentPage);
  }, [currentPage]);

  const handleTranscript = (transcript) => {
    setPayload(prevPayload => ({ ...prevPayload, notes: prevPayload.notes ? prevPayload.notes + ' ' + transcript : transcript }));
  };

  return (
    <div className="">
      <div className="w-100 flex wrap">
        <div className="col-3-3">
          <div>
            <TagInputs onChange={handleChange} dateRestriction={'current'} name="dateOfVisit" value={payload?.dateOfVisit} label="Date" type="date" />
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.temperature} variation={true} name="temperature" label="Temperature" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.bloodPressure} name="bloodPressure" label="Blood Pressure" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.heartPulse} variation={true} name="heartPulse" label="Heart Pulse" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.respiratory} name="respiratory" label="Respiratory" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.bloodSugar} name="bloodSugar" label="Blood Sugar" />
            </div>
          </div>

          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.oxygenSaturation} name="oxygenSaturation" label="Oxygen Saturation" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.height} variation={true} name="height" label="Height" />
            </div>
          </div>
          <div className="w-100">
            <TagInputs onChange={handleChange} value={payload?.weight} variation={true} name="weight" label="Weight" />
          </div>
          {/* <div>
            <TagInputs onChange={handleChange} value={payload?.careType} type="select" options={careTypes} name="careType" label="Care Type" />
          </div> */}
          <div>
            <TagInputs onChange={handleChange} value={payload?.appointmentId} options={Appointments} name="appointmentId" label="Select Appointment/Visit" type="select" />
            {/* {appointmentPassed && (
              <div className="m-t-10">
                <p style={{ color: 'red', marginBottom: '10px' }}>This appointment has passed. Please reschedule.</p>
                <button className="col-6 submit-btn" onClick={() => handleEdit(payload?.appointmentId)}>
                  Reschedule Appointment
                </button>
              </div>
            )} */}
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.doctorId} name="doctorId" label="Assign Doctor" options={doctors} type="select" />
          </div>
          {/* <div>
            <TagInputs onChange={handleChange} value={payload?.VitalNurseEmployeeId} name="VitalNurseEmployeeId" label="Assign Nurse" options={nurses} type="select" />
          </div> */}
          <div className="w-100 flex flex-h-end flex-direction-v">
            <div className="m-t-20 m-b-20">
              <UploadButton setDocNames={setDocNames} setdocumentArray={setDocumentArray} />
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
          <div>
              <EDMSFiles
                selectedFile={selectedMfiles}
                setSelectedFile={setSelectedMfiles}
              />
          </div>
          <div>
            <TextArea
              label="Notes"
              type="text"
              placeholder="Write your notes here..."
              onChange={handleChange}
              value={payload?.notes}
              name="notes"
            />
            <SpeechToTextButton onTranscript={handleTranscript} />
          </div>
          <button onClick={submitPayload} className="submit-btn m-t-20 ">Add Vital</button>
        </div>
        <div className="col-8 m-l-20">
          <VisitsTable data={visits} />
          <div className="m-t-20"><Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} /></div>
        </div>
      </div>
    </div>
  );
}

export default Vitals;
