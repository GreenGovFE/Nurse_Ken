import React, { useCallback, useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import { usePatient } from '../../contexts';
import notification from '../../utility/notification';
import axios from 'axios';
import GhostTextCompletion from '../UI/TextPrediction';

const MemoizedTagInputs = React.memo(TagInputs);

function Blacklist({ closeModal }) {
    const [nurses, setNurses] = useState([]);
    const [nurse, setNurse] = useState({});
    const [doctor, setDoctor] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState({ reason: '' });
    const { patientId, patientName, patientInfo } = usePatient();
    const [services, setServices] = useState(null);
    const [service, setService] = useState({})
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});

    console.log(patientId,)


    const fieldLabels = {
        reason: ' Reason',
    };

    const Blacklist = async () => {
        if (!validatePayload()) return;

        const url = `/PatientBlackList/patient/${patientId}`;

        setLoading(true);
        try {
            const res = await post(url, {
                ...payload,
            });

            if (typeof res === 'number') {
                notification({ message: "successfully blaclisted patient", type: "success" });
                setPayload({ isEmergency: false });
                setNurse({});
                closeModal();
            } else {
                handleErrorResponse(res);
            }
        } catch (error) {
            notification({ message: `Failed to blaclist `, type: "error" });
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
            <RiCloseFill className='close-btn pointer' onClick={() => { closeModal(); setServices(null); setCategory({}) }} />
            <div className="modal-contents">
                <div className="flex">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-4">
                        <h4>Blacklist {patientName}</h4>
                    </div>
                </div>
                <div className="p-20">
                    <div className='w-100'>
                        <GhostTextCompletion
                            label="Select Category"
                            name="reason"
                            value={payload?.reason}
                            handleChange={ ( (e) => setPayload({ ...payload, reason: e.target.value }))}
                            type='textArea'
                        />
                    </div>
                </div>

                <button className="submit-btn m-t-20 w-100" onClick={Blacklist} disabled={loading}>Blacklist</button>
            </div>
        </div>
    );
}

export default Blacklist;
