import { useEffect, useState } from "react";
import { IoMdClose } from 'react-icons/io'
import { get, post, put } from "../../utility/fetch";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import axios from "axios";

const EquipmentModal = ({ closeModal, setRoomData, roomId, data }) => {
    const [payload, setPayload] = useState({
        equipmentId: data?.id,
        quantity: data?.qty,
        roomId: data?.room?.id,
        location: data?.location,
        assignNote: data?.assignNote,
    });

    const [userNames, setUserNames] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [rooms, setRooms] = useState([]);



    useEffect(() => {
        getUsers();
        getRooms()
    }, [])




    const getUsers = async () => {
        try {
            let res = await get("/patients/AllPatient/2?pageIndex=1&pageSize=10000");
            console.log(res)
            let temp = res?.data?.map((user) => ({
                name: `${user.firstName} ${user.lastName}`,
                value: user.patientId,
            }));

            temp.unshift({ name: "Select Patient", value: 0 });
            setUserNames(temp);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getRooms = async () => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'GET', // Change method to GET for axios.get
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.get("https://edogoverp.com/clinicapi/api/room/list/1/1000", options);
            console.log(res);
            let roomList = res?.data?.resultList || []; // Adjusted to access data property

            roomList.unshift({ name: "Select Room", id: 0 });
            setRooms(roomList.map((item) => ({ value: item?.id, name: item.name })));
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    // const getEquipment = async () => {
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
    //         let res = await axios.get(`https://edogoverp.com/clinicapi/api/assignequipmentpatient/list/${1}/10000`, options);
    //         console.log(res)
    //         let temp = res?.resultList?.map((data) => ({
    //             name: data?.equipment?.name,
    //             value: data?.equipment?.id,
    //         }));
    //         temp.unshift({ name: "Select Equipment", value: 0 });
    //         setEquipment(temp);
    //     } catch (error) {
    //         console.error('Error fetching equipment:', error);
    //     }
    // };

    const handleChange = (event) => {
        if (event.target.name === "roomId") {
            setPayload({
                ...payload,
                roomId: Number(event.target.value),
            });
        }
        else if (event.target.name === "quantity") {
            setPayload({
                ...payload,
                quantity: Number(event.target.value),
            });
        }
        else {
            setPayload({ ...payload, [event.target.name]: event.target.value });
        }
    };

    console.log(payload);
    console.log(data);

    const assignEquipment = async () => {
        const { equipmentId, roomId, quantity, assignNote, location } = payload;

        if (!roomId === 0 || quantity === 0 || assignNote === "" || location === '') {
            notification({ message: "Please fill all the fields", type: "error" });
            return;
        }
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.post(`https://edogoverp.com/clinicapi/api/assignequipmentpatient`, payload, options);
            console.log(res);
            if (res?.statusCode === 409) {
                notification({ message: "Equipment Already Assigned", type: "error" });
                return;
            } else if (res) {
                notification({ message: "Equipment Assigned Successfully", type: "success" });
                setPayload({
                    equipmentId: 0,
                    roomId: roomId,
                    location: '',
                    quantity: 0,
                    assignNote: "",
                });
                closeModal();
            }
        } catch (error) {
            console.error('Error assigning equipment:', error);
            notification({ message: "Failed to assign equipment", type: "error" });
        }
    };




    return (
        <div className="modal">
            <IoMdClose className="close-btn pointer" onClick={() => closeModal()} />
            <div className="modal-contents" >
                <div className="p-10">
                    <div
                        className="m-t-10 p-t-10 flex-h-center modal-content-large"
                        style={{
                            boxShadow: '0px 2px 6px #0000000A',
                            // backgroundColor: 'white'
                        }}
                    >
                        <h3 className="m-b-40">Assign an equipment</h3>
                        {/* <TagInputs type="select" value={data && payload?.equipmentName} options={equipment} name="equipmentName" onChange={handleChange} label="Select Equipment" /> */}
                        {/* <TagInputs type="select" value={data && payload?.name} options={userNames} name="patientName" onChange={handleChange} label="Select Patient" /> */}
                        <TagInputs variation="number" name="quantity" onChange={handleChange} label="Quantity" />
                        <TagInputs type="select" options={rooms} name="roomId" onChange={handleChange} label="Select Room" />
                        <TagInputs name="location" onChange={handleChange} label="Location" />
                        <TagInputs type="textArea" name="assignNote" onChange={handleChange} label="Notes" />

                        <button onClick={assignEquipment} className="submit-btn w-100 m-t-10">Submit</button>


                    </div>
                </div>
            </div>

        </div >
    )
}

export default EquipmentModal;