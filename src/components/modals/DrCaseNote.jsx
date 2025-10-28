import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";

import { formatDate } from "../../utility/general";
import TagInputs from "../layouts/TagInputs";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";

function DrCaseNote({
  closeModal,
  visit,
  notes,
  add,
  doctors,
  nurses,
  fetch,
  currentPage,
}) {
  const [payload, setPayload] = useState({});
  const [specialistData, setSpecialistData] = useState(null);

  useEffect(() => {
    // Map of specialist keys to endpoint names
    const specialistMap = [
      { key: "ophthalmologyId", endpoint: "Ophthalmology" },
      { key: "familyMedicineId", endpoint: "FamilyMedicine" },
      { key: "oG_IVFId", endpoint: "OG_IVF" },
      { key: "oG_BirthRecordId", endpoint: "OG_BirthRecord" },
      { key: "orthopedicId", endpoint: "Orthopedic" },
      { key: "generalSurgeryId", endpoint: "GeneralSurgery" },
      { key: "pediatricId", endpoint: "Pediatric" },
      { key: "generalPracticeId", endpoint: "GeneralPractice" },
      { key: "antenatalId", endpoint: "Antenatal" },
      { key: "cardiologyId", endpoint: "Cardiology" },
      // Add more mappings as needed
    ];

    if (notes) {
      for (const { key, endpoint } of specialistMap) {
        if (notes[key] && notes[key] !== 0) {
          get(`/${endpoint}/${notes[key]}`)
            .then((res) => {
              console.log("Specialist Data:", res.data);
              setSpecialistData(res?.data);
            })
            .catch(() => setSpecialistData(null));
          break;
        }
      }
    }
  }, [notes]);

  const requiredFields = {
    doctorId: "Assigned Doctor",
    nurseId: "Administering Nurse",
    additionalNoteOnTreatment: "Additional Notes",
  };

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !payload[field]
    );
    return missingFields;
  };

  const addNotes = () => {
    const data = {
      doctorId: payload?.doctorId,
      nurseId: payload?.nurseId,
      treatmentId: visit.id,
      additionalNoteOnTreatment: payload?.additionalNoteOnTreatment,
    };
    const missingFields = checkMissingFields(payload);
    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map(
        (field) => requiredFields[field]
      );
      notification({
        message: `Missing required fields: ${missingFieldLabels.join(", ")}`,
        type: "error",
      });
      return;
    }
    post(`/patients/${visit.patientId}/addpatientnote`, data)
      .then((res) => {
        notification({ message: "Added notes successfully", type: "success" });
      })
      .catch((err) => {
        notification({ message: "Failed to add notes", type: "error" });
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "doctorId" || name === "nurseId") {
      setPayload((prevPayload) => ({ ...prevPayload, [name]: Number(value) }));
    } else {
      setPayload((prevPayload) => ({ ...prevPayload, [name]: value }));
    }
  };

  console.log("notes", notes);

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(
      (doctor) => doctor?.value === Number(doctorId)
    );
    return doctor ? doctor?.name : "Doctor Not Found";
  };

  const doctorname = getDoctorName(visit?.doctorId);
return (
    <div className="overlay">
        <RiCloseFill className="close-btn pointer" onClick={closeModal} />
        <div className="modal-contents" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            {specialistData && (
                <div className="m-t-20">
                    <h4>Specialist Data</h4>
                    <div
                        className="flex flex-column gap-20"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <div className="flex gap-10">
                            <TagInputs
                                label="Patient Name"
                                value={
                                    specialistData?.patient
                                        ? `${specialistData.patient.firstName} ${specialistData.patient.lastName}`
                                        : ""
                                }
                                readOnly={true}
                            />
                            <TagInputs
                                label="Patient Ref"
                                value={specialistData?.patient?.patientRef || ""}
                                readOnly={true}
                            />
                            <TagInputs
                                label="Date Created"
                                value={
                                    specialistData?.createdAt
                                        ? new Date(specialistData.createdAt).toLocaleDateString()
                                        : ""
                                }
                                readOnly={true}
                            />
                        </div>
                        <TagInputs
                            label="Doctor"
                            value={
                                specialistData?.doctor
                                    ? `${specialistData.doctor.firstName} ${specialistData.doctor.lastName}`
                                    : ""
                            }
                            readOnly={true}
                        />
                        <TagInputs
                            type="textArea"
                            label="Diagnosis"
                            value={specialistData?.diagnosis || ""}
                            readOnly={true}
                        />
                        <TagInputs
                            type="textArea"
                            label="History"
                            value={specialistData?.history || ""}
                            readOnly={true}
                        />
                        <TagInputs
                            type="textArea"
                            label="Patient Complaint"
                            value={specialistData?.patientComplaint || ""}
                            readOnly={true}
                        />
                        <TagInputs
                            type="textArea"
                            label="Physical Examination"
                            value={specialistData?.physicalExamination || ""}
                            readOnly={true}
                        />
                        <TagInputs
                            type="textArea"
                            label="Investigation"
                            value={specialistData?.investigation || ""}
                            readOnly={true}
                        />
                        {/* <TagInputs
                            label="Action Taken"
                            value={specialistData?.actionTaken || ""}
                            readOnly={true}
                        /> */}
                    </div>
                </div>
            )}
        </div>
    </div>
);
}

export default DrCaseNote;
