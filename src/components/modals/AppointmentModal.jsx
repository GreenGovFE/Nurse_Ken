import React, { useCallback, useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import TagInputs from "../layouts/TagInputs";
import { get, post } from "../../utility/fetch";
import { usePatient } from "../../contexts";
import notification from "../../utility/notification";
import axios from "axios";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

const MemoizedTagInputs = React.memo(TagInputs);

function AppointmentModal({
  closeModal,
  appointmentId,
  type,
  fetchData,
  currentPage,
  data,
}) {
  const [nurses, setNurses] = useState([]);
  const [nurse, setNurse] = useState({});
  const [doctor, setDoctor] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const [minTime, setMinTime] = useState(undefined);
  const [services, setServices] = useState([]);
  const [service, setService] = useState({});
  const { patientId, patientName } = usePatient();

  // Populate form fields from data prop if present
  useEffect(() => {
    if (data) {
    setPayload({
      appointDate: data.appointDate
        ? (() => {
            // Handles "YYYY-MM-DD" and "M/D/YYYY" or "MM/DD/YYYY"
            if (/^\d{4}-\d{2}-\d{2}$/.test(data.appointDate)) {
              return data.appointDate;
            }
            const parts = data.appointDate.split("/");
            if (parts.length === 3) {
              // Convert M/D/YYYY or MM/DD/YYYY to YYYY-MM-DD
              return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
            }
            return "";
          })()
        : "",
      appointTime: data.appointTime || "",
      description: data.description || "",
      doctorEmployeeId: data.doctorId || "",
      nurseEmployeeId: data.nurseId || "",
    });
      if (data.doctor && data.doctorId) {
        setDoctor({ label: data.doctor, value: data.doctorId });
      }
      if (data.nurse && data.nurseId) {
        setNurse({ label: data.nurse, value: data.nurseId });
      }
    }
  }, [data]);

  useEffect(() => {
    console.log("Appointment Modal Data", data);
    const today = new Date().toISOString().split("T")[0];
    const newMinTime =
      payload?.appointDate === today
        ? new Date().toTimeString().split(" ")[0].slice(0, 5)
        : undefined;
    if (newMinTime !== minTime) {
      setMinTime(newMinTime);
    }
  }, [payload?.appointDate, minTime]);

  useEffect(() => {
    getNurses();
    getDoctors();
    getServices();
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event?.target;
      const today = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);

      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));

      if (name === "appointDate" && value === today) {
        setMinTime(currentTime);
      } else if (name === "appointDate") {
        setMinTime(undefined);
      }

      if (
        name === "appointTime" &&
        payload?.appointDate === today &&
        value < currentTime
      ) {
        notification({
          message: `Time cannot be in the past for today's ${type}`,
          type: "error",
        });
        setPayload((prevPayload) => ({
          ...prevPayload,
          appointTime: "",
        }));
      }
    },
    [payload?.appointDate]
  );

  const handleSelectChange = useCallback((value, name) => {
    if (name === "nurse") {
      setNurse(value);
      setPayload((prevPayload) => ({
        ...prevPayload,
        nurseEmployeeId: value?.value,
      }));
    } else if (name === "doctor") {
      setDoctor(value);
      setPayload((prevPayload) => ({
        ...prevPayload,
        doctorEmployeeId: value?.value,
      }));
    } else {
      setService(value);
      setPayload((prevPayload) => ({
        ...prevPayload,
        serviceId: value?.value,
      }));
    }
  }, []);

  const getNurses = async () => {
    try {
      const res = await get(
        `/patients/Allnurse/${sessionStorage.getItem(
          "clinicId"
        )}?pageIndex=1&pageSize=300`
      );
      const tempNurses = res?.data
        ?.filter((nurse) => nurse?.username)
        .map((nurse) => ({
          label: nurse?.username,
          value: parseFloat(nurse?.employeeId),
        }));
      tempNurses?.unshift({ label: "Select Nurse", value: "" });
      setNurses(tempNurses);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  const getDoctors = async () => {
    try {
      const res = await get(
        `/patients/AllDoctor/${sessionStorage?.getItem(
          "clinicId"
        )}?pageIndex=1&pageSize=300`
      );
      const tempDoc = res?.data
        ?.filter((doc) => doc?.username)
        .map((doc) => ({
          label: doc?.username,
          value: parseFloat(doc?.employeeId),
        }));
      tempDoc?.unshift({ label: "Select Doctor", value: "" });
      setDoctors(tempDoc);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const getServices = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/costsetup/list/1/1000`,
        options
      );

      const tempServices = res?.data?.resultList
        // ?.filter((service) => service.category.name === "Clinical Service" || service.category.name === "Clinical Services")
        .map((service) => ({
          label: service?.serviceName,
          value: parseFloat(service?.serviceId),
        }));

      tempServices?.unshift({ label: "Select Service", value: "" });

      setServices(tempServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fieldLabels = {
    appointDate: "Appointment Date",
    appointTime: "Appointment Time",
    doctorEmployeeId: "Doctor to meet",
    description: "Additional Details",
    nurseEmployeeId: " Assign Nurse",
  };

  const addAppointmemt = async () => {
    if (!validatePayload()) return;

    const admitted = type === "admission";
    const formattedValue = payload?.appointDate.replace(/-/g, "/");
    const url = appointmentId
      ? `/Appointment/update-appointment`
      : `/Appointment/create-appointment`;

    setLoading(true);
    try {
      const res = await post(url, {
        ...payload,
        patientId: +patientId,
        appointDate: formattedValue,
        isAdmitted: admitted,
        ...(appointmentId ? { id: appointmentId } : {}),
        careType: 0,
      });

      if (
        [
          "successfully created appointment",
          "successfully updated appointment",
          "successfully addmitted patient",
        ].includes(res?.message)
      ) {
        await fetchData(currentPage);
        notification({
          message:
            res?.message === "successfully addmitted patient"
              ? "successfully admitted patient"
              : res?.message,
          type: "success",
        });
        setPayload({
          appointDate: "",
          appointTime: "",
          description: "",
          doctorEmployeeId: 0,
          nurseEmployeeId: 0,
        });
        setDoctor({});
        setNurse({});
        setService({});
        closeModal();
      } else {
        handleErrorResponse(res);
      }
    } catch (error) {
      notification({
        message: `Failed to ${appointmentId ? "update" : "create"} ${type}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleErrorResponse = (res) => {
    let errorMessage = `Failed to ${
      appointmentId ? "update" : "create"
    } ${type}`;
    if (res.StatusCode === 401) {
      notification({ message: "Unauthorized Session", type: "error" });
    } else if (res.StatusCode === 500) {
      notification({ message: "Internal Server Error", type: "error" });
    } else {
      const errors = res.errors || {};
      const missingFields = Object.keys(errors).filter((field) =>
        errors[field].some((msg) => /is required/i.test(msg))
      );
      if (missingFields.length > 0) {
        const formattedFields = missingFields.map(
          (field) =>
            fieldLabels[field] || field.replace(/([a-z])([A-Z])/g, "$1 $2")
        );
        errorMessage = `The following fields are required: ${formattedFields.join(
          ", "
        )}`;
      }
      notification({ message: errorMessage, type: "error" });
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
      const errorMessage = `The following fields are required: ${missingFields.join(
        ", "
      )}`;
      notification({ message: errorMessage, type: "error" });
    }

    return Object.keys(validationErrors).length === 0;
  };

  const handleTranscript = (transcript) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      description: prevPayload.description
        ? prevPayload.description + " " + transcript
        : transcript,
    }));
  };

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-content">
        <div className="flex">
          <div className="flex space-between flex-v-center m-t-20 m-l-20 col-4">
            <h4>
              {type === "admission"
                ? "Admit Patient"
                : appointmentId
                ? `Reschedule Appointment For ${patientName}`
                : "Patient's Appointment"}
            </h4>
          </div>
        </div>
        <div className="p-20">
          <div className="flex space-between flex-v-center">
            <div className="m-r-10">
              <MemoizedTagInputs
                label={
                  type === "admission" ? "Admission Date" : "Appointment Date"
                }
                value={payload?.appointDate}
                dateRestriction={type === "admission" ? "past" : "future"}
                onChange={handleChange}
                type="date"
                name="appointDate"
              />
            </div>

            <div>
              <MemoizedTagInputs
                label={
                  type === "admission" ? "Admission Time" : "Appointment Time"
                }
                value={payload?.appointTime}
                onChange={handleChange}
                type="time"
                name="appointTime"
                min={minTime}
              />
            </div>
          </div>
          <div className="w-100">
            <MemoizedTagInputs
              label="Select Service"
              name="serviceId"
              value={service}
              onChange={(e) => handleSelectChange(e, "serviceId")}
              type="R-select"
              options={services}
            />
          </div>
          <div className="w-100">
            <MemoizedTagInputs
              label="Doctor to meet"
              name="doctorEmployeeId"
              value={doctor}
              onChange={(e) => handleSelectChange(e, "doctor")}
              type="R-select"
              options={doctors}
            />
          </div>
          <div className="w-100">
            <MemoizedTagInputs
              label="Assign Nurse"
              name="nurseEmployeeId"
              value={nurse}
              onChange={(e) => handleSelectChange(e, "nurse")}
              type="R-select"
              options={nurses}
            />
          </div>
          <div>
            <GhostTextCompletion
              label="Additional Details"
              name="description"
              value={payload?.description}
              handleChange={handleChange}
            />
          </div>
          <button
            className="submit-btn m-t-20 w-100"
            onClick={addAppointmemt}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
