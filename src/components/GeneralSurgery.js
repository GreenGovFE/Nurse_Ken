import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import ReferPatient from "../../modals/ReferPatient";
import LabRequestTable from "./LabRequestTable";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";

// import IVFConsultation from "./IVFConsultation";

const GeneralSurgery = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const [formData, setFormData] = useState({});
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);

  const { patientId } = useParams();
  const [records, setRecords] = useState({});
  const [surgeonList, setsurgeonList] = useState([]);
  const [anasList, setanasList] = useState([]);
  const [displaydoc, setDisplayDocuments] = useState({});
  const [displaydocPelvic, setDisplayDocumentsPelvic] = useState({});
  const [
    displaydocPelvicInvestigation,
    setDisplayDocumentsPelvicInvestigation,
  ] = useState({});
  const [displaydocAfm, setDisplayDocumentsAfm] = useState({});

  const [loading, setLoading] = useState(true);
  const [surgicalOpList, setsurgicalOpList] = useState([]);
  const [anasOPList, setanasOPList] = useState([]);
  const [carePlan, setcarePlan] = useState("");

  const [vitals, setvitals] = useState();
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);

  const [newLab, setNewLab] = useState({ test: "", location: "" });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    quantity: "",
    freq: "",
    duration: "",
  });

  const [labRequests, setLabRequests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientId: +patientId || 0, // include if applicable
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
      operationPerformedId: +formData.operationPerformedId || 0,
      indication: formData.indication || "",
      surgeonId: +formData.surgeonId || 0,
      asstSurgeonId: +formData.asstSurgeonId || 0,
      anesthetistId: +formData.anesthetistId || 0,
      asstAnesthetistId: +formData.asstAnesthetistId || 0,
      anesthesiaId: +formData.anesthesiaId || 0,
      incisions: formData.incisions || "",
      findings: formData.findings || "",
      procedures: formData.procedures || "",
      anesthesiaStartTime: formData.anesthesiaStartTime || "",
      anesthesiaEndTime: formData.anesthesiaEndTime || "",
      tran: formData.tran || "",
      catheter: formData.catheter || "",
      specimen: formData.specimen || "",
      intra_OperationTreatment: formData.intra_OperationTreatment || "",
      post_OperationTreatmentOrder: formData.post_OperationTreatmentOrder || "",
      specialInstructions: formData.specialInstructions || "",
      surgeonSignature: formData.surgeonSignature || "",
      appointmentId: +localStorage.getItem("appointmentId"),
    };

    console.log("Payload:", payload);
    // ...then call your API

    try {
      const response = await post("/GeneralSurgery", payload);
      if (response.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }

    console.log(payload); // check your payload structure
    // alert("Appointment created!");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocuments(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const getRecord = async () => {
    try {
      const response = await get(`/GeneralSurgery/${treatmentId}`);
      if (response.isSuccess) {
        console.log(response.data);
        setFormData({
          patientId: response.data?.patient?.id || 0,
          startTime: response.data?.startTime?.hasValue
            ? `${String(response.data.startTime.value.hours).padStart(
                2,
                "0"
              )}:${String(response.data.startTime.value.minutes).padStart(
                2,
                "0"
              )}`
            : "",
          endTime: response.data?.endTime?.hasValue
            ? `${String(response.data.endTime.value.hours).padStart(
                2,
                "0"
              )}:${String(response.data.endTime.value.minutes).padStart(
                2,
                "0"
              )}`
            : "",
          operationPerformedId: response.data?.operationPerformed?.id || 0,
          indication: response.data?.indication || "",
          surgeonId: response.data?.surgeon?.id || 0,
          asstSurgeonId: response.data?.asstSurgeon?.id || 0,
          anesthetistId: response.data?.anesthetist?.id || 0,
          asstAnesthetistId: response.data?.asstAnesthetist?.id || 0,
          anesthesiaId: response.data?.anesthesia?.id || 0,
          incisions: response.data?.incisions || "",
          findings: response.data?.findings || "",
          procedures: response.data?.procedures || "",
          anesthesiaStartTime: response.data?.anesthesiaStartTime?.hasValue
            ? `${String(response.data.anesthesiaStartTime.value.hours).padStart(
                2,
                "0"
              )}:${String(
                response.data.anesthesiaStartTime.value.minutes
              ).padStart(2, "0")}`
            : "",
          anesthesiaEndTime: response.data?.anesthesiaEndTime?.hasValue
            ? `${String(response.data.anesthesiaEndTime.value.hours).padStart(
                2,
                "0"
              )}:${String(
                response.data.anesthesiaEndTime.value.minutes
              ).padStart(2, "0")}`
            : "",
          tran: response.data?.tran || "",
          catheter: response.data?.catheter || "",
          specimen: response.data?.specimen || "",
          intra_OperationTreatment:
            response.data?.intra_OperationTreatment || "",
          post_OperationTreatmentOrder:
            response.data?.post_OperationTreatmentOrder || "",
          specialInstructions: response.data?.specialInstructions || "",
          surgeonSignature: response.data?.surgeonSignature || "",
          appointmentId: response.data?.appointmentId || 0,
        });

        // const mappedData = mapResponseToFormData(response.data);
        // setFormData(mappedData);
        // setBirthRecords(
        //   response.data.recordList?.find((e) => e.patient.id == patientId)
        // );
        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
    // https://edogoverp.com/medicals/api/OG_BirthRecord/list/1/10
  };
  const handleFileUploadPelvicInvestigation = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsPelvicInvestigation(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleFileUploadPelvic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsPelvic(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleFileUploadAfm = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsAfm(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const getDocs = async (array) => {
    console.log(array);
    let res = await gets({
      // endpoint: `patientlabreport/patient-report/${patientId?.id}/labtechnician/${userAuth?.resultList?.userId}`,
      endpoint: `document/view-document/${array[0]?.docName}`,

      // body: formData,
      // auth: false,
    });
    console.log(res);
    setDisplayDocuments(res?.data);
    //
  };

  //   /const handleFileChange = async (e) => {
  //     const formData = new FormData();

  //     const file = e.target.files[0];
  //     setSelectedFile(file);
  //     console.log(file);

  //     // Callback to parent component with the selected file

  //     formData.append("IFormFile", file);

  //     setisLoading(true);

  //     const res = await post({
  //       endpoint: "document",
  //       body: formData,
  //       auth: false,
  //     });

  //     if (res && res.status == 200) {
  //       setisLoading(false);
  //       // if (onFileChange) {
  //         onFileChange(res.data, file.name);
  //         console.log(res.data, file.name);
  //       // }

  //       console.log(res)
  //     }

  //     // https://edogoverp.com/services/api/documents/admin-stores
  //   };

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (patientId) fetchSurgeonRecord();
    if (treatmentId) {
      fetchVisit();
      fetcLabhData(treatmentId);
    }
    fetchTreatmentVitalsRecord();

    fetchAnasRecord();
    fetchSurgicalOpList();
    fetchAnasList();
    getRecord();

    console.log(formData);
  }, [patientId]);

  const fetchSurgeonRecord = async () => {
    setLoading(true);
    // https://edogoverp.com/medicals/api/Employee/surgeon-list
    try {
      const response = await get(`/Employee/surgeon-list`);
      if (response?.isSuccess) {
        setsurgeonList(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurgicalOpList = async () => {
    setLoading(true);
    // https://edogoverp.com/medicals/api/Employee/surgeon-list
    try {
      const response = await get(`/GeneralSurgery/list/surgical-operation`);
      if (response?.isSuccess) {
        setsurgicalOpList(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnasList = async () => {
    setLoading(true);
    // https://edogoverp.com/medicals/api/Employee/surgeon-list
    try {
      const response = await get(`/GeneralSurgery/list/anesthesia`);
      if (response?.isSuccess) {
        setanasOPList(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnasRecord = async () => {
    setLoading(true);
    // https://edogoverp.com/medicals/api/Employee/surgeon-list
    try {
      const response = await get(`/Employee/list/anesthetist`);
      if (response?.isSuccess) {
        setanasList(response.data || []);
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

  const fetchVisit = async () => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${patientId}/`
      );
      setLastVisit(response.data[response.data.length - 1]);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
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

  const fetcLabhData = async (treatmentId) => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/patients/list/generalsurgery/${treatmentId}/is-family-medicine/false/1/10/general-surgery-patients-lab-requests`
      );
      setDataFromLab(response.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      alert("");

      toast("A visit has to exist before you can add treatment");
      return;
    }
    setTreatmentModal(!treatmentModal);
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
      familyMedicineId: 0,
      oG_IVFId: 0,
      oG_BirthRecordId: 0,
      orthopedicId: 0,
      generalSurgeryId: +treatmentId || 0,
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
    <div style={{ padding: "90px" }} className="w-100">
      <div class="flex-between align-center">
        <div class="flex" style={{ padding: "20px" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>
        {treatmentId && (
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
      <div className="field-row">
        <label>Surgery Performed</label>
        <select
          className="input-field"
          onChange={handleChange}
          name="operationPerformedId"
          value={formData.operationPerformedId || ""}
        >
          <option value="">-- Select a user --</option>
          {surgicalOpList?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {/* <input
                  onChange={handleChange}
                  name="operationPerformedId"
                  className="input-field"
                  type="number"
                /> */}
      </div>
      <div>
        <div class="flex-row-gap-start m-t-20">
          <main className="">
            <section className="">
              <div className="section-box flex-col-gap">
                <div className="input-row">
                  <div className="flex-row-gap">
                    <div className="field-row">
                      <label>Start time</label>
                      <input
                        onChange={handleChange}
                        name="startTime"
                        className="input-field"
                        type="time"
                        value={formData.startTime || ""}
                      />
                    </div>
                    <div className="field-row">
                      <label>End Time</label>
                      <input
                        onChange={handleChange}
                        name="endTime"
                        className="input-field"
                        type="time"
                        value={formData.endTime || ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="field-column">
                  <label>Indication</label>
                  <textarea
                    name="indication"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData.indication}
                  />
                </div>
                <div className="field-row flex-row-gap">
                  <div className="field-row">
                    <label>Surgeon</label>
                    <select
                      className="input-field"
                      onChange={handleChange}
                      value={formData.surgeonId || ""}
                      name="surgeonId"
                    >
                      <option value="">-- Select a user --</option>
                      {surgeonList?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.middleName} {user.lastName}
                        </option>
                      ))}
                    </select>
                    {/* <input
              onChange={handleChange}
              className="input-field"
              type="number"
            /> */}
                  </div>
                  <div className="field-row">
                    <label>Asst. Surgeon</label>
                    <select
                      className="input-field"
                      onChange={handleChange}
                      value={formData.asstSurgeonId || ""}
                      name="asstSurgeonId"
                    >
                      <option value="">-- Select a user --</option>
                      {surgeonList?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.middleName} {user.lastName}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      onChange={handleChange}
                      name="asstSurgeonId"
                      className="input-field"
                      type="number"
                    /> */}
                  </div>
                </div>
                <div className="field-row flex-row-gap">
                  <div className="field-row">
                    <label>Anesthetist</label>
                    <select
                      className="input-field"
                      onChange={handleChange}
                      value={formData.anesthetistId || ""}
                      name="anesthetistId"
                    >
                      <option value="">-- Select a user --</option>
                      {anasList?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.middleName} {user.lastName}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      onChange={handleChange}
                      name="anesthetistId"
                      className="input-field"
                      type="number"
                    /> */}
                  </div>
                  <div className="field-row">
                    <label>Asst. Anesthetist</label>
                    <select
                      className="input-field"
                      onChange={handleChange}
                      value={formData.asstAnesthetistId || ""}
                      name="asstAnesthetistId"
                    >
                      <option value="">-- Select a user --</option>
                      {anasList?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.middleName} {user.lastName}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      onChange={handleChange}
                      name="asstAnesthetistId"
                      className="input-field"
                      type="number"
                    /> */}
                  </div>
                </div>
                <div className="field-row">
                  <label>Anesthesia</label>
                  <select
                    className="input-field"
                    value={formData.anesthesiaId || ""}
                    onChange={handleChange}
                    name="anesthesiaId"
                  >
                    <option value="">-- Select a user --</option>
                    {anasOPList?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-column">
                  <label>Incisions</label>
                  <textarea
                    value={formData.incisions || ""}
                    name="incisions"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="field-column">
                  <label>Findings</label>
                  <textarea
                    value={formData.findings || ""}
                    name="findings"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="field-column">
                  <label>Procedures</label>
                  <textarea
                    value={formData.procedures || ""}
                    name="procedures"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="field-row flex-row-gap">
                  <div className="field-row">
                    <label>Anesthesia start time</label>
                    <input
                      onChange={handleChange}
                      value={formData.anesthesiaStartTime || ""}
                      name="anesthesiaStartTime"
                      className="input-field"
                      type="time"
                    />
                  </div>
                  <div className="field-row">
                    <label>Anesthesia end time</label>
                    <input
                      onChange={handleChange}
                      value={formData.anesthesiaEndTime || ""}
                      name="anesthesiaEndTime"
                      className="input-field"
                      type="time"
                    />
                  </div>
                </div>
                <div className="flex-row-gap">
                  <div className="field-column">
                    <label>Drain</label>
                    <textarea
                      name="tran"
                      value={formData.tran || ""}
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                    />
                  </div>
                  <div className="field-column">
                    <label>Catheter</label>
                    <textarea
                      name="catheter"
                      value={formData.catheter || ""}
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                    />
                  </div>
                  <div className="field-column">
                    <label>Specimen</label>
                    <textarea
                      value={formData.specimen || ""}
                      name="specimen"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                    />
                  </div>
                </div>
                {treatmentId && dataFromLab && (
                  <div className="field-column">
                    <label>Patient's Lab Results</label>
                    <LabRequestTable data={dataFromLab} isFamily={false} />
                  </div>
                )}
                {treatmentId && (
                  <MedicationTable
                    data={{
                      treatmentType: "GeneralSurgery",
                      treatmentId: treatmentId,
                    }}
                  />
                )}
                <div className="field-column">
                  <label>Intra-operative treatment</label>
                  <textarea
                    name="intra_OperationTreatment"
                    onChange={handleChange}
                    value={formData.intra_OperationTreatment || ""}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="field-column">
                  <label>Post-operative treatment order</label>
                  <textarea
                    name="post_OperationTreatmentOrder"
                    onChange={handleChange}
                    value={formData.post_OperationTreatmentOrder || ""}
                    className="input-field"
                    rows={6}
                  />
                </div>
                <div className="field-column">
                  <label>Special instructions</label>
                  <textarea
                    value={formData.specialInstructions || ""}
                    name="specialInstructions"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                  />
                </div>
                {/* <div className="field-column">
                  <label>Surgeon Signature</label>
                  <textarea
                    value={formData.surgeonSignature || ""}
                    name="surgeonSignature"
                    onChange={handleChange}
                    className="input-field"
                    rows={3}
                  />
                </div> */}
                {!treatmentId && (
                  <button onClick={handleSubmit} className="submit-btn">
                    Submit
                  </button>
                )}
              </div>
            </section>
          </main>
          <VitalsRecords vitals={vitals} />
        </div>
      </div>
      {treatmentModal && (
        <AddTreatmentOld
          createTreatment={createTreatmet}
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleTreatmentModal}
          visit={lastVisit}
          // data={data}
          id={patientId}
          // fetchData={fetchData}
        />
      )}
      {showModal && (
        <ReferPatient
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleModal}
          visit={lastVisit}
          vital={vitals}
          generalSurgery={+treatmentId || 0}
          // vitalId = {vitals.id}
          id={patientId}
          // treatment={data[0] || null}
        />
      )}
    </div>
  );
};

export default GeneralSurgery;
