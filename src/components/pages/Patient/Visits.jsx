import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import VisitsTable from "../../tables/VisitsTable";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";

function Visits({ setSelectedTab }) {
  const { patientId } = usePatient();

  const [payload, setPayload] = useState({});
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);




  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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


  const fieldLabels = {
    dateOfVisit: "Visit Date",
    temperature: "Temperature",
    bloodPressure: "Blood Pressure",
    heartPulse: "Heart Pulse",
    respiratory: "Respiratory",
    height: "Height",
    weight: "Weight",
    careType: "Care Type",
    doctorEmployeeId: "Assigned Doctor",
    nurseEmployeeId: "Assigned Nurse",
    notes: "Notes",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "dateOfVisit") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate >= currentDate) {
        console.log("Invalid input");
        notification({ message: 'Date selected cannot be a future date', type: "error" });

        // Reset the date input to an empty string
        event.target.value = "";
        setPayload(prevPayload => ({ ...prevPayload, [name]: "" }));
        return;
      }
    }

    const parsedValue = ["age", "temperature", "heartPulse", "height", "nurseEmployeeId", "doctorEmployeeId", "careType", "weight"].includes(name)
      ? parseInt(value)
      : value;

    setPayload(prevPayload => ({ ...prevPayload, [name]: parsedValue }));

    console.log(payload);
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      console.log(res);
      let tempNurses = res?.data?.map((nurse) => {
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
      let tempDoc = res?.data?.map((doc) => {
        return { name: doc?.username, value: parseFloat(doc?.employeeId) };
      });

      tempDoc?.unshift({ name: "Select Doctor", value: "" });
      setDoctors(tempDoc);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const getVisitationDetails = async () => {
    try {
      let res = await get(`/patients/GetAllVisitationRecordByPatientId?patientId=${patientId}&pageIndex=${currentPage}&pageSize=10`);
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

    try {
      let res = await post("/patients/AddVisitationRecords", {
        ...payload,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        PatientId: parseFloat(patientId),
      });

      if (typeof res === "number") {
        notification({ message: res?.messages, type: "success" });
        getVisitationDetails();
      } else if (res.StatusCode === 401) {
        notification({ message: "Unauthorized Session", type: "error" });
      } else if (res.StatusCode === 500) {
        notification({ message: "Internal Server Error", type: "error" });
      } else {
        let errorMessage = "An error occurred";

        if (res && res.errors) {
          const errors = res.errors;
          console.log(errors);

          const customFieldNames = {
            doctorEmployeeId: "Assigned Doctor",
            nurseEmployeeId: "Assigned Nurse",
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
      notification({ message: error?.detail, type: "error" });
    }
  };

  const next = () => {
    setSelectedTab("treatment");
  };

  useEffect(() => {
    getNurses();
    getDoctors();
    getVisitationDetails();
  }, []);

  return (
    <div className="">
      <div className="w-100 flex">
        <div className="col-3-3">
          <div>
            <TagInputs onChange={handleChange} name="dateOfVisit" value={payload?.dateOfVisit} label="Visit Date" type="date" />
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="temperature" label="Temperature" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="bloodPressure" label="Blood Pressure" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="heartPulse" label="Heart Pulse" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="respiratory" label="Respiratory" />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} name="height" label="Height" />
            </div>
          </div>
          <div className="w-100">
            <TagInputs onChange={handleChange} name="weight" label="Weight" />
          </div>
          <div>
            <TagInputs onChange={handleChange} type="select" options={careTypes} name="careType" label="Care Type" />
          </div>
          <div>
            <TagInputs onChange={handleChange} options={doctors} name="doctorEmployeeId" label="Assign Doctor" type="select" />
          </div>
          <div>
            <TagInputs onChange={handleChange} name="nurseEmployeeId" label="Assign Nurse" options={nurses} type="select" />
          </div>
          <div>
            <TextArea
              label="Notes"
              type="text"
              placeholder="Write your notes here..."
              onChange={handleChange}
              name="notes"
            />
          </div>
          <div className="w-100">
            <button onClick={submitPayload} className="submit-btn w-100 m-t-20">
              Add Vitals
            </button>
            <button onClick={next} className="save-drafts w-100 m-t-20">
              Continue
            </button>
          </div>
        </div>
        <div className="col-8 m-l-20 m-r-20">
          <VisitsTable data={visits} />
          <div>
            <div className="pagination flex space-between float-right col-4 m-t-20">
              <div className="flex gap-8">
                <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
              </div>
              <div className="flex gap-8">
                <button
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"Previous"}
                </button>

                {generatePageNumbers().map((page, index) => (
                  <button
                    key={`page-${index}`}
                    className={`pagination-btn ${currentPage === page ? 'bg-green text-white' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {"Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visits;
