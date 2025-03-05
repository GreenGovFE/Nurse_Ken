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
import SpeechToTextButton from "../UI/SpeechToTextButton";

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

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const deleteDoc = (doc) => {
        let newArr = documentArray.filter((id) => id.name !== doc);
        setDocumentArray(newArr);
    };

    const getNurseNotes = async (currentPage) => {
        try {
            let res = await get(`/patients/get-nurse-treatmentnote/${treatment?.id}?pageIndex=${currentPage}&pageSize=1`);
            setNote(res?.data);
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
                
            }else{
                notification({ message: 'Failed to add consent', type: 'error' });
            }   
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    useEffect(() => {
        getNurseNotes(currentPage);
    }, [currentPage])

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
                    </div>
                    <div className="m-l-20  m-t-20">
                        <TagInputs label="Administring Nurse's Comment" name="additionalNoteOnTreatment" value={Array.isArray(note) ? note?.map((note) => (note?.note)) : ''} readOnly={true} type='textArea' />
                        <SpeechToTextButton onTranscript={handleTranscript} />
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
                    fetch={getNurseNotes}
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
