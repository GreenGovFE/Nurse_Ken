import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill } from "react-icons/ri";
import { usePatient } from "../../contexts";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

function Discharge({ closeModal, appointment, fetch, currentPage }) {
    const [payload, setPayload] = useState({});
    const { patientId, patientName } = usePatient();
    const [Loading, setLoading] = useState(false);

    const requiredFields = {
        dischargeNote: "Discharge Note",
    };

    const checkMissingFields = (payload) => {
        const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
        return missingFields;
    };

    const discharge = () => {
        setLoading(true);
        const data = {
            appointId: appointment?.id,
            dischargeNote: payload?.dischargeNote
        }
        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            setLoading(false)
            return;
        }
        post(`/patients/discharge-patient`, data)
            .then(res => {
                if (res.message === "The patient has dis-charged") {
                    notification({ message: 'Discharged successfully', type: "success" });
                    fetch(currentPage)
                    setLoading(false)
                } else {
                    notification({ message: 'Failed to discharge patient', type: "error" });
                    setLoading(false)
                }
            })
            .catch(err => {
                notification({ message: 'Failed to discharge patient', type: "error" });
                setLoading(false)
            })
    }

    const handleChange = (event, name) => {
        setPayload(prevPayload => ({ ...prevPayload, [name]: event?.target?.value }));
    };

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, dischargeNote: prevPayload.dischargeNote ? prevPayload.dischargeNote + ' ' + transcript : transcript }));
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={() => closeModal(false)} />
            <div className="modal-contents">
                <div className="flex ">
                    <div className="flex  flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Discharge Note</p> | <p className={'m-l-10'}>{patientName}</p>
                    </div>

                </div>

                <div className="">
                    <GhostTextCompletion
                        label="Discharge Notes"
                        name="dischargeNotes"
                        value={payload?.dischargeNote}
                        handleChange={(e) => handleChange(e, 'dischargeNote')}
                    />
                    
                </div>
                <button className="submit-btn m-t-20 w-100" disabled={Loading} onClick={discharge}>Discharge</button>

            </div>


        </div>
    );
}

export default Discharge;
