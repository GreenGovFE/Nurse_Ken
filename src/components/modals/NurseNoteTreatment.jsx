import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';

import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import notification from '../../utility/notification';

function NurseNoteTreatment({ closeModal, visit, notes, add, doctors, nurses, fetch, currentPage }) {

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
            treatmentId: visit.id,
            additionalNoteOnTreatment: payload?.additionalNoteOnTreatment
        }
        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            return;
        }
        post(`/patients/${visit.patientId}/addpatientnote`, data)
            .then(res => {
                notification({ message: 'Added notes successfully', type: "success" });
            })
            .catch(err => {
                notification({ message: 'Failed to add notes', type: "error" });
            })
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "doctorId" || name === "nurseId") {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
        }
    };

    
    
    
    const getDoctorName = (doctorId) => {
        const doctor = doctors?.find((doctor) => doctor?.value === Number(doctorId));
        return doctor ? doctor?.name : "Doctor Not Found";
    };
    
    const doctorname = getDoctorName(visit?.doctorId)
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20  m-l-30 col-6">
                        {add !== true ?
                            <p>Nurse Notes</p>
                            :
                            <p>Nurse Notes/Observations</p>
                        }
                    </div>
                </div>
                <div className="p-20">
                    <div>
                        {add === true &&
                            <div>
                                <div className="">
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
                                                <td>{new Date(visit.dateOfVisit).toLocaleDateString()}</td>
                                                <td>{visit.age}</td>
                                                <td>{visit.weight}</td>
                                                <td>{visit.temperature}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <TagInputs type='select' label="Administering Nurse" onChange={handleChange} options={nurses} name="nurseId" />
                                    <TagInputs type='select' label="Assigned Doctor" onChange={handleChange} options={doctors} name="doctorId" />
                                </div>
                                <TagInputs label="Additional Notes" name="additionalNoteOnTreatment" onChange={handleChange} type='textArea' />
                                <button className="submit-btn m-t-20 w-100" onClick={addNotes}>Add Notes</button>
                            </div>
                        }
                    </div>
                    {add !== true &&
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
                                        <td>{new Date(visit.dateOfVisit).toLocaleDateString()}</td>
                                        <td>{visit.age}</td>
                                        <td>{visit.weight}</td>
                                        <td>{visit.temperature}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <TagInputs label="Administering Nurse" value={visit?.nurseName} onChange={handleChange} options={nurses} disabled={true} name="nurseId" />
                            <TagInputs label="Assigned Doctor" value={doctorname} onChange={handleChange} options={doctors} name="doctorId" />
                            <TagInputs label="Nurse Notes" name="additionalNoteOnTreatment" value={Array.isArray(notes) ? notes?.map((note) => (note)) : ''} readOnly={true} type='textArea' />
                            <div className='m-t-20'>
                                {visit?.immunizationDocuments?.map((item, index) => (
                                    <div key={index} className="m-t-10 flex">
                                        <a href={item.docPath} target="_blank" className="m-r-10" rel="noopener noreferrer">
                                            {item.docName}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default NurseNoteTreatment;
