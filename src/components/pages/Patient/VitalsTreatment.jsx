import React, { useCallback, useEffect, useState } from "react";
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
import GhostTextCompletion from "../../UI/TextPrediction";
import VitalsChart from "./VitalChart"; // Import the VitalsChart component
import axios from "axios";

function VitalsTreat({ treatment }) {
  const { patientId, nurseTypes, setNurseTypes } = usePatient();

  const [documentArray, setDocumentArray] = useState([]);

  const [payload, setPayload] = useState({
    dateOfVisit: "",
    temperature: "",
    bloodPressure: "",
    heartPulse: "",
    respiratory: "",
    height: 0,
    weight: 0,
    bmi: 0, // Added BMI to the payload
    careType: 0,
    vitalNurseEmployeeId: Number(sessionStorage.getItem('userId')),
    appointmentId: null,
    treatmentId: 0,
    serviceTreatmentId: treatment?.id || 0,
    doctorId: treatment?.doctorId,
    notes: "",
    vitalDocuments: [],
    bloodSugar: '',
    oxygenSaturation: '',

  });
  console.log(treatment)

  const [nurses, setNurses] = useState([]);
  const [docNames, setDocNames] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [Appointments, setAppointments] = useState([]);
  const [viewing, setViewing] = useState(false);
  const [selectedMfiles, setSelectedMfiles] = useState([]);
  const [add, setAdd] = useState(false)
  const [appointmentPassed, setAppointmentPassed] = useState(false);
  const [isServicePaid, setIsServicePaid] = useState(true);
  const [vitalServicesFromAppointmentId, setVtalServicesFromAppointmentId] =
    useState();
  const [showChart, setShowChart] = useState(false); // State to toggle chart visibility
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: "Select Category", value: "" });
  const [service, setService] = useState({ name: "Select Service", value: "" });
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const submitServicePayload = async () => {
    try {
      let res = await post("/patients/CreateVitalServicePayment", {
        clinicId: +sessionStorage.getItem("clinicId"),
        categoryId: category.value,
        patientId: +patientId,
        categoryItemId: service.value,
        amount: 0,
        status: "Pending",
        appointmentId: Number(treatment?.appointmentId),
      });
      console.log(res);
      if (res.message === "The Vital service record was added successfully") {
        notification({ message: 'The service was added successfully', type: "success" });
        setCategory({ name: "Select Category", value: "" });
        setService({ name: "Select Service", value: "" });
        setSelectedCategory(null);
      }
      // notification({ message: "Unauthorized Session", type: "error" });
    } catch (error) {
      console.log(error);
      notification({ message: "Failed to add service to treatment", type: "error" });
    }
  };

  const getVitalsByAppointmentId = async (id) => {
    try {
      let res = await get(
        `/patients/vital-service-by-appointmentId?appointmentId=${id}`
      );
      setIsServicePaid(
        res.data.find(
          (e) => e.status === "Not Paid" || e.status === "Advance Paid"
        )
      );

      setVtalServicesFromAppointmentId(res.data);
      // setVtalServicesFromAppointmentId()
      // setTotalPages(res.pageCount);
    } catch (error) {
      console.error("Error fetching visitation details:", error);
    }
  };

  const handleSelectChange = useCallback((value, name) => {
    if (name === "category") {
      setCategory(value);
    } else {
      setService(value);
      setPayload((prevPayload) => ({
        ...prevPayload,
        serviceId: value?.value,
      }));
    }
  }, []);

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
    vitalNurseEmployeeId: "Assigned Nurse",
    appointmentId: 'Appointment',
    notes: "Notes",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const parsedValue = ["height", "weight", "temperature", "heartPulse"].includes(name)
      ? parseFloat(value)
      : value;

    setPayload((prevPayload) => {
      const updatedPayload = { ...prevPayload, [name]: parsedValue };

      if (name === "height" || name === "weight") {
        const heightInMeters = updatedPayload.height / 100;
        const weight = updatedPayload.weight;

        if (heightInMeters > 0 && weight > 0) {
          // multiply by 100, round to nearest integer, then divide back
          const rawBmi = weight / (heightInMeters ** 2);
          updatedPayload.bmi = Math.round(rawBmi * 100) / 100;
        } else {
          updatedPayload.bmi = 0;
        }
      }

      return updatedPayload;
    });

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
      let res = await get(`/patients/GetVitalsByServiceTreatmentId?treatmentId=${treatment?.id}&pageIndex=${currentPage}&pageSize=10`);
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

    setLoading(true);

    try {
      let res = await post("/patients/AddTreatmentVitalsRecord", {
        ...payload,
        dateOfVisit: dateTimeOfVisit,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        patientId: parseFloat(patientId),
        appointmentId: Number(treatment?.appointmentId),
        doctorId: Number(treatment?.doctorId),
        careType: 2,
        treatmentId: 0,
        serviceTreatmentId: treatment?.id || 0,
        vitalNurseEmployeeId: Number(sessionStorage.getItem('userId')),
        vitalDocuments: vitalDocs,
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
        setNurseTypes('vital');
        return
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
        console.log(res)
        notification({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      console.error("Error adding vital record:", error);
      // notification({ message: "Failed to add Vital record", type: "error" });
    } finally {
      setLoading(false);
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

  const getCategories = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Token not found in session storage");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/category/list/1/1000`,
        options
      );

      const tempServices = res?.data?.resultList
        // ?.filter((service) => service.category.name === "Clinical Service" || service.category.name === "Clinical Services")
        .map((category) => ({
          label: category?.name,
          value: parseFloat(category?.id),
        }));

      tempServices?.unshift({ label: "Select Service", value: "" });

      setCategories(tempServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getCategoriesService = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Token not found in session storage");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setService({});
      setServices(null);
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/categoryitem/list/category/${category?.value}/1/1000`,
        options
      );

      const tempServices = res?.data?.resultList.map((service) => ({
        label: service?.itemName,
        value: parseFloat(service?.id),
      }));

      tempServices?.unshift({ label: "Select Service", value: "" });

      setServices(tempServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const toggleChart = () => {
    setShowChart((prev) => !prev); // Toggle chart visibility
  };

  useEffect(() => {
    getCategories()
    getNurses();
    getDoctors();
    fetchData();
    getVitalsByAppointmentId(treatment?.appointmentId);
    getVitalsDetails(currentPage);
  }, []);

  useEffect(() => {
    getVitalsDetails(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getCategoriesService();
  }, [category]);


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
              <TagInputs
                onChange={handleChange}
                value={payload?.height}
                variation={true}
                name="height"
                label="Height (cm)"
              />
            </div>
          </div>
          <div className="w-100">
            <TagInputs
              onChange={handleChange}
              value={payload?.weight}
              variation={true}
              name="weight"
              label="Weight (kg)"
            />
          </div>
          <div className="w-100">
            <TagInputs
              value={payload?.bmi || ""}
              name="bmi"
              label="BMI"
              readOnly={true} // Make the BMI field read-only
            />
          </div>
          {/* <div>
            <TagInputs onChange={handleChange} value={payload?.careType} type="select" options={careTypes} name="careType" label="Care Type" />
          </div> */}

          {/* <div>
            <TagInputs onChange={handleChange} value={payload?.doctorId} name="doctorId" label="Assign Doctor" options={doctors} type="select" />
          </div> */}
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
            <GhostTextCompletion
              label="Notes"
              type="text"
              placeholder="Write your notes here..."
              handleChange={handleChange}
              value={payload?.notes}
              name="notes"
            />
          </div>
          <button onClick={submitPayload} disabled={loading} className="submit-btn m-t-20 ">Add Vital</button>
        </div>

        <div className="col-8 m-l-20">
          <div>
            <div className="p-20">
              <div className="w-100">
                <TagInputs
                  label="Select Category"
                  name="category"
                  value={category}
                  onChange={(e) => handleSelectChange(e, "category")}
                  type="R-select"
                  options={categories}
                />
              </div>
            </div>
            {Array.isArray(services) && (
              <div className="p-20">
                <div className="w-100">
                  <TagInputs
                    label="Select Service"
                    name="serviceId"
                    value={service}
                    onChange={(e) => handleSelectChange(e, "serviceId")}
                    type="R-select"
                    options={services}
                  />
                </div>
              </div>
            )}

            <button
              onClick={submitServicePayload}
              className="submit-btn m-t-20 m-b-20"
              disabled={loading || !category?.value || !service?.value}
            >
              Add Service
            </button>
          </div>
          <div>
            <VisitsTable data={visits} />

          </div>
          {/* Collapsible Section for Vitals Chart */}
          <div style={{ marginTop: "30px" }}>
            <button onClick={toggleChart} className="submit-btn">
              {showChart ? "Hide Vitals Chart" : "Show Vitals Chart"}
            </button>
            {showChart && (
              <div className="card m-t-10">
                <VitalsChart visitsData={visits} />
              </div>
            )}
          </div>

          <UnpaidServices
            isServicePaid={isServicePaid}
            payload={payload}
            unpaidServices={vitalServicesFromAppointmentId}
          />
          <div className="m-t-20">
            <Paginate
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VitalsTreat;

const UnpaidServices = ({ payload, unpaidServices, isServicePaid }) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="w-100">
      {showTable
        ? // Show alert stripe if appointmentId exists
        payload?.appointmentId && (
          <div className="alert-container">
            <p>You have one or more unpaid services.</p>
            <button
              className="view-button"
              onClick={() => setShowTable(true)}
            >
              View
            </button>
          </div>
        )
        : // Show table after clicking "View"
        isServicePaid && (
          <div className="table-container">
            <h3 className="m-t-20">Added Services</h3>
            <table className="bordered-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unpaidServices?.map((service, index) => (
                  <tr key={index}>
                    <td>{service.categoryName}</td>
                    <td>{service.categoryItem}</td>
                    <td>{service.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <button
              className="view-button"
              onClick={() => setShowTable(false)}
            >
              ← Back
            </button> */}
          </div>
        )}
    </div>
  );
};