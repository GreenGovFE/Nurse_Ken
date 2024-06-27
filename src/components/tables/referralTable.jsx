import React, { useState } from "react";
import { RiAddBoxFill, RiDeleteBin3Fill, RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ActionReferralModal from "../modals/ActionRefferalModal";
import { usePatient } from "../../contexts";

function ReferralTable({ data, fetch }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralId, setRefferalId] = useState('');
  const [referralInfo, setReferralInfo] = useState('');

  const { patientId, patientName, hmoId, patientInfo, setPatientInfo, setPatientId,  } = usePatient();

  const openModal = () => {
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);

  };


  const continueUpdate = (id, data) => {
    console.log(data)
    setPatientId(id);
    setReferralInfo(data);
    setRefferalId(data?.referralId)
    openModal()
  }

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Hospital</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Acceptance Status</th>
              <th className="center-text">Date Created</th>
              <th className="center-text">Action</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row, index) => (
              <tr key={row?.id}>
                <td>{index + 1}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.hospitalName}</td>
                <td>{row?.diagnosis}</td>
                <td>{row?.acceptanceStatus}</td>
                <td>{new Date(row?.dateCreated).toLocaleDateString()}</td>
                <td>
                  <div>
                    <span style={{ color: '#3C7E2D' }} className="flex flex-h-center">
                      <RiAddBoxFill onClick={() => continueUpdate(row?.patientId, row)} className="pointer" style={{ width: '24px', height: '24px' }} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen &&
        <ActionReferralModal
          closeModal={closeModal}
          referralId={referralId}
          referralInfo={referralInfo}
          fetch={fetch}
        />}
    </div>
  );
}

export default ReferralTable;
