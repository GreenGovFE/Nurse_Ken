import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import axios from "axios";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiDeleteBinLine } from "react-icons/ri";
import { usePatient } from "../../contexts";
import NurseNotesAdd from "./NurseNotesAdd";
import NurseNoteTreatment from "./NurseNoteTreatment";
import UploadButton from "../../Input/UploadButton";

function DetailedNurseNotes({ closeModal, treatment, notes, doctors, nurses, reset }) {
    const [nurseNotesModal, setNurseNotesModal] = useState(false)
    const { patientId, patientName } = usePatient();
    const [viewing, setViewing] = useState({});
    const [add, setAdd] = useState(false);
    const [note, setNote] = useState([]);
    const [NotesModal, setNotesModal] = useState(false)
    const [docNames, setDocNames] = useState([]);
    const [documentArray, setDocumentArray] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    // const getNurseNotes = async (currentPage) => {
    //     try {
    //         let res = await get(`/patients/get-nurse-treatmentnote/${treatment?.id}?pageIndex=${currentPage}&pageSize=1`);
    //         setNote(res?.data);
    //         setTotalPages(res?.pageCount)
    //     } catch (error) {
    //         console.error("Error fetching doctors:", error);
    //     }
    // };

    const getPrescriptionLog = async (currentPage) => {
        try {
            let res = await get(`/patients/prescription-log?treatmentId=${treatment?.id}`);
            setNote(res);
            setTotalPages(res?.pageCount)
        } catch (error) {
            console.error("Error fetching doctors:", error);
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
        }
        try {
            let res = await post(`/patients/AddConsent`, payload);
            if (res?.appointmentId) {
                notification({ message: 'Consent added successfully', type: 'success' });
                setDocumentArray([]);
                setDocNames([]);
                reset(true);

            } else {
                notification({ message: 'Failed to add consent', type: 'error' });
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    useEffect(() => {
        getPrescriptionLog();
    }, [])

    const selectRecord = (record) => () => {
        setViewing(record);
        setNotesModal(true);
    };

    const medications = [...(treatment?.medications || []), ...(treatment?.otherMedications || [])];

    const handleTranscript = (transcript) => {
        setNote(prevNote => [...prevNote, { note: transcript }]);
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex space-between">
                    <div className="flex  flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Nurse Notes</p> | <p className={'m-l-10'}>{patientName}</p>
                    </div>

                    <div className="flex  flex-v-center m-t-20 m-l-10 ">
                        <button onClick={() => setNurseNotesModal(true)} className="add-note">
                            Add to patient's note
                        </button>
                    </div>
                </div>
                <div>
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">Date</th>
                                <th className="center-text">Age</th>
                                <th className="center-text">Weight (Kg)</th>
                                <th className="center-text">Temperature (°C)</th>
                                <th className="center-text">Admin Nurse</th>
                                <th className="center-text">Nurse Note</th>
                                <th className="center-text">Diagnosis</th>
                                <th className="center-text">Care Plan</th>
                            </tr>
                        </thead>
                        <tbody className="white-bg view-det-pane">
                            <tr key={treatment?.id}>
                                <td>{new Date(treatment?.dateOfVisit).toLocaleDateString()}</td>
                                <td>{treatment?.age}</td>
                                <td>{treatment?.weight}</td>
                                <td>{treatment?.temperature}</td>
                                <td>{treatment?.nurseName}</td>
                                <td onClick={selectRecord(treatment)}>
                                    <img className="hovers pointer" src="/details.png" alt="Details" />
                                </td>
                                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                                    {treatment?.diagnosis}
                                </td>
                                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                                    {treatment?.carePlan}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex">
                    <div>
                        <div className="w-100  flex m-t-20">
                            <TagInputs
                                style={{ borderRight: "none" }}
                                label={note[0]?.createdAt ? new Date(note[0]?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Date'}
                                name="additionalNoteOnTreatment"
                                value={note[0]?.createdAt ? new Date(note[0]?.createdAt).toLocaleDateString() : ''}
                                readOnly={true}
                            />
                            <TagInputs label="Nurse" value={note[0]?.name} readOnly={true} />
                        </div>
                        <table className="bordered-table-2 m-t-10">
                            <thead className="border-top-none">
                                <tr className="border-top-none">
                                    <th className="w-20" rowSpan="2">Diagnosis</th>
                                    <th rowSpan="2">Prescription</th>
                                    <th colSpan="3" className="center-text">Dosage</th>
                                </tr>
                                <tr className="">
                                    <th>Frequency</th>
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
                                                <span>{administrationFrequencies.find(freq => freq.id === item.administrationFrequency)?.name || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="m-l-20  m-t-20">
                        <TagInputs label="Administring Nurse's Comment" name="additionalNoteOnTreatment" value={Array.isArray(note) ? note?.map((note) => (note?.note)) : ''} readOnly={true} type='textArea' />
                    </div>
                </div>
                <div className="w-100 flex flex-h-end flex-direction-v">
                    <div className="m-t-20 m-b-20">
                        {documentArray?.map((item, index) => (
                            <div key={index} className=" flex">
                                <a href={item.path} target="_blank" className="m-r-10">
                                    {item.name}
                                </a>
                                <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
                            </div>
                        ))}

                        {documentArray.length === 0 ? (
                            <div className="col-5">
                                <UploadButton setDocNames={setDocNames} setdocumentArray={setDocumentArray} />
                            </div>
                        ) : (
                            <button onClick={addConsent} className="rounded-btn m-t-20 col-3">Attach file</button>
                        )}
                    </div>
                </div>

                <div>
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
                            {Array.from({ length: totalPages > 3 ? 3 : totalPages }, (_, i) => (
                                <button
                                    key={`page-${i + 1}`}
                                    className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            {totalPages > 3 && <span>...</span>}
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
            </div>

            {nurseNotesModal && (
                <NurseNotesAdd
                    treatment={treatment}
                    notes={notes}
                    add={add}
                    fetch={getPrescriptionLog}
                    currentPage={currentPage}
                    closeModal={setNurseNotesModal}
                    doctors={doctors}
                    nurses={nurses}
                />
            )}

            {NotesModal && (
                <NurseNoteTreatment
                    visit={viewing}
                    notes={notes}
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
