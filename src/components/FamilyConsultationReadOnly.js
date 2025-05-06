import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import toast from "react-hot-toast";

import { get, post } from "../../../utility/fetch";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import IVFConsultation from "./IVFConsultation";
import BirthRecordForm from "./BirthRecordForm";
import Treatments from "./Treatments";
import AddTreatment from "../../modals/AddTreatment";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import GhostTextCompletion from "../../UI/TextPrediction";
import { FiArrowLeft } from "react-icons/fi";
import ReferPatient from "../../modals/ReferPatient";
import LabRequestTable from "./LabRequestTable";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";

const FamilyConsultationReadOnly = () => {
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const view = searchParams.get("view");
  // const treatmentId = searchParams.get("treatmentId");

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const { patientId } = useParams();
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [familyMedcineTreatmentDataById, setFamilyMedcineTreatmentDataById] =
    useState();
  const [treatmentData, settreatmentData] = useState([]);

  const [lastVisit, setLastVisit] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [carePlan, setCarePlan] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);

  const [newLab, setNewLab] = useState({ test: "", location: "" });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    quantity: "",
    freq: "",
    duration: "",
  });

  const [labRequests, setLabRequests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patient, setPatient] = useState();
  const [vitals, setvitals] = useState();
  const [visit, setVisit] = useState();
  const [dataFromLab, setDataFromLab] = useState();
  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState();

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleModal = () => {
    if (lastVisit === null) {
      toast("A visit has to exist before you can refer patient");
      return;
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    settreatmentData(treatmentData);
  }, [treatmentData]);

  const getTreatmentData = (data) => {
    console.log(data);
    settreatmentData(data);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await get(`/patients/${patientId}/treatmentrecord`);
      setData(response.data);
      console.log(response.data[0]);
      response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetcLabhData = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `/patients/list/familyMedicine/${treatmentId}/is-family-medicine/true/1/10/family-medicine-patients-lab-requests`
      );
      setDataFromLab(response.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchVisit = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${patientId}/`
      );
      setLastVisit(response.data[response.data.length - 1]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    console.log(treatmentData);
    let payload = {
      dateOfVisit: formData.dateOfVisit,
      // appointmentId: 0,
      appointmentId: +localStorage.getItem("appointmentId"),

      diagnosis: formData.diagnosis,
      isAdmitted: false,
      patientId: +patientId,
      DoctorId: +docInfo.employeeId,
      medications: treatmentData.medications,
      otherMedications: treatmentData.otherMedications,
      followUpAppointment: {
        id: 0,
        appointDate: formData.appointDate,
        appointTime: formData.appointTime,
        description: formData.description,
        doctorEmployeeId: formData.appointDate ? docInfo.employeeId : 0,

        nurseEmployeeId: 0,
        isAdmitted: false,
        patientId: formData.appointDate ? patientId : 0,
        serviceId: 0,
        isEmergency: false,
        careType: 0,
      },
      carePlan: carePlan,
    };
    // Submit form logic here
    try {
      const response = await post(
        `/FamilyMedicineTreatment/family-medicine/${treatmentId}`,
        payload
      );
      if (response.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);

        // navigate(`/FamilyMedicineTreatment/family-medicine/${treatmentId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }
    // onClose();
  };

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (patientId) {
      fetchRecord();
      fetchTreatmentVitalsRecord();
      fetchVisit();
      fetcLabhData();
      // getPatientDetails();
    }

    if (view) {
      fetchTreatmentRecord();
    }
  }, [patientId]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await get(`/FamilyMedicine/${treatmentId}`);
      if (response?.isSuccess) {
        setRecords(response.data || {});
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatmentVitalsRecord = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${+localStorage.getItem(
          "appointmentId"
        )}&pageIndex=1&pageSize=10`
      );
      if (true) {
        setvitals(response.data);
        console.log(response.data);
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
      setLoading(false);
    }
  };

  const fetchTreatmentRecord = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/FamilyMedicineTreatment/list/family-medicine/${treatmentId}/1/10`
      );
      if (response?.isSuccess) {
        setFamilyMedcineTreatmentDataById(response.data.recordList[0] || {});
        console.log(response.data.recordList[0] || {});
        setDiagnosis(response.data.recordList[0].diagnosis || 89);
        setCarePlan(response.data.recordList[0].carePlan || 89);
        setAdditionalNotes(response.data.recordList[0].additionalNotes || 89);

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
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split("T")[0] : "-";
  };
  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      alert("");

      toast("A visit has to exist before you can add treatment");
      return;
    }
    setTreatmentModal(!treatmentModal);
  };

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

  const handleLabAdd = () => {
    setLabRequests([...labRequests, newLab]);
    setNewLab({ test: "", location: "" });
  };

  const handlePrescriptionAdd = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({ name: "", quantity: "", freq: "", duration: "" });
  };

  const createTreatmet = async (load) => {
    let payload = {
      dateOfVisit: "2025-05-01T05:09:59.302Z",
      appointmentId: +localStorage.getItem("appointmentId"),
      diagnosis: "string",
      isAdmitted: false,
      patientId: +patientId,
      medications: [
        {
          pharmacyInventoryId: 1,
          quantity: 1,
          frequency: 2,
          duration: 0,
        },
      ],
      otherMedications: [
        {
          name: "fhhkjkkkhk",
          quantity: 0,
          frequency: 0,
          duration: 0,
        },
      ],
      followUpAppointment: {
        id: 0,
        appointDate: "1920/09/1",
        appointTime: "23:09",
        description: "string",
        doctorEmployeeId: 0,
        nurseEmployeeId: 0,
        isAdmitted: true,
        patientId: 0,
        serviceId: 0,
        isEmergency: true,
        careType: 0,
      },
      carePlan: "string",
      familyMedicineId: +treatmentId,
      oG_IVFId: 0,
      oG_BirthRecordId: 0,
      orthopedicId: 0,
      generalSurgeryId: 0,
      pediatricId: 0,
      generalPracticeId: 0,
      antenatalId: 0,
      ...load,
    };

    try {
      await post(`/ServiceTreatment`, payload);
      // await fetchData();
      toast.success("Treatment added successfully");
      // closeModal();
      toggleTreatmentModal();
    } catch (error) {
      toast.error("Error adding treatment");
      console.log(error);
    }
  };

  return (
    <div style={{ paddingTop: "60px" }} className="consultation-container">
      <div class="flex-between align-center">
        <div class="flex" style={{ padding: "20px" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>
        <div>
          {!view && (
            <div class="flex-row-gap">
              <button className="rounded-btn" onClick={toggleModal}>
                + Refer Patient To Lab
              </button>
              <button className="rounded-btn" onClick={toggleTreatmentModal}>
                + Add Treatment
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="flex-row-gap-start exact-grid">
        <section className="left-panel">
          <div className="field-row">
            <label>Date Of Visit</label>
            <input
              onChange={handleChange}
              name="dateOfVisit"
              className="input-field"
              type="date"
              value={formData.dateOfVisit}
            />
          </div>

          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative overflow-auto max-h-[90vh]">
              {/* <h2 className="text-xl font-bold mb-4">Vitals Records</h2> */}
              <VitalsRecords vitals={vitals}/>

            </div>
          </div>
          {/* {view && (
            <div className="field-column">
              <label>Patient's Diagnosis</label>
              <textarea
                className="input-field"
                rows={10}
                name="diagosis"
                value={diagnosis}
                readOnly
                onChange={handleChange}
              ></textarea>
            </div>
          )} */}
          {treatmentId && dataFromLab && (
            <div className="field-column">
              <label>Patient's Lab Results</label>
              <LabRequestTable data={dataFromLab} isFamily={true} />
            </div>
          )}

          {/* {view && (
            <div className="field-column">
              <label>Patient's Care Plan</label>
              <textarea
                className="input-field"
                rows={10}
                name="diagosis"
                value={carePlan}
                onChange={handleChange}
              ></textarea>
            </div>
          )} */}

          {/* <div className="section-box">
            <div className="input-row">
              <div className="field-row">
                <label>Referral Type</label>
                <input
                  onChange={(e) =>
                    setNewLab({ ...newLab, test: e.target.value })
                  }
                  className="input-field"
                  value={newLab.test}
                />
              </div>
              <div className="field-row">
                <label>Centre</label>
                <input
                  onChange={(e) =>
                    setNewLab({ ...newLab, location: e.target.value })
                  }
                  className="input-field"
                  value={newLab.location}
                />
              </div>

              <button className="btn small green" onClick={handleLabAdd}>
                Add Lab
              </button>
            </div>

            <table className="readonly-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Lab Request</th>
                  <th>Test Location</th>
                </tr>
              </thead>
              <tbody>
                {labRequests.map((lab, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{lab.test}</td>
                    <td>{lab.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          <div className="field-column">
            <label>Additional Notes</label>
            <textarea
              className="input-field"
              rows={4}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            ></textarea>
          </div>

         {treatmentId && <MedicationTable
            data={{ treatmentType: "FamilyMedicine", treatmentId: treatmentId }}
          />}

          {/* {view && (
            <table className="readonly-table">
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration (days)</th>
                </tr>
              </thead>
              <tbody>
                {familyMedcineTreatmentDataById?.medications.map(
                  (med, index) => (
                    <tr key={med.id}>
                      <td>{index + 1}</td>
                      <td style={{ maxWidth: "180px", whiteSpace: "normal" }}>
                        {med.pharmacyInventory?.productName}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={med.quantity}
                          className="input-field"
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={med.frequency}
                          className="input-field"
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={med.duration}
                          className="input-field"
                          style={{ width: "50px" }}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )} */}

          {/* <div className="section-box">
            <div className="input-row">
              <div className="field-row">
                <label>Drug Name</label>
                <input
                  className="input-field"
                  value={newPrescription.name}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="field-row">
                <label>Drug Quatity</label>
                <input
                  type="number"
                  placeholder="Qty"
                  className="input-field"
                  value={newPrescription.quantity}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="field-row">
                <label>Drug Frequency</label>
                <input
                  type="number"
                  placeholder="Freq"
                  className="input-field"
                  value={newPrescription.freq}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      freq: e.target.value,
                    })
                  }
                />
              </div>
              <div className="field-row">
                <label>Drug Duration</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Duration"
                  value={newPrescription.duration}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input-row">
                <button
                  className="btn small green"
                  onClick={handlePrescriptionAdd}
                >
                  Add Prescription
                </button>
              </div>
            </div>
            <label>Prescription</label>
            <table className="readonly-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Freq/Day</th>
                  <th>Duration (Days)</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>{p.freq}</td>
                    <td>{p.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          {/* <div className="field-column">
            <label>Care Plan</label>
            <textarea
              className="input-field"
              rows={4}
              value={carePlan}
              onChange={(e) => setcarePlan(e.target.value)}
            ></textarea>
          </div> */}
          {/* <div className="modal-overlay"> */}
          {treatmentModal && (
            <AddTreatmentOld
              createTreatment={createTreatmet}
              repeatedDiagnosis={repeatedDiagnosis}
              setRepeatedDiagnosis={setRepeatedDiagnosis}
              closeModal={toggleTreatmentModal}
              visit={lastVisit}
              data={data}
              id={patientId}
              fetchData={fetchData}
            />
          )}
          {/* {!view && (
            <div>
              <AddTreatment
                repeatedDiagnosis={repeatedDiagnosis}
                setRepeatedDiagnosis={setRepeatedDiagnosis}
                closeModal={toggleTreatmentModal}
                visit={lastVisit}
                data={data}
                getTreatmentData={getTreatmentData}
                treatmentData={treatmentData}
                id={patientId}
                fetchData={fetchData}
              />
            </div>
          )} */}

          {showModal && (
            <ReferPatient
              repeatedDiagnosis={repeatedDiagnosis}
              setRepeatedDiagnosis={setRepeatedDiagnosis}
              closeModal={toggleModal}
              visit={lastVisit}
              vital={vitals}
              familyMedcine={treatmentId}
              id={patientId}
              // treatment={data[0] || null}
            />
          )}

         
         

          {/* <Treatments data={patient?.treatments} visit={visit || null} id={patientId} />; */}
          {false && (
            <div className="footer-button">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="btn green"
              >
                Follow-up Appointment
              </button>
            </div>
          )}
          {isOpen &&
            false(
              <div className="">
                {/* <div className="appointment-card modal-content"> */}
                <div className="appointment-card">
                  {/* <button className="close-btn" onClick={onClose}>
                  ×
                </button> */}
                  <div className="appointment-icon">
                    <div className="circle-icon">🔔</div>
                  </div>
                  <h3 className="greeting-text">
                    Hello Dr.{docInfo.firstName} {docInfo.lastName}
                  </h3>
                  <h4 className="title">
                    Schedule a followup Appointment here
                  </h4>

                  <form className="appointment-form">
                    <input
                      type="text"
                      name="visitPurpose"
                      placeholder="Purpose for Visit"
                      className="full-input"
                      required
                    />

                    <div className="input-row">
                      <input
                        type="date"
                        name="appointDate"
                        className="half-input"
                        required
                        onChange={handleChange}
                      />
                      <input
                        type="time"
                        name="appointTime"
                        className="half-input"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <textarea
                      name="description"
                      placeholder="Additional Notes (Diagnosis)"
                      className="notes-area"
                      onChange={handleChange}
                    ></textarea>

                    {/* <button type="submit" className="submit-btn">
                    Create Appointment
                  </button> */}
                  </form>
                </div>
              </div>
            )}
        </section>

        <section className="right-panel">
          <div className="field-row">
            <label>Last confinement</label>
            <div className="readonly-box">
              {formatDate(records.lastConfinement)}
            </div>
          </div>
          <div className="field-row">
            <label>Type of delivery</label>
            <div className="readonly-box">
              {deliveryTypes[records.deliveryType]}
            </div>
          </div>
          <div className="field-column">
            <label>Delivery Complications?</label>
            <div className="readonly-box">{records.details ? "Yes" : "No"}</div>
          </div>
          <div className="field-column">
            <label>Provide Details</label>
            <div className="readonly-box">{records.details}</div>
          </div>
          <div className="field-column">
            <label>Breast feeding?</label>
            <div className="readonly-box">
              {records.breastFeeding ? "Yes" : "No"}
            </div>
          </div>
          <div className="field-column">
            <label>Menstrual resumed?</label>
            <div className="readonly-box">
              {records.menstrualResumed ? "Yes" : "No"}
            </div>
          </div>
          <div className="group-box">
            <label>Investigation</label>
            <div className="group-options">
              <span className="checked">
                {investigations[records.investigation]}
              </span>
            </div>
          </div>
          <div className="group-box">
            <label>Family Plan Methods</label>
            <div className="group-options">
              <span className="checked">{plans[records.familyPlanMethod]}</span>
            </div>
          </div>
          <div className="field-column">
            <label>Consent</label>
            <div className="readonly-box">{records.consent ? "Yes" : "No"}</div>
          </div>
          <div className="field-row">
            <label>Date commence</label>
            <div className="readonly-box">
              {formatDate(records.dateCommence)}
            </div>
          </div>
          <div className="field-row">
            <label>Next visit</label>
            <div className="readonly-box">—</div>
          </div>
          <div className="field-column">
            <label>Instructions</label>
            <div className="readonly-box">{records.instructions}</div>
          </div>
          <div className="field-column">
            <label>Remarks</label>
            <div className="readonly-box">{records.remarks}</div>
          </div>
          <div className="field-column">
            <label>Attach documents</label>
            <div className="readonly-box">
              {records.familyMedicineDocuments?.map((doc, i) => (
                <a key={i} href={doc.docPath || "#"} className="doc-link">
                  {doc.docName}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      {!view && (
        <div className="action-row">
          {/* <button type="button" className="btn grey">
            Preview Record
          </button> */}
          <button onClick={handleSubmit} className="btn green w-50 m-t-20">
            Submit Record
          </button>
        </div>
      )}

      {/* <IVFConsultation /> */}
    </div>
  );
};

export default FamilyConsultationReadOnly;
