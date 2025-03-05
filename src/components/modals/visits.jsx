import React, { useEffect, useState } from 'react';
import { RiCloseFill, RiFileDownloadFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';

function ViewVisit({ closeModal, visit, next }) {
    const [nurses, setNurses] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [payload, setPayload] = useState({});
    const [tiffData, setTiffData] = useState(null);

    useEffect(() => {
        getNurses();
        getDoctors();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
    }

    const getNurses = async () => {
        try {
            let res = await get(
                `/patients/Allnurse/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
                    "clinicId"
                )}&pageIndex=1&pageSize=10`
            );
            setNurses(Array.isArray(res?.data) ? res?.data : []);
        } catch (error) {
            console.error('Error fetching nurses:', error);
        }
    };

    const getDoctors = async () => {
        try {
            let res = await get(
                `/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
                    "clinicId"
                )}&pageIndex=1&pageSize=30`
            );
            setDoctors(Array.isArray(res?.data) ? res?.data : []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const formattedDate = dateObject.toISOString().split("T")[0];
        return formattedDate;
    };

    const downloadFile = async (docName) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                console.error('Token not found in session storage');
                return;
            }

            const url = `${process.env.REACT_APP_BASE_URL}/labapi/api/document/download-document/${docName}`;

            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await fetch(url, options);

            if (response.ok) {
                const blob = await response.blob();

                const blobUrl = URL.createObjectURL(blob);

                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                anchor.download = docName;
                anchor.click();

                URL.revokeObjectURL(blobUrl);
            } else {
                console.error('Failed to fetch download link:', response.statusText);
            }
        } catch (e) {
            console.error('Error fetching download link:', e);
        }
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex ">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-3">
                        <p>Vitals Details</p>
                    </div>
                </div>
                <div className="p-20">

                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">Date</th>
                                <th className="center-text">Blood Pressure (mmHg)</th>
                                <th className="center-text">Weight (Kg)</th>
                                <th className="center-text">Temp (°C)</th>
                                <th className="center-text">Height (cm)</th>
                                <th className="center-text">Heart (bpm)</th>
                                <th className="center-text">Oxygen Saturation (SpO₂) </th>
                                <th className="center-text">Blood sugar</th>
                                <th className="center-text">Resp</th>
                                <th className="center-text">Admin Nurse</th>
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">

                            <tr >
                                <td style={{ minWidth: '100px' }}>{formatDate(visit?.dateOfVisit)}</td>
                                <td>{visit?.bloodPressure}</td>
                                <td>{visit?.weight}</td>
                                <td>{visit?.temperature}</td>
                                <td>{visit?.height}</td>
                                <td>{visit?.heartPulse}</td>
                                <td>{visit?.oxygenSaturation}</td>
                                <td>{visit?.bloodSugar}</td>
                                <td>{visit?.respiratory}</td>
                                <td>{(visit?.vitalNurseName)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <TagInputs label="Assigned Nurse" name="assignedNurse" value={visit?.vitalNurseName} readOnly={true} />
                    {
                        visit?.notes && visit.notes.map((data, index) => (
                            <div>
                                <TagInputs label="Additional Notes" name="additonalNoteOnTreatment" value={data} onChange={handleChange} readOnly={true} type='textArea' />
                            </div>
                        ))
                    }

                    {visit?.vitalDocuments
                        ?.filter(doc => doc?.docName && doc?.docPath) // Filter out invalid docs
                        .map((doc, index) => (
                            <div key={index}>
                                <div className='text-green pointer flex flex-direction-v flex-h-center'>
                                    <RiFileDownloadFill onClick={() => downloadFile(doc?.docName)} size={20} />
                                    <span className='' onClick={() => downloadFile(doc?.docName)}>Download {doc?.docName}</span>
                                    {/* Check if the document is a PDF, otherwise display images or other files */}
                                    {doc?.docPath?.endsWith('.pdf') || doc?.docPath?.endsWith('.tif') || doc?.docPath?.endsWith('.bmp') || doc?.docPath?.endsWith('.tiff') ? (
                                        <iframe
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(doc?.docPath)}&embedded=true`}
                                            title={doc?.docName}
                                            width="100%"
                                            height="auto"
                                            frameBorder="0"
                                        />
                                    ) : doc?.docPath?.endsWith('.png') || doc?.docPath?.endsWith('.jpg') || doc?.docPath?.endsWith('.jpeg') ? (
                                        // For image files, use an img tag
                                        <img src={doc?.docPath} alt={doc?.docName}
                                            style={{
                                                width: 'auto',   
                                                height: 'auto',       
                                                maxHeight: '80vh',   
                                                objectFit: 'contain'  
                                            }}
                                        />
                                    ) : (
                                        // For other types (e.g., Word, Excel), provide a link to download or view
                                        <a href={doc?.docPath} target="_blank" rel="noopener noreferrer">
                                            {doc?.docName}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}



                </div>
            </div>
        </div>
    );
}

export default ViewVisit;