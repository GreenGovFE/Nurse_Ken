import React, { useState } from "react";
import { RiAddBoxFill } from "react-icons/ri";
import ActionReferralModal from "../modals/ActionRefferalModal";
import { usePatient } from "../../contexts";

function ReferralTable({ data, fetch, currentPage, itemsPerPage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralId, setRefferalId] = useState('');
  const [referralInfo, setReferralInfo] = useState('');

  const { setPatientId } = usePatient();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const continueUpdate = (id, data) => {
    setPatientId(id);
    setReferralInfo(data);
    setRefferalId(data?.referralId);
    openModal();
  };

  // Sort data by dateCreated in descending order
  const sortedData = [...data].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Referred From</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Acceptance Status</th>
              <th className="center-text">Date Created</th>
              <th className="center-text">Action</th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {Array.isArray(sortedData) && sortedData.map((row, index) => (
              <tr key={row?.id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.hospitalName}</td>
                <td style={{ width: '250px', textAlign: 'left' }}>{row?.diagnosis}</td>
                <td>{row?.acceptanceStatus}</td>
                <td>{new Date(row?.dateCreated).toLocaleDateString()}</td>
                <td>
                  {(row?.acceptanceStatus !== 'Accepted' && row?.acceptanceStatus !== 'Rejected') && (
                    <div>
                      <span style={{ color: '#3C7E2D' }} className="flex flex-h-center">
                        <RiAddBoxFill
                          onClick={() => continueUpdate(row?.patientId, row)}
                          className="pointer"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        isModalOpen &&
        <ActionReferralModal
          closeModal={closeModal}
          referralId={referralId}
          referralInfo={referralInfo}
          fetch={fetch}
        />
      }
    </div>
  );
}

export default ReferralTable;
