import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function ReferralModal({ closeModal, bedId, next, fetchBedList }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [Patient, setPatient] = useState([]);
    const [hospitals, setHospitals] = useState([])


    const userId = sessionStorage?.getItem("userId")

    console.log(payload, hospitals);

    const handleChange = (field, event) => {
        console.log(event);
        const value = event;
        const name = field
        console.log(name, value);

        if (name === 'referredClinicId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value?.value) }));

        } else if (name === 'patientId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.value }));
        }
        else {
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

    const ReferPatient = async () => {
        const Payload = {
            ...payload,
            clinicId: Number(sessionStorage?.getItem("clinicId")),
            referredClinicId: payload?.referredClinicId || 0,
            patientId: payload?.patientId ?  payload?.patientId : 0,
            referralNotes: payload?.referralNotes ? payload?.referralNotes : '',
            treatmentId: 8,
        }

        const customFieldNames = {
            referredClinicId: "Clinic/Hospital",
            patientId: "Patient",
            referralNotes: "Additional Notes",

        };
        
        const validatePayload = (payload) => {
            const fieldsToCheck = Object.keys(payload).filter(field => field !== 'Notes' );
            return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '');
        };

        const invalidFields = validatePayload(Payload);
        console.log(invalidFields)

        if (invalidFields.length > 0) {
            const formattedFields = invalidFields.map(field => {
                if (customFieldNames[field]) {
                    return customFieldNames[field];
                }
                // Add space between camelCased words
                return field.replace(/([a-z])([A-Z])/g, '$1 $2');
            });

            const errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
            notification({ message: errorMessage, type: "error" });
            return;
        }
        try {
            let res = await post(`/Referrals/refer-patient`, Payload);
            console.log(res);
            if (res?.status === 200) {
                notification({ message: 'Assigned Successfully', type: "success" })
                closeModal()
            }else{
                notification({ message: res?.message, type: "error" })
            }
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: "error" })
            console.error('Error fetching in and out patients:', error);
            // Handle the error here, such as displaying an error message to the user
        }
           
    };

    const formattedTime = currentDateTime.toLocaleTimeString();

    const getAllPatients = async () => {
        try {
            let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=3000`);
            console.log(res);
            let tempDoc = res?.data?.map((patient, idx) => {
                return {
                    label: `${patient?.firstName} ${patient?.lastName}`, value: parseFloat(patient?.patientId),
                };
            });

            tempDoc?.unshift({
                label: "Select Patient", value: ""
            });
            setPatient(tempDoc);
        } catch (error) {
            console.error('Error fetching all patients:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };


    const getAllHospitals = async () => {
        try {
            let res = await get(`/facilities/Get-All-Hospital?pageSize=300&pageNumber=1`);
            console.log(res);
            let tempDoc = res?.data?.map((item, idx) => {
                return {
                    label: `${item?.hospitalName}`, value: item?.clinicId
                };
            });

            tempDoc?.unshift({
                label: "Select Hospital/Clinic", value: ""
            });
            setHospitals(tempDoc);
        } catch (error) {
            console.error('Error fetching all hosspitals:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };




    useEffect(() => {
        getAllPatients();
        getAllHospitals();
    }, []);

    return (
        <div className='modal'>
            <div className="modal-contents">
                <span className="close m-b-20" onClick={closeModal}>&times;</span>
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Refer Patient</p>
                    </div>
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className="p-40">
                    <TagInputs label="Select Patient" onChange={(value) => handleChange("patientId", value)} options={Patient} name="patientId" type='R-select' />
                    <TagInputs label="Select Clinic/Hospital" onChange={(value) => handleChange("referredClinicId", value)} options={hospitals} name="referredClinicId" type='R-select' />
                    <TagInputs label="Additional Notes" name="referralNotes" onChange={(value) => handleChange("referralNotes", value)} type='textArea' />

                    <button onClick={ReferPatient} className="submit-btn m-t-20 w-100" >Refer Patient</button>
                </div>
            </div>
        </div>
    );
}

export default ReferralModal;