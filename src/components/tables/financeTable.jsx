import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import FinanceDetails from "../pages/Patient/FinanceDetails";

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
    setHmoId(record?.paymentBreakdowns[0]?.hmoId);
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
              {/* <th className="center-text">Payment Status</th> */}
              <th className="center-text">Visit Started On</th>
              <th className="center-text">Visit Ended ON</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row, index) => (
              <tr className="hovers pointer" onClick={selectRecord(row)}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>
                  <div>
                    {row.patient.firstName}
                    {row.patient.isReferred ? <span className="add-note m-l-10">Referred</span> : ''}
                  </div>
                </td>
                <td>{row.patient.lastName}</td>
                {/* <td>{row.status}</td> */}
                <td>{row?.visitStartedOn ?
                  (() => {
                    const [day, month, year] = row.visitStartedOn?.split('-');
                    const formattedDate = new Date(`${year}-${month}-${day}`);
                    return formattedDate.toLocaleDateString();
                  })()
                  : ''}</td>
                <td>{row?.visitEndedOn ?
                  (() => {
                    const [day, month, year] = row.visitEndedOn?.split('-');
                    const formattedDate = new Date(`${year}-${month}-${day}`);
                    return formattedDate.toLocaleDateString();
                  })()
                  : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      { isModalOpen &&
        <FinanceDetails closeModal={closeModal}/>
      }
    </div>
  );
}

export default FinanceTable;
