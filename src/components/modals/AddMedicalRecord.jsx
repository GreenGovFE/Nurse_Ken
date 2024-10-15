import React, { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { post } from '../../utility/fetch';
import toast from 'react-hot-toast';

function AddMedicalRecord({ closeModal, patientId, fetchData, medicalRecordType }) {

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const addMedicalRecord = async () => {
        if (!comment) {
            toast("Please fill in fields")
            return;
        }
        setLoading(true);
        const payload = {
            // medicalRecordType: medicalRecordType,
            // name: name,
            comment: comment,
            patientId: patientId
        };
        console.log(payload);
        try {
            await post(`/patients/addmedicalrecord`, payload);
            await fetchData();
            toast.success('Medical record added successfully');
            closeModal();
        } catch (error) {
            toast.error('Error adding medical record');
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Add Medical Record</h3>


                    <TextArea
                        label="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn m-t-20 w-100" onClick={addMedicalRecord} disabled={loading}>Add Medical Record</button>
                </div>
            </div>
        </div>
    );
}

export default AddMedicalRecord;
