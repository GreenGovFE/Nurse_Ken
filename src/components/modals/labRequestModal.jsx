import React, { useEffect, useState } from "react";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiFileDownloadFill } from "react-icons/ri";

const LabrequestModal = ({ closeModal, record }) => {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);

    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();


    const downloadFile = async (docName) => {
        try {
            // Get the token from local storage
            const token = sessionStorage.getItem('token');

            // If token is not available, handle accordingly
            if (!token) {
                console.error('Token not found in session storage');
                return;
            }

            // Construct the URL with the document name
            const url = `https://edogoverp.com/labapi/api/document/download-document/${docName}`;

            // Fetch options including the Authorization header with the JWT token
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Fetch the file
            const response = await fetch(url, options);

            // Check if the request was successful
            if (response.ok) {
                // Convert response body to a blob
                const blob = await response.blob();

                // Create a URL for the blob
                const blobUrl = URL.createObjectURL(blob);

                // Trigger download by creating an anchor element
                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                anchor.download = docName; // Set the filename for download
                anchor.click();

                // Clean up by revoking the blob URL
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
                    {/* <div className="flex flex-v-center m-t-20 m-l-160 col-6">
                        <p className="m-l-10">Time: {formattedTime}</p>
                    </div> */}
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
