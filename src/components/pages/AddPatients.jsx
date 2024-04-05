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
            <div className="w-40"><TagInputs label="New or Referred" type="select" options = {patientType} /></div>
            {/* <TagInputs label="First Name" />
            <TagInputs label="Last Name" />
            <TagInputs label="Gender" type="select" options={gender} />
            <TagInputs label="Date of Birth" type = "date" />
            <TagInputs label="Email Address" />
            <TagInputs label="Phone Number" />
            <p className="m-t-20">Profile Details</p>
            <TagInputs label="User Name" />
            <TagInputs label="Password" type="password" />
            <TagInputs label="Confirm Password" type="password" />*/}
            <div><button onClick={()=> navigate("/patient-details")} className="btn  m-t-20">Next</button> </div> 
        </div>
    )
}

export default AddPatients