import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';
import { usePatient } from '../../contexts';
import SpeechToTextButton from "../UI/SpeechToTextButton";

function ReferralModal({ closeModal, AppointmentId, next, fetchData, currentPage }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [Patient, setPatient] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const { patientId, patientName, hmoId, patientInfo, setPatientId } = usePatient();
    const [treatment, setTreatment] = useState([]);

    const userId = sessionStorage?.getItem("userId");
    const clinicId = sessionStorage?.getItem('clinicId')

    console.log(payload, hospitals);

    const handleChange = (field, event) => {
        const value = event;
        const name = field;

        if (name === 'referredClinicId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value?.value) }));
        } else if (name === 'patientId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.value }));
        } else if (name === 'treatmentId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(value?.value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.target.value }));
        }
    };

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, []);

    console.log(patientId, AppointmentId)
    const ReferPatient = async () => {
        const Payload = {
            ...payload,
            clinicId: Number(sessionStorage?.getItem("clinicId")),
            referredClinicId: payload?.referredClinicId || 0,
            patientId: patientId ? patientId : 0,
            referralNotes: payload?.referralNotes ? payload?.referralNotes : '',
            appointmentId: AppointmentId || 0,
        };

        const customFieldNames = {
            referredClinicId: "Clinic/Hospital",
            patientId: "Patient",
            referralNotes: "Additional Notes",
        };

        const validatePayload = (payload) => {
            const fieldsToCheck = Object.keys(payload).filter(field => field !== 'clinicId');
            return fieldsToCheck.filter(field => payload[field] === 0 || payload[field] === '');
        };

        const invalidFields = validatePayload(Payload);

        if (invalidFields.length > 0) {
            const formattedFields = invalidFields.map(field => {
                if (customFieldNames[field]) {
                    return customFieldNames[field];
                }
                return field.replace(/([a-z])([A-Z])/g, '$1 $2');
            });

            const errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
            notification({ message: errorMessage, type: "error" });
            return;
        }
        try {
            let res = await post(`/Referrals/refer-patient`, Payload);
            if (res?.message === "Referral note added successfully") {
                notification({ message: 'Referred Successfully', type: "success" });
                fetchData(currentPage);
                closeModal();
            } else {
                notification({ message: res?.message, type: "error" });
            }
        } catch (error) {
            notification({ message: 'Failed to refer patient', type: "error" });
            console.error('Error fetching in and out patients:', error);
        }
    };

    const formattedTime = currentDateTime.toLocaleTimeString();

    const getAllPatients = async () => {
        try {
            let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=3000`);
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
        }
    };

    const getAllHospitals = async () => {
        try {
            let res = await get(`/facilities/Get-All-Hospital?pageSize=300&pageNumber=1`);
            let tempDoc = res?.data
                ?.filter(item => item?.clinicId !== Number(clinicId))
                ?.map((item, idx) => {
                    return {
                        label: `${item?.hospitalName}`, value: item?.clinicId
                    };
                });

            tempDoc?.unshift({
                label: "Select Hospital/Clinic", value: ""
            });
            setHospitals(tempDoc);
        } catch (error) {
            console.error('Error fetching all hospitals:', error);
        }
    };

    useEffect(() => {
        getAllPatients();
        getAllHospitals();
    }, [patientId]);

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, referralNotes: prevPayload.referralNotes ? prevPayload.referralNotes + ' ' + transcript : transcript }));
    };

    return (
        <div className='modal'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex">
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p className='m-l-20'>Refer Patient</p>
                    </div>
                </div>
                <div className="p-10">
                    <TagInputs label="Select Clinic/Hospital" onChange={(value) => handleChange("referredClinicId", value)} options={hospitals} name="referredClinicId" type='R-select' />
                    <TagInputs label="Additional Notes" name="referralNotes" value = {payload?.referralNotes} onChange={(value) => handleChange("referralNotes", value)} type='textArea' />
                    <SpeechToTextButton onTranscript={handleTranscript} />
                    <button onClick={ReferPatient} className="submit-btn m-t-20 w-100" >Refer Patient</button>
                </div>
            </div>
        </div>
    );
}

export default ReferralModal;
