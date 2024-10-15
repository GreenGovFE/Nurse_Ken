import React from "react";
import { RiCloseFill } from "react-icons/ri";

const DeleteConfirmationModal = ({ closeModal, confirmDelete, equipment }) => {
  return (
    <div className="modal ">
      <RiCloseFill className='close-btn pointer' onClick={closeModal} />
      <div className="modal-contents  ">
        <div className="p-20">
          <h2 className="">Confirm Action</h2>
          {
            equipment === "patient" ? (
              <p>
               Are you sure you want to cancel this appointment?
              </p>
            ):(
              <p>
                Are you sure you want to remove this {equipment} from the patient?
              </p>
            )
          }
          <div className="col-4  m-t-20 flex center-text">
            <button className="submit-btn" onClick={confirmDelete}>Yes</button>
            <button className="delete-btn m-l-10" onClick={closeModal}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
