import { useEffect, useState } from "react";
import { get } from "../../utility/fetch";

function TreatmentTable({ data }) {

  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getNurses();
    getDoctors();
  }, []);

  const getNurses = async () => {
    try {
      let res = await get(
        `/patients/Allnurse/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
          "clinicId"
        )}&pageIndex=1&pageSize=10`
      );
      setNurses(Array.isArray(res?.data) ? res?.data : []);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getDoctors = async () => {
    try {
      let res = await get(
        `/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?clinicId=${sessionStorage.getItem(
          "clinicId"
        )}&pageIndex=1&pageSize=30`
      );
      setDoctors(Array.isArray(res?.data) ? res?.data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  const getNurseName = (nurseId) => {
    const nurse = nurses?.find((nurse) => nurse?.nurseEmployeeId === nurseId);
    return nurse ? nurse?.username : "Nurse Not Found";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find((doctor) => doctor?.doctorEmployeeId === doctorId);
    return doctor ? doctor?.username : "None Assigned";
  };
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Date</th>
              <th>Age</th>
              <th>Weight (Kg)</th>
              <th>Temperature  (°C)</th>
              <th>Admin Nurse</th>
              <th>Nurse Note</th>
              <th>Diagnosis</th>
              <th>Medication/Prescription</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.dateOfVisit).toLocaleDateString()}</td>
                <td>{row?.age}</td>
                <td>{row?.weight}</td>
                <td>{row?.temperature}</td>
                <td>{getDoctorName(row?.doctorId)}</td>
                <td>{row?.additionalNote || 'No Note'}</td>
                <td>{row?.diagnosis}</td>
                <td>
                  {row?.medications?.map((med) => (
                    <div key={med.id} className="m-b-10">
                      {med ? med.name : 'No Medication'}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default TreatmentTable;
