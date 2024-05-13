import { RiGroup2Fill, RiHotelBedFill, RiUser2Fill } from "react-icons/ri";
export const PatientData = [
    {
        id: 'HS8980',
        firstName: "John",
        lastName: "Doe",
        weight: 80,
        age: 32,
        gender: "Male",
        height: 180,
        bloodGroup: "O+",
        temp: 36.5,
        bloodPressure: "120/80",
        heartRate: 80,
        respiratoryRate: 20,
        assignedNurse: "Dr. Smith",
        dateCreated: "2022-01-01",
        referred: true
    },

   

]


export const stats = [
    {
        number: "2,890",
        title: "Assigned Patients",
        icon: <RiHotelBedFill className="icon" size={32} />,
    },
    {
        number: "10,000",
        title: "Administered Out-Patients",
        icon: <RiUser2Fill className="icon" size={32} />,
    },
    {
        number: "1,000",
        title: "Waiting Assigned Patients",
        icon: <RiGroup2Fill className="icon" size={32} />,
    },
    {
        number: "6,080",
        title: "Admitted Patients",
        icon: <RiHotelBedFill className="icon" size={32} />,
    },
    {
        number: "3,700",
        title: "Patients with HMO",
        icon: <RiGroup2Fill className="icon" size={32} />,
    },
]

export const patientBreakdown = [
    {
        name: "Cardiology",
        value: 189,
    },
    {
        name: "Orthopedics",
        value: 120,
    },
    {
        name: "Gastroenterology",
        value: 80,
    },
    {
        name: "Neurology",
        value: 60,
    },
]

export const allergyData =[
    {
        date: "2022-01-01",
        allergyType: "Respiratory issues and hives",
        details: "the patient was very concerned and uncomfortable",
        prescribedMedication: "2 pills of vitamin C daily",
    },
    {
        date: "2022-01-01",
        allergyType: "Respiratory issues and hives",
        details: "the patient was very concerned and uncomfortable",
        prescribedMedication: "2 pills of vitamin C daily",
    },
    {
        date: "2022-01-01",
        allergyType: "Respiratory issues and hives",
        details: "the patient was very concerned and uncomfortable",
        prescribedMedication: "2 pills of vitamin C daily",
    },
]