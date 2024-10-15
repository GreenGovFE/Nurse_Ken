import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import axios from "axios";
import notification from "../../utility/notification";
import UpdatePaymentModal from "../modals/UpdatePayment";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";

function DetailedNotes({ closeModal, treatment, notes, doctors, nurses,   }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);

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
        console.log(payload)
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
                console.log(res)
                notification({ message: 'Added notes successfully', type: "success" });
            })
            .catch(err => {
                notification({ message: 'Failed to add notes', type: "error" });
                console.log(err)
            })
    }

    const getNurseName = (nurseId) => {
        const nurse = nurses?.find((nurse) => nurse?.nurseEmployeeId === nurseId);
        return nurse ? nurse?.username : "Nurse Not Found";
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors?.find((doctor) => doctor?.doctorEmployeeId === doctorId);
        return doctor ? doctor?.username : "None Assigned";
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "doctorId" || name === "nurseId") {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
        }
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
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
                                <th>Weight</th>
                                <th>Temp</th>
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
                            {/* <th>Notes</th> */}
                        </tr>
                    </thead>
                    <tbody className="white-bg view-det-pane">
                        <tr>
                            <td>{treatment.diagnosis}</td>
                            <td>
                                {treatment.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.name}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {treatment.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.dosage?.frequency}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {treatment.medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.dosage?.quantity}</span>
                                    </div>
                                ))}
                            </td>
                            {/* <td>{treatment.additonalNote}</td> */}
                        </tr>
                    </tbody>
                </table>

                <div className="flex">
                    <div className="m-r-20">
                        <TagInputs label="Comments" name="additionalNoteOnTreatment" value={Array.isArray(notes) ? notes?.map((note) => (note)) : ''} readOnly={true} type='textArea' />
                    </div>
                    <TagInputs label="Administration Status" name="additionalNoteOnTreatment" value={Array.isArray(notes) ? notes?.map((note) => (note)) : ''} readOnly={true} type='textArea' />
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
