import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
// import BirthRecordForm from "./BirthRecordForm";

const BirthRecordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage?.getItem("USER_INFO"));

  const { patientId } = useParams();
  const [records, setRecords] = useState({});
  const [displaydoc, setDisplayDocuments] = useState({});
  const [displaydocPelvic, setDisplayDocumentsPelvic] = useState({});
  const [
    displaydocPelvicInvestigation,
    setDisplayDocumentsPelvicInvestigation,
  ] = useState({});
  const [displaydocAfm, setDisplayDocumentsAfm] = useState({});

  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
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
  const [birthRecords, setBirthRecords] = useState(false);

  useEffect(() => {
    if (birthRecords?.id) {
      setFormData({
        // Dates & IDs
        dateOfBirth: birthRecords?.dateOfBirth?.split("T")[0] || "",
        timeOfBirth: birthRecords?.timeOfBirth?.value
          ? `${String(birthRecords?.timeOfBirth.value.hours).padStart(
              2,
              "0"
            )}:${String(birthRecords?.timeOfBirth.value.minutes).padStart(
              2,
              "0"
            )}`
          : "",

        patientMotherId: String(birthRecords?.patientMotherId || ""),
        patientFatherId: String(birthRecords?.patientFatherId || ""),

        // Simple fields
        sex: birthRecords?.sex || "",
        birthWeight: String(birthRecords?.birthWeight || ""),
        birthHeight: String(birthRecords?.birthHeight || ""),
        headCircumference: String(birthRecords?.headCircumference || ""),
        skinCircumference: String(birthRecords?.skinCircumference || ""),
        chestCircumference: String(birthRecords?.chestCircumference || ""),
        temperature: String(birthRecords?.temperature || ""),
        rbs: birthRecords?.rbs || "",
        spO2: String(birthRecords?.spO2 || ""),
        apgarScore: String(birthRecords?.apgarScore || ""),

        // Picklists (numbers stored as strings)
        color: String(birthRecords?.skincolor || ""),
        respiratoryEffect: String(birthRecords?.respiratoryEffort || ""),
        muscleTone: String(birthRecords?.muscleTone || ""),
        reflex: String(birthRecords?.reflex || ""),

        // Free‑text
        activity: birthRecords?.activity || "",
        pulse: birthRecords?.pulse || "",

        // Fixed IDs
        appointmentId: String(birthRecords?.appointmentId || ""),
        doctorId: String(birthRecords?.doctor?.id || docInfo?.id || ""),
      });
    }
  }, [birthRecords]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientId: Number(patientId),
      dateOfBirth: formData.dateOfBirth, // "YYYY-MM-DD"
      timeOfBirth: formData.timeOfBirth, // "HH:MM"
      patientMotherId: 100,
      patientFatherId: 100,
      sex: formData.sex, // "M" or "F"
      birthWeight: +formData.birthWeight || 8,
      birthHeight: +formData.birthHeight || 20,
      headCircumference: +formData.headCircumference,
      skinCircumference: +formData.skinCircumference,
      chestCircumference: +formData.chestCircumference,

      temperature: +formData.temperature,
      rbs: formData.rbs, // string
      spO2: +formData.spO2,
      apgarScore: +formData.apgarScore,
      skincolor: +formData.color, // 1,2,3...
      respiratoryEffort: +formData.respiratoryEffect,
      muscle: +formData.muscleTone,
      activity: formData.activity, // string
      reflex: {
        reflexType: +formData.reflexType,
        normalReflexOption: formData.normalReflexOption || "StrongCry",
      },
      pulse: formData?.pulse || "",

      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: docInfo.employeeId,
    };

    try {
      const response = await post("/OG_BirthRecord", payload);
      if (response.isSuccess) {
      toast("Successfully Uploaded");

        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      toast("Submission failed: FIll all fields properly");
    
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.entries(errors).forEach(([key, messages]) => {
          messages.forEach((msg) => {
            console.warn(`${key}: ${msg}`);
          });
        });
      } else {
        console.error("Unexpected error:", error?.message || error);
      }
    }
    

    console.log(payload); // check your payload structure
    // alert("Appointment created!");
  };

  const getRecord = async () => {
    try {
      const response = await get(`/OG_BirthRecord/patient/${patientId}`);
      if (response.isSuccess) {
        setBirthRecords(response?.data);
        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
    // https://edogoverp.com/medicals/api/OG_BirthRecord/list/1/10
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
    if (patientId) {
      // fetchRecord();
      getRecord();
    }
  }, [patientId]);

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

    console.log(value);
    // alert(name)

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    console.log(formData);
  };

  return (
    <div style={{ paddingTop: "0px" }} className="w-100">
      <main className="">
        <section className="">
          <div className="section-box flex-row-gap-start">
            <div className="input-row">
              {/* Date of Birth */}
              <div className="field-row">
                <label>DOB</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.dateOfBirth}
                />
              </div>

              {/* Mother */}
              <div className="field-row">
                <label>Mother</label>
                <input
                  type="text"
                  name="patientMotherId"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.patientMotherId}
                />
              </div>

              {/* Sex */}
              <div className="field-row">
                <label>Sex</label>
                <select
                  name="sex"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.sex}
                >
                  <option value="">Select…</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* Birth Weight */}
              <div className="field-row">
                <label>Birth Weight (Kg)</label>
                <input
                  type="number"
                  name="birthWeight"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.birthWeight}
                />
              </div>

              {/* Temperature */}
              <div className="field-row">
                <label>Temp (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.temperature}
                />
              </div>

              {/* RBS */}
              {/* <div className="field-row">
                <label>RBS</label>
                <input
                  type="text"
                  name="rbs"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.rbs}
                />
              </div> */}

              {/* SPO2 */}
              <div className="field-row">
                <label>SPO₂</label>
                <input
                  type="number"
                  name="spO2"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.spO2}
                />
              </div>

              {/* Colour */}
              <div className="field-row">
                <label>Skin Colour</label>
                <select
                  name="color"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.color}
                >
                  <option value="">Select…</option>
                  <option value="1">Pink</option>
                  <option value="2">Blue</option>
                  <option value="3">Pale</option>
                </select>
              </div>

              {/* Muscle Tone */}
              <div className="field-row">
                <label>Muscle (Activity)</label>
                <select
                  name="muscleTone"
                  onChange={handleChange}
                  value={formData.muscleTone}
                  className="input-field"
                >
                  <option value="">Select…</option>
                  <option value="1">Normal</option>
                  <option value="2">Reduced</option>
                  <option value="3">Absent</option>
                </select>
              </div>
              <div className="field-row">
                <label>Pulse</label>
                <input
                  type="text"
                  name="pulse"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.pulse}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="field-row">
                <label>Time Of Birth</label>
                <input
                  type="time"
                  name="timeOfBirth"
                  value={formData.timeOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="field-row">
                <label>Father</label>
                <input
                  type="text"
                  name="patientFatherId"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.patientFatherId}
                />
              </div>

              <div className="field-row">
                <label>Birth Length (cm)</label>
                <input
                  type="text"
                  name="birthHeight"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.birthHeight}
                />
              </div>

              <div className="field-row">
                <label>Head Circumference (cm)</label>
                <input
                  type="text"
                  name="headCircumference"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.headCircumference}
                />
              </div>

              {/* <div className="field-row">
                <label>Skin Circumference</label>
                <input
                  type="text"
                  name="skinCircumference"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.skinCircumference}
                />
              </div> */}

              <div className="field-row">
                <label>Chest Circumference (cm)</label>
                <input
                  type="text"
                  name="chestCircumference"
                  onChange={handleChange}
                  value={formData.chestCircumference}
                  className="input-field"
                />
              </div>

              <div className="field-row">
                <label>Respiratory Efforts (CRY)</label>

                <select
                  name="respiratoryEffect"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.respiratoryEffect}
                >
                  <option value="">Select…</option>
                  <option value="1">Good</option>
                  <option value="2">Absent</option>
                  <option value="3">Weak</option>
                </select>
              </div>

              <div className="field-row">
                <label>Reflex</label>

                <select
                  name="reflexType"
                  onChange={handleChange}
                  className="input-field"
                  value={formData.reflexType}
                >
                  <option value="">Select…</option>
                  <option value="1">Absent</option>
                  <option value="1">Grimance</option>
                  <option value="3">Normal</option>
                </select>
              </div>

              {formData.reflexType == "3" && (
                <div className="field-row">
                  <label>Sub Options (Normal)</label>

                  <select
                    name="normalReflexOption"
                    onChange={handleChange}
                    className="input-field"
                    value={formData.normalReflexOption}
                  >
                    <option value="">Select…</option>
                    <option value="StrongCry">Strong Cry</option>
                    <option value="Cough">Cough</option>
                    <option value="Sneeze">Sneeze</option>
                  </select>
                </div>
              )}
              {/* <input
                  type="text"
                  name="respiratoryEffect"
                  onChange={handleChange}
                  value={formData.respiratoryEffect}
                  className="input-field"
                /> */}

              <div className="field-row">
                <label>RBS</label>
                <input
                  type="text"
                  name="rbs"
                  onChange={handleChange}
                  value={formData.rbs}
                  className="input-field"
                />
              </div>
            </div>
          </div>
          <div className="field-row">
            <label>APGAR Score / 10</label>
            <input
              type="text"
              name="apgarScore"
              onChange={handleChange}
              value={formData.apgarScore}
              className="input-field"
            />
          </div>

          {/* <div className="field-column m-t-20">
            <label>Activity</label>

            <textarea
              rows={10}
              value={formData.diagnosis}
              name="diagnosis"
              onChange={handleChange}
              className="input-field"
            ></textarea>
          </div> */}
          <button onClick={handleSubmit} className="submit-btn m-t-10">
            Submit
          </button>
        </section>
      </main>
    </div>
  );
};

export default BirthRecordForm;
