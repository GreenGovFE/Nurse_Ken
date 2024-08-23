import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post, put } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function ActionReferralModal({ closeModal, referralId, referralInfo, fetch }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [errors, setErrors] = useState({});
    const [actionOptions, setActionOptions] = useState([]);


    console.log(referralInfo)
    const handleChange = (field, event) => {
        const value = event?.target?.value ?? event;
        setPayload(prevPayload => ({ ...prevPayload, [field]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    };

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);

    const validate = () => {
        console.log(payload)
        const newErrors = {};
        if (!payload.acceptanceStatus) {
            newErrors.acceptanceStatus = 'Decision is required';
            notification({ message: 'Decision is required', type: "error" });
        }
        if (!payload.notes) {
            newErrors.notes = 'Additional Notes are required';
            notification({ message: 'Additional Notes are required', type: "error" });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getActionTypes = async () => {
        try {
            let res = await get(`/Referrals/GetAllAcceptanceStatus`);
            console.log(res);

            let filteredRes = res?.filter(action => action?.index !== 1);

            let tempDoc = filteredRes?.map((action, idx) => {
                return {
                    name: `${action?.value}`,
                    value: parseFloat(action?.index),
                };
            });

            tempDoc?.unshift({
                name: "Select Action",
                value: ""
            });

            setActionOptions(tempDoc);
        } catch (error) {
            console.error('Error fetching all actions:', error);
        }
    };

    useEffect(() => {
        getActionTypes();
    }, [])

    const ActionReferral = async () => {
        if (!validate()) {
            return;
        }

        if (referralInfo.acceptanceStatus === 'Rejected' && payload.acceptanceStatus == 2) {
            notification({ message: 'Can not reject an already rejected patient', type: "error" });
            return;
        }

        const Payload = {
            ...payload,
            acceptanceStatus: parseInt(payload.acceptanceStatus),
            referralId: referralId,
        };

        try {
            let res = await post(`/Referrals/Update-patient-Referral`, Payload);
            console.log(res);
            if (res.message === "Referral note updated successfully") {
                if (Payload.acceptanceStatus === 3) {
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

    const formattedTime = currentDateTime.toLocaleTimeString();

    return (
        <div className='modal'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className="modal-contents">
                <div className="flex m-l-40 ">
                    <div className="flex flex-v-center m-t-20 col-5">
                        <p className='m-l-'>Admit Referred Patient</p>
                    </div>
                    {/* <div className="flex space-between flex-v-center m-l-100 m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div> */}
                </div>
                <div className="p-40">
                    <TagInputs
                        label="Decision"
                        onChange={(value) => handleChange("acceptanceStatus", (value))}
                        options={actionOptions}
                        name="acceptanceStatus"
                        type='select'
                    />
                    {/* {errors.acceptanceStatus && <div className="error">{errors.acceptanceStatus}</div>} */}

                    <TagInputs
                        label="Additional Notes"
                        name="notes"
                        onChange={(value) => handleChange("notes", value)}
                        type='textArea'
                    />
                    {/* {errors.notes && <div className="error">{errors.notes}</div>} */}

                    <button onClick={ActionReferral} className="submit-btn m-t-20 w-100">Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ActionReferralModal;
