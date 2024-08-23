import React from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";

function PatientsTable({ data, currentPage, itemsPerPage }) {
  const { setPatientId, setPatientName, setPatientPage, setHmoId, setPatientInfo } = usePatient();

  let navigate = useNavigate();

  const continueUpdate = (id, data) => {
    console.log(data);
    setPatientId(id);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setHmoId(data?.hmoId);
    setPatientInfo(data);
    navigate("/patient-details");
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Email</th>
              <th className="center-text">Modified By</th>
              <th className="center-text">Created On</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data.map((row, index) => (
                <tr className="hovers pointer" onClick={() => continueUpdate(row?.patientId || row?.id, row)} key={row?.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>
                    <div>
                      {row?.firstName} {row.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{row?.lastName}</td>
                  <td>{row?.email}</td>
                  <td>{row?.modifiedByName}</td>
                  <td>{new Date(row?.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientsTable;
