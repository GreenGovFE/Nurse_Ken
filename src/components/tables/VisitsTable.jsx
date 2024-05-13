import React, { useState, useEffect } from "react";
import { get } from "../../utility/fetch";
import Visits from "../pages/Patient/Visits";
import ViewVisit from "../modals/visits";

function VisitsTable({ data }) {
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [viewing, setViewing] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);

  };



  const selectRecord = (record) => () => {
    console.log(record);
    setViewing(record);
    setIsModalOpen(true);
  };

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
    return doctor ? doctor?.username : "Doctor Not Found";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return
    }
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Date</th>
              <th>Blood Pressure</th>
              <th>Weight</th>
              <th>Temp</th>
              <th>Height</th>
              <th>Heart</th>
              <th>Resp</th>
              <th>Admin Nurse</th>
              <th>Assigned Doctor</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.dateOfVisit)}</td>
                <td>{row.bloodPressure}</td>
                <td>{row.weight}</td>
                <td>{row.temperature}</td>
                <td>{row.height}</td>
                <td>{row.heartPulse}</td>
                <td>{row.respiratory}</td>
                <td>{getNurseName(row.nurseId)}</td>
                <td>{getDoctorName(row.doctorId)}</td>
                {/* <td onClick={selectRecord(row)}><img className="hovers pointer" src="/details.png" /></td> */}
              </tr>

            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen &&
        <ViewVisit
          closeModal={closeModal}
          visit={viewing}
        />
      }
    </div>
  );
}

export default VisitsTable;
