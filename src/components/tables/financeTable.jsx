import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";

function FinanceTable({ data, currentPage, itemsPerPage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();


  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectRecord = (record) => () => {
    setIsModalOpen(true);
    setPatientId(record?.patient?.id);
    setPatientName(`${record?.patient?.firstName} ${record?.patient?.lastName}`);
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
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>
                  <div>
                    {row.patient.firstName}
                    {row.patient.isReferred ? <span className="add-note m-l-10">Referred</span> : ''}
                  </div>
                </td>
                <td>{row.patient.lastName}</td>
                <td>{row.totalCost}</td>
                <td>{row.patientBalance}</td>
                <td>{row.modifiedBy.firstName} {row.modifiedBy.lastName}</td>
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
