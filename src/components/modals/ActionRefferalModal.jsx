import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post, put } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function ActionReferralModal({ closeModal, referralId, next, fetchBedList }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});

    const actionOptions = [{name: 'Accept/Decline', value: ''},{name: 'Accept', value: 1}, {name: 'Decline', value: 2}]

    const handleChange = (field, event) => {

        console.log(event);
        const value  = event;
        const name = field

        if (name === 'acceptanceStatus') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value?.target.value),  }));

        }else{
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.target.value }));
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const AssigneBed = async () => {
        const Payload = {
            ...payload,
            referralId: referralId,

        }
        try {
            let res = await post(`/Referrals/Update-patient-Refferal`, Payload);
            console.log(res);
            notification({ message: 'Assigned Successfully', type: "success" })
            fetchBedList()
            closeModal()
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: "error" })
            console.error('Error fetching in and out patients:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };

    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();

    // const getAllPatients = async () => {
    //     try {
    //         let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=3000`);
    //         console.log(res);
    //         let tempDoc = res?.data?.map((patient, idx) => {
    //             return {
    //                 label: `${patient?.firstName} ${patient?.lastName}`, value: parseFloat(patient?.patientId)
    //             };
    //         });

    //         tempDoc?.unshift({
    //             label: "Select Patient", value: ""
    //         });
    //         setPatient(tempDoc);
    //     } catch (error) {
    //         console.error('Error fetching all patients:', error);
    //         // Handle the error here, such as displaying an error message to the user
    //     }
    // };







    // useEffect(() => {
    //     getAllPatients();
    // }, []);

    return (
        <div className='modal'>
            <div className="modal-contents">
                <span className="close m-b-20" onClick={closeModal}>&times;</span>
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Admit Reffered Patient</p>
                    </div>
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className="p-40">
                    <TagInputs label="Decision" onChange={(value) => handleChange("acceptanceStatus", value)} options={actionOptions} name="acceptanceStatus" type='select' />
                    <TagInputs label="Additional Notes" name="notes" onChange={(value) => handleChange("notes", value)} type='textArea' />

                    <button onClick={AssigneBed} className="submit-btn m-t-20 w-100" >Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ActionReferralModal;