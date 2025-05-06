import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import axios from "axios";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";
import { usePatient } from "../../contexts";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

function AdministerMed({ closeModal, treatment, doctors, nurses, fetch, currentPage }) {
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

    const medications = [...(treatment?.medications || []), ...(treatment?.otherMedications || [])];

    const administerMed = async () => {
        setLoading(true);
        const data = {
            administeredBy: nurses.find(nurse => nurse.value === payload.nurse)?.label,
            treatmentId: treatment?.id,
            patientId: patientId,
            clinicId: Number(sessionStorage.getItem("clinicId")),
            otherNotes: payload?.otherNotes,
            units: payload?.units,
            administeredDate: payload?.administeredDate,
            administeredTime: payload?.administeredTime,
            volumeGiven: payload?.volumeGiven,
            medicationName: payload?.medicationName,
            medicationSource: payload?.medicationSource,
            medicationId: payload?.medicationId || 0,
        };

        const requiredFields = {
            nurse: "Administering Nurse",
            otherNotes: "Additional Notes",
            units: "Units",
            administeredDate: "Administered Date",
            administeredTime: "Administered Time",
            volumeGiven: "Volume Given",
            medicationName: "Medication Name",
            medicationSource: "Medication Source",
        };

        const checkMissingFields = (payload) => {
            const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
            return missingFields;
        };

        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            setLoading(false);
            return;
        }

        try {
            const res = await post(`/patients/prescription-log`, data);
            if (res?.message === "Successfully logged medication") {
                notification({ message: 'Medication administered successfully', type: "success" });
                fetch(currentPage);
                closeModal();
            } else {
                notification({ message: 'Failed to administer medication', type: "error" });
            }
        } catch (err) {
            notification({ message: 'Failed to administer medication', type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event, name) => {
        if (name === "doctorId" || name === "nurse") {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(event?.value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: event?.target?.value }));
        }
    };

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, note: prevPayload.note ? prevPayload.note + ' ' + transcript : transcript }));
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors?.find((doctor) => doctor?.value === Number(doctorId));
        return doctor ? doctor?.name : "Doctor Not Found";
    };

    const doctorname = getDoctorName(treatment?.doctorId)

    console.log(medications, 'medications')

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={() => closeModal(false)} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex  flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Adminster Medication</p> | <p className={'m-l-10'}>{patientName}</p>
                    </div>

                </div>

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
                            <th colSpan="4" className="center-text">Dosage</th>
                        </tr>
                        <tr className="">
                            <th>Frequency</th>
                            <th>Quantity</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="white-bg view-det-pane">
                        <tr>
                            <td>{treatment?.diagnosis}</td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{item?.pharmacyInventory?.productName}</span>
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
                            <td>{treatment?.pharmacistNote}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="">
                    <GhostTextCompletion
                        label="Adminstering Nurse's Comment"
                        name="notes"
                        value={payload?.note}
                        handleChange={(e) => handleChange(e, 'note')}
                    />
                </div>
                <button className="submit-btn m-t-20 w-100" onClick={administerMed}>Add Notes</button>


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

export default AdministerMed;
