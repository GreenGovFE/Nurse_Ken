import React from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";


function PatientsTable({ data }) {
  const { setPatientId, setPatientName, setPatientPage, setHmoId, setPatientInfo } = usePatient();

  let navigate = useNavigate()

  const continueUpdate =(id, data)=>{
    console.log(data)
    setPatientId(id);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setHmoId(data?.hmoId);
    setPatientInfo(data);
    navigate("/patient-details")
  }


  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>User Name</th>
              
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane ">
            {Array.isArray(data) && data?.map((row) => (
              <tr className="hovers pointer" onClick={()=>continueUpdate(row?.patientId || row?.id, row)} key={row?.id}>
                <td>{row?.patientId || row?.id}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.email}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientsTable;
