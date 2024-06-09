import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post, put } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function ActionReferralModal({ closeModal, referralId, next, fetch }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});

    const actionOptions = [{ name: 'Accept/Decline', value: '' }, { name: 'Accept', value: 1 }, { name: 'Decline', value: 2 }]

    const handleChange = (field, event) => {

        console.log(event);
        const value = event;
        const name = field

        if (name === 'acceptanceStatus') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value?.target.value), }));

        } else {
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

    const ActionReferral = async () => {
        const Payload = {
            ...payload,
            referralId: referralId,
        };

        try {
            let res = await post(`/Referrals/Update-patient-Referral`, Payload);
            console.log(res);
            if (res.message === "Referral note updated successfully") {
                if (Payload.acceptanceStatus === 1) {
                    notification({ message: 'Accepted Successfully', type: "success" });
                } else {
                    notification({ message: 'Declined Successfully', type: "success" });
                }
                fetch();
                closeModal();
            } else {
                notification({ message: 'Failed to update patient acceptance', type: "error" });
                closeModal();
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                notification({ message: 'Referral not found', type: "error" });
            } else if (error.response && error.response.status === 500) {
                notification({ message: 'Server Error', type: "error" });
            } else {
                notification({ message: error?.response?.data?.errorData[0] || error?.message, type: "error" });
            }
            console.error('Error fetching in and out patients:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };



    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();


    return (
        <div className='modal'>
            <div className="modal-contents">
                <span className="close m-b-20" onClick={closeModal}>&times;</span>
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Admit Referred Patient</p>
                    </div>
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className="p-40">
                    <TagInputs label="Decision" onChange={(value) => handleChange("acceptanceStatus", value)} options={actionOptions} name="acceptanceStatus" type='select' />
                    <TagInputs label="Additional Notes" name="notes" onChange={(value) => handleChange("notes", value)} type='textArea' />

                    <button onClick={ActionReferral} className="submit-btn m-t-20 w-100" >Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ActionReferralModal;