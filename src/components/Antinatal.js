import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import MedicationTable from "./MedicationTable";
import AntenatalVisitTable from "./AntenatalVisitTabls";
import { get, post } from "../utility/fetch";
import LabRequestTable from "./LabRequestTable";
import { usePatient } from "../contexts";

const Antinatal = () => {
  const { patientId, setPatientId, patientInfo, patientName, setDiagnosis, setHmoDetails, appointmentId } = usePatient();
  const treatmentId = patientInfo?.id;
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [vitals, setvitals] = useState();
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);

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

  console.log("FormData:", appointmentId, patientInfo);

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
    patientId: +patientId,
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
      plannedDateOfDelivery: "",
      modeOfDelivery: 1,
      category: 1,
      typeOfPregnancy: "",
      episiotomyNeeded: true,
      clinicalPelvimetry: 1,
      deliveryListReceived: true,
    },
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
    appointmentId: +appointmentId,
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
        `/patients/list/antenatal/${treatmentId}/is-family-medicine/false/1/10/antenatal-patients-lab-requests`
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
    console.log("FormData:", formData);

    try {
      const response = await post(
        `/Antenatal`,
        formData // send formData directly
      );

      if (response?.data.isSuccess) {
        toast.success("Submitted successfully");

        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }

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
              response?.data.birthPlan?.plannedDateOfDelivery || "",
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

          postnatalCare: {
            dateOfDelivery: response?.data.postnatalCare?.dateOfDelivery || "",
            modeOfDelivery: response?.data.postnatalCare?.modeOfDelivery || 1,
            episiotomy: response?.data.postnatalCare?.episiotomy ?? true,
            complication: response?.data.postnatalCare?.complication || "",
            sexOfBaby: response?.data.postnatalCare?.sexOfBaby || "",
            weightOfBabyKg: response?.data.postnatalCare?.weightOfBabyKg || 0,
            breastfeedingWell:
              response?.data.postnatalCare?.breastfeedingWell ?? true,
            conditionOfBaby:
              response?.data.postnatalCare?.conditionOfBaby || "",
            conditionOfMother:
              response?.data.postnatalCare?.conditionOfMother || "",
            familyPlanningChoice:
              response?.data.postnatalCare?.familyPlanningChoice || "",
          },

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
      generalSurgeryId: 0,
      pediatricId: 0,
      generalPracticeId: 0,
      antenatalId: +treatmentId || 0,
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

  const catchAddedVisits = (data) => {
    setFormData({ ...formData, antenatalVisits: data });
  };

  const fetchTreatmentVitalsRecord = async () => {
    //   setLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${+appointmentId}&pageIndex=1&pageSize=10`
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
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  return (
    <div className="w-100" style={{ paddingTop: "60px" }}>
      <div class="flex space-between align-center">
        <div class="flex" style={{ padding: "20px" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>

        <h3>{patientName}</h3>
        
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="section-box">
            <h2 style={{ textAlign: "center" }} className="w-100">
              Antenatal
            </h2>

            <div className="flex-row-gap-start m-t-20">
              <div className="w-100">
                {/* <h2>1. Past History</h2> */}

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
                        onChange={(e) => handleChange(e, ["familyHistory"])}
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
                        {formData?.obstetricHistories?.map((item, index) => (
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
                                  value={obstetricEntry.gestationalAgeWeek}
                                  onChange={(e) =>
                                    setObstetricEntry({
                                      ...obstetricEntry,
                                      gestationalAgeWeek: +e.target.value,
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
                                  value={obstetricEntry.durationOfLabour}
                                  onChange={(e) =>
                                    setObstetricEntry({
                                      ...obstetricEntry,
                                      durationOfLabour: e.target.value,
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
                                  value={obstetricEntry.modeOfDelivery}
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
                                  <option value="Female">Female</option>
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
                                  <button onClick={() => saveEdit(index)}>
                                    💾
                                  </button>
                                  <button onClick={cancelEdit}>❌</button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(index, item)}
                                  >
                                    ✏️
                                  </button>
                                  <button onClick={() => deleteEntry(index)}>
                                    🗑️
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
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
              {/* <VitalsRecords vitals={vitals} /> */}
            </div>
            <Accordion title="Present Pregnancy History">
              <div className="form-grid">
                <div className="field-column">
                  <label>Last Menstrual Period (LMP)</label>
                  <input
                    type="date"
                    value={
                      formData.presentPregnancyHistory?.lastMenstrualPeriod
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
                      formData.presentPregnancyHistory?.expectedDateOfDelivery
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
                    type="date"
                    value={
                      formData.presentPregnancyHistory?.expectedDateOfDelivery
                    }
                    onChange={(e) =>
                      handleChange(e, [
                        "presentPregnancyHistory",
                        "expectedDateOfDelivery",
                      ])
                    }
                  />
                </div>
              </div>

              <h4 style={{ margin: "20px 0px" }}>Booking Test Results</h4>
              <div className="form-grid">
                <div className="field-column">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.presentPregnancyHistory?.weightKg}
                    onChange={(e) =>
                      handleChange(e, ["presentPregnancyHistory", "weightKg"])
                    }
                  />
                </div>
                <div className="field-column">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={formData.presentPregnancyHistory?.heightCm}
                    onChange={(e) =>
                      handleChange(e, ["presentPregnancyHistory", "heightCm"])
                    }
                  />
                </div>
                <div className="field-column">
                  <label>BMI</label>
                  <input
                    type="number"
                    value={formData.presentPregnancyHistory?.bmi}
                    onChange={(e) =>
                      handleChange(e, ["presentPregnancyHistory", "bmi"])
                    }
                  />
                </div>
                <div className="field-column">
                  <label>PCV</label>
                  <input
                    type="text"
                    value={formData.presentPregnancyHistory?.bookingTest.pcv}
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
                    value={formData.presentPregnancyHistory?.bookingTest.glu}
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
                    value={formData.presentPregnancyHistory?.bookingTest.prot}
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
                    value={formData.presentPregnancyHistory?.bookingTest.vdrl}
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
                    value={formData.presentPregnancyHistory?.bookingTest.hiv}
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
                    value={formData.presentPregnancyHistory?.bookingTest.hbv}
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
                    value={formData.presentPregnancyHistory?.bookingTest.bcv}
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
                      handleChange(e, ["presentPregnancyHistory", "bloodGroup"])
                    }
                  />
                </div>
                <div className="field-column">
                  <label>Genotype</label>
                  <input
                    type="text"
                    value={formData.presentPregnancyHistory.genoType}
                    onChange={(e) =>
                      handleChange(e, ["presentPregnancyHistory", "genoType"])
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
                appointmentId={+appointmentId}
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
                      formData.birthPlan.plannedDateOfDelivery?.split("T")[0] ||
                      ""
                    }
                    onChange={(e) =>
                      handleChange(e, ["birthPlan", "plannedDateOfDelivery"])
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
                    onChange={(e) => handleChange(e, ["birthPlan", "category"])}
                  >
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
                        handleChange(e, ["birthPlan", "episiotomyNeeded"])
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
                      handleChange(e, ["birthPlan", "clinicalPelvimetry"])
                    }
                  >
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
                        handleChange(e, ["birthPlan", "deliveryListReceived"])
                      }
                    />
                    Delivery List Received
                  </label>
                </div>
              </div>
            </Accordion>
            <Accordion title=" Postnatal Care">
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
            </Accordion>
          </div>
        </div>
      </form>

      {treatmentId && dataFromLab && (
        <div className="field-column">
          <label>Patient's Lab Results</label>
          <LabRequestTable data={dataFromLab} isFamily={false} />
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
