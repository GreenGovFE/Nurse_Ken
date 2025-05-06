import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import React from "react";
import Cookies from 'js-cookie';


const VitalPatientsTable = ({ currentPage, data, itemsPerPage }) => {
  const { setPatientId, setPatientName, setHmoId, setPatientInfo } = usePatient();

  let navigate = useNavigate();

  const continueUpdate = (id, data) => {
    setPatientId(id);
    Cookies.set('patientId', id)
    setPatientName(`${data.firstName} ${data.lastName}`);
    setHmoId(data?.hmoId);
    setPatientInfo(data);
    localStorage.setItem('from', true);
    navigate("/patient-details");
  }
  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">Patient's Ref</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Vital Nurse</th>
              <th className="center-text">Vital Date</th>
              <th className="center-text">Time Sent</th>

            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr className="hovers pointer" onClick={() => continueUpdate(row?.patientId || row?.id, row)} key={row?.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patientRef}</td>

                  <td>
                    <div>
                      {row?.firstName} {row?.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{row?.lastName}</td>
                  <td>{row?.vitalNurse}</td>
                  <td>{new Date(row?.admissionDate).toLocaleDateString()}</td>
                  <td>
                    {new Date(row?.admissionDate.split('.')[0]).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true, // Adjust for 12-hour format (AM/PM)
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VitalPatientsTable;