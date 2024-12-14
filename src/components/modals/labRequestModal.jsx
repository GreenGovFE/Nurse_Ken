import React, { useEffect, useState } from "react";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiFileDownloadFill } from "react-icons/ri";

const LabrequestModal = ({ closeModal, record }) => {
    const downloadFile = async (docName) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                console.error('Token not found in session storage');
                return;
            }

            const url = `https://edogoverp.com/labapi/api/document/download-document/${docName}`;

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
        <div className="modal  ">
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className="modal-contents col-12  p-10 ">
                <div className="flex  m-l-20">
                    <div className="flex flex-v-center m-t-20  col-7">
                        <h3 className="m-r-10" >{record?.patientFullName}</h3> |
                        <p className="m-l-10">Lab Report</p>
                    </div>
                </div>

                <div className="p-20" >

                    <div className="m-t-10 ">
                        <TagInputs disabled={true} value={record?.subject} label='Subject' />
                    </div>
                    <div className='flex flex-v-center m-t-20 '><div className='findings w-100'>Lab Findings</div>  </div>
                    <div className='outline-box'>{record?.labFindings}</div>
                    <div>

                        <div className="m-t-20" >

                            {record?.patientLabDocuments.map((doc, index) => (
                                <div key={index}>
                                    <div className='text-green pointer flex flex-direction-v flex-h-center '>
                                        <RiFileDownloadFill onClick={() => downloadFile(doc?.docName)} size={20} />
                                        <a href={doc.docUrl} target="_blank" rel="noopener noreferrer">{doc.docName}</a>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
};

export default LabrequestModal;
