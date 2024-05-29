import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { get, post } from '../../utility/fetch';
import toast from 'react-hot-toast';
import { BsTrash } from 'react-icons/bs';

function AddTreatment({ closeModal, visit, id, fetchData }) {
    const [carePlan, setCarePlan] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medication, setMedication] = useState(''); // State to hold individual medication input
    const [medications, setMedications] = useState([]); // State to hold medication items
    const [loading, setLoading] = useState(false);
    const [treatmentCategories, setTreatmentCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1); // State to hold the selected category ID

    const fetchTreatmentCategory = async () => {
        try {
            const response = await get('/patients/get-all-categories');
            setTreatmentCategories(response);
        } catch (error) {
            console.log(error);
        }
    }

    const addMedication = () => {
        if (medication.trim() !== '') {
            setMedications([...medications, medication]);
            setMedication(''); // Clear the input field
        }
    };

    const removeMedication = (index) => {
        const updatedMedications = [...medications];
        updatedMedications.splice(index, 1);
        setMedications(updatedMedications);
    };

    const addTreatment = async () => {
        setLoading(true);
        const payload = {
            dateOfVisit: visit?.dateOfVisit,
            diagnosis: diagnosis,
            medication: medications, // Send the medications array
            carePlan: carePlan,
            treatmentCategoryId: selectedCategoryId // Use the selected category ID
        }

        try {
            await post(`/patients/${id}/visit/${visit?.id}/addtreatmentprescription`, payload);
            await fetchData();
            toast.success('Treatment added successfully');
            closeModal();
        } catch (error) {
            toast.error('Error adding treatment');
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTreatmentCategory();
    }, [])

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Add Treatment</h3>
                    <div className="w-80 m-t-20 flex">
                        <label htmlFor="category" className='label'>Treatment Category</label>
                        <select id="category" className="input-field" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                            {treatmentCategories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="m-t-20">
                        <InputField
                            label="Medication"
                            value={medication}
                            onChange={(e) => setMedication(e.target.value)}
                        />
                        <button className="btn m-t-10" onClick={addMedication}>Add Medication</button>
                    </div>
                    {medications.length > 0 && (
                        <table className="bordered-table-2 m-t-20">
                            <thead className='border-top-none'>
                                <tr>
                                    <th className='w-20'>s/n</th>
                                    <th className='w-60'>Medication</th>
                                    <th className='w-20'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medications.map((med, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{med}</td>
                                        <td><BsTrash className="text-red pointer" height={20} width={20} onClick={() => removeMedication(index)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <TextArea label="Patient Diagnosis" name="diagnosis" onChange={(e) => setDiagnosis(e.target.value)} />
                    <TextArea label="Add Care Plan" name="carePlan" onChange={(e) => setCarePlan(e.target.value)} />
                    <button className="submit-btn m-t-20 w-100" onClick={addTreatment} disabled={loading}>Add Treatment</button>
                </div>
            </div>
        </div>
    );
}

export default AddTreatment; 