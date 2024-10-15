import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';

function ViewVisit({ closeModal, visit, next }) {

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
        const { name, value } = event.target;
        setPayload(prevPayload => ({ ...prevPayload, [name]: value }));
    }

    const getNurses = async () => {
        try {
            let res = await get(
                `/patients/Allnurse/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
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
            let res = await get(
                `/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
                    "clinicId"
                )}&pageIndex=1&pageSize=30`
            );
            setDoctors(Array.isArray(res?.data) ? res?.data : []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            // Handle the error here, such as displaying an error message to the user
        }
    };

    const getNotes = async () => {
        try {
            let res = await get(
                `/patients/${sessionStorage.getItem("patientId")}/nursenotes/${visit?.visitId}`
            );
            setNotes(Array.isArray(res?.data) ? res?.data : []);
        } catch (error) {
            // Handle the error here
            console.error('Error fetching notes:', error);
        }
    };

    const addNotes = async () => {
        try {
            let res = await post(
                `/patients/${sessionStorage.getItem("patientId")}/addpatientnote`, { ...payload, nursesId: visit?.nurseId, doctorId: visit?.doctorId });
        } catch (error) {
            // Handle the error here
            console.error('Error fetching notes:', error);
        }
    };


    const getNurseName = (nurseId) => {
        const nurse = nurses?.find((nurse) => nurse?.nurseEmployeeId === nurseId);
        return nurse ? nurse?.username : "Nurse Not Found";
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors?.find((doctor) => doctor?.doctorEmployeeId === doctorId);
        return doctor ? doctor?.username : "None Assigned";
    };

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);




    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();

    const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const formattedDate = dateObject.toISOString().split("T")[0];
        return formattedDate;
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex ">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-3">
                        <p>Vitals Details</p>
                    </div>
                    {/* <div className="flex m-l-240 flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div> */}
                </div>
                <div className="p-20">

                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-20">Date</th>
                                <th>Weight</th>
                                <th>Temp</th>
                                <th>Height</th>
                                <th>Heart</th>
                                <th>Resp</th>
                                <th>Blood Pressure</th>

                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">

                            <tr >
                                <td>{formatDate(visit.dateOfVisit)}</td>

                                <td>{visit.weight}</td>
                                <td>{visit.temperature}</td>
                                <td>{visit.height}</td>
                                <td>{visit.heartPulse}</td>
                                <td>{visit.respiratory}</td>
                                <td>{visit.bloodPressure}</td>



                            </tr>


                        </tbody>
                    </table>

                    <TagInputs label="Assigned Nurse" name="assignedNurse" value={visit?.vitalNurseName} readOnly={true} />
                    {/* <TagInputs label="Assigned Doctor" name="assignedDoctor" value={visit?.doctorName} readOnly={true} /> */}
                    {
                        visit?.notes &&

                        visit.notes.map((data, index) => (
                            <div>
                                <TagInputs label="Additional Notes" name="additonalNoteOnTreatment" value={data} onChange={handleChange} readOnly={true} type='textArea' />
                            </div>
                        )

                        )
                    }
                    

                    {/* <button className="submit-btn m-t-20 w-100" onClick={() => addNotes}>Add Notes</button> */}
                </div>
            </div>
        </div>
    );
}

export default ViewVisit;