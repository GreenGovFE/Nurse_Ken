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
    <div className="w-100 m-t-10">
      <div className="w-100 none-flex-item  ">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Blood Pressure (mmHg)</th>
              <th className="center-text">Weight (Kg)</th>
              <th className="center-text">Temp  (°C)</th>
              <th className="center-text">Height (cm)</th>
              <th className="center-text">Heart (bpm)</th>
              <th className="center-text">Respiration (bpm)</th>
              <th className="center-text">Admin Nurse</th>
              <th className="center-text">Assigned Doctor</th>
              <th className="center-text"></th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (  
              <tr key={row.id}>
                <td style={{minWidth: '100px'}}>{formatDate(row.dateOfVisit)}</td>
                <td>{row.bloodPressure}</td>
                <td>{row.weight}</td>
                <td>{row.temperature}</td>
                <td>{row.height}</td>
                <td>{row.heartPulse}</td>
                <td>{row.respiratory}</td>
                <td>{(row.nurseName)}</td>
                <td>{(row.doctorName)}</td>
                <td onClick={selectRecord(row)}><img className="hovers pointer" src="/details.png" /></td>
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
