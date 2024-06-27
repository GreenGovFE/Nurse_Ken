import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";

function FinanceTable({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();


  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectRecord = (record) => () => {
    setIsModalOpen(true);
    setPatientId(record.patientId);
    setPatientName(`${record.firstName} ${record.lastName}`);
    setPatientPage("financeHmo");
    setHmoId(record.paymentBreakdowns[0]?.hmoId);

    navigate("/finance-details");
  };
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Bill</th>
              <th className="center-text">Outstanding Payment</th>
              <th className="center-text">Last Updated by</th>
              <th className="center-text">Date Created</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row, index) => (
              <tr className="hovers pointer" onClick={selectRecord(row)} key={row.id}>
                <td>{index + 1}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.totalCost}</td>
                <td>{row.patientBalance}</td>
                <td>{new Date(row.modifiedOn).toLocaleDateString()}</td>
                <td>{new Date(row.createdOn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinanceTable;
