import { useEffect, useState } from "react";
import TagInputsCheck from "./TagInputCheck";
import TagInputs from "./TagInputs";
import { IoMdClose } from 'react-icons/io'
import { get, post } from "../../utility/fetch";
import { get as getPatient } from "../../utility/fetchNurse";
import notification from "../../utility/notification";
import Notify from "../../utility/notify";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

const BedAssignModal = ({ closeModal, getBeds, data }) => {
    const [payload, setPayload] = useState({
        patientAssignedName: "",
        bedId: data.id,
        patientAssignedId: 0,
        assignNote: "",
        assignerUserId: Number(sessionStorage?.getItem("userId"))
    });
    const [selectedStaff, setSelectedStaff] = useState();

    
    const [staffIdInput, setStaffIdInput] = useState("");
    
    const [userNames, setUserNames] = useState([]);
    const getUsers = async () => {
        let res = await getPatient("/patients/AllPatient/2?pageIndex=1&pageSize=10000");
        setUserNames(res?.data?.map((user) => ({
            name: `${user.firstName} ${user.lastName}`,
            value: user.patientId,
        })))
    }

    const handleChange = (event) => {
        if (event.target.name === "patientAssignedId") {
            setStaffIdInput(event.target.value);
            setPayload({
                ...payload,
                patientAssignedName: userNames.find((item) => item?.value === Number(event.target.value)).name,
                patientAssignedId: Number(event.target.value),
            })
            setSelectedStaff(userNames.find((item) => item?.value === Number(event.target.value)).name);
        }
        else {
            setPayload({ ...payload, [event.target.name]: event.target.value });
        }
    }

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, assignNote: prevPayload.assignNote ? prevPayload.assignNote + ' ' + transcript : transcript }));
    };

    const assignBed = async () => {
        const {
            patientAssignedName,
            bedId,
            patientAssignedId,
            patientAssignedUserId,
            assignNote,
            assignerUserId } = payload;

        if (bedId === 0 || patientAssignedId === 0 || patientAssignedUserId === 0 || assignNote === "" || assignerUserId === 0 || patientAssignedName === "") {
            Notify({ title: "Error", message: "Please fill all the fields", type: "danger" });
            return;
        }

        let res = await post("/bed/assign-bed", { ...payload })
        if (res) {
            notification({ message: "Bed Assigned Successfully", type: "success" });
            closeModal();
            getBeds()
        }
    }

    useEffect(() => {
        getUsers();
        if (staffIdInput !== "") {
            getUsers(staffIdInput)
        }

    }, [staffIdInput]);

    return (
        <div className="overlay m-t-20 ">
            <IoMdClose className="close-btn pointer" onClick={() => closeModal()} />
            <div className="modal-content" >
                <div className="p-10">
                    <div
                        className="m-t-10 p-t-10 flex-h-center modal-content-large"
                        style={{
                            boxShadow: '0px 2px 6px #0000000A',
                        }}
                    >
                        <h3 className="m-b-10">Assign a Patient</h3>
                        <TagInputs type="select" value={staffIdInput} name="patientAssignedId" options={userNames} onChange={handleChange} label="Select Patient" />
                        <GhostTextCompletion
                            label="Additional Notes"
                            name="additionalNote"
                            value={payload?.assignNote}
                            handleChange={handleChange}
                        />
                       
                        <button onClick={assignBed} className="btn w-100 m-t-10">Submit</button>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default BedAssignModal;