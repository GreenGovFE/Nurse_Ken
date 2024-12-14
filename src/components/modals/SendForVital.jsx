import React, { useCallback, useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import { usePatient } from '../../contexts';
import notification from '../../utility/notification';

const MemoizedTagInputs = React.memo(TagInputs);

function SendForVital({ closeModal }) {
    const [nurses, setNurses] = useState([]);
    const [nurse, setNurse] = useState({});
    const [doctor, setDoctor] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState({});
    const { patientId, patientName } = usePatient();

    console.log(patientId)

    
    useEffect(() => {
        getNurses();
        getDoctors();
    }, []);


    const handleSelectChange = useCallback((value, name) => {
        if (name === 'nurse') {
            setNurse(value);
            setPayload(prevPayload => ({ ...prevPayload, NurseId: value?.value }));
        } else {
            setDoctor(value);
            setPayload(prevPayload => ({ ...prevPayload, doctorEmployeeId: value?.value }));
        }
    }, []);

    const getNurses = async () => {
        try {
            const res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
            const tempNurses = res?.data
                ?.filter((nurse) => nurse?.username)
                .map((nurse) => ({ label: nurse?.username, value: parseFloat(nurse?.employeeId) }));
            tempNurses?.unshift({ label: "Select Nurse", value: "" });
            setNurses(tempNurses);
        } catch (error) {
            console.error("Error fetching nurses:", error);
        }
    };

    const getDoctors = async () => {
        try {
            const res = await get(`/patients/AllDoctor/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=300`);
            const tempDoc = res?.data
                ?.filter((doc) => doc?.username)
                .map((doc) => ({ label: doc?.username, value: parseFloat(doc?.employeeId) }));
            tempDoc?.unshift({ label: "Select Doctor", value: "" });
            setDoctors(tempDoc);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };


    const fieldLabels = {
        NurseId: ' Assign Nurse'
    };

    const sendForVital = async () => {
        if (!validatePayload()) return;

        const url =`/Appointment/checkin-patient`;

        setLoading(true);
        try {
            const res = await post(url, {
                ...payload,
                patientId,
            });

            if (res?.message == "successfully checked in") {
                notification({ message: "successfully sent patient for vital", type: "success" });
                setPayload({});
                setNurse({});
                closeModal();
            } else {
                handleErrorResponse(res);
            }
        } catch (error) {
            notification({ message: `Failed to send for vital`, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleErrorResponse = (res) => {
        let errorMessage = `Failed to send for vital`;
        if (res.StatusCode === 401) {
            notification({ message: "Unauthorized Session", type: "error" });
        } else if (res.StatusCode === 500) {
            notification({ message: "Internal Server Error", type: "error" });
        } else {
            const errors = res.errors || {};
            const missingFields = Object.keys(errors).filter(field => errors[field].some(msg => /is required/i.test(msg)));
            if (missingFields.length > 0) {
                const formattedFields = missingFields.map(field => fieldLabels[field] || field.replace(/([a-z])([A-Z])/g, "$1 $2"));
                errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
            }
            notification({ message: errorMessage, type: "error" });
        }
    };

    const validatePayload = () => {
        let validationErrors = {};
        let missingFields = [];

        Object.keys(fieldLabels).forEach(field => {
            if (!payload[field]) {
                validationErrors[field] = `${fieldLabels[field]} is required`;
                missingFields.push(fieldLabels[field]);
            }
        });

        if (missingFields.length > 0) {
            const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
            notification({ message: errorMessage, type: "error" });
        }

        return Object.keys(validationErrors).length === 0;
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-4">
                        <h4>Send {patientName} For Vital</h4>
                    </div>
                </div>
                <div className="p-20">
                    <div className='w-100'>
                        <MemoizedTagInputs
                            label="Assign Nurse"
                            name="NurseId"
                            value={nurse}
                            onChange={(e) => handleSelectChange(e, 'nurse')}
                            type='R-select'
                            options={nurses}
                        />
                    </div>
                    <button className="submit-btn m-t-20 w-100" onClick={sendForVital} disabled={loading}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default SendForVital;
