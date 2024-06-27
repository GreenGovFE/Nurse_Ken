import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TagInputs from '../layouts/TagInputs';
import { get } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';

function AddBed({ closeModal, bedId, fetchBedList }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [patients, setPatients] = useState([]);
    const [action, setAction] = useState('');

    const handleChange = (field, event) => {
        const value = event;
        const name = field;

        if (name === 'patientAssignedId') {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.label, patientAssignedId: value?.value }));
        } else if (name === 'action') {
            setAction(value?.value);
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: value?.target.value }));
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const validatePayload = () => {
        const requiredFields = {
            patientAssignedId: 'Patient',
            assignNote: 'Additional Notes',
        };

        const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);

        if (missingFields.length > 0) {
            const errorMessage = `The following fields are required: ${missingFields.map(field => requiredFields[field]).join(', ')}`;
            notification({ message: errorMessage, type: 'error' });
            return false;
        }

        return true;
    };

    const AssigneBed = async () => {
        if (!validatePayload()) return;

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const url = 'https://edogoverp.com/clinicapi/api/bed/assign-bed';
        const Payload = {
            ...payload,
            bedId: bedId,
            patientAssignedId: Number(payload?.patientAssignedId),
        };

        try {
            let res = await axios.post(url, Payload, options);
            notification({ message: 'Assigned Successfully', type: 'success' });
            fetchBedList();
            closeModal();
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: 'error' });
            console.error('Error assigning bed:', error);
        }
    };

    const UnAssigneBed = async () => {
        if (!validatePayload()) return;

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const url = `https://edogoverp.com/clinicapi/api/bed/unassign-bed/${bedId}`;

        try {
            let res = await axios.put(url, null, options);
            notification({ message: 'Unassigned Successfully', type: 'success' });
            fetchBedList();
            closeModal();
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: 'error' });
            console.error('Error unassigning bed:', error);
        }
    };

    const handleAction = () => {
        if (action === '') {
            notification({ message: 'Please select an action', type: 'error' });
            return
        }
        if (action === 'assign') {
            AssigneBed();
        } else {
            UnAssigneBed();
        }
    };

    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();

    const getAllPatients = async () => {
        try {
            let res = await get(`/patients/AllPatient/${sessionStorage?.getItem('clinicId')}?pageIndex=1&pageSize=3000`);
            let tempPatients = res?.data?.map(patient => ({
                label: `${patient?.firstName} ${patient?.lastName}`,
                value: parseFloat(patient?.patientId),
            }));

            tempPatients?.unshift({
                label: 'Select Patient',
                value: '',
            });
            setPatients(tempPatients);
        } catch (error) {
            console.error('Error fetching all patients:', error);
        }
    };

    const actions = [
        { label: 'Select Action', value: '' },
        { label: 'Assign', value: 'assign' },
        { label: 'Unassign', value: 'unassign' },
    ];

    useEffect(() => {
        getAllPatients();
    }, []);

    return (
        <div className='modal'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className='modal-contents '>
                <div className='flex '>
                    <div className='flex  flex-v-center m-t-20 col-7'>
                        <p className='m-l-10 '>Assign Bed To Patient</p>
                    </div>
                    <div className='flex  flex-v-center m-t-20 m-l-80 col-5'>
                        <p>Time: {formattedTime}</p>
                    </div>
                </div>
                <div className='p-10'>
                    <TagInputs label='Select Action' onChange={value => handleChange('action', value)} options={actions} name='action' type='R-select' />
                    {action === 'assign' &&
                        <TagInputs label='Patient' onChange={value => handleChange('patientAssignedId', value)} options={patients} name='patientAssignedName' type='R-select' />
                    }
                    <TagInputs label='Additional Notes' name='assignNote' onChange={value => handleChange('assignNote', value)} type='textArea' />

                    <button onClick={handleAction} className='submit-btn m-t-20 w-100'>
                        {action === 'assign' ? 'Assign Bed' : action === 'unassign' ? 'Unassign Bed' : 'Action'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddBed;
