import { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import NurseNoteTreatment from "../modals/NurseNoteTreatment";
import { usePatient } from "../../contexts";
import DetailedNotes from "../modals/detailedNotes";
import DetailedNurseNotes from "../modals/DetailedNurseNotes";

function TreatmentTable({ data }) {
  const { patientId } = usePatient();
  const [combinedData, setCombinedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [notes, setNotes] = useState('');
  const [add, setAdd] = useState(false); // Add loading state'
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurse, setNurse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nurseNotes, setNurseNotes] = useState(false);
  const [NotesModal, setNotesModal] = useState(false)
  const [vital, setVital] = useState([])



  const fetchData = async () => {
    try {
      const response = await get(`/patients/vital-by-patientId?patientId=${patientId}&pageIndex=${currentPage}&pageSize=1000`);
      setVital(response?.data);
      const combined = data?.map(treatment => {
        const correspondingVital = response?.data?.find(vital => vital?.vitalId === treatment?.vitalId);
        return {
          ...treatment,
          nurseName: correspondingVital ? correspondingVital.vitalNurseName : 'No Nurse Assigned',
          nurseNotes: correspondingVital ? correspondingVital.notes : 'No Notes',
          nurseId: correspondingVital ? correspondingVital.vitalNurseId : 0,
          bloodPressure: correspondingVital ? correspondingVital?.bloodPressure : '',
          heartPulse: correspondingVital? correspondingVital?.heartPulse : '',
          respiratory: correspondingVital? correspondingVital?.respiratory : '',
          height: correspondingVital? correspondingVital?.height : '',
          weight: correspondingVital? correspondingVital?.weight : treatment?.weight,
        };
      });
      setCombinedData(combined);
    } catch (e) {
      setCombinedData(data)
    }
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempNurses = res?.data
        ?.filter((nurse) => nurse?.username) 
        .map((nurse) => {
          return { name: nurse?.username, value: parseFloat(nurse?.employeeId) };
        });
  
      tempNurses?.unshift({ name: "Select Nurse", value: "" });
      setNurses(tempNurses);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  const getDoctors = async () => {
    try {
      let res = await get(`/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempDoc = res?.data?.map((doc) => {
        return { name: doc?.username, value: parseFloat(doc?.employeeId) };
      });

      tempDoc?.unshift({ name: "Select Doctor", value: "" });
      setDoctors(tempDoc);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getNurses();
    getDoctors();
  }, [])


  useEffect(() => {
    fetchData();
  }, [patientId, data]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false)
    setNurseNotes(false)
    setNotesModal(false)
  };

  const selectRecord = (record) => () => {
    setViewing(record);
    setNotes(record.nurseNotes);
    setNotesModal(true);
  };

  const addNotes = (record, type) => () => {
    if (type === 'view meds') {
      setViewing(record);
      setNotes(record?.nurseNotes);
      setIsModalOpen(true);
      setAdd(true)
    } else if (type === 'nurse notes') {
      setViewing(record);
      setNotes(record?.nurseNotes);
      setNurseNotes(true)
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Age</th>
              <th className="center-text">Weight (Kg)</th>
              <th className="center-text">Temperature (°C)</th>
              <th className="center-text">Admin Nurse</th>
              {/* <th className="center-text">Admin Note</th> */}
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Medication/Prescription</th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {combinedData.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.dateOfVisit).toLocaleDateString()}</td>
                <td>{row?.age}</td>
                <td>{row?.weight}</td>
                <td>{row?.temperature}</td>
                <td>{row?.nurseName}</td>
                {/* <td onClick={selectRecord(row)}>
                  <img className="hovers pointer" src="/details.png" alt="Details" />
                </td> */}
                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                  {row?.diagnosis}
                </td>
                <td>
                  {row?.medications?.map((med, index) => (
                    <div key={med?.id} className="m-b-10 flex flex-direction-v">
                      <div className="flex">
                        <span>{index + 1}.</span>
                        <span className="m-l-20">{med ? med.name : 'No Medication'}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex col-8">
                    <span className="m-t-10 m-b-10 add-note" onClick={addNotes(row, 'view meds')}>
                      View Medications/Prescription Details
                    </span>
                    <span className="m-t-10 m-b-10 m-l-20 add-note" onClick={addNotes(row, 'nurse notes')}>
                      View Nurse Notes
                    </span>
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <DetailedNotes
          treatment={viewing}
          notes={notes}
          add={add}
          closeModal={closeModal}
          doctors={doctors}
          nurses={nurses}
        />
      )}
      {NotesModal && (
        <NurseNoteTreatment
          visit={viewing}
          notes={notes}
          add={add}
          closeModal={closeModal}
          doctors={doctors}
          nurses={nurses}
        />
      )}

      {nurseNotes && (
        <DetailedNurseNotes
          treatment={viewing}
          notes={notes}
          add={add}
          closeModal={closeModal}
          doctors={doctors}
          nurses={nurses}
          vital={vital}

        />
      )}



    </div>
  );
}

export default TreatmentTable;
