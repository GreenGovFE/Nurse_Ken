import React, { useEffect, useState } from "react";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiDeleteBinLine } from "react-icons/ri";
import { usePatient } from "../../contexts";
import NurseNotesAdd from "./NurseNotesAdd";
import NurseNoteTreatment from "./NurseNoteTreatment";
import Vitals from "../pages/Patient/Vitals"; // Import the Vitals component
import VitalsTreat from "../pages/Patient/VitalsTreatment";
import AddMoreTreatment from "./AddMorePrescription";
import { get, post } from "../../utility/fetch";
import downloadicon from "../../assets/images/download-icon.png";
import { RiFilePaper2Line } from "react-icons/ri";
import { formatDate } from "../../utility/general";

function DetailedNurseNotes({ closeModal, treatment, doctors, nurses, reset }) {
    const [nurseNotesModal, setNurseNotesModal] = useState(false);
    const { patientId, patientName } = usePatient();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notes, setNotes] = useState([]);
    const [viewing, setViewing] = useState({});
    const [add, setAdd] = useState(false);
    const [vitals, setVitals] = useState([]);

    const [showVitalsSection, setShowVitalsSection] = useState(false); // State to toggle vitals section visibility

    const [documentArray, setDocumentArray] = useState([]);
    const [NotesModal, setNotesModal] = useState(false)
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

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const deleteDoc = (doc) => {
        let newArr = documentArray.filter((id) => id.name !== doc);
        setDocumentArray(newArr);
    };

    const getPrescriptionLog = async () => {
        try {
            const res = await get(`/patients/prescription-log-by-service-treatment?serviceTreatmentId=${treatment?.id}`);
            setNotes(res);
            setTotalPages(res.length);
        } catch (error) {
            console.error("Error fetching prescription log:", error);
        }
    };

    const addConsent = async () => {
        const payload = {
            id: 0,
            patientId: Number(patientId),
            clinicId: Number(sessionStorage.getItem("clinicId")),
            appointmentId: treatment?.appointmentId,
            docName: documentArray[0]?.name,
            docPath: documentArray[0]?.path
        };
        try {
            let res = await post(`/patients/AddConsent`, payload);
            if (res?.appointmentId) {
                notification({ message: 'Consent added successfully', type: 'success' });
                setDocumentArray([]);
                reset(true);
            } else {
                notification({ message: 'Failed to add consent', type: 'error' });
            }
        } catch (error) {
            console.error("Error adding consent:", error);
        }
    };

    const getVital = async () => {
        try {
            const res = await get(`/patients/vital-by-appointmentId?appointmentId=${treatment?.appointmentId}&pageIndex=1&pageSize=100`);
            const vital = res?.data?.[0] || {};
            setVitals(vital);
            setTotalPages(res.length);
        } catch (error) {
            console.error("Error fetching prescription log:", error);
        }
    };

    useEffect(() => {
        getPrescriptionLog();
        getVital();
    }, []);

    console.log(vitals, 'vital')

    const selectRecord = (record) => () => {
        setViewing(record);
        setNotesModal(true);
    };

    const currentNote = notes[currentPage - 1];

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex space-between">
                    <div className="flex flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Nurse Notes</p> | <p className="m-l-10">{patientName}</p>
                    </div>
                    <div className="flex flex-v-center m-t-20 m-l-10">
                        <button onClick={() => setNurseNotesModal(true)} className="add-note">
                            Administer Medication
                        </button>
                    </div>
                </div>
                <div>
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
                    <button onClick={() => setAdd(true)} className="submit-btn m-t-10">Add to existing prescriptions</button>

                </div>

                <div className="m-t-20 m-b-10">
                    <h4>First Vital</h4>
                </div>
                <div>
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-10">Date</th>
                                <th>Weight (Kg)</th>
                                <th>Temp (°C)</th>
                                <th>Height (cm)</th>
                                <th>BMI</th>
                                <th>Heart (bpm)</th>
                                <th>Respiratory</th>
                                <th>Blood Pressure (mmHg)</th>
                                <th>ECG</th>
                                <th>Nurse Notes</th>
                                <th>Administered Nurse</th>
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">
                            <tr>
                                <td>{formatDate(vitals?.dateOfVisit)}</td>
                                <td>{vitals?.weight}</td>

                                <td>{vitals?.temperature} C</td>
                                <td>{vitals?.height} cm</td>
                                <td>{vitals?.bmi} </td>
                                <td>{vitals?.heartPulse} bpm</td>
                                <td>{vitals?.respiratory}</td>
                                <td>{vitals?.bloodPressure}</td>
                                <td>
                                    <div
                                        style={{ width: "100%" }}
                                        className="outline pointer"
                                    // onClick={() => setNoteModalData(vitals)}
                                    >
                                        {vitals?.vitalDocuments?.map((item) => (
                                            <div>

                                                <div className="flex">
                                                    <a
                                                        href={item.docPath}
                                                        target="blank"
                                                    // download={true}
                                                    >
                                                        {item.docName}
                                                    </a>
                                                    {item.docPath && (
                                                        <a
                                                            href={item.docPath}
                                                            target="_blank"
                                                            download={true}
                                                        >
                                                            <img
                                                                style={{ width: "16px", height: "16px" }}
                                                                src={downloadicon}
                                                            />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className="outline pointer"
                                        onClick={() => selectRecord(vitals)}
                                    >
                                        <RiFilePaper2Line />
                                    </div>
                                </td>
                                <td>{vitals?.vitalNurseName}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {currentNote && (
                    <>
                        <div className="m-t-20">
                            <h4>Admistration Information</h4>
                            <div className="flex">
                                <div>
                                    <div className="w-100 flex m-t-20">
                                        <TagInputs
                                            style={{ borderRight: "none" }}
                                            label={currentNote?.createdAt ? `Time: ${new Date(currentNote?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Date'}
                                            name="additionalNoteOnTreatment"
                                            value={currentNote?.createdAt ? new Date(currentNote?.createdAt).toLocaleDateString() : ''}
                                            readOnly={true}
                                        />
                                        <TagInputs label="Nurse" value={currentNote?.administeredBy} readOnly={true} />
                                    </div>
                                </div>
                            </div>
                            <table className="bordered-table-2">
                                <thead>
                                    <tr>
                                        <th>Medication Name</th>
                                        <th>Volume Given</th>
                                        <th>Units</th>
                                        <th>Administered By</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{currentNote.medicationName}</td>
                                        <td>{currentNote.volumeGiven}</td>
                                        <td>{currentNote.units}</td>
                                        <td>{currentNote.administeredBy}</td>
                                        <td>{currentNote.otherNotes}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </>
                )}

                <div className="m-t-20">
                    <button
                        className="submit-btn"
                        onClick={() => setShowVitalsSection((prev) => !prev)}
                    >
                        {showVitalsSection ? "Hide Vitals Section" : "Show Vitals"}
                    </button>
                    {showVitalsSection && (
                        <div className="card m-t-10">
                            <VitalsTreat treatment={treatment} /> {/* Render the Vitals component */}
                        </div>
                    )}
                </div>

                <div className="w-100 flex flex-h-end flex-direction-v">
                    <div className="m-t-20 m-b-20">
                        {documentArray?.map((item, index) => (
                            <div key={index} className="flex">
                                <a href={item.path} target="_blank" className="m-r-10">
                                    {item.name}
                                </a>
                                <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
                            </div>
                        ))}

                        {documentArray.length === 0 ? (
                            <div className="col-5">
                                <button onClick={addConsent} className="rounded-btn m-t-20 col-3">Attach file</button>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="pagination flex space-between float-right col-6 m-t-20 m-b-80">
                    <div className="flex gap-8">
                        <div className="bold-text">Page</div>
                        <div>{currentPage}/{totalPages}</div>
                    </div>
                    <div className="flex gap-8">
                        <button
                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={`page-${i + 1}`}
                                className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {nurseNotesModal && (
                <NurseNotesAdd
                    treatment={treatment}
                    fetch={getPrescriptionLog}
                    currentPage={currentPage}
                    closeModal={() => setNurseNotesModal(false)}
                    doctors={doctors}
                    nurses={nurses}
                />
            )}

            {add && (
                <AddMoreTreatment
                    closeModal={() => setAdd(false)} // Close the modal
                    patientId={patientId}
                    treatment={treatment}
                    visit={vitals}
                />
            )}

            {NotesModal && (
                <NurseNoteTreatment
                    visit={viewing}
                    notes={viewing?.nurseNotes}
                    add={add}
                    closeModal={closeModal}
                    doctors={doctors}
                    nurses={nurses}
                />
            )}
        </div>
    );
}

export default DetailedNurseNotes;
