import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';

function Appointment({ closeModal, patient }) {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const [nurses, setNurses] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [notes, setNotes] = useState([]);
    const [payload, setPayload] = useState({});




    useEffect(() => {
        getNurses();
        getDoctors();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event?.target;
        setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
    }

    const handleSelectChange = (value) => {
        setPayload(prevPayload => ({ ...prevPayload, assignedDoctor: value?.value }));
    };


    const getNurses = async () => {
        try {
            let res = await get(
                `/patients/Allnurse/${sessionStorage?.getItem("clinicId")}?clinicId=${sessionStorage?.getItem(
                    "clinicId"
                )}&pageIndex=1&pageSize=10`
            );
            setNurses(Array.isArray(res?.data) ? res?.data : []);
        } catch (error) {
            console.error('Error fetching nurses:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };

    const getDoctors = async () => {
        try {
            let res = await get(`/patients/AllDoctor/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=300`);
            console.log(res);
            let tempDoc = res?.data
                ?.filter((doc) => doc?.username)
                .map((doc) => {
                    return { label: doc?.username, value: parseFloat(doc?.employeeId) };
                });

            tempDoc?.unshift({ label: "Select Doctor", value: "" });
            setDoctors(tempDoc);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };


    const addAppointmemt = async () => {
        try {
            let res = await post(`/patients/${sessionStorage?.getItem("patientId")}/addpatientnote`, { ...payload, });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex ">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-4">
                        <p>Patient's Appointment</p>
                    </div>
                </div>
                <div className="p-20">
                    <div className='flex space-between flex-v-center'>
                        <div className='m-r-10'>
                            <TagInputs label="Appointment Date" onChange={handleChange} type='date' name="date" />
                        </div>
                        <div>
                            <TagInputs label="Appointment Time" onChange={handleChange} type='time' name="appointmentTime" />
                        </div>
                    </div>
                    <div className='w-100'>
                        <TagInputs label="Doctor to meet" name="assignedDoctor" onChange={handleSelectChange} type='R-select' options={doctors} />
                    </div>


                    <div>
                        <TagInputs label="Additional Details" name="additonalDetails" onChange={handleChange} type='textArea' />
                    </div>

                    <button className="submit-btn m-t-20 w-100" onClick={addAppointmemt}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Appointment;