import React, { useCallback, useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import { usePatient } from '../../contexts';
import notification from '../../utility/notification';
import axios from 'axios';

const MemoizedTagInputs = React.memo(TagInputs);

function SendForVital({ closeModal }) {
    const [nurses, setNurses] = useState([]);
    const [nurse, setNurse] = useState({});
    const [doctor, setDoctor] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState({ isEmergency: false });
    const { patientId, patientName, patientInfo } = usePatient();
    const [services, setServices] = useState(null);
    const [service, setService] = useState({})
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});

    console.log(patientId, service, nurse)


    useEffect(() => {
        getNurses();
        getDoctors();
        // getServices();
        getCategories();
    }, []);


    useEffect(() => {
        getCategoriesService();
    }, [category]);


    const handleSelectChange = useCallback((value, name) => {
        if (name === 'nurse') {
            setNurse(value);
            setPayload(prevPayload => ({ ...prevPayload, NurseId: value?.value }));
        } else if (name === 'category') {
            setCategory(value);
        } else {
            setService(value);
            setPayload(prevPayload => ({ ...prevPayload, serviceId: value?.value }));
        }
    }, []);

    const handleCheckboxChange = (event) => {
        setPayload(prevPayload => ({ ...prevPayload, isEmergency: event.target.checked }));
    };

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

    function filterClinicalServices(items) {
        return items.filter(item => item.category.name === "Clinical Service");
    }

    // const getServices = async () => {
    //     const token = sessionStorage.getItem('token');

    //     if (!token) {
    //         console.error('Token not found in session storage');
    //         return;
    //     }

    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     };

    //     try {
    //         const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/costsetup/list/1/1000`, options);

    //         const tempServices = res?.data?.resultList
    //             // ?.filter((service) => service.category.name === "Clinical Service" || service.category.name === "Clinical Services")
    //             .map((service) => ({ label: service?.serviceName, value: parseFloat(service?.serviceId) }));

    //         tempServices?.unshift({ label: "Select Service", value: "" });

    //         setServices(tempServices);
    //     } catch (error) {
    //         console.error("Error fetching services:", error);
    //     }
    // };

    const getCategories = async () => {
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
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/category/list/1/1000`, options);

            const tempServices = res?.data?.resultList
                // ?.filter((service) => service.category.name === "Clinical Service" || service.category.name === "Clinical Services")
                .map((category) => ({ label: category?.name, value: parseFloat(category?.id) }));

            tempServices?.unshift({ label: "Select Service", value: "" });

            setCategories(tempServices);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const getCategoriesService = async () => {
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
            setService({})
            setServices(null);
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/categoryitem/list/category/${category?.value}/1/1000`, options);

            const tempServices = res?.data?.resultList
                .map((service) => ({ label: service?.itemName, value: parseFloat(service?.id) }));

            tempServices?.unshift({ label: "Select Service", value: "" });

            setServices(tempServices);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fieldLabels = {
        NurseId: ' Assign Nurse'
    };

    const sendForVital = async () => {
        if (!validatePayload()) return;

        const url = `/Appointment/checkin-patient`;

        setLoading(true);
        try {
            const res = await post(url, {
                ...payload,
                patientId,
                appointmentId: patientInfo?.appointmentId || 0,
            });

            if (res?.message == "successfully checked in") {
                notification({ message: "successfully sent patient for vital", type: "success" });
                setPayload({ isEmergency: false });
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
            <RiCloseFill className='close-btn pointer' onClick={()=>{closeModal();setServices(null); setCategory({})}} />
            <div className="modal-contents">
                <div className="flex">
                    <div className="flex space-between flex-v-center m-t-20 m-l-20 col-4">
                        <h4>Send {patientName} For Vital</h4>
                    </div>
                </div>
                <div className="p-20">
                    <div className='w-100'>
                        <MemoizedTagInputs
                            label="Select Category"
                            name="category"
                            value={category}
                            onChange={(e) => handleSelectChange(e, 'category')}
                            type='R-select'
                            options={categories}
                        />
                    </div>
                </div>
                {Array.isArray(services) &&
                    <div className="p-20">
                        <div className='w-100'>
                            <MemoizedTagInputs
                                label="Select Service"
                                name="serviceId"
                                value={service}
                                onChange={(e) => handleSelectChange(e, 'serviceId')}
                                type='R-select'
                                options={services}
                            />
                        </div>
                    </div>
                }
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
                    <div className="flex flex-v-center m-t-20">
                        <input
                            type="checkbox"
                            id="isEmergency"
                            name="isEmergency"
                            checked={payload.isEmergency}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="isEmergency" className="m-l-10">Is Emergency</label>
                    </div>
                    <button className="submit-btn m-t-20 w-100" onClick={sendForVital} disabled={loading}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default SendForVital;
