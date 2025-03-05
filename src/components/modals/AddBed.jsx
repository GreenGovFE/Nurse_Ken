import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TagInputs from '../layouts/TagInputs';
import { get } from '../../utility/fetch';
import axios from 'axios';
import notification from '../../utility/notification';
import { usePatient } from '../../contexts';
import { useBeds } from '../../contexts/bedContext';
import SpeechToTextButton from '../UI/SpeechToTextButton';

function AddBed({ closeModal, bedId, fetchBedList, assigned }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [payload, setPayload] = useState({});
    const [patients, setPatients] = useState([]);
    const [action, setAction] = useState('');
    const { beds, setBeds, bedsTablePages, setBedTablePages, bedsTablePage, setBedTablePage } = useBeds();
    const { patientId, patientName, setPatientName, setPatientId, diagnosis, setDiagnosis, hmoDetails, setHmoDetails } = usePatient()




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

    const getAssignedBeds = async (page) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/assign-bed/list/${page}/10`, options);
            setBeds(res?.data?.resultList || []);
            setBedTablePages(res?.data?.totalPages)
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };


    const validatePayload = () => {
        const requiredFields = {
            assignNote: 'Additional Notes',
        };
    
        if (!patientId) {
            requiredFields.patientAssignedId = 'Patient';
        }
    
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
        // if (!payload?.patientAssignedId?.hmoId) {
        //     notification({ message: 'Patient', type: 'error' });
        // }
        // else {
        // }

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
        const url = `${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/assign-bed`;
        const Payload = {
            ...payload,
            bedId: bedId,
            patientAssignedId: Number(payload?.patientAssignedId?.patientId || patientId),
            hmoId: hmoDetails?.hmoId || payload?.patientAssignedId?.hmoId ||  0,
            hmoPackageId: hmoDetails?.hmoPackageId ||  payload?.patientAssignedId?.hmoPackageId  || 0,

        };

        try {
            let res = await axios.post(url, Payload, options);
            notification({ message: 'Assigned Successfully', type: 'success' });
            fetchBedList();
            getAssignedBeds(bedsTablePage);
            setPatientName('')
            setPatientId(null)
            setDiagnosis(null)
            setHmoDetails({})
            closeModal();
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: 'error' });
            console.error('Error assigning bed:', error);
        }
    };

    const UnAssigneBed = async () => {

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
        const url = `${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/unassign-bed/${bedId}`;

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
                value: patient,
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

    // let actions
    // if (assigned === 'Occupied') {
    //     actions = [
    //         { label: 'Select Action', value: '' },
    //         { label: 'Unassign', value: 'unassign' },
    //     ];

    // } else {
    //     actions = [
    //         { label: 'Select Action', value: '' },
    //         { label: 'Assign', value: 'assign' },
    //     ];
    // }

    useEffect(() => {
        getAllPatients();
    }, []);

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, assignNote: prevPayload.assignNote ? prevPayload.assignNote + ' ' + transcript : transcript }));
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className='modal-content'>
                <div className='flex '>
                    <div className='flex  flex-v-center m-t-20 col-7'>
                        <p className='m-l-10 '>{patientName ? patientName : ''} Assign Bed To Patient</p>
                    </div>
                    {/* <div className='flex  flex-v-center m-t-20 m-l-80 col-5'>
                        <p>Time: {formattedTime}</p>
                    </div> */}
                </div>
                <div className='p-10'>
                    {/* <TagInputs label='Select Action' onChange={value => handleChange('action', value)} options={actions} name='action' type='R-select' /> */}
                    {!patientId &&
                        <TagInputs label='Patient' onChange={value => handleChange('patientAssignedId', value)} options={patients} name='patientAssignedName' type='R-select' />

                    }
                    <TagInputs label='Date' name='dateOfVital' onChange={value => handleChange('dateOfVital', value)} type='date' dateRestriction={'past'} />
                    <TagInputs label='Diagnosis' name='diagnosis' onChange={value => handleChange('diagnosis', value)} value={diagnosis ? diagnosis : ''} disabled={diagnosis} type='textArea' />
                    <TagInputs label='Additional Notes' name='assignNote' onChange={value => handleChange('assignNote', value)} value ={payload?.assignNote} type='textArea' />
                    <SpeechToTextButton onTranscript={handleTranscript} />
                    <button onClick={AssigneBed} className='submit-btn m-t-20 w-100'>
                        Assign Bed
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddBed;
