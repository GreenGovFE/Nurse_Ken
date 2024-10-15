import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import VisitsTable from "../../tables/VisitsTable";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";
import AppointmentModal from "../../modals/AppointmentModal";
import Paginate from "../../UI/paginate";

function Vitals({ setSelectedTab }) {
  const { patientId, nurseTypes } = usePatient();

  const [payload, setPayload] = useState({
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
  });
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [Appointments, setAppointments] = useState([]);
  const [viewing, setViewing] = useState(false);
  const [add, setAdd] = useState(false)
  const [appointmentPassed, setAppointmentPassed] = useState(false);




  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEdit = (recordId) => {
    setViewing(parseInt(recordId));
    setAdd(true);
  }

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;
  };

  const closeModal = () => {
    setAdd(false)
  };

  const checkIfAppointmentPassed = (appointmentId) => {
    const selectedAppointment = Appointments.find(
      (item) => item.value === parseFloat(appointmentId)
    );

    if (!selectedAppointment || !selectedAppointment.name) return;

    const appointmentDateString = selectedAppointment.name.split(" at ")[0];
    const appointmentTimeString = selectedAppointment.name.split(" at ")[1].split(" with ")[0];

    // Combine date and time into a single string
    const appointmentDateTimeString = `${appointmentDateString} ${appointmentTimeString}`;

    // Parse the combined string into a Date object
    const appointmentDateTime = new Date(appointmentDateTimeString);

    // Add 30 minutes to the appointment time
    const updatedAppointmentTime = new Date(appointmentDateTime.getTime() + 30 * 60000);

    // Get the current time
    const currentDateTime = new Date();

    // Check if the current time is past the updated appointment time (+30 mins)
    if (currentDateTime > updatedAppointmentTime) {
      return true; // Appointment has passed, including the 30-minute buffer
    }

    return false; // Appointment is still valid
  };






  const fieldLabels = {
    dateOfVisit: "Visit Date",
    temperature: "Temperature",
    bloodPressure: "Blood Pressure",
    heartPulse: "Heart Pulse",
    respiratory: "Respiratory",
    height: "Height",
    weight: "Weight",
    careType: "Care Type",
    VitalNurseEmployeeId: "Assigned Nurse",
    appointmentId: 'Appointment',
    notes: "Notes",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === "dateOfVisit") {
      console.log(value)
      const selectedDate = new Date(value);
      const currentDate = new Date();


      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      console.log(selectedDate, currentDate)

      if (selectedDate > currentDate) {
        console.log("Invalid input");
        notification({ message: 'Date selected cannot be a future date', type: "error" });

        // Reset the date input to an empty string
        event.target.value = "";
        setPayload(prevPayload => ({ ...prevPayload, [name]: "" }));
        return;
      }
    } else if (name === "appointmentId") {
      console.log(`Appointment`, value);
      const isPassed = checkIfAppointmentPassed(value);
      if (!isPassed) {
        setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value) }));
        setAppointmentPassed(false);
      } else {
        setAppointmentPassed(true);
      }
    }

    const parsedValue = ["age", "temperature", "heartPulse", "height", "VitalNurseEmployeeId", "careType", "weight",].includes(name)
      ? parseInt(value)
      : value;
    setPayload(prevPayload => ({ ...prevPayload, [name]: parsedValue }));


    console.log(payload);
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      console.log(res);
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
      console.log(res);
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
      console.log(res);
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


    try {
      let res = await post("/patients/AddVitalsRecord", {
        ...payload,
        dateOfVisit: dateTimeOfVisit,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        PatientId: parseFloat(patientId),
        appointmentId: Number(payload.appointmentId)
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
        })
        getVitalsDetails(currentPage);
      } else if (res.StatusCode === 401) {
        notification({ message: "Unauthorized Session", type: "error" });
      } else if (res.StatusCode === 500) {
        notification({ message: "Internal Server Error", type: "error" });
      } else {
        let errorMessage = "Failed to add Vitals ";

        if (res && res.errors) {
          const errors = res.errors;
          console.log(errors);

          const customFieldNames = {
            VitalNurseEmployeeId: "Assigned Nurse",
            // appointmentId: 'Appointment',
          };

          const missingFields = Object.keys(errors).filter((field) => {
            return errors[field].some((errorMsg) => /is required/i.test(errorMsg));
          });

          console.log(missingFields);

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
      notification({ message: "Failed to add Vital record", type: "error" });
    }
  };

  const fetchData = async () => {
    try {
      const response = await get(`/appointment/get-appointment-bypatientId/${patientId}?pageIndex=${1}&pageSize=1000`);

      let tempDoc = response?.data
        ?.filter(item => item?.tracking === 'AwaitingVitals')
        ?.map((item, idx) => {
          return {
            name: `${item?.appointDate} at ${item?.appointTime} with ${item?.doctor}`,
            value: parseFloat(item?.id)
          };
        });

      tempDoc?.unshift({ name: "Select Appointment", value: "" });
      setAppointments(tempDoc);
      setPayload(prevPayload => ({ ...prevPayload, appointmentId: '' }))
      setAppointmentPassed(false);

    } catch (e) {
      console.log(e);
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
              <TagInputs onChange={handleChange} value={payload?.height} variation={true} name="height" label="Height" />
            </div>
          </div>
          <div className="w-100">
            <TagInputs onChange={handleChange} value={payload?.weight} variation={true} name="weight" label="Weight" />
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.careType} type="select" options={careTypes} name="careType" label="Care Type" />
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.appointmentId} options={Appointments} name="appointmentId" label="Select Appointment" type="select" />
            {appointmentPassed && (
              <div className="m-t-10">
                <p style={{ color: 'red', marginBottom: '10px' }}>This appointment has passed. Please reschedule.</p>
                <button className="col-6 submit-btn" onClick={() => handleEdit(payload?.appointmentId)}>
                  Reschedule Appointment
                </button>
              </div>
            )}
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.VitalNurseEmployeeId} name="VitalNurseEmployeeId" label="Assign Nurse" options={nurses} type="select" />
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
          </div>
          <div className="w-100">
            <button onClick={submitPayload} className="submit-btn w-100 m-t-20">
              Add Vitals
            </button>
            <>
              {nurseTypes === 'admin' &&
                <button onClick={next} className="save-drafts w-100 m-t-20">
                  Continue
                </button>
              }
            </>
          </div>
        </div>
        <div className="col-8 m-l-20">
          <VisitsTable data={visits} />
          <div className="m-t-20"><Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/></div>
        </div>
      </div>
      {
        add && (
          <AppointmentModal
            closeModal={closeModal}
            appointmentId={viewing}
            type={'appointment'}
            fetchData={fetchData}
            currentPage={currentPage}
          />
        )
      }
    </div>
  );
}

export default Vitals;
