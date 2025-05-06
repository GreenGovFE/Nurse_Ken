import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import TagInputs from "../layouts/TagInputs";
import notification from "../../utility/notification";
import { usePatient } from "../../contexts";
import { post } from "../../utility/fetch";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

function AdministerMed({ medication, closeModal, nurses, doctors, treatment, source }) {
    const { patientId, patientName } = usePatient();
    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState({
        administeredDate: "",
        administeredTime: "",
        volumeGiven: "",
        units: "",
        otherNotes: "",
    });
    const administrationFrequencies = [
        { id: 1, name: 'Immediately' },
        { id: 2, name: 'As needed' },
        { id: 3, name: 'Once daily' },
        { id: 4, name: 'Twice a day' },
        { id: 5, name: 'Three times a day' },
        { id: 6, name: 'Four times a day' },
        { id: 7, name: 'At night' },
        { id: 8, name: 'Morning' },
        { id: 9, name: 'Evening' },
        { id: 10, name: 'Every 24 hours' },
        { id: 11, name: 'Every 12 hours' },
        { id: 12, name: 'Every 8 hours' },
        { id: 13, name: 'Every 6 hours' },
        { id: 14, name: 'Every 4 hours' },
        { id: 15, name: 'Every 3 hours' },
        { id: 16, name: 'Every 2 hours' },
        { id: 17, name: 'Every hour' },
        { id: 18, name: 'Every 2 months' },
        { id: 19, name: 'Every 3 months' },
    ];

    const drugStrengthUnits = [
        { id: 0, name: "Milligrams" },
        { id: 1, name: "Grams" },
        { id: 2, name: "Micrograms" },
        { id: 3, name: "Milliliters" },
        { id: 4, name: "Liters" },
        { id: 5, name: "Units" },
        { id: 6, name: "Puffs" },
        { id: 7, name: "Sprays" },
        { id: 8, name: "Drops" },
        { id: 9, name: "Patch" },
        { id: 10, name: "Bottle" },
        { id: 11, name: "TransdermalSystem" },
        { id: 12, name: "Tablet" },
        { id: 13, name: "Capsule" },
        { id: 14, name: "Suppository" },
        { id: 15, name: "Scoop" },
        { id: 16, name: "Sachet" },
        { id: 17, name: "Ampoule" },
        { id: 18, name: "Vial" },
        { id: 19, name: "InjectionPen" },
        { id: 20, name: "Enema" },
        { id: 21, name: "Ounces" },
        { id: 22, name: "Teaspoon" },
        { id: 23, name: "Tablespoon" },
        { id: 24, name: "Milliequivalents" },
        { id: 25, name: "InternationalUnits" }
    ];

    const routesOfAdministration = [
        { id: 1, name: 'Orally' },
        { id: 2, name: 'Sublingual' },
        { id: 3, name: 'Topical' },
        { id: 4, name: 'Inhalation' },
        { id: 5, name: 'Suppository' },
        { id: 6, name: 'IV' },
        { id: 7, name: 'IM' },
        { id: 8, name: 'Subcut' },
        { id: 9, name: 'Intradermal' },
        { id: 10, name: 'PerRectum' },
        { id: 11, name: 'PerVagina' },
        { id: 12, name: 'Implant' },
    ];

    const handleChange = (event, name) => {
        if (name === "doctorId" || name === "nurse") {
            setPayload(prevPayload => ({ ...prevPayload, [name]: Number(event?.value) }));
        } else {
            setPayload(prevPayload => ({ ...prevPayload, [name]: event?.target?.value }));
        }
    };


    console.log(source, medication)
    const administerMed = async () => {
        setLoading(true);
        const formattedTime = payload.administeredTime
            ? { hours: parseInt(payload.administeredTime.split(":")[0], 10), minutes: parseInt(payload.administeredTime.split(":")[1], 10) }
            : null;

        const data = {
            administeredBy: nurses.find(nurse => nurse.value === payload.nurse)?.name,
            treatmentId: 0,
            serviceTreatmentId: treatment?.id,
            patientId: Number(patientId),
            clinicId: Number(sessionStorage.getItem("clinicId")),
            otherNotes: payload?.otherNotes,
            units: payload?.units,
            administeredDate: payload?.administeredDate,
            administeredTime: formattedTime,
            volumeGiven: Number(payload?.volumeGiven),
            medicationName: medication?.pharmacyInventory?.productName,
            medicationSource: source,
            medicationId: medication?.id || 0,
        };

        const requiredFields = {
            otherNotes: "Additional Notes",
            units: "Units",
            administeredDate: "Administered Date",
            administeredTime: "Administered Time",
            volumeGiven: "Volume Given",
        };

        const checkMissingFields = (payload) => {
            const missingFields = Object.keys(requiredFields).filter(field => !payload[field]);
            return missingFields;
        };

        const missingFields = checkMissingFields(payload);
        if (missingFields.length > 0) {
            const missingFieldLabels = missingFields.map(field => requiredFields[field]);
            notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
            setLoading(false);
            return;
        }

        try {
            const res = await post(`/patients/prescription-log`, data);
            if (res) {
                notification({ message: 'Medication administered successfully', type: "success" });
                closeModal();
            } else {
                notification({ message: 'Failed to administer medication', type: "error" });
            }
        } catch (err) {
            notification({ message: 'Failed to administer medication', type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleTranscript = (transcript) => {
        setPayload(prevPayload => ({ ...prevPayload, otherNotes: prevPayload.otherNotes ? prevPayload.otherNotes + ' ' + transcript : transcript }));
    };

    return (
        <div className="overlay">
            <RiCloseFill className="close-btn pointer" onClick={closeModal} />
            <div className="modal-content">
                <h4>Administer Medication</h4>
                <p><strong>Medication:</strong> <span style={{ fontWeight: "bold", color: "green"}}>{medication?.pharmacyInventory?.productName} {medication?.quantity} {drugStrengthUnits.find(unit => unit.id === medication?.drugStrengthUnit)?.name || 'N/A'}</span> </p>
                <p>
                    <strong>Route of Administration:</strong> <span style={{ fontWeight: "bold", color: "green"}}>{routesOfAdministration?.find(route => route.id === medication?.routeOfAdministration)?.name}</span>
                </p>
                <p>
                    <strong>Frequency of Administration: </strong> 
                    <span style={{fontWeight: "bold", color: medication?.administrationFrequency === 1 ? 'red' : 'green' }}>
                        {administrationFrequencies?.find(freq => freq.id === medication?.administrationFrequency)?.name}
                    </span>
                </p>
                <TagInputs type={'R-select'} options={nurses?.map((nurse) => {
                    return {
                        label: nurse?.name,
                        value: nurse?.value
                    }
                })} label="Administering Nurse" name="nurse" onChange={(e) => handleChange(e, 'nurse')} />
                <TagInputs
                    label="Administered Date"
                    name="administeredDate"
                    type="date"
                    onChange={(e) => handleChange(e, 'administeredDate')}
                />
                <TagInputs
                    label="Administered Time"
                    name="administeredTime"
                    type="time"
                    onChange={(e) => handleChange(e, 'administeredTime')}
                />
                <TagInputs
                    label="Volume Given"
                    name="volumeGiven"
                    variation='number'
                    onChange={(e) => handleChange(e, 'volumeGiven')}
                />
                <TagInputs
                    label="Units"
                    name="units"
                    onChange={(e) => handleChange(e, 'units')}
                />
                <GhostTextCompletion
                    label="Other Notes"
                    name="otherNotes"
                    value={payload?.otherNotes}
                    handleChange={(e) => handleChange(e, 'otherNotes')}
                />

                <button className="submit-btn m-t-20 w-100" onClick={administerMed} disabled={loading}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default AdministerMed;
