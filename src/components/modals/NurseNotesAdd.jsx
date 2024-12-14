import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import axios from "axios";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";
import { usePatient } from "../../contexts";

function NurseNotesAdd({ closeModal, treatment, doctors, nurses, fetch, currentPage }) {
    const [payload, setPayload] = useState({});
    const { patientId, patientName } = usePatient();
    const [loading, setLoading] = useState(false)

    const requiredFields = {
        nurse: "Administering Nurse",
        note: "Additional Notes",
    };

    const checkMissingFields = (payload) => {
        const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
        return missingFields;
    };


    const addNotes = () => {
        setLoading(true)
        const data = {
            nurseId: payload?.nurse,
            treatmentId: treatment?.id,
            note: payload?.note
        }
        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            return;
        }
        post(`/patients/add-nurse-treatment-note`, data)
            .then(res => {
                notification({ message: 'Added notes successfully', type: "success" });
                fetch(currentPage)
                closeModal()
                setLoading(false)
            })
            .catch(err => {
                notification({ message: 'Failed to add notes', type: "error" });
                setLoading(false)
            })
    }

    const handleChange = (event, name) => {
        if (name === "doctorId" || name === "nurse") {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(event?.value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: event?.target?.value }));
        }
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors?.find((doctor) => doctor?.value === Number(doctorId));
        return doctor ? doctor?.name : "Doctor Not Found";
    };

    const doctorname = getDoctorName(treatment?.doctorId)

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={() => closeModal(false)} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex  flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Nurse Notes</p> | <p className={'m-l-10'}>{patientName}</p>
                    </div>

                </div>
                {/* <div>
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">Date</th>
                                <th className="center-text">Age</th>
                                <th className="center-text">Blood Pressure (mmHg)</th>
                                <th className="center-text">Weight (Kg)</th>
                                <th className="center-text">Temp</th>
                                <th className="center-text">Height</th>
                                <th className="center-text">Heart</th>
                                <th className="center-text">Resp</th>
                                <th className="center-text">Admin Nurse</th>
                            </tr>
                        </thead>
                        <tbody className="white-bg view-det-pane">
                            <tr >
                                <td>{new Date(treatment?.dateOfVisit).toLocaleDateString()}</td>
                                <td>{treatment?.age}</td>
                                <td>{treatment?.bloodPressure}</td>
                                <td>{treatment?.weight}</td>
                                <td>{treatment?.temperature}</td>
                                <td>{treatment?.height}</td>
                                <td>{treatment?.heartPulse}</td>
                                <td>{treatment?.respiratory}</td>
                                <td>{treatment?.nurseName}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                <TagInputs type={'R-select'} options={nurses?.map((nurse) => {
                    return {
                        label: nurse?.name,
                        value: nurse?.value
                    }
                })} label="Administering Nurse" name="nurse" onChange={(e) => handleChange(e, 'nurse')} />
                <TagInputs options={doctors} label="Assigned Doctor" value={doctorname} name="additionalNoteOnTreatment" readOnly={true} />



                <table className="bordered-table-2 m-t-20">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="w-20" rowSpan="2">Diagnosis</th>
                            <th rowSpan="2">Prescription</th>
                            <th colSpan="3" className="center-text">Dosage</th> {/* Dosage header spanning two columns */}
                        </tr>
                        <tr className="">
                            <th>Frequency</th>
                            <th>Quantity</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody className="white-bg view-det-pane">
                        <tr>
                            <td>{treatment?.diagnosis}</td>
                            <td>
                                {treatment?.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.name}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {treatment?.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.frequency}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {treatment?.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.quantity}</span>
                                    </div>
                                ))}
                            </td>
                            <td>{treatment?.pharmacistNote}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="">

                    <TagInputs label="Administering Nurse's Comment" name="note" onChange={(e) => handleChange(e, 'note')} type='textArea' />
                </div>
                <button className="submit-btn m-t-20 w-100" onClick={addNotes}>Add Notes</button>


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

export default NurseNotesAdd;
