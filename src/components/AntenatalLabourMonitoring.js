import React, { useState } from "react";
import "./AntenatalLabourMonitoring.css"; // If you prefer external CSS, otherwise use <style>
import { get, post } from "../utility/fetch";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import AntenatalLabourMonitoringVitalsTable from "./AntenatalLabourMonitoringVitalsTable";
import toast from "react-hot-toast";

const AntenatalLabourMonitoring = () => {
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();

  const treatmentId = searchParams.get("treatmentId");
  const [labourMonitoringData, setLabourMonitoringData] = useState(null);
  const [change, setchange] = useState(null);

  const [formData, setFormData] = useState({
    patientId: 0,
    antenatalId: 0,
    hospNo: 0,
    parity: {
      gravida: "",
      para: "",
      alive: "",
    },
    lmp: "",
    edd: "",
    gaWeeks: 0,
    show: false,
    liqour: false,
    appointmentId: 0,
    doctorId: 0,
    nurseId: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("parity.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        parity: {
          ...prev.parity,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  useEffect(() => {
    getDelivery();
  }, []);

  const getDelivery = async () => {
    const response = await get(
      `/AntenatalLabourMonitoring/antenatal/${treatmentId}`
    );
    console.log(response);

    if (response.isSuccess) {
      setFormData(response?.data);
      setLabourMonitoringData(response?.data);
    }
  };

  const handleSubmit = async (e) => {
    try {
      // e.preventDefault(); // if needed for form submission context

      let payload = {
        ...formData,
        antenatalId: +treatmentId,
        gaWeeks: +formData.gaWeeks,
        patientId: +patientId,
        appointmentId: +localStorage.getItem("appointmentId"),
        doctorId: docInfo?.employeeId,
      };

      console.log(payload);
      console.log("Form Submitted:", formData);
      toast.error("Form Submitted:");

      const response = await post(`/AntenatalLabourMonitoring`, { ...payload });
      console.log(response);

      getDelivery();
    } catch (error) {
      console.error("Error submitting form:", error);
      getDelivery();
    }
  };

  return (
    <div className="w-100 section-box">
      <div className="container">
        <h1>Antenatal Labour Monitoring</h1>
        <div>
          {/* <div className="row">
              <input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                placeholder="Patient ID"
              />
              <input
                type="number"
                name="antenatalId"
                value={formData.antenatalId}
                onChange={handleChange}
                placeholder="Antenatal ID"
              />
              <input
                type="number"
                name="hospNo"
                value={formData.hospNo}
                onChange={handleChange}
                placeholder="Hospital Number"
              />
            </div> */}
          <fieldset>
            <legend>Parity</legend>
            <div className="row">
              <div>
                <p>Gravida</p>
                <input
                  type="text"
                  name="parity.gravida"
                  value={formData?.parity?.gravida}
                  onChange={handleChange}
                  placeholder="Gravida"
                />
              </div>
              <div>
                <p>Para</p>
                <input
                  type="text"
                  name="parity.para"
                  value={formData?.parity?.para}
                  onChange={handleChange}
                  placeholder="Para"
                />
              </div>
              <div>
                <p>Alive</p>
                <input
                  type="text"
                  name="parity.alive"
                  value={formData?.parity?.alive}
                  onChange={handleChange}
                  placeholder="Alive"
                />
              </div>
            </div>
          </fieldset>
          <div className="row">
            <div className="flex-col-gap w-30">
              <label>LMP</label>
              <input
                type="date"
                name="lmp"
                value={formData?.lmp}
                onChange={handleChange}
                placeholder="LMP"
              />
            </div>
            <div className="flex-col-gap w-30">
              <label>EDD</label>
              <input
                type="date"
                name="edd"
                value={formData?.edd}
                onChange={handleChange}
                placeholder="EDD"
              />
            </div>
            <div className="flex-col-gap w-30">
              <label>GA</label>
              <input
                type="number"
                name="gaWeeks"
                value={formData?.gaWeeks}
                onChange={handleChange}
                placeholder="GA Weeks"
              />
            </div>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="show"
                checked={formData?.show}
                onChange={handleChange}
              />
              Show
            </label>
            <label>
              <input
                type="checkbox"
                name="liqour"
                checked={formData?.liqour}
                onChange={handleChange}
              />
              Liqour
            </label>
          </div>
          {/* <div className="row">
              <input
                type="number"
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleChange}
                placeholder="Appointment ID"
              />
              <input
                type="number"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="Doctor ID"
              />
              <input
                type="number"
                name="nurseId"
                value={formData.nurseId}
                onChange={handleChange}
                placeholder="Nurse ID"
              />
            </div> */}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {labourMonitoringData && (
        <div className="container">
          <AntenatalLabourMonitoringVitalsTable
            patientId={labourMonitoringData?.patient?.id}
            appointmentId={labourMonitoringData?.appointmentId}
            laboutMonitoringId={labourMonitoringData?.id}
            labourVitals={labourMonitoringData?.labourVitals}
            setchange={setchange}
          />
        </div>
      )}
    </div>
  );
};

export default AntenatalLabourMonitoring;
