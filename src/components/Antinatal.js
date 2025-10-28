import React, { useEffect, useState } from "react";
import { get, post, put } from "../utility/fetch";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
// import ReferPatient from "./modals/ReferPatient";
import LabRequestTable from "./LabRequestTable";
// import AddTreatmentOld from "./modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
// import VitalsRecords from "./modals/vitmodals/VitalsRecord";
import AntenatalVisitTable from "./AntenatalVisitTabls";
import DeliveryForm from "./DeliveryForm";
import AntenatalLabourMonitoring from "./AntenatalLabourMonitoring";


const Antinatal = ({ patientData }) => {
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const isEdit = searchParams.get("edit");

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const { patientId } = useParams();
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [vitals, setvitals] = useState();
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});

  const [editingIndex, setEditingIndex] = useState(null);
  const [obstetricEntry, setObstetricEntry] = useState({
    year: "",
    age: "",
    gestationalAgeWeek: "",
    durationOfLabour: "",
    modeOfDelivery: "",
    sex: "",
    weightKg: "",
    fatalOutCome: "",
    aph: false,
    pph: false,
    pih: false,
    otherIllness: "",
  });

  // Start editing
  const startEdit = (index, item) => {
    setEditingIndex(index);
    setObstetricEntry(item);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null);
    setObstetricEntry({
      year: "",
      age: "",
      gestationalAgeWeek: "",
      durationOfLabour: "",
      modeOfDelivery: "",
      sex: "",
      weightKg: "",
      fatalOutCome: "",
      aph: false,
      pph: false,
      pih: false,
      otherIllness: "",
    });
  };

  // Save edits
  const saveEdit = (index) => {
    console.log(formData.obstetricHistories);
    const updatedHistories = [...formData.obstetricHistories];
    updatedHistories[index] = obstetricEntry;
    setFormData({ ...formData, obstetricHistories: updatedHistories });
    cancelEdit();
  };

  // Delete an entry
  const deleteEntry = (index) => {
    const updatedHistories = formData.obstetricHistories.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, obstetricHistories: updatedHistories });
    cancelEdit();
  };

  // Add new obstetric row (assumes you already have an obstetricEntry object filled)
  const addObstetricRow = () => {
    setFormData({
      ...formData,
      obstetricHistories: [...formData.obstetricHistories, obstetricEntry],
    });
    // reset form entry fields after adding
    setObstetricEntry({
      year: "",
      age: "",
      gestationalAgeWeek: "",
      durationOfLabour: "",
      modeOfDelivery: "",
      sex: "",
      weightKg: "",
      fatalOutCome: "",
      aph: false,
      pph: false,
      pih: false,
      otherIllness: "",
    });
  };

  useEffect(() => {
    if (treatmentId) {
      fetchVisit();
      fetchRecord();
      fetcLabhData();
    }
    fetchTreatmentVitalsRecord();
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: +patientId || patientData?.patientId,
    maritalStatus: "Married",
    educationStatus: "1st Degree",
    pastMedicalHistory: "",
    pastSurgicalHistory: "",
    familyHistory: "",
    gravida: "",
    para: "",
    alive: "",
    male: "",
    female: "",
    obstetricHistories: [],
    presentPregnancyHistory: {
      lastMenstrualPeriod: "",
      expectedDateOfDelivery: "",
      bookingTest: {
        pcv: "",
        glu: "",
        prot: "",
        vdrl: "",
        hiv: "",
        hbv: "",
        bcv: "",
      },
      bloodGroup: "",
      genoType: "",
      weightKg: 0,
      heightCm: 0,
      bmi: 0,
    },
    antenatalVisits: [],
    birthPlan: {
      plannedDateOfDelivery: null,
      modeOfDelivery: 1,
      category: 1,
      typeOfPregnancy: "",
      episiotomyNeeded: true,
      clinicalPelvimetry: 1,
      deliveryListReceived: true,
    },
    id: isEdit && treatmentId,
    postnatalCare: {
      dateOfDelivery: "",
      modeOfDelivery: 1,
      episiotomy: true,
      complication: "",
      sexOfBaby: "",
      weightOfBabyKg: 0,
      breastfeedingWell: true,
      conditionOfBaby: "",
      conditionOfMother: "",
      familyPlanningChoice: "",
    },
    appointmentId: +localStorage.getItem("appointmentId"),
    doctorId: docInfo?.employeeId,
  });

  const handleChange = (e, path = []) => {
    const { name, value, type, checked } = e.target;

    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value === "" ? "" : parseFloat(value);
    } else if (type === "select-one") {
      // Check if value is numeric (e.g., "1", "2.5")
      newValue = /^\d+(\.\d+)?$/.test(value) ? parseFloat(value) : value;
    } else {
      newValue = value;
    }

    console.log(newValue);

    setFormData((prev) => {
      const updated = { ...prev };
      let target = updated;

      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }

      target[path[path.length - 1]] = newValue;
      return updated;
    });
  };

  const fetcLabhData = async () => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/patients/list/antenatal/${treatmentId}/1/10/lab-request`
      );
      setDataFromLab(response?.data?.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  const [formErrors, setFormErrors] = useState({});

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  // };
  const handleSubmit = async (status) => {
    // e.preventDefault();

    console.log("FormData:", { ...formData, status: status });

    // console.log(pp)
    // return

    // const errors = validateFormData(formData);

    // console.log(errors);
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   {
    //     Object.entries(errors).map(([key, message]) => {
    //       let kk = ("Validation Errors:", getDisplayFieldName(key));
    //       toast.error(`Validation Errors: ${message}`);
    //     });
    //   }
    //   console.log("Validation Errors:", errors);
    //   // Prevent form submission
    // } else {
    //   setFormErrors({});
    //   // toast.success("Form data is valid:", formData);
    //   // Proceed with form submission (e.g., API call)
    // }
    // console.log(formData);

    // return;
    let response = null;
    try {
      !isEdit
        ? (response = await post(
            `/Antenatal`,
            { ...formData, status: status } // send formData directly
          ))
        : (response = await put(
            `/Antenatal/${treatmentId}`,
            { ...formData, status: status } // send formData directly
          ));

      //

      console.log(response);

      toast.success(isEdit ? "updated successfully" : "Submitted successfully");

      // navigate(`/doctor/patients/patient-details/${patientId}`);
      // navigate(
      //   `/antenatal-record/${patientId}/?treatmentId=${response?.data?.antenatalId}`
      // );

      console.log("API Response:", response);
    } catch (error) {
      toast.error("Please make sure all fields are properly filled");

      console.error("Submission failed:", error);
      if (error?.response?.data?.errors) {
        Object.entries(error.response?.data.data.errors).forEach(
          ([field, messages]) => {
            messages.forEach((msg) => {
              console.warn(`${field}: ${msg}`);
            });
          }
        );
      }
    }
  };

  const fetchRecord = async () => {
    try {
      const response = await get(`/Antenatal/${treatmentId}`);
      if (response?.isSuccess) {
        console.log(response);
        setFormData({
          ...response?.data,
          patientId: response?.data.patient?.id || 0,
          maritalStatus: response?.data.maritalStatus || "",
          educationStatus: response?.data.educationStatus || "",
          pastMedicalHistory: response?.data.pastMedicalHistory || "",
          pastSurgicalHistory: response?.data.pastSurgicalHistory || "",
          familyHistory: response?.data.familyHistory || "",
          gravida: response?.data.gravida || "",
          para: response?.data.para || "",
          alive: response?.data.alive || "",
          male: response?.data.male || "",
          female: response?.data.female || "",

          obstetricHistories: response?.data.obstetricHistories || [],

          presentPregnancyHistory: {
            lastMenstrualPeriod:
              response?.data.presentPregnancyHistory?.lastMenstrualPeriod || "",
            expectedDateOfDelivery:
              response?.data.presentPregnancyHistory?.expectedDateOfDelivery ||
              "",
            bookingTest: {
              pcv:
                response?.data.presentPregnancyHistory?.bookingTest?.pcv || "",
              glu:
                response?.data.presentPregnancyHistory?.bookingTest?.glu || "",
              prot:
                response?.data.presentPregnancyHistory?.bookingTest?.prot || "",
              vdrl:
                response?.data.presentPregnancyHistory?.bookingTest?.vdrl || "",
              hiv:
                response?.data.presentPregnancyHistory?.bookingTest?.hiv || "",
              hbv:
                response?.data.presentPregnancyHistory?.bookingTest?.hbv || "",
              bcv:
                response?.data.presentPregnancyHistory?.bookingTest?.bcv || "",
            },
            bloodGroup:
              response?.data.presentPregnancyHistory?.bloodGroup || "",
            genoType: response?.data.presentPregnancyHistory?.genoType || "",
            weightKg: response?.data.presentPregnancyHistory?.weightKg || 0,
            heightCm: response?.data.presentPregnancyHistory?.heightCm || 0,
            bmi: response?.data.presentPregnancyHistory?.bmi || 0,
          },

          antenatalVisits: response?.data.antenatalVisits || [],

          birthPlan: {
            plannedDateOfDelivery:
              response?.data.birthPlan?.plannedDateOfDelivery || null,
            modeOfDelivery: response?.data.birthPlan?.modeOfDelivery || 1,
            category: response?.data.birthPlan?.category || 1,
            typeOfPregnancy: response?.data.birthPlan?.typeOfPregnancy || "",
            episiotomyNeeded:
              response?.data.birthPlan?.episiotomyNeeded ?? true,
            clinicalPelvimetry:
              response?.data.birthPlan?.clinicalPelvimetry || 1,
            deliveryListReceived:
              response?.data.birthPlan?.deliveryListReceived ?? true,
          },

          // postnatalCare: {
          //   dateOfDelivery: response?.data.postnatalCare?.dateOfDelivery || "",
          //   modeOfDelivery: response?.data.postnatalCare?.modeOfDelivery || 1,
          //   episiotomy: response?.data.postnatalCare?.episiotomy ?? true,
          //   complication: response?.data.postnatalCare?.complication || "",
          //   sexOfBaby: response?.data.postnatalCare?.sexOfBaby || "",
          //   weightOfBabyKg: response?.data.postnatalCare?.weightOfBabyKg || 0,
          //   breastfeedingWell:
          //     response?.data.postnatalCare?.breastfeedingWell ?? true,
          //   conditionOfBaby:
          //     response?.data.postnatalCare?.conditionOfBaby || "",
          //   conditionOfMother:
          //     response?.data.postnatalCare?.conditionOfMother || "",
          //   familyPlanningChoice:
          //     response?.data.postnatalCare?.familyPlanningChoice || "",
          // },

          appointmentId: response?.data.appointmentId || 0,
          doctorId: response?.data.doctor?.id || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
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

  // const createTreatmet = async (load) => {
  //   let payload = {
  //     dateOfVisit: "2025-05-01T05:09:59.302Z",
  //     appointmentId: +localStorage.getItem("appointmentId"),
  //     diagnosis: "string",
  //     isAdmitted: false,
  //     patientId: +patientId,
  //     medications: [
  //       {
  //         pharmacyInventoryId: 1,
  //         quantity: 1,
  //         frequency: 2,
  //         duration: 0,
  //       },
  //     ],
  //     otherMedications: [
  //       {
  //         name: "fhhkjkkkhk",
  //         quantity: 0,
  //         frequency: 0,
  //         duration: 0,
  //       },
  //     ],
  //     followUpAppointment: {
  //       id: 0,
  //       appointDate: "1920/09/1",
  //       appointTime: "23:09",
  //       description: "string",
  //       doctorEmployeeId: 0,
  //       nurseEmployeeId: 0,
  //       isAdmitted: true,
  //       patientId: 0,
  //       serviceId: 0,
  //       isEmergency: true,
  //       careType: 0,
  //     },
  //     carePlan: "string",
  //     familyMedicineId: 0,
  //     oG_IVFId: 0,
  //     oG_BirthRecordId: 0,
  //     orthopedicId: 0,
  //     generalSurgeryId: 0,
  //     pediatricId: 0,
  //     generalPracticeId: 0,
  //     antenatalId: +treatmentId || 0,
  //     ...load,
  //   };

  //   try {
  //     await post(`/ServiceTreatment`, payload);
  //     // await fetchData();
  //     toast.success("Treatment added successfully");
  //     // closeModal();
  //     toggleTreatmentModal();
  //   } catch (error) {
  //     toast.error("Error adding treatment");
  //     console.log(error);
  //   }
  // };

  const createTreatment = async (load) => {
    let payload = {
      dateOfVisit: "2025-05-01T05:09:59.302Z",
      appointmentId: +localStorage.getItem("appointmentId"),
      diagnosis: "some diagnosis",
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
          name: "Paracetamol",
          quantity: 1,
          frequency: 2,
          duration: 3,
        },
      ],
      followUpAppointment: {
        id: 0,
        appointDate: "",
        appointTime: "",
        description: "",
        doctorEmployeeId: 0,
        nurseEmployeeId: 0,
        isAdmitted: false,
        patientId: +patientId,
        serviceId: 1,
        isEmergency: false,
        careType: 0,
      },
      carePlan: "Monitor vitals daily",
      familyMedicineId: 0,
      oG_IVFId: 0,
      oG_BirthRecordId: 0,
      orthopedicId: 0,
      generalSurgeryId: 0,
      pediatricId: 0,
      generalPracticeId: 0,
      antenatalId: +treatmentId || 0,
      ...load,
    };

    // const errors = validateTreatmentPayload(payload);

    // if (errors.length) {
    //   errors.forEach((err) => toast.error(err));
    //   console.log("Payload validation errors:", errors);
    //   return;
    // }

    try {
      await post(`/ServiceTreatment`, payload);
      toast.success("Treatment added successfully");
      toggleTreatmentModal();
    } catch (error) {
      toast.error("Error adding treatment");
      console.log(error);
    }
  };

  const validateTreatmentPayload = (payload) => {
    const errors = [];

    const checkString = (key, value) => {
      if (typeof value !== "string" || !value.trim()) {
        errors.push(`${key} is required and must be a non-empty string`);
      }
    };

    const checkNumber = (key, value) => {
      if (typeof value !== "number") {
        errors.push(`${key} is required and must be a number`);
      }
    };

    const checkBoolean = (key, value) => {
      if (typeof value !== "boolean") {
        errors.push(`${key} must be a boolean value`);
      }
    };

    // const checkArray = (key, value) => {
    //   if (!Array.isArray(value) || value.length === 0) {
    //     errors.push(`${key} must be a non-empty array`);
    //   }
    // };

    checkString("dateOfVisit", payload.dateOfVisit);
    checkNumber("appointmentId", payload.appointmentId);
    checkString("diagnosis", payload.diagnosis);
    checkBoolean("isAdmitted", payload.isAdmitted);
    checkNumber("patientId", payload.patientId);

    // checkArray("medications", payload.medications);
    payload.medications.forEach((med, i) => {
      checkNumber(
        `medications[${i}].pharmacyInventoryId`,
        med.pharmacyInventoryId
      );
      if (med.quantity <= 0)
        errors.push(`medications[${i}].quantity must be > 0`);
      if (med.frequency <= 0)
        errors.push(`medications[${i}].frequency must be > 0`);
      checkNumber(`medications[${i}].duration`, med.duration);
    });

    // checkArray("otherMedications", payload.otherMedications);
    payload.otherMedications.forEach((med, i) => {
      checkString(`otherMedications[${i}].name`, med.name);
      checkNumber(`otherMedications[${i}].quantity`, med.quantity);
      checkNumber(`otherMedications[${i}].frequency`, med.frequency);
      checkNumber(`otherMedications[${i}].duration`, med.duration);
    });

    const followUp = payload.followUpAppointment;
    if (typeof followUp !== "object" || !followUp) {
      errors.push("followUpAppointment is required");
    } else {
      checkString("followUpAppointment.appointDate", followUp.appointDate);
      checkString("followUpAppointment.appointTime", followUp.appointTime);
      checkString("followUpAppointment.description", followUp.description);
      checkNumber(
        "followUpAppointment.doctorEmployeeId",
        followUp.doctorEmployeeId
      );
      checkNumber(
        "followUpAppointment.nurseEmployeeId",
        followUp.nurseEmployeeId
      );
      checkBoolean("followUpAppointment.isAdmitted", followUp.isAdmitted);
      checkNumber("followUpAppointment.patientId", followUp.patientId);
      checkNumber("followUpAppointment.serviceId", followUp.serviceId);
      checkBoolean("followUpAppointment.isEmergency", followUp.isEmergency);
      checkNumber("followUpAppointment.careType", followUp.careType);
    }

    checkString("carePlan", payload.carePlan);

    const idFields = [
      "familyMedicineId",
      "oG_IVFId",
      "oG_BirthRecordId",
      "orthopedicId",
      "generalSurgeryId",
      "pediatricId",
      "generalPracticeId",
      "antenatalId",
    ];

    idFields.forEach((field) => {
      checkNumber(field, payload[field]);
    });

    return errors;
  };

  const isEmpty = (value) => {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === "string" && value.trim() === "") {
      return true;
    }
    if (typeof value === "number" && isNaN(value)) {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (
      typeof value === "object" &&
      Object.keys(value).length === 0 &&
      !(value instanceof Date)
    ) {
      return true;
    }
    return false;
  };

  // Helper function to validate a date string (e.g., "YYYY-MM-DD")
  const isValidDate = (dateString) => {
    // Basic regex for YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    // Check if the date object is valid and the year, month, day match the input
    return (
      date instanceof Date &&
      !isNaN(date) &&
      date.getFullYear() === parseInt(dateString.substring(0, 4)) &&
      date.getMonth() + 1 === parseInt(dateString.substring(5, 7)) &&
      date.getDate() === parseInt(dateString.substring(8, 10))
    );
  };

  const getDisplayFieldName = (key) => {
    // A simple conversion for common cases, or use a lookup map for complex names
    const parts = key.split(/(?=[A-Z])/); // Split by uppercase letters
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const validateFormData = (formData) => {
    console.log(formData);
    let errors = {};

    // Basic type checking and emptiness for top-level fields
    if (typeof formData.patientId !== "number" || isNaN(formData.patientId)) {
      errors.patientId = "Patient ID must be a number.";
      console.log(errors);
    }
    if (
      isEmpty(formData.maritalStatus) ||
      typeof formData.maritalStatus !== "string"
    ) {
      errors.maritalStatus = "Marital Status is required and must be a string.";
      console.log(errors);
    }
    if (
      isEmpty(formData.educationStatus) ||
      typeof formData.educationStatus !== "string"
    ) {
      errors.educationStatus =
        "Education Status is required and must be a string.";
      console.log(errors);
    }
    // Add similar checks for other top-level string fields
    if (
      isEmpty(formData.pastMedicalHistory) ||
      typeof formData.pastMedicalHistory !== "string"
    ) {
      errors.pastMedicalHistory = "Past Medical History must be a string.";
      console.log(errors);
    }
    if (
      isEmpty(formData.pastSurgicalHistory) ||
      typeof formData.pastSurgicalHistory !== "string"
    ) {
      errors.pastSurgicalHistory = "Past Surgical History must be a string.";
    }
    if (
      isEmpty(formData.familyHistory) ||
      typeof formData.familyHistory !== "string"
    ) {
      errors.familyHistory = "Family History must be a string.";
      console.log(errors);
    }

    // Numerical fields (gravida, para, alive, male, female)
    ["gravida", "para", "alive", "male", "female"].forEach((field) => {
      console.log(formData[field]);
      if (
        formData[field] == "" ||
        (typeof formData[field] !== "string" &&
          isNaN(parseInt(formData[field])))
      ) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be a number or empty.`;
      }
    });

    // obstetricHistories (array of objects)
    if (
      !Array.isArray(formData.obstetricHistories) ||
      formData.obstetricHistories.length < 1
    ) {
      errors.obstetricHistories = "Obstetric Histories must not be empty.";
    } else {
      console.log(formData.obstetricHistories);
      formData.obstetricHistories.forEach((history, index) => {
        // Example: If obstetric history objects have specific required fields

        [
          "age",

          "durationOfLabour",
          "fatalOutCome",
          "modeOfDelivery",
          "otherIllness",
          "gestationalAgeWeek",
          "sex",
          "year",
        ].forEach((field) => {
          console.log(history[field]);
          console.log(history);
          console.log(field);
          if (
            (typeof history[field] !== "string" && history[field] == "") ||
            history[field] < 0
          ) {
            errors[field] = `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } must not be or empty.`;
          }
        });

        // errors[
        //   `obstetricHistories[${index}]`
        // ] = `Entry ${index} in Obstetric Histories must be an object.`;
        // Add more specific validations for fields within each history object if needed
        // e.g., if (isEmpty(history.deliveryDate)) errors[`obstetricHistories[${index}].deliveryDate`] = 'Delivery date is required.';
      });
    }

    // presentPregnancyHistory
    if (
      typeof formData.presentPregnancyHistory !== "object" ||
      formData.presentPregnancyHistory === null
    ) {
      errors.presentPregnancyHistory =
        "Present Pregnancy History must be an object.";
    } else {
      const pph = formData.presentPregnancyHistory;
      if (
        isEmpty(pph.lastMenstrualPeriod) ||
        !isValidDate(pph.lastMenstrualPeriod)
      ) {
        errors.lastMenstrualPeriod =
          "Last Menstrual Period is required and must be a valid date (YYYY-MM-DD).";
      }
      if (
        isEmpty(pph.expectedDateOfDelivery) ||
        !isValidDate(pph.expectedDateOfDelivery)
      ) {
        errors.expectedDateOfDelivery =
          "Expected Date of Delivery is required and must be a valid date (YYYY-MM-DD).";
      }

      // bookingTest
      if (typeof pph.bookingTest !== "object" || pph.bookingTest === null) {
        errors.bookingTest = "Booking Test must be an object.";
      } else {
        const bt = pph.bookingTest;
        // console.log(bt)
        // All booking test fields are strings and can be empty. Just check type.
        ["pcv", "glu", "prot", "vdrl", "hiv", "hbv", "bcv"].forEach((field) => {
          console.log(bt);
          console.log(bt[field]);
          console.log(field);
          if (typeof bt[field] !== "string" || bt[field] == "") {
            errors[
              `bookingTest.${field}`
            ] = `${field.toUpperCase()} must not be a empty.`;
          }
        });
      }

      if (typeof pph.bloodGroup !== "string" || pph.bloodGroup == "") {
        errors.bloodGroup = "Blood Group must be a string.";
      }
      if (typeof pph.genoType !== "string" || pph.genoType == "") {
        errors.genoType = "Genotype must be a string.";
      }
      if (typeof pph.weightKg !== "number" || pph.weightKg < 0) {
        errors.weightKg = "Weight must be a non-negative number.";
      }
      if (typeof pph.heightCm !== "number" || pph.heightCm < 0) {
        errors.heightCm = "Height must be a non-negative number.";
      }
      if (typeof pph.bmi !== "number" || pph.bmi < 0) {
        errors.bmi = "BMI must be a non-negative number.";
      }
    }

    // antenatalVisits (array of objects) - similar to obstetricHistories
    if (!Array.isArray(formData.antenatalVisits)) {
      console.log(formData.antenatalVisits);

      errors.antenatalVisits = "Antenatal Visits must be an array.";
    } else {
      if (formData.antenatalVisits.length == 0) {
        // alert("Iamempty");
      } else {
        formData.antenatalVisits.forEach((visit, index) => {
          console.log(formData.antenatalVisits);

          // if (typeof visit !== "object" || visit === null) {
          //   errors[
          //     `antenatalVisits[${index}]`
          //   ] = `Entry ${index} in Antenatal Visits must be an object.`;
          // }

          [
            "bp",
            "date",
            "festalHeartRate",
            "gestationalAgeWeeks",
            "lie",
            "oedma",
            "pcv",
            "position",
            "pr",
            "presentation",
            "remark",
            "sfhCm",
            "tt",
            "urine",
            "ve",
            "visitNo",
            "weightKg",
          ].forEach((field) => {
            console.log(visit[field]);
            console.log(visit);
            console.log(field);
            if (visit[field] == "") {
              errors[field] = `${
                field.charAt(0).toUpperCase() + field.slice(1)
              } must not be or empty.`;
            }
          });
          // Add specific validations for fields within each visit object if needed
        });
      }
    }

    // birthPlan
    if (typeof formData.birthPlan !== "object" || formData.birthPlan === null) {
      errors.birthPlan = "Birth Plan must be an object.";
    } else {
      const bp = formData.birthPlan;
      if (
        isEmpty(bp.plannedDateOfDelivery) ||
        !isValidDate(bp.plannedDateOfDelivery)
      ) {
        errors.plannedDateOfDelivery =
          "Planned Date of Delivery is required and must be a valid date (YYYY-MM-DD).";
      }
      if (typeof bp.modeOfDelivery !== "number" || bp.modeOfDelivery <= 0) {
        errors.modeOfDelivery = "Mode of Delivery must be selected.";
      }
      if (typeof bp.category !== "number" || bp.category <= 0) {
        errors.category = "Category must be selected.";
      }
      if (typeof bp.typeOfPregnancy !== "string" || bp.typeOfPregnancy == "") {
        errors.typeOfPregnancy = "Type of Pregnancy must be a selected.";
      }
      if (typeof bp.episiotomyNeeded !== "boolean") {
        errors.episiotomyNeeded = "Episiotomy Needed must be a boolean.";
      }
      if (
        typeof bp.clinicalPelvimetry !== "number" ||
        bp.clinicalPelvimetry <= 0
      ) {
        errors.clinicalPelvimetry = "Clinical Pelvimetry must be selected.";
      }
      if (typeof bp.deliveryListReceived !== "boolean") {
        errors.deliveryListReceived =
          "Delivery List Received must be a boolean.";
      }
    }

    // postnatalCare
    // if (typeof formData.postnatalCare !== 'object' || formData.postnatalCare === null) {
    //   errors.postnatalCare = 'Postnatal Care must be an object.';
    // } else {
    //   const pnc = formData.postnatalCare;
    //   if (isEmpty(pnc.dateOfDelivery) || !isValidDate(pnc.dateOfDelivery)) {
    //     errors.dateOfDelivery = 'Date of Delivery is required and must be a valid date (YYYY-MM-DD).';
    //   }
    //   if (typeof pnc.modeOfDelivery !== 'number' || pnc.modeOfDelivery <= 0) {
    //     errors.postnatalCareModeOfDelivery = 'Mode of Delivery must be selected.';
    //   }
    //   if (typeof pnc.episiotomy !== 'boolean') {
    //     errors.postnatalCareEpisiotomy = 'Episiotomy must be a boolean.';
    //   }
    //   if (typeof pnc.complication !== 'string') {
    //     errors.complication = 'Complication must be a string.';
    //   }
    //   if (typeof pnc.sexOfBaby !== 'string') {
    //     errors.sexOfBaby = 'Sex of Baby must be a string.';
    //   }
    //   if (typeof pnc.weightOfBabyKg !== 'number' || pnc.weightOfBabyKg < 0) {
    //     errors.weightOfBabyKg = 'Weight of Baby must be a non-negative number.';
    //   }
    //   if (typeof pnc.breastfeedingWell !== 'boolean') {
    //     errors.breastfeedingWell = 'Breastfeeding Well must be a boolean.';
    //   }
    //   if (typeof pnc.conditionOfBaby !== 'string') {
    //     errors.conditionOfBaby = 'Condition of Baby must be a string.';
    //   }
    //   if (typeof pnc.conditionOfMother !== 'string') {
    //     errors.conditionOfMother = 'Condition of Mother must be a string.';
    //   }
    //   if (typeof pnc.familyPlanningChoice !== 'string') {
    //     errors.familyPlanningChoice = 'Family Planning Choice must be a string.';
    //   }
    // }

    // appointmentId and doctorId
    if (
      typeof formData.appointmentId !== "number" ||
      isNaN(formData.appointmentId)
    ) {
      errors.appointmentId = "Appointment ID must be a number.";
    }
    if (typeof formData.doctorId !== "number" || isNaN(formData.doctorId)) {
      errors.doctorId = "Doctor ID must be a number.";
    }

    return errors;
  };

  const catchAddedVisits = (data) => {
    setFormData({ ...formData, antenatalVisits: data });
  };

  const fetchTreatmentVitalsRecord = async () => {
    //   setLoading(true);
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
      // setLoading(false);
    }
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
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  const [currentStep, setCurrentStep] = useState(0);

  const steps = ["Antenatal", "Antenatal Labour Monitoring", "Delivery Form"];

  const handleStepChange = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="consultation-container w-100" style={{ paddingTop: "60px" }}>
     {treatmentId &&  <div
          className="flex"
          style={{ padding: "20px", cursor: "pointer", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FiArrowLeft />
            <p onClick={() => navigate(-1)} style={{ marginLeft: "8px" }}> Back</p>
          </div>
          {lastVisit?.patientName && (
            <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
              {lastVisit.patientName}
            </span>
          )}
        </div>}
      <div style={{ padding:treatmentId && "20px" }}>
        <h2>Delivery Process</h2>
        <StepsComponent steps={steps} onStepChange={handleStepChange} />

        <div style={{ marginTop: "20px" }}>
          {currentStep === 0 && (
            <div class="w-100">
              <div class="flex-between align-center">
                
                {/* {treatmentId && (
                  <div class="flex-row-gap">
                    <button
                      disabled={formData.status !== "submitted"}
                      className="rounded-btn"
                      onClick={toggleModal}
                    >
                      + Refer Patient To Lab
                    </button>
                    <button
                      disabled={formData.status !== "submitted"}
                      className="rounded-btn"
                      onClick={toggleTreatmentModal}
                    >
                      + Add Treatment
                    </button>
                  </div>
                )} */}
              </div>
              <div>
                <div>
                  <div className="section-box">
                    <div
                      className="flex"
                      style={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <h2 style={{ textAlign: "center" }} className="w-100">
                        Antenatal
                      </h2>
                      {(formData.status || isEdit) && (
                        <div>
                          {formData.status !== "submitted" ? (
                            <p
                              className="flex bold"
                              style={{
                                backgroundColor: "yellow",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                fontWeight: "bold",
                              }}
                            >
                              saved
                            </p>
                          ) : (
                            <p
                              style={{
                                backgroundColor: "#ccffcc",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              Submitted
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {/* <VitalsRecords vitals={vitals} viewMode={false} /> */}
                    <div className="flex-row-gap-start m-t-20">
                      <div className="w-100">
                        {/* <h2>1. Past History</h2> */}
                        <Accordion title="Patient Complaint">
                          <div class="form-grid">
                            <div className="field-column">
                              <label>Patient Complaint</label>
                              <textarea
                                placeholder="Patient"
                                value={formData.patientComplaint}
                                rows={3}
                              />
                            </div>
                          </div>
                        </Accordion>
                        <Accordion title="Past Medical History">
                          <div class="form-grid">
                            <div className="field-column">
                              <label>Past Medical History</label>
                              <input
                                placeholder="Past Medical History"
                                value={formData.pastMedicalHistory}
                                onChange={(e) =>
                                  handleChange(e, ["pastMedicalHistory"])
                                }
                              />
                            </div>
                            <div className="field-column">
                              <label>Past Surgical History</label>
                              <input
                                placeholder="Past Surgical History"
                                value={formData.pastSurgicalHistory}
                                onChange={(e) =>
                                  handleChange(e, ["pastSurgicalHistory"])
                                }
                              />
                            </div>
                            <div className="field-column">
                              <label>Family History</label>
                              <input
                                placeholder="Family History"
                                value={formData.familyHistory}
                                onChange={(e) =>
                                  handleChange(e, ["familyHistory"])
                                }
                              />
                            </div>
                          </div>
                        </Accordion>
                        <Accordion title="Past Obstetric History">
                          <div className="flex-row-gap-start">
                            <div
                              style={{ width: "15%", marginRight: "10px" }}
                              className=""
                            >
                              <label>Gravida</label>
                              <input
                                type="text"
                                value={formData.gravida}
                                onChange={(e) => handleChange(e, ["gravida"])}
                                placeholder="Gravida"
                              />
                            </div>
                            <div
                              style={{ width: "15%", marginRight: "10px" }}
                              className=""
                            >
                              <label>Para</label>
                              <input
                                type="text"
                                value={formData.para}
                                onChange={(e) => handleChange(e, ["para"])}
                                placeholder="Para"
                              />
                            </div>
                            <div
                              style={{ width: "15%", marginRight: "10px" }}
                              className=""
                            >
                              <label>Alive</label>
                              <input
                                type="text"
                                value={formData.alive}
                                onChange={(e) => handleChange(e, ["alive"])}
                                placeholder="Alive"
                              />
                            </div>
                            <div
                              style={{ width: "15%", marginRight: "10px" }}
                              className=""
                            >
                              <label>Male</label>
                              <input
                                type="text"
                                value={formData.male}
                                onChange={(e) => handleChange(e, ["male"])}
                                placeholder="Male"
                              />
                            </div>
                            <div
                              style={{ width: "15%", marginRight: "10px" }}
                              className=""
                            >
                              <label>Female</label>
                              <input
                                type="text"
                                value={formData.female}
                                onChange={(e) => handleChange(e, ["female"])}
                                placeholder="Female"
                              />
                            </div>
                          </div>
                          <div className="readonly-table-wrapperR mt-10">
                            <table
                              border={1}
                              cellPadding={5}
                              className="w-full readonly-tableR  text-sm"
                            >
                              <thead>
                                <tr>
                                  <th>Preg #</th>
                                  <th>Year at birth</th>
                                  <th>Age at birth</th>
                                  <th>GA (Weeks)</th>
                                  <th>Duration Of Labour</th>
                                  <th>Mode of Delivery</th>
                                  <th>Sex Of Baby</th>
                                  <th>Weight (Kg)</th>
                                  <th>Foetal Outcome</th>
                                  <th>APH</th>
                                  <th>PPH</th>
                                  <th>PIH</th>
                                  <th>Other Illness</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formData?.obstetricHistories?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="number"
                                            value={obstetricEntry.year}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                year: +e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.year
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="number"
                                            value={obstetricEntry.age}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                age: +e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.age
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="number"
                                            value={
                                              obstetricEntry.gestationalAgeWeek
                                            }
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                gestationalAgeWeek:
                                                  e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.gestationalAgeWeek
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            value={
                                              obstetricEntry.durationOfLabour
                                            }
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                durationOfLabour:
                                                  e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.durationOfLabour
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            value={
                                              obstetricEntry.modeOfDelivery
                                            }
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                modeOfDelivery: e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.modeOfDelivery
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <select
                                            className="input-field"
                                            value={obstetricEntry.sex}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                sex: e.target.value,
                                              })
                                            }
                                          >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                              Female
                                            </option>
                                          </select>
                                        ) : (
                                          item.sex
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="number"
                                            value={obstetricEntry.weightKg}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                weightKg: +e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.weightKg
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            placeholder="Death, Alive, Abortion"
                                            value={obstetricEntry.fatalOutCome}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                fatalOutCome: e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.fatalOutCome
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="checkbox"
                                            checked={obstetricEntry.aph}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                aph: e.target.checked,
                                              })
                                            }
                                          />
                                        ) : item.aph ? (
                                          "✔"
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="checkbox"
                                            checked={obstetricEntry.pph}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                pph: e.target.checked,
                                              })
                                            }
                                          />
                                        ) : item.pph ? (
                                          "✔"
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            type="checkbox"
                                            checked={obstetricEntry.pih}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                pih: e.target.checked,
                                              })
                                            }
                                          />
                                        ) : item.pih ? (
                                          "✔"
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                      <td>
                                        {editingIndex === index ? (
                                          <input
                                            value={obstetricEntry.otherIllness}
                                            onChange={(e) =>
                                              setObstetricEntry({
                                                ...obstetricEntry,
                                                otherIllness: e.target.value,
                                              })
                                            }
                                          />
                                        ) : (
                                          item.otherIllness
                                        )}
                                      </td>
                                      {/* Repeat for other cells similarly */}
                                      <td>
                                        {editingIndex === index ? (
                                          <>
                                            <button
                                              onClick={() => saveEdit(index)}
                                            >
                                              💾
                                            </button>
                                            <button onClick={cancelEdit}>
                                              ❌
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() =>
                                                startEdit(index, item)
                                              }
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={() => deleteEntry(index)}
                                            >
                                              🗑️
                                            </button>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                                {/* New Entry Row (already in your code) */}
                              </tbody>
                            </table>
                          </div>
                          <button
                            className="btn"
                            type="button"
                            onClick={addObstetricRow}
                            style={{ margin: "20px" }}
                          >
                            ➕ Add Obstetric Entry
                          </button>
                        </Accordion>
                        {/* <div class="">
                    <div className="group-box">
                      <label>Marital Status</label>
                      {["Single", "Married", "Divorced"].map((opt, idx) => (
                        <label key={opt}>
                          <input
                            type="radio"
                            name="maritalStatus"
                            value={opt}
                            onChange={(e) => handleChange(e, ["maritalStatus"])}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    <div className="group-box">
                      <label>Educational Status</label>
                      {["1st Degree", "2nd Degree", "3rd Degree"].map(
                        (opt, idx) => (
                          <label key={opt}>
                            <input
                              type="radio"
                              name="educationStatus"
                              value={opt}
                              onChange={(e) =>
                                handleChange(e, ["educationStatus"])
                              }
                            />
                            {opt}
                          </label>
                        )
                      )}
                    </div>
                  </div> */}
                        {/* <h2>1. Make an accordion of them </h2> */}
                      </div>
                    </div>
                    <Accordion title="Present Pregnancy History">
                      <div className="form-grid">
                        <div className="field-column">
                          <label>Last Menstrual Period (LMP)</label>
                          <input
                            type="date"
                            value={
                              formData.presentPregnancyHistory
                                ?.lastMenstrualPeriod
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "lastMenstrualPeriod",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Expected Date of Delivery (EDD)</label>
                          <input
                            type="date"
                            value={
                              formData.presentPregnancyHistory
                                ?.expectedDateOfDelivery
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "expectedDateOfDelivery",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Gestational Age (GA)</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.gestationalAge
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "gestationalAge",
                              ])
                            }
                          />
                        </div>
                      </div>
                      <h4 style={{ margin: "20px 0px" }}>
                        Booking Test Results
                      </h4>
                      <div className="form-grid">
                        <div className="field-column">
                          <label>Weight (kg)</label>
                          <input
                            type="number"
                            value={formData.presentPregnancyHistory?.weightKg}
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "weightKg",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Height (cm)</label>
                          <input
                            type="number"
                            value={formData.presentPregnancyHistory?.heightCm}
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "heightCm",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>BMI</label>
                          <input
                            type="number"
                            value={formData.presentPregnancyHistory?.bmi}
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bmi",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>PCV</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.pcv
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "pcv",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Glu</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.glu
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "glu",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Protein</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.prot
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "prot",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>VDRL</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.vdrl
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "vdrl",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>HIV</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.hiv
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "hiv",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>HBV</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.hbv
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "hbv",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>HCV</label>
                          <input
                            type="text"
                            value={
                              formData.presentPregnancyHistory?.bookingTest.bcv
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bookingTest",
                                "bcv",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Blood Group</label>
                          <input
                            type="text"
                            value={formData.presentPregnancyHistory.bloodGroup}
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "bloodGroup",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Genotype</label>
                          <input
                            type="text"
                            value={formData.presentPregnancyHistory.genoType}
                            onChange={(e) =>
                              handleChange(e, [
                                "presentPregnancyHistory",
                                "genoType",
                              ])
                            }
                          />
                        </div>
                      </div>
                    </Accordion>
                    <Accordion title=" Antenatal Visits ">
                      <AntenatalVisitTable
                        fetchRecord={fetchRecord}
                        catchAddedVisits={catchAddedVisits}
                        visits={formData.antenatalVisits}
                        appointmentId={+localStorage.getItem("appointmentId")}
                        patientId={patientId}
                        id={treatmentId}
                      />
                    </Accordion>
                    <Accordion title="Birth Plan">
                      <div className="form-grid">
                        <div className="field-column">
                          <label>Planned Date of Delivery</label>
                          <input
                            type="date"
                            value={
                              formData.birthPlan.plannedDateOfDelivery?.split(
                                "T"
                              )[0] || ""
                            }
                            onChange={(e) =>
                              handleChange(e, [
                                "birthPlan",
                                "plannedDateOfDelivery",
                              ])
                            }
                          />
                        </div>
                        <div className="field-column">
                          <label>Mode of Delivery</label>
                          <select
                            className="input-field"
                            value={formData.birthPlan.modeOfDelivery}
                            onChange={(e) =>
                              handleChange(e, ["birthPlan", "modeOfDelivery"])
                            }
                          >
                            <option value="">--Select--</option>
                            <option value={1}>Vaginal</option>
                            <option value={2}>Cesarean - elective</option>
                            <option value={3}>Assisted - emergency</option>
                            <option value={4}>Trial of labour</option>
                            <option value={5}>VBAC</option>
                          </select>
                        </div>
                        <div className="field-column">
                          <label>Category</label>
                          <select
                            className="input-field"
                            value={formData.birthPlan.category}
                            onChange={(e) =>
                              handleChange(e, ["birthPlan", "category"])
                            }
                          >
                            <option value="">--Select--</option>
                            <option value={1}>Primpara</option>
                            <option value={2}>Multipara</option>
                            <option value={2}>Grandmultipara</option>
                          </select>
                        </div>
                        <div className="field-column">
                          <label>Type of Pregnancy</label>
                          <select
                            className="input-field"
                            value={formData.birthPlan.typeOfPregnancy}
                            onChange={(e) =>
                              handleChange(e, ["birthPlan", "typeOfPregnancy"])
                            }
                          >
                            <option value="">--Select--</option>
                            <option value={"Singleton"}>Singleton</option>
                            <option value={"Twins"}>Twins</option>
                            <option value={"Triplets"}>Triplets</option>
                            <option value={"Quadriplets"}>Quadriplets</option>
                            {/* <option value={'Singleton'}>Borderline</option> */}
                          </select>
                          {/* <input
                  type="text"
                  value={formData.birthPlan.typeOfPregnancy}
                  onChange={(e) =>
                    handleChange(e, ["birthPlan", "typeOfPregnancy"])
                  }
                /> */}
                        </div>
                        <div className="field-column">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.birthPlan.episiotomyNeeded}
                              onChange={(e) =>
                                handleChange(e, [
                                  "birthPlan",
                                  "episiotomyNeeded",
                                ])
                              }
                            />
                            Episiotomy Needed
                          </label>
                        </div>
                        <div className="field-column">
                          <label>Clinical Pelvimetry</label>
                          <select
                            className="input-field"
                            value={formData.birthPlan.clinicalPelvimetry}
                            onChange={(e) =>
                              handleChange(e, [
                                "birthPlan",
                                "clinicalPelvimetry",
                              ])
                            }
                          >
                            <option value="">--Select--</option>
                            <option value={1}>Adequate</option>
                            <option value={2}>Inadequate</option>
                            <option value={2}>Borderline</option>
                          </select>
                        </div>
                        <div className="field-column">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.birthPlan.deliveryListReceived}
                              onChange={(e) =>
                                handleChange(e, [
                                  "birthPlan",
                                  "deliveryListReceived",
                                ])
                              }
                            />
                            Delivery List Received
                          </label>
                        </div>
                      </div>
                    </Accordion>
                    {/* <Accordion title=" Postnatal Care">
                <div className="form-grid">
                  <div className="field-column">
                    <label>Date of Delivery</label>
                    <input
                      type="date"
                      value={
                        formData.postnatalCare.dateOfDelivery?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "dateOfDelivery"])
                      }
                    />
                  </div>
                  <div className="field-column">
                    <label>Mode of Delivery</label>
                    <select
                      className="input-field"
                      value={formData.postnatalCare.modeOfDelivery}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "modeOfDelivery"])
                      }
                    >
                      <option value={1}>Vaginal</option>
                      <option value={2}>Cesarean - elective</option>
                      <option value={3}>Assisted - emergency</option>
                      <option value={4}>Trial of labour</option>
                      <option value={5}>VBAC</option>
                    </select>
                  </div>
                  <div className="field-column">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.postnatalCare.episiotomy}
                        onChange={(e) =>
                          handleChange(e, ["postnatalCare", "episiotomy"])
                        }
                      />
                      Episiotomy Done
                    </label>
                  </div>
                  <div className="field-column">
                    <label>Complication</label>
                    <input
                      type="text"
                      value={formData.postnatalCare.complication}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "complication"])
                      }
                    />
                  </div>
                  <div className="field-column">
                    <label>Sex of Baby</label>
                    <select
                      className="input-field"
                      value={formData.postnatalCare.sexOfBaby}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "sexOfBaby"])
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="field-column">
                    <label>Weight of Baby (kg)</label>
                    <input
                      type="number"
                      value={formData.postnatalCare.weightOfBabyKg}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "weightOfBabyKg"])
                      }
                    />
                  </div>
                  <div className="field-column">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.postnatalCare.breastfeedingWell}
                        onChange={(e) =>
                          handleChange(e, ["postnatalCare", "breastfeedingWell"])
                        }
                      />
                      Breastfeeding Well
                    </label>
                  </div>
                  <div className="field-column">
                    <label>Condition of Baby</label>
                    <input
                      type="text"
                      value={formData.postnatalCare.conditionOfBaby}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "conditionOfBaby"])
                      }
                    />
                  </div>
                  <div className="field-column">
                    <label>Condition of Mother</label>
                    <input
                      type="text"
                      value={formData.postnatalCare.conditionOfMother}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "conditionOfMother"])
                      }
                    />
                  </div>
                  <div className="field-column">
                    <label>Family Planning Choice</label>
                    <input
                      type="text"
                      value={formData.postnatalCare.familyPlanningChoice}
                      onChange={(e) =>
                        handleChange(e, ["postnatalCare", "familyPlanningChoice"])
                      }
                    />
                  </div>
                </div>
                {!treatmentId && (
                  <button
                    className="submit-btn"
                    type="submit"
                    style={{ marginTop: "20px" }}
                  >
                    Submit
                  </button>
                )}
              </Accordion> */}
                    {!treatmentId && (
                      <div className="flex-row-gap">
                        <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("saved")}
                        >
                          Save
                        </button>
                        <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("submitted")}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {isEdit && formData.status !== "submitted" && (
                      <div className="flex-row-gap">
                        <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("saved")}
                        >
                          Update Record
                        </button>
                        <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("submitted")}
                        >
                          Submit Record
                        </button>
                      </div>
                    )}
                    {isEdit && formData.status == "submitted" && (
                      <div className="flex-row-gap">
                        <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("saved")}
                        >
                          Update Record
                        </button>
                        {/* <button
                          className="submit-btn"
                          type="submit"
                          style={{ marginTop: "20px" }}
                          onClick={() => handleSubmit("submitted")}
                        >
                          Submit Record
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {treatmentId && dataFromLab && (
                <div className="field-column">
                  <label>Patient's Lab Results</label>
                  <LabRequestTable
                    data={dataFromLab}
                    isFamily={"Antenatal"}
                    treatmentId={treatmentId}
                  />
                </div>
              )}
              {treatmentId && (
                <MedicationTable
                  data={{
                    treatmentType: "antenatal",
                    treatmentId: treatmentId,
                  }}
                />
              )}
             
             
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <AntenatalLabourMonitoring />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <DeliveryForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Antinatal;

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

const StepsComponent = ({ steps, onStepChange }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index) => {
    setActiveStep(index);
    onStepChange(index);
  };

  return (
    <div
      className="steps-wrapper"
      style={{ display: "flex", margin: "20px 0" }}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          onClick={() => handleStepClick(index)}
          style={{
            flex: 1,
            padding: "10px 0",
            textAlign: "center",
            cursor: "pointer",
            background: index === activeStep ? "#3498db" : "#ecf0f1",
            color: index === activeStep ? "#fff" : "#333",
            borderRadius: "4px",
            marginRight: index !== steps.length - 1 ? "10px" : "0",
            transition: "all 0.3s ease",
          }}
        >
          {step}
        </div>
      ))}
    </div>
  );
};