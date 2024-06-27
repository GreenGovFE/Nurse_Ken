import { useEffect, useState } from "react";
import { IoMdClose } from 'react-icons/io';
import { get } from "../../utility/fetch";
import notification from "../../utility/notification";
import axios from "axios";
import TagInputs from "../layouts/TagInputs";

const AmbulanceModal = ({ closeModal, setRoomData, data, getRooms }) => {
    const [payload, setPayload] = useState({
        ambulanceId: data?.id,
        patientId: data?.patientId,
        location: data?.location,
        destination: data?.destination,
        assignNote: data?.assignNote,
        driverUserId: 8,
        bookedDate: data?.bookedDate,
        bookedTime: data?.bookedTime
    });

    const [userNames, setUserNames] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        let res = await get("/patients/AllPatient/2?pageIndex=1&pageSize=10000");
        console.log(res);
        let temp = res?.data?.map((user) => ({
            name: `${user.firstName} ${user.lastName}`,
            value: user.patientId,
        }));

        temp.unshift({ name: "Select Patient", value: 0 });
        setUserNames(temp);
    };

    const handleChange = (event) => {
        if (event.target.name === "patientId") {
            setPayload({
                ...payload,
                patientId: Number(event.target.value),
            });
        } else {
            setPayload({ ...payload, [event.target.name]: event.target.value });
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = (`0${d.getDate()}`).slice(-2);
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const hours = (`0${d.getHours()}`).slice(-2);
        const minutes = (`0${d.getMinutes()}`).slice(-2);
        return `${hours}:${minutes}`;
    };

    const assignAmbulance = async () => {
        const currentTime = new Date();
        const formattedDate = formatDate(payload.bookedDate);
        const formattedTime = formatTime(currentTime);

        const {
            ambulanceId,
            patientId,
            location,
            destination,
            assignNote,
            driverUserId,
        } = payload;

        if (
            patientId === 0 ||
            location === '' ||
            assignNote === "" ||
            destination === '' ||
            formattedDate === '' ||
            formattedTime === ''
        ) {
            notification({ message: "Please fill all the fields", type: "error" });
            return;
        }

        const updatedPayload = {
            ...payload,
            bookedDate: formattedDate,
            bookedTime: formattedTime,
        };

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.post(`https://edogoverp.com/clinicapi/api/assignambulance`, updatedPayload, options);
            console.log(res);
            if (res?.data?.statusCode === 409) {
                notification({ message: "Ambulance Already Assigned", type: "error" });
                return;
            } else if (res) {
                notification({ message: "Ambulance Assigned Successfully", type: "success" });
                setPayload({
                    ambulanceId: 0,
                    patientId: 0,
                    location: '',
                    destination: '',
                    assignNote: '',
                    driverUserId: 8,
                    bookedDate: '',
                    bookedTime: ''
                });
                closeModal();
            }
        } catch (error) {
            console.error('Error assigning ambulance:', error);
            notification({ message: "Failed to assign ambulance", type: "error" });
        }
    };

    return (
        <div className="modal">
            <IoMdClose className="close-btn pointer" onClick={() => closeModal()} />
            <div className="modal-contents">
                <div className="p-10">
                    <div
                        className="m-t-10 p-t-10 flex-h-center modal-content-large"
                        style={{
                            boxShadow: '0px 2px 6px #0000000A',
                        }}
                    >
                        <h3 className="m-b-20">Assign Ambulance to Patient</h3>
                        <TagInputs type="select" options={userNames} name="patientId" onChange={handleChange} label="Select Patient" />
                        <TagInputs name="destination" onChange={handleChange} label="Destination" />
                        <TagInputs name="location" onChange={handleChange} label="Location" />
                        <TagInputs type="date" name="bookedDate" onChange={handleChange} label="Book A Date" />
                        <TagInputs type="textArea" onChange={handleChange} name="assignNote" label="Additional notes" />
                        <button onClick={assignAmbulance} className="submit-btn w-100 m-t-10">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmbulanceModal;
