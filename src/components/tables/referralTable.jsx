import React, { useState } from "react";
import { RiAddBoxFill, RiDeleteBin3Fill, RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ActionReferralModal from "../modals/ActionRefferalModal";

function ReferralTable({ data }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralId, setRefferalId] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
    
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    
  };
  

  const continueUpdate = (id, data) => {
    console.log(data)
    sessionStorage?.setItem("patientId", id);
    sessionStorage?.setItem("patientName", `${data?.firstName}  ${data?.lastName}`);
    setRefferalId(data?.referralId)
    openModal()
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
              <th>Hospital</th>
              <th>Diagnosis</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{row?.patientId}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.hospitalName}</td>
                <td>{row?.diagnosis}</td>
                <td>{row?.dateCreated}</td>
                <td>
                  <div>
                    <span className="flex flex-h-center">
                    <RiAddBoxFill onClick={()=> continueUpdate(row?.patientId, row)} className="pointer" style={{ width: '24px', height: '24px' }} />
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
      />}
    </div>
  );
}

export default ReferralTable;
