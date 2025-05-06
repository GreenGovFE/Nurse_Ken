import { useEffect, useState } from "react";
import { get, put } from "../../utility/fetch";
import NurseNoteTreatment from "../modals/NurseNoteTreatment";
import { usePatient } from "../../contexts";
import DetailedNotes from "../modals/detailedNotes";
import DetailedNurseNotes from "../modals/DetailedNurseNotes";
import notification from "../../utility/notification";
import { useNavigate } from "react-router-dom";

function TreatmentTable({ data, reset }) {
  const { patientId, setPatientId, setPatientInfo, setPatientName, setDiagnosis, setHmoDetails } = usePatient();
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
  const [patient, setPatient] = useState([]);
  const [NotesModal, setNotesModal] = useState(false)
  const [vital, setVital] = useState([])
  const navigate = useNavigate()




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
          heartPulse: correspondingVital ? correspondingVital?.heartPulse : '',
          respiratory: correspondingVital ? correspondingVital?.respiratory : '',
          height: correspondingVital ? correspondingVital?.height : '',
          weight: correspondingVital ? correspondingVital?.weight : treatment?.weight,
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

  // const selectRecord = (record) => () => {
  //   setViewing(record);
  //   setNotes(record.nurseNotes);
  //   setNotesModal(true);
  // };

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

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=${1}&pageSize=${1000}`);
      setPatient(res?.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRecord = (record) => async () => {
    const admitted = await Admit(record?.id);
    if (!admitted) return;

    setPatientId(record?.patient?.id);
    const patientRecord = patient?.find((p) => p?.patientId === record?.patientId);

    if (patientRecord) {
      setHmoDetails({
        hmoId: patientRecord.hmoId,
        hmoPackageId: patientRecord.hmoPackageId,
      });
      setPatientName(`${patientRecord.firstName} ${patientRecord.lastName}`);
    }
    setDiagnosis(record?.diagnosis);
    setViewing(record);
    navigate('/facility');
  };

  const Admit = async (id, record) => {
    const url = `/ServiceTreatment/${id}/patient/${patientId}/admit-patient`;
    setLoading(true);
    try {
      const res = await put(url);
      if (res?.statusCode === 200) {
        notification({ message: "Successfully admitted patient", type: "success" });
        setPatientId(record?.patient?.id);
        const patientRecord = patient?.find((p) => p?.patientId === record?.patientId);

        if (patientRecord) {
          setHmoDetails({
            hmoId: patientRecord.hmoId,
            hmoPackageId: patientRecord.hmoPackageId,
          });
          setPatientName(`${patientRecord.firstName} ${patientRecord.lastName}`);
        }
        setDiagnosis(record?.diagnosis);
        setViewing(record);
        navigate('/facility');
      } else {
        notification({ message: "Failed to admit patient", type: "error" });
      }
    } catch (error) {
      notification({ message: `Failed to admit patient`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Care Plan</th>
              <th className="center-text">Doctor</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Medication/Prescription</th>
              <th className="center-text">Attached Documents</th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {combinedData.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.dateOfVisit).toLocaleDateString()}</td>
                <td>{row?.carePlan}</td>
                <td>{row?.doctor?.firstName} {row?.doctor?.lastName}</td>
                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                  {row?.diagnosis}
                </td>
                <td>
                  {row?.medications?.map((med, index) => (
                    <div key={med?.id} className="m-b-10 flex flex-direction-v">
                      <div className="flex">
                        <span>{index + 1}.</span>
                        <span className="m-l-20">{med ? med?.pharmacyInventory?.productName : 'No Medication'}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-direction-v">
                    {row?.isAdmitted ? ''
                      :
                      <>
                        <button className="m-t-10 m-b-10 submit-btn" onClick={() => Admit(row?.id, row)}>
                          Admit Patient
                        </button>
                      </>

                    }
                    <button className="m-t-10 m-b-10 submit-btn" onClick={addNotes(row, 'view meds')}>
                      View Medications/Prescription Details
                    </button>
                    <button className="m-t-10 m-b-10 submit-btn" onClick={addNotes(row, 'nurse notes')}>
                      View Nurse Notes
                    </button>
                    <span className="m-t-10 m-b-10 admit-status">
                      {row?.isAdmitted ? 'Admitted' : 'Vitisted'}
                    </span>
                  </div>

                </td>
                <td>{row?.consentDocuments?.map((doc) => (
                  <div className="flex flex-direction-v">
                    <a href={doc.docPath} target="_blank" className="m-r-10">
                      {doc.docName}
                    </a>
                  </div>
                ))}</td>
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
          reset={reset}

        />
      )}
    </div>
  );
}

export default TreatmentTable;
