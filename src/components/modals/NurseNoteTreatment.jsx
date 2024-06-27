import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';

function NurseNoteTreatment({ closeModal, visit, notes, add }) {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const addNotes = () => {
        const data = {
            doctorId: visit.doctorId,
            nurseId: visit.nurseId,
            treatmentId: visit.id,
            additionalNoteOnTreatment: payload
        }
        post(`/patients/${visit.patientId}/addpatientnote`, data)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }


    console.log(notes)

    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();

    const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const formattedDate = dateObject.toISOString().split("T")[0];
        return formattedDate;
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20  m-l-30 col-4">
                        <p>Treatment Record</p>
                    </div>
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className="p-40">

                    <div>
                        {add === true &&
                            <div>
                                <TagInputs label="Additional Notes" name="additonalNoteOnTreatment" onChange={(e) => { setPayload(e.target.value) }} type='textArea' />

                                <button className="submit-btn m-t-20 w-100" onClick={addNotes}>Add Notes</button>
                            </div>
                        }
                    </div>
                    {add !== true &&
                        <div>
                            <TagInputs label="Nurse Notes" name="additonalNoteOnTreatment" value={notes.map((note)=>(note))} readOnly={true} type='textArea' />
                            <div className='m-t-20'>
                                {visit?.immunizationDocuments?.map((item, index) => (
                                    <div key={index} className="m-t-10 flex">
                                        <a href={item.docPath} target="_blank" className="m-r-10">
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