import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function AddBed({ closeModal, bedId, next, fetchBedList }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [Patient, setPatient] = useState([]);

    console.log(payload);

    const handleChange = (field, event) => {
        console.log(event);
        const value  = event;
        const name = field

        if (name === 'patientAssignedName') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.label, patientAssignedId: value?.value,  }));

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

        const token = sessionStorage.getItem('token');
           
        // If token is not available, handle accordingly
        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const url = `https://edogoverp.com/clinicapi/api/bed/assign-bed`;
        const Payload = {
            ...payload,
            bedId: bedId,
            assignerUserId: 23,
        }
        try {
            let res = await axios.post(url, Payload, options);
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

    const getAllPatients = async () => {
        try {
            let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=3000`);
            console.log(res);
            let tempDoc = res?.data?.map((patient, idx) => {
                return {
                    label: `${patient?.firstName} ${patient?.lastName}`, value: parseFloat(patient?.patientId)
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







    useEffect(() => {
        getAllPatients();
    }, []);

    return (
        <div className='modal'>
            <div className="modal-contents">
                <span className="close m-b-20" onClick={closeModal}>&times;</span>
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Assign Bed To Patient</p>
                    </div>
                    <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className="p-40">
                    <TagInputs label="Patient's Name" onChange={(value) => handleChange("patientAssignedName", value)} options={Patient} name="patientAssignedName" type='R-select'  />
                    <TagInputs label="Additional Notes" name="assignNote" onChange={(value) => handleChange("assignNote", value)} type='textArea' />

                    <button onClick={AssigneBed} className="submit-btn m-t-20 w-100" >Assign Bed</button>
                </div>
            </div>
        </div>
    );
}

export default AddBed;