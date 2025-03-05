import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";

function DetailedNotes({ closeModal, treatment, notes, doctors, nurses, }) {
    const [payload, setPayload] = useState({});

    const requiredFields = {
        doctorId: "Assigned Doctor",
        nurseId: "Administering Nurse",
        additionalNoteOnTreatment: "Additional Notes",
    };

    const checkMissingFields = (payload) => {
        const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
        return missingFields;
    };

    const addNotes = () => {
        const data = {
            doctorId: payload?.doctorId,
            nurseId: payload?.nurseId,
            treatmentId: treatment.id,
            additionalNoteOnTreatment: payload?.additionalNoteOnTreatment
        }
        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            return;
        }
        post(`/patients/${treatment.patientId}/addpatientnote`, data)
            .then(res => {
                notification({ message: 'Added notes successfully', type: "success" });
            })
            .catch(err => {
                notification({ message: 'Failed to add notes', type: "error" });
            })
    }

    const medications = [...(treatment?.medications || []), ...(treatment?.otherMedications || [])];

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex space-between flex-v-center m-t-20 m-l-10 col-5">
                        <p>Prescription Details</p>
                    </div>
                </div>
                <div>
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-20">Date</th>
                                <th>Age</th>
                                <th>Weight (kg)</th>
                                <th>Temp (°C)</th>
                            </tr>
                        </thead>
                        <tbody className="white-bg view-det-pane">
                            <tr >
                                <td>{new Date(treatment.dateOfVisit).toLocaleDateString()}</td>
                                <td>{treatment.age}</td>
                                <td>{treatment.weight}</td>
                                <td>{treatment.temperature}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="bordered-table-2 m-t-40">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="w-20" rowSpan="2">Diagnosis</th>
                            <th rowSpan="2">Prescription</th>
                            <th colSpan="3" className="center-text">Dosage</th> {/* Dosage header spanning two columns */}
                        </tr>
                        <tr className="">
                            <th>Frequency</th>
                            <th>Quantity</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody className="white-bg view-det-pane">
                        <tr>
                            <td>{treatment?.diagnosis}</td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.name}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.frequency} times daily</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.quantity}mg</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.duration} days</span>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex">
                    <div className="m-r-20">
                        <TagInputs label="Vital Nurse's Comment" name="additionalNoteOnTreatment" value={Array.isArray(notes) ? notes?.map((note) => (note)) : ''} readOnly={true} type='textArea' />
                    </div>
                    <TagInputs label="Care Plan" name="carePlan" value={treatment?.carePlan} readOnly={true} type='textArea' />
                </div>

                <div className='m-t-20'>
                    {treatment?.immunizationDocuments?.map((item, index) => (
                        <div key={index} className="m-t-10 flex">
                            <a href={item?.docPath} target="_blank" className="m-r-10" rel="noopener noreferrer">
                                {item?.docName}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DetailedNotes;
