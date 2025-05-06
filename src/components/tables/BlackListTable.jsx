import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import { put } from "../../utility/fetch";
import notification from "../../utility/notification";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";

function BlackListTable({ data, currentPage, itemsPerPage, fetchData }) {
  const { setPatientId, setPatientName } = usePatient();
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const closeModalDel = () => {
    setIsModalOpenDel(false);
  };

  const Reinstate = async (patientId, blacklistId) => {
    const url = `/PatientBlackList/${blacklistId}/patient/${patientId}/un-blacklist`;

    setLoading(true);
    try {
      const res = await put(url);

      if (typeof res === 'number') {
        notification({ message: "Successfully reinstated patient", type: "success" });
        fetchData(currentPage);
        closeModalDel();
      } else {
        notification({ message: "Failed to reinstate patient", type: "error" });
      }
    } catch (error) {
      notification({ message: "Failed to reinstate patient", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (patientId, blacklistId) => {
    setRecordToDelete({ patientId, blacklistId });
    setIsModalOpenDel(true);
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">Patient Id</th>
              <th className="center-text">Patient's Name</th>
              <th className="center-text">Blacklist Date</th>
              <th className="center-text">Blacklisted By</th>
              <th className="center-text">Reinstated By</th>
              <th className="center-text">Reason</th>
              <th className="center-text"></th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr className="" key={row?.patientId}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patient?.patientRef}</td>
                  <td>
                    <div>
                      {row?.patient?.firstName} {row?.patient?.lastName} {row?.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{new Date(row?.createdAt)?.toLocaleDateString()}</td>
                  <td>{row?.blacklistedBy?.firstName} {row?.blacklistedBy?.lastName}</td>
                  <td>{row?.unBlacklistDoneBy?.firstName} {row?.unBlacklistDoneBy?.lastName}</td>
                  <td>{row?.reason}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteConfirmation(row?.patient?.id, row?.id)}
                      className="submit-btn"
                    >
                      Reinstate
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpenDel && (
        <DeleteConfirmationModal
          closeModal={closeModalDel}
          confirmDelete={() => Reinstate(recordToDelete?.patientId, recordToDelete?.blacklistId)}
          equipment="blacklist"
          from="blacklist"
        />
      )}
    </div>
  );
}

export default BlackListTable;
