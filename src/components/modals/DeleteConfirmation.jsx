import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";

const DeleteConfirmationModal = ({ closeModal, confirmDelete, equipment, from, setDays }) => {
  const [localDays, setLocalDays] = useState("");

  const handleDaysChange = (e) => {
    setLocalDays(e.target.value);
    if (equipment === "bed") {
      setDays(e.target.value); // Update the parent state
    }
  };

  return (
    <div className="modal ">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-contents">
        <div className="p-20">
          <h2 className="">Confirm Action</h2>
          {from === "blacklist" ? (
            <p>Are you sure you want to reinstate?</p>
          ) : equipment === "patient" ? (
            <p>Are you sure you want to cancel this appointment?</p>
          ) : (
            <p>Are you sure you want to unassign this patient from the {equipment}?</p>
          )}
          {equipment === "bed" && (
            <div className="m-t-20">
              <label htmlFor="days">Enter Days Spent:</label>
              <input
                type="number"
                id="days"
                value={localDays}
                onChange={handleDaysChange}
                className="input-field"
              />
            </div>
          )}
          <div className="col-4 m-t-20 flex center-text">
            <button className="submit-btn" onClick={confirmDelete}>
              Yes
            </button>
            <button className="delete-btn m-l-10" onClick={closeModal}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
