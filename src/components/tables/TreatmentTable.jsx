import { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import NurseNoteTreatment from "../modals/NurseNoteTreatment";
import { usePatient } from "../../contexts";

function TreatmentTable({ data }) {
  const { patientId } = usePatient();
  const [combinedData, setCombinedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [notes, setNotes] = useState('');
  const [add, setAdd] = useState(false); // Add loading state'
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchData = async () => {
    try {
      const response = await get(`/patients/GetAllVisitationRecordByPatientId?patientId=${patientId}`);
      const combined = data.map(treatment => {
        const correspondingVisit = response.data.find(visit => visit.visitId === treatment.visitId);
        return {
          ...treatment,
          nurseName: correspondingVisit ? correspondingVisit.nurseName : 'No Nurse Assigned',
          nurseNotes: correspondingVisit ? correspondingVisit.notes : 'No Notes',
          nurseId: correspondingVisit ? correspondingVisit.nurseId : 0
        };
      });
      console.log(combined);

      setCombinedData(combined);
    } catch (e) {
      console.log(e);
    }
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      console.log(res);
      let tempNurses = res?.data?.map((nurse) => {
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
      console.log(res);
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
  };

  const selectRecord = (record) => () => {
    setViewing(record);
    setNotes(record.nurseNotes);
    setIsModalOpen(true);
  };

  const addNotes = (record) => () => {
    setViewing(record);
    setNotes(record.nurseNotes);
    setIsModalOpen(true);
    setAdd(true)
  };

  console.log(combinedData)

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
              <th className="center-text">Nurse Note</th>
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
                <td>{row.nurseName}</td>
                <td onClick={selectRecord(row)}>
                  <img className="hovers pointer" src="/details.png" alt="Details" />
                </td>
                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                  {row?.diagnosis}
                </td>
                <td>
                  {row?.medications?.map((med, index) => (
                    <div key={med.id} className="m-b-10 flex flex-direction-v">
                      <div className="flex">
                        <span>{index + 1}.</span>
                        <span className="m-l-20">{med ? med.name : 'No Medication'}</span>
                      </div>
                    </div>
                  ))}
                  <span className="m-t-10 m-b-10 add-note" onClick={addNotes(row)}>
                    Add to patient's note
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <NurseNoteTreatment
          visit={viewing}
          notes={notes}
          add={add}
          closeModal={closeModal}
          doctors={doctors}
          nurses={nurses}
        />
      )}


    </div>
  );
}

export default TreatmentTable;
