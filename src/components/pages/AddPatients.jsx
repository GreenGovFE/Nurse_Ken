import { useNavigate } from "react-router"
import TagInputs from "../layouts/TagInputs"

let gender = [
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },

]
let patientType = [{ value: "New", name: "New" }, { value: "Referred", name: "Referred" }
]
const AddPatients = () => {
    const navigate = useNavigate()
    return (
        <div className="m-t-80 flex  w-100 flex-direction-v flex-v-center">
            <div className="w-40"><TagInputs className={'m-b-10'} label="New or Referred" type="select" options={patientType} /></div>
            <div>
                <button onClick={() => navigate("/patient-details")} className="btn  m-t-20">Next</button>
            </div>
        </div>
    )
}

export default AddPatients