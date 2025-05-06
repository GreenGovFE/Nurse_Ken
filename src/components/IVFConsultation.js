import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import LabRequestTable from "./LabRequestTable";
import toast from "react-hot-toast";
import ReferPatient from "../../modals/ReferPatient";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";

// import IVFConsultation from "./IVFConsultation";

const IVFConsultation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const treatmentId = searchParams.get("treatmentId");
  const [treatmentModal, setTreatmentModal] = useState(false);

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [vitals, setvitals] = useState();

  const { patientId } = useParams();
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [records, setRecords] = useState({});
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);

  const [displaydoc, setDisplayDocuments] = useState({});
  const [displaydocPelvic, setDisplayDocumentsPelvic] = useState({});
  const [
    displaydocPelvicInvestigation,
    setDisplayDocumentsPelvicInvestigation,
  ] = useState({});
  const [displaydocAfm, setDisplayDocumentsAfm] = useState({});

  const [loading, setLoading] = useState(true);
  const [investigationList, setInvestigationList] = useState([
    { name: "HSG" },
    { name: "Pelvic Scan" },
    { name: "Breast Scan" },
    { name: "AMF" },
    { name: "Hormonal Profile" },
    { name: "FBC" },
    { name: "HVS" },
    { name: "RBS" },
    { name: "HBV/HCV" },
    { name: "VDRL" },
    { name: "RVS" },
  ]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [carePlan, setcarePlan] = useState("");

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

  const fetcLabhData = async (treatmentId) => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/patients/list/og_ivf/${treatmentId}/is-family-medicine/false/1/10/og-ivf-patients-lab-requests`
      );
      setDataFromLab(response.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientId: Number(patientId),
      yearOfMarriage: formData.yearOfMarriage,
      cohabiting: formData.cohabiting === "Yes",
      sexualIntercourse: formData.sexualIntercourse === "Yes",
      previousMarriage: formData.previousMarriage === "Yes",
      howManyKids: +formData.childrenCount,
      lastConfinement: formData.lastConfinement,
      lastLMP: formData.lastLMP,
      menstrualCycle: {
        numberOfDays: Number(formData.noOfDays),
        intervals: Number(formData.intervals),
        menstrualFlow: formData.menstrualFlow === "Regular" ? 1 : 0,
      },
      previousTreatment: {
        anyPreviousTreatment: formData.previousTreatment === "Yes",
        details: formData.previousDetails,
        partnerProfile: {
          age: +formData.age,
          otherWives: true,
          otherKids: true,
          previousSpermTest: true,
          spermTestResult: "",
        },
        inMateProfile: "" || formData.intimateProfile,
        pelvicScanDocuments: [], // handle file uploads separately
      },
      previousInvestigation: {
        anyPreviousInvestigation: formData.previousInvestigation === "Yes",
        details: formData.previousInvestigationDetails,
        hsgDocuments: [], // handle file uploads separately
        afmDocuments: [], // handle file uploads separately
      },
      physicalExam: {
        breastExam: "N/A" || formData.breastScan,
        pelvic: "N/A" || formData.pelvicScanPhysical,
        vagina: "N/A" || formData.vaginalScan,
      },
     
      investigations: [
        {
          investigationType: 1,
          investigationDocument: {
            docName: "string",
            docPath: "string",
          },
        investigationResult: "N/A" || formData.investigationResults,
        },
      ],
      diagnosis: 1,
      // primaryInfertility:
      //   formData.primaryInfertility || formData.secondaryInfertility,
      // secondaryInfertility:
      //   formData.secondaryInfertility || formData.primaryInfertility,
      oG_IVFTreatmentId: 1,
      causeOfInfertility: formData.causeOfInfertility,
      typeOfInfertility: formData.typeOfInfertility,
      oG_IVF_IVPMethodId: 1, // set based on your logic
      treatmentSchedule: formData.treatmentSchedule,
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: docInfo.employeeId,
    };

    try {
      const response = await post("/OG_IVF", payload);
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

  const handleIvestigationSelectChange = (e) => {
    const value = e.target.value;
    // setFormData({ ...formData, operationPerformedId: value });

    if (value && !selectedInvestigations.includes(value)) {
      setSelectedInvestigations([...selectedInvestigations, value]);
    }
  };

  const handleRemove = (itemToRemove) => {
    setSelectedInvestigations(
      selectedInvestigations.filter((item) => item !== itemToRemove)
    );
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

  useEffect(
    () => {
      if (view && patientId) {
        fetchRecord();
        fetchVisit();
      }
      fetchTreatmentVitalsRecord();

    },
    [patientId],
    view
  );

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await get(`/OG_IVF/${treatmentId}`);
      if (response?.isSuccess) {
        setRecords(response.data || {});
        fetcLabhData(response.data.id);

        setFormData({
          yearOfMarriage: response.data.yearOfMarriage
            ? new Date(response.data.yearOfMarriage).toISOString().split("T")[0]
            : "",
        
          cohabiting: response.data.cohabiting ? "Yes" : "No",
          sexualIntercourse: response.data.sexualIntercourse ? "Yes" : "No",
          previousMarriage: response.data.previousMarriage ? "Yes" : "No",
          childrenCount: response.data.howManyKids?.toString() || "",
        
          lastConfinement: response.data.lastConfinement
            ? new Date(response.data.lastConfinement).toISOString().split("T")[0]
            : "",
        
          lastLMP: response.data.lastLMP
            ? new Date(response.data.lastLMP).toISOString().split("T")[0]
            : "",
        
          noOfDays: response.data.menstrualCycle?.numberOfDays?.toString() || "",
          intervals: response.data.menstrualCycle?.intervals?.toString() || "",
          menstrualFlow:
            response.data.menstrualCycle?.menstrualFlow === 1 ? "Regular" : "Irregular",
        
          previousTreatment: response.data.previousTreatment?.anyPreviousTreatment
            ? "Yes"
            : "No",
          previousDetails: response.data.previousTreatment?.details || "",
          intimateProfile: response.data.previousTreatment?.inMateProfile || "",
        
          previousInvestigation:
            response.data.previousInvestigation?.anyPreviousInvestigation
              ? "Yes"
              : "No",
          previousInvestigationDetails:
            response.data.previousInvestigation?.details || "",
        
          // Optional: map document lists to file previews if needed later
        
          breastScan: response.data.physicalExam?.breastExam || "",
          pelvicScanPhysical: response.data.physicalExam?.pelvic || "",
          vaginalScan: response.data.physicalExam?.vagina || "",
        
          // If investigations exist, use first result or prepare UI to iterate all
          investigationResults:
            response.data.investigations?.[0]?.investigationResult || "",
        
          diagnosis: response.data.diagnosis?.toString() || "",
          causeOfInfertility: response.data.causeOfInfertility || "",
          typeOfInfertility: response.data.typeOfInfertility || "",
          treatmentSchedule: response.data.treatmentSchedule || "",
        });
        

        // Optional: handle file arrays separately
        // setDisplayDocuments
        // setDisplayDocumentsPelvic
        // setDisplayDocumentsPelvicInvestigation
        // setDisplayDocumentsAfm
        setDisplayDocumentsPelvicInvestigation(
          response.data.previousTreatment?.pelvicScanDocuments || []
        );
        setDisplayDocuments(
          response.data.previousInvestigation?.hsgDocuments || []
        );
        setDisplayDocumentsAfm(
          response.data.previousInvestigation?.afmDocuments || []
        );
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

  const handleLabAdd = () => {
    setLabRequests([...labRequests, newLab]);
    setNewLab({ test: "", location: "" });
  };

  const handlePrescriptionAdd = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({ name: "", quantity: "", freq: "", duration: "" });
  };
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
      oG_IVFId: +treatmentId || 0,
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
    <div style={{ paddingTop: "60px" }} className="w-100">
      <div class="flex-between align-center">
        <div class="flex" style={{ padding: "20px" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>
        {view && (
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
      <main className="">
        <section className="">
          <div className="section-box flex-row-gap-start">
            <div className="input-row w-70">
              <div class="w-100 flex-row-gap">
                <div className="field-row">
                  <label>Year Of Marriage</label>
                  <input
                    type="date"
                    name="yearOfMarriage"
                    onChange={handleChange}
                    className="input-field"
                    value={formData.yearOfMarriage || ""}
                  />
                </div>

                <div className="field-row">
                  <label>How many kids?</label>
                  <input
                    className="input-field"
                    type="number"
                    onChange={handleChange}
                    name="childrenCount"
                    value={formData.childrenCount || ""}
                  />
                </div>
              </div>

              <div className="flex-row-gap w-100">
                <div className="field-row">
                  <label>Last Confinement</label>
                  <input
                    type="date"
                    className="input-field"
                    onChange={handleChange}
                    name="lastConfinement"
                    value={formData.lastConfinement || ""}
                  />
                </div>

                <div className="field-row">
                  <label>LMP</label>
                  <input
                    type="date"
                    className="input-field"
                    name="lastLMP"
                    onChange={handleChange}
                    value={formData.lastLMP || ""}
                  />
                </div>
              </div>
              <div className="radio-column">
                <span>
                  Does your husband have any other children from another woman?
                </span>
                <label>
                  <input
                    type="radio"
                    name="anotherchild"
                    value="Yes"
                    checked={formData.anotherchild === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="anotherchild"
                    value="No"
                    checked={formData.anotherchild === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Sexual Intercourse?</span>
                <label>
                  <input
                    type="radio"
                    name="sexualIntercourse"
                    value="Yes"
                    checked={formData.sexualIntercourse === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="sexualIntercourse"
                    value="No"
                    checked={formData.sexualIntercourse === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
          

              <div className="radio-row">
                <span>Cohabiting?</span>
                <label>
                  <input
                    type="radio"
                    name="cohabiting"
                    value="Yes"
                    checked={formData.cohabiting === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="cohabiting"
                    value="No"
                    checked={formData.cohabiting === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Previous Marriage?</span>
                <label>
                  <input
                    type="radio"
                    name="previousMarriage"
                    value="Yes"
                    checked={formData.previousMarriage === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="previousMarriage"
                    value="No"
                    checked={formData.previousMarriage === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Any discharge from the breast?</span>
                <label>
                  <input
                    type="radio"
                    name="breastDischarge"
                    value="Yes"
                    checked={formData.breastDischarge === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="breastDischarge"
                    value="No"
                    checked={formData.breastDischarge === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Any vagina discharge?</span>
                <label>
                  <input
                    type="radio"
                    name="vaginaDischarge"
                    value="Yes"
                    checked={formData.vaginaDischarge === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="vaginaDischarge"
                    value="No"
                    checked={formData.vaginaDischarge === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Any abdominal swollen?</span>
                <label>
                  <input
                    type="radio"
                    name="abdominalSwollen"
                    value="Yes"
                    checked={formData.abdominalSwollen === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="abdominalSwollen"
                    value="No"
                    checked={formData.abdominalSwollen === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Do you have fibroid?</span>
                <label>
                  <input
                    type="radio"
                    name="hasFibroid"
                    value="Yes"
                    checked={formData.hasFibroid === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasFibroid"
                    value="No"
                    checked={formData.hasFibroid === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>Any Previous Treatment?</span>
                <label>
                  <input
                    type="radio"
                    name="previousTreatment"
                    value="Yes"
                    checked={formData.previousTreatment === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="previousTreatment"
                    value="No"
                    checked={formData.previousTreatment === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>

              {formData.previousTreatment === "Yes" && (
                <div className="field-column new">
                  <label>Detail</label>
                  <textarea
                    name="previousDetails"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData.previousDetails || ""}
                  ></textarea>
                </div>
              )}
              <div className="radio-row">
                <span>Any previous Investigation</span>
                <label>
                  <input
                    type="radio"
                    name="previousInvestigation"
                    value="Yes"
                    checked={formData.previousInvestigation === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="previousInvestigation"
                    value="No"
                    checked={formData.previousInvestigation === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              {formData.previousInvestigation === "Yes" && (
                <div className="field-column new">
                  <label>Details</label>
                  <textarea
                    name="previousInvestigationDetails"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData.previousInvestigationDetails || ""}
                  ></textarea>
                </div>
              )}
              <div>
                <div>
                  <div className="radio-row">
                    <span>Menstrual flow?</span>
                    <label>
                      <input
                        type="radio"
                        name="menstrualFlow"
                        value="Regular"
                        checked={formData.menstrualFlow === "Regular"}
                        onChange={handleChange}
                      />
                      Regular
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="menstrualFlow"
                        value="Irregular"
                        checked={formData.menstrualFlow === "Irregular"}
                        onChange={handleChange}
                      />
                      Irregular
                    </label>
                  </div>
                </div>
                <label className="normal-label">Menstrual Cycle</label>

                <div class="flex-row-gap">
                  <div className="field-row">
                    <label>No. Of Days</label>
                    <input
                      name="noOfDays"
                      onChange={handleChange}
                      className="input-field"
                      value={formData.noOfDays || ""}
                    />
                  </div>
                  <div className="field-row">
                    <label>Intervals</label>
                    <input
                      name="intervals"
                      onChange={handleChange}
                      className="input-field"
                      value={formData.intervals || ""}
                    />
                  </div>
                </div>
              </div>

              <div className="field-column new">
                <label>Partner's Profile</label>
                <div className="radio-column">
                <span>Previous Sperm Test?</span>
                <label>
                  <input
                    type="radio"
                    name="previousSpermTest"
                    value="Yes"
                    checked={formData.previousSpermTest === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="previousSpermTest"
                    value="No"
                    checked={formData.previousSpermTest === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
                {/* <textarea
                  rows={6}
                  name="intimateProfile"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.intimateProfile || ""}
                ></textarea> */}
              </div>
           

              <div className="flex">
                <div className="field-column new">
                  <label>Age</label>
                  <input
                    type="text"
                    name="age"
                    className="input-field"
                    value={formData.age || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-column new">
                  <label>Other Wives</label>
                  <input
                    type="text"
                    className="input-field"
                    name="otherWives"
                    value={formData.otherWives || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-column new">
                  <label>Other Kids</label>
                  <input
                    type="text"
                    className="input-field"
                    name="otherkids"
                    value={formData.otherkids || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="field-column new">
                <label>Pelvic Scan</label>

                <input
                  type="file"
                  name="pelvic"
                  onChange={handleFileUploadPelvic}
                />
                <img
                  style={{ height: "100px" }}
                  src={`https://edogoverp.com/labapi/api/document/view-document/${displaydocPelvic}`}
                />
              </div>

              <div className="field-column">
                <label>Vaginal Scan</label>
                <textarea
                  name="vaginalScan"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                  value={formData.vaginalScan || ""}
                ></textarea>
              </div>

              <div className="field-column">
                <label>Breast Scan</label>
                <textarea
                  rows={6}
                  name="breastScan"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.breastScan || ""}
                ></textarea>
              </div>

              <div className="field-column">
                <label>Pelvic</label>
                <textarea
                  rows={6}
                  name="pelvicScanPhysical"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.pelvicScanPhysical || ""}
                ></textarea>
              </div> */}
            </div>
            <div className="input-row w-30">
            <VitalsRecords vitals={vitals}/>

              {/* <div className="field-column new">
                <label>HSG</label>
                <input type="file" name="hsg" onChange={handleFileUpload} />
                <img
                  style={{ height: "100px" }}
                  src={`https://edogoverp.com/labapi/api/document/view-document/${displaydoc}`}
                />
              </div>

              <div className="field-column new">
                <label>AMF</label>
                <input type="file" name="afm" onChange={handleFileUploadAfm} />
                <img
                  style={{ height: "100px" }}
                  src={`https://edogoverp.com/labapi/api/document/view-document/${displaydocAfm}`}
                />
              </div> */}

              {/* <div className="m-t-10">
                <p>Investigations</p>
                <div className="field-column">
                  <label>Pelvic Scan</label>
                  <input
                    type="file"
                    name="pelvicInvestigation"
                    onChange={handleFileUploadPelvicInvestigation}
                  />
                  <img
                    style={{ height: "100px" }}
                    src={`https://edogoverp.com/labapi/api/document/view-document/${displaydocPelvicInvestigation}`}
                  />
                </div>

                <div className="field-column">
                  <label>Investigation Results</label>
                  <textarea
                    rows={6}
                    name="investigationResults"
                    onChange={handleChange}
                    className="input-field"
                    value={formData.investigationResults || ""}
                  ></textarea>
                </div>
              </div> */}
            </div>
          </div>
          <div className="field-column new m-t-20">
            {/* <label>Diagosis</label> */}

            <div className="w-half">
              <label className="normal-label">Diagnosis</label>

              <div className="field-row">
                <select
                  className="input-field"
                  onChange={handleChange}
                  name="diagnosis"
                  value={formData.diagnosis || ""}
                >
                  <option value="Select a diagnosis">
                    -- Select a diagnosis --
                  </option>
                  {[
                    { name: "Primary Infertility" },
                    { name: "Secondary Infertility" },
                  ]?.map((user) => (
                    <option key={user.name} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <textarea
              rows={6}
              name="diagnosis"
              onChange={handleChange}
              className="input-field"
              value={formData.diagnosis}
            ></textarea> */}
          </div>
          <div className="gap w-100 w-half">
            <div className="flex w-100">
              <div class="m-t- w-half">
                {formData.diagnosis == "Primary Infertility" && (
                  <div className="field-column new">
                    <label>Primary Infertility</label>
                    <textarea
                      rows={6}
                      name="primaryInfertility"
                      onChange={handleChange}
                      className="input-field"
                      value={formData.primaryInfertility}
                    ></textarea>
                  </div>
                )}
                {formData.diagnosis == "Secondary Infertility" && (
                  <div className="field-column new">
                    <label>Secondary Infertility</label>
                    <textarea
                      rows={6}
                      name="secondaryInfertility"
                      onChange={handleChange}
                      value={formData.secondaryInfertility}
                      className="input-field"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <div className="w-half">
              <div class="m-t-10">
                <div className="field-column new">
                  <label>Cause Of Infertility</label>
                  <textarea
                    rows={6}
                    name="causeOfInfertility"
                    onChange={handleChange}
                    value={formData.causeOfInfertility}
                    className="input-field"
                  ></textarea>
                </div>
                <div className="field-column new">
                  <label>Type Of Infertility</label>
                  <textarea
                    rows={6}
                    name="typeOfInfertility"
                    onChange={handleChange}
                    value={formData.typeOfInfertility}
                    className="input-field"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="w-half">
            <label className="normal-label">Investigations</label>

            <div className="field-row">
              <label>Select Investigations</label>
              <select
                className="input-field"
                onChange={handleIvestigationSelectChange}
                name="operationPerformedId"
                value={formData.operationPerformedId || ""}
              >
                <option value="">-- Select a user --</option>
                {investigationList?.map((user) => (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <ul>
                {selectedInvestigations.map((item, index) => (
                  <div
                    key={index}
                    className="flex-between normal-label justify-between"
                  >
                    <li>{item}</li>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          {view && dataFromLab && (
            <div className="field-column">
              <label>Patient's Lab Results</label>
              <LabRequestTable data={dataFromLab} isFamily={false} />
            </div>
          )}
          {view && (
            <MedicationTable
              data={{ treatmentType: "OG_IVF", treatmentId: treatmentId }}
            />
          )}
          <div className="field-column new">
            <label>Treatment Schedule</label>
            <textarea
              rows={6}
              name="treatmentSchedule"
              onChange={handleChange}
              value={formData.treatmentSchedule}
              className="input-field"
            ></textarea>
          </div>

          {!view && (
            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          )}

          {showModal && (
            <ReferPatient
              repeatedDiagnosis={repeatedDiagnosis}
              setRepeatedDiagnosis={setRepeatedDiagnosis}
              closeModal={toggleModal}
              visit={lastVisit}
              vital={vitals}
              ivf={records.id || 0}
              // vitalId = {vitals.id}
              id={patientId}
              // treatment={data[0] || null}
            />
          )}

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
        </section>
      </main>
    </div>
  );
};

export default IVFConsultation;
