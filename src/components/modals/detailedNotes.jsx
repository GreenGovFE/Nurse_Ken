import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";

function DetailedNotes({ closeModal, treatment, notes, doctors, nurses, }) {
    const [payload, setPayload] = useState({});

    const medications = [...(treatment?.medications || []), ...(treatment?.otherMedications || [])];

    const administrationFrequencies = [
        { id: 1, name: 'Immediately' },
        { id: 2, name: 'As needed' },
        { id: 3, name: 'Once daily' },
        { id: 4, name: 'Twice a day' },
        { id: 5, name: 'Three times a day' },
        { id: 6, name: 'Four times a day' },
        { id: 7, name: 'At night' },
        { id: 8, name: 'Morning' },
        { id: 9, name: 'Evening' },
        { id: 10, name: 'Every 24 hours' },
        { id: 11, name: 'Every 12 hours' },
        { id: 12, name: 'Every 8 hours' },
        { id: 13, name: 'Every 6 hours' },
        { id: 14, name: 'Every 4 hours' },
        { id: 15, name: 'Every 3 hours' },
        { id: 16, name: 'Every 2 hours' },
        { id: 17, name: 'Every hour' },
        { id: 18, name: 'Every 2 months' },
        { id: 19, name: 'Every 3 months' },
    ];

    const drugStrengthUnits = [
        { id: 0, name: "Milligrams" },
        { id: 1, name: "Grams" },
        { id: 2, name: "Micrograms" },
        { id: 3, name: "Milliliters" },
        { id: 4, name: "Liters" },
        { id: 5, name: "Units" },
        { id: 6, name: "Puffs" },
        { id: 7, name: "Sprays" },
        { id: 8, name: "Drops" },
        { id: 9, name: "Patch" },
        { id: 10, name: "Bottle" },
        { id: 11, name: "TransdermalSystem" },
        { id: 12, name: "Tablet" },
        { id: 13, name: "Capsule" },
        { id: 14, name: "Suppository" },
        { id: 15, name: "Scoop" },
        { id: 16, name: "Sachet" },
        { id: 17, name: "Ampoule" },
        { id: 18, name: "Vial" },
        { id: 19, name: "InjectionPen" },
        { id: 20, name: "Enema" },
        { id: 21, name: "Ounces" },
        { id: 22, name: "Teaspoon" },
        { id: 23, name: "Tablespoon" },
        { id: 24, name: "Milliequivalents" },
        { id: 25, name: "InternationalUnits" }
    ];


    const routesOfAdministration = [
        { id: 1, name: 'Orally' },
        { id: 2, name: 'Sublingual' },
        { id: 3, name: 'Topical' },
        { id: 4, name: 'Inhalation' },
        { id: 5, name: 'Suppository' },
        { id: 6, name: 'IV' },
        { id: 7, name: 'IM' },
        { id: 8, name: 'Subcut' },
        { id: 9, name: 'Intradermal' },
        { id: 10, name: 'PerRectum' },
        { id: 11, name: 'PerVagina' },
        { id: 12, name: 'Implant' },
    ];

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


    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex space-between flex-v-center m-t-20 m-l-10 col-5">
                        <p>Prescription Details</p>
                    </div>
                </div>

                <table className="bordered-table-2 m-t-40">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="w-20" rowSpan="2">Diagnosis</th>
                            <th rowSpan="2">Prescription</th>
                            <th colSpan="5" className="center-text">Dosage</th> {/* Dosage header spanning two columns */}
                        </tr>
                        <tr className="">
                            <th>Quantity</th>
                            <th>Duration</th>
                            <th>Route</th>
                            <th>Frequency of Administration</th>
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
                                        <span>{item?.quantity} {drugStrengthUnits.find(unit => unit.id === item?.drugStrengthUnit)?.name || 'N/A'}</span>
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
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{routesOfAdministration.find(route => route.id === item.routeOfAdministration)?.name || 'N/A'}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {medications.map((item) => (
                                    <div key={item?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                        <span>{administrationFrequencies.find(route => route.id === item.administrationFrequency)?.name || 'N/A'}</span>
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
