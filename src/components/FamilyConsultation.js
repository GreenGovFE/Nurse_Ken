import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../utility/fetch";
import { FiArrowLeft } from "react-icons/fi";

const FamilyConsultation = () => {
  const [formData, setFormData] = useState({});
  const [vitals, setvitals] = useState([]);

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    fetchTreatmentVitalsRecord();
  }, []);

  const deliveryTypes = {
    1: "Normal",
    2: "C-Section",
    3: "Assisted",
  };

  const investigations = {
    1: "FBC",
    2: "PT",
    3: "LFT",
    4: "EUC",
    5: "RBS",
  };

  const plans = {
    1: "IUCD",
    2: "Pills",
    3: "Injectable-two months",
    4: "Injectable-three months",
    5: "Implant",
  };

  const { patientId } = useParams();

  const fetchTreatmentVitalsRecord = async () => {
    //  setLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${+localStorage.getItem(
          "appointmentId"
        )}&pageIndex=1&pageSize=10`
      );
      if (true) {
        setvitals(response.data);
        // console.log(response.data.recordList[0] || {});
        // setDiagnosis(response.data.recordList[0].diagnosis || 89);
        // setCarePlan(response.data.recordList[0].carePlan || 89);
        // setAdditionalNotes(response.data.recordList[0].additionalNotes || 89);

        // setFormData({
        //   ...response.data.recordList[0],
        // });
        // console.log({
        //   ...response.data.recordList[0],
        // });
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      //  setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patientId: parseInt(patientId),
      lastConfinement: formData.lastConfinement || null,
      deliveryType: 1,
      deliveryComplications: formData.deliveryComplications === "Yes",
      details: formData.details || "",
      breastFeeding: formData.breastFeeding === "Yes",
      menstrualResumed: formData.menstrualResumption === "Yes",
      investigation: 1,
      familyPlanMethod: 1,
      dateCommence: formData.dateCommence || null,
      // nextVisit: formData.nextVisit || null,
      appointmentId: +localStorage.getItem("appointmentId"),
      instructions: formData.instructions || "",
      remarks: formData.remark || "",
      doctorId: docInfo.employeeId,
      consent: formData.consent === "Yes",
      familyMedicineDocuments: [
        {
          docName: "string",
          docPath: "string",
        },
      ],
    };

    console.log("Mapped Payload:", payload);
    try {
      const response = await post("/FamilyMedicine", payload);
      if (response.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div style={{ padding: "60px 0px" }} className="consultation-container">

      <div class="flex" style={{ padding: "20px" }}>
        <FiArrowLeft/>
        <p onClick={() => navigate(-1)}> Back</p>
      </div>
      <main className="consultation-main">
        <form className="consultation-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div class="flex-row-gap">
              <div className="field-row">
                <label htmlFor="lastConfinement">Last confinement</label>
                <input
                  id="lastConfinement"
                  name="lastConfinement"
                  onChange={handleChange}
                  type="date"
                  className="input-field"
                />
              </div>
             
            </div>

             
            <div className="group-box">
              <label>Type Od Delivery</label>
              <div className="group-options">
                {["Normal", "C-section", "Assisted"].map((opt, index) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="investigation"
                      value={index + 1}
                      onChange={handleChange}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="field-row">
              <label htmlFor="deliveryType">Type of delivery</label>
              <input
                id="deliveryType"
                name="deliveryType"
                onChange={handleChange}
                type="text"
                className="input-field"
              />
            </div>
          </div>

          <div className="radio-row">
            <span>Delivery Complications?</span>
            <label>
              <input
                type="radio"
                name="deliveryComplications"
                value="Yes"
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="deliveryComplications"
                value="No"
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>

          <div className="field-column">
            <label htmlFor="details">Provide Details</label>
            <textarea
              id="details"
              name="details"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
          </div>

          <div className="radio-row">
            <span>Breast feeding?</span>
            <label>
              <input
                type="radio"
                name="breastFeeding"
                value="Yes"
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="breastFeeding"
                value="No"
                onChange={handleChange}
              />{" "}
              No
            </label>
            <span>Menstrual resumption?</span>
            <label>
              <input
                type="radio"
                name="menstrualResumption"
                value="Yes"
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="menstrualResumption"
                value="No"
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>

          <div className="input-row">
            <div className="group-box">
              <label>Investigation</label>
              <div className="group-options">
                {["FBC", "PT", "LFT", "EUC", "RBS"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="investigation"
                      value={opt}
                      onChange={handleChange}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="group-box">
              <label>Family Plan Methods</label>
              <div className="group-options">
                {[
                  "IUCD",
                  "Pills",
                  "Injectable-two months",
                  "Injectable-three months",
                  "Implant",
                ].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="planMethod"
                      value={opt}
                      onChange={handleChange}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="radio-row">
            <span>Consent</span>
            <label>
              <input
                type="radio"
                name="consent"
                value="Yes"
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="consent"
                value="No"
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>

          <div className="input-row">
            <div className="field-row">
              <label htmlFor="dateCommence">Date commence</label>
              <input
                id="dateCommence"
                name="dateCommence"
                onChange={handleChange}
                type="date"
                className="input-field"
              />
            </div>
            <div className="field-row">
                <label htmlFor="lastConfinement">Date Expired</label>
                <input
                  id="dateExpired"
                  name="dateExpired"
                  onChange={handleChange}
                  type="date"
                  className="input-field"
                />
              </div>
            {/* <div className="field-row">
              <label htmlFor="nextVisit">Next visit</label>
              <input
                id="nextVisit"
                name="nextVisit"
                onChange={handleChange}
                type="text"
                className="input-field"
              />
            </div> */}
          </div>

          <div className="field-column">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
          </div>

          <div className="field-column">
            <label htmlFor="remark">Remark</label>
            <textarea
              id="remark"
              name="remark"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
          </div>

          {/* <div className="upload-box">Attach documents</div> */}

          <div className="action-row">
            {/* <button type="button" className="btn grey">
              Preview Record
            </button> */}
            <button type="submit" className="btn green">
              Submit Record
            </button>
          </div>
        </form>

        <aside className="sidebar">
          <div className="bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative overflow-auto max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4">Vitals Records</h2>
              {vitals?.map((v, i) => (
                <div key={i} className="vitals-card">
                  <div className="vitals-row">
                    <strong>Date of Visit:</strong> {v.dateOfVisit}
                  </div>
                  <div className="vitals-row">
                    <strong>Nurse:</strong> {v.vitalNurseName}
                  </div>
                  <div className="vitals-row">
                    <strong>Patient:</strong> {v.patientName}
                  </div>
                  <div className="vitals-row">
                    <strong>Temperature:</strong> {v.temperature} °C
                  </div>
                  <div className="vitals-row">
                    <strong>Blood Pressure:</strong> {v.bloodPressure}
                  </div>
                  <div className="vitals-row">
                    <strong>Heart Pulse:</strong> {v.heartPulse}
                  </div>
                  <div className="vitals-row">
                    <strong>Respiratory:</strong> {v.respiratory}
                  </div>
                  <div className="vitals-row">
                    <strong>Blood Sugar:</strong> {v.bloodSugar}
                  </div>
                  <div className="vitals-row">
                    <strong>Oxygen Saturation:</strong> {v.oxygenSaturation}
                  </div>
                  <div className="vitals-row">
                    <strong>Height:</strong> {v.height} cm
                  </div>
                  <div className="vitals-row">
                    <strong>Weight:</strong> {v.weight} kg
                  </div>
                  <div className="vitals-row">
                    <strong>BMI:</strong> {v.bmi}
                  </div>
                  <div className="vitals-row">
                    <strong>Notes:</strong> {v.notes?.join(", ") || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <button className="btn-action green">View Patient's Vital</button>
          <button className="btn-action grey">Add Prescription</button>
          <button className="btn-action grey">Request Lab Work</button>
          <button className="btn-action disabled" disabled>
            Admit Patient
          </button>
          <button className="btn-action disabled" disabled>
            Schedule Appointment
          </button>
          <div className="diagnosis-box">Diagnosis Prediction 1</div>
          <div className="diagnosis-box">Diagnosis Prediction 1</div> */}
        </aside>
      </main>
    </div>
  );
};

export default FamilyConsultation;
