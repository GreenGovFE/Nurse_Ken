import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import TagInputs from "../layouts/TagInputs";
import { usePatient } from "../../contexts";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import AdministerMed from "./AdministerMed";

function NurseNotesAdd({ closeModal, treatment, doctors, nurses, fetch, currentPage }) {
    const [payload, setPayload] = useState({});
    const { patientName } = usePatient();
    const [loading, setLoading] = useState(false);
    const [showAdministerMed, setShowAdministerMed] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [source, setSource] = useState('')
    const medications = treatment?.medications || [];
    const otherMedications = treatment?.otherMedications || [];
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

    console.log('medications', medications);

    const handleAdministerMed = (medication, source) => {
        setSelectedMedication(medication);
        setSource(source)
        setShowAdministerMed(true);
    };

    const handleChange = (event, name) => {
        if (name === "nurse") {
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

    const doctorname = getDoctorName(treatment?.doctorId);

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={() => closeModal(false)} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Patient's Medications</p> | <p className={'m-l-10'}>{patientName}</p>
                    </div>
                </div>

                {/* <TagInputs
                    type={'R-select'}
                    options={nurses?.map((nurse) => ({ label: nurse?.name, value: nurse?.value }))}
                    label="Administering Nurse"
                    name="nurse"
                    onChange={(e) => handleChange(e, 'nurse')}
                /> */}
                <TagInputs
                    label="Assigned Doctor"
                    value={treatment?.doctor?.firstName + ' ' + treatment?.doctor?.lastName}
                    name="additionalNoteOnTreatment"
                    readOnly={true}
                />

                {medications.length > 0 && (
                    <>
                        <h4>Medications</h4>
                        <table className="bordered-table-2 m-t-20">
                            <thead>
                                <tr>
                                    <th>Medication</th>
                                    <th>Quantity</th>
                                    <th>Duration</th>
                                    <th>Route</th>
                                    <th>Frequency of Administration</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medications.map((medication) => (
                                    <tr key={medication?.id}>
                                        <td>{medication?.pharmacyInventory?.productName}</td>
                                        <td>{medication?.quantity} {drugStrengthUnits.find(unit => unit.id === medication?.drugStrengthUnit)?.name || 'N/A'}</td>
                                        <td>{medication?.duration} days </td>
                                        <td>{routesOfAdministration.find(route => route.id === medication.routeOfAdministration)?.name || 'N/A'}</td>
                                        <td>{administrationFrequencies.find(freq => freq.id === medication.administrationFrequency)?.name || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="save-drafts"
                                                onClick={() => handleAdministerMed(medication, 'Medications')}
                                            >
                                                Administer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {otherMedications.length > 0 && (
                    <>
                        <h4>Other Medications</h4>
                        <table className="bordered-table-2 m-t-20">
                            <thead>
                                <tr>
                                    <th>Medication</th>
                                    <th>Quantity</th>
                                    <th>Duration</th>
                                    <th>Route of Administration</th>
                                    <th>Frequency of Administration</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {otherMedications.map((medication) => (
                                    <tr key={medication?.id}>
                                        <td>{medication?.name}</td>
                                        <td>{medication?.quantity} {drugStrengthUnits.find(unit => unit.id === medication?.drugStrengthUnit)?.name || 'N/A'}</td>
                                        <td>{medication?.duration} days</td>
                                        <td>{routesOfAdministration.find(route => route.id === medication.routeOfAdministration)?.name || 'N/A'}</td>
                                        <td>{administrationFrequencies.find(freq => freq.id === medication.administrationFrequency)?.name || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="save-drafts"
                                                onClick={() => handleAdministerMed(medication, 'OtherMedications')}
                                            >
                                                Administer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* <div className="">
                    <TagInputs
                        label="Administering Nurse's Comment"
                        name="note"
                        value={payload.note}
                        onChange={(e) => handleChange(e, 'note')}
                        type='textArea'
                    />
                    <SpeechToTextButton onTranscript={handleTranscript} />
                </div> */}


                {showAdministerMed && (
                    <AdministerMed
                        medication={selectedMedication}
                        treatment={treatment}
                        nurses={nurses}
                        source={source}
                        closeModal={() => setShowAdministerMed(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default NurseNotesAdd;
