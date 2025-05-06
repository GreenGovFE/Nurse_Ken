import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import SendForVital from "../modals/SendForVital";
import Cookies from "js-cookie";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { del } from "../../utility/fetch";
import notification from "../../utility/notification";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";
import AppointmentModal from "../modals/AppointmentModal";

function PatientsAppointTable({ data, currentPage, itemsPerPage, fetchData }) {
  const { setPatientId, setPatientName, setPatientPage, setHmoId, setPatientInfo, nurseRoles, setHmoDetails } = usePatient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [recordToDelete, setRecordToDelete] = useState(null);
  const closeModalDel = () => { setIsModalOpenDel(false); }
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [add, setAdd] = useState(false);

  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false)
  };

  console.log(data)

  const handleDelete = (id) => {
    del(`/Appointment/Delete-appointment?Id=${id}`)
      .then(res => {
        if (res.message === "The appointment has been removed from the doctor schedule table") {
          notification({ message: 'Cancelled appointment successfully', type: "success" });
          fetchData(currentPage)
        } else {
          notification({ message: 'Failed to delete appointment', type: "error" });
        }
      })
      .catch(err => {
        notification({ message: 'Failed to delete appointment', type: "error" });
      })
  }

  const handleDeleteConfirmation = (recordId) => {
    setRecordToDelete(recordId);
    setIsModalOpenDel(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      handleDelete(recordToDelete);
      setIsModalOpenDel(false);
    }
  };

  const selectRecord = (id, data) => {
    console.log(id)
    setIsModalOpen(true);
    setPatientName(`${data.patientName}`);
    setPatientId(id);
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', data);
    Cookies.set('patientName', `${data.patientName} `)
  };



  const handleEdit = (recordId, name, id) => {
    setViewing(recordId);
    setPatientName(name);
    setPatientId(id);
    setAdd(true);
  }


  const continueUpdate = (id, data) => {
    setPatientId(id);
    setPatientName(`${data?.patientName}`);
    // setHmoId(data?.hmoId);
    setPatientInfo(data);
    // setHmoDetails(data)
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', data);
    Cookies.set('patientName', `${data.patientName}`)
    navigate("/patient-details");
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
              <th className="center-text">Appointment Date</th>
              <th className="center-text">Appointment Time</th>
              <th className="center-text">Doctor To See</th>
              <th className="center-text">Nurse Assigned</th>
              <th className="center-text">Reason</th>
            

              <>
                {nurseRoles?.includes('checkin') &&
                  <>
                    <th className="center-text"></th>
                    <th className="center-text"></th>
                  </>
                }
              </>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr className="" key={row?.patientId}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patientRef}</td>
                  <td>
                    <div>
                      {row?.patientName} {row?.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{row?.appointDate}</td>
                  <td>
                    {row?.appointTime}
                  </td>

                  <td>{row?.doctor}</td>
                  <td>{row?.nurse}</td>
                  <td>{row?.description}</td>
                  <>
                    {nurseRoles?.includes('checkin') &&
                      <td><button onClick={(e) => { e.stopPropagation(); selectRecord(row?.patientId, row) }} className="submit-btn">Send for vitals</button></td>
                    }
                  </>
                  <td>
                    <>
                      <div className="flex space-around">
                        <button id="border-none" onClick={() => handleEdit(row?.id, row?.patientName, row?.patientId)}
                          disabled={row?.tracking !== 'AwaitingVitals'} 

                        >
                          <RiEdit2Fill
                            size={20}

                            style={{ color: 'green', cursor: 'pointer' }}
                          />
                        </button>
                        <button id="border-none" onClick={() => handleDeleteConfirmation(row.id)}
                          disabled={row?.tracking !== 'AwaitingVitals'}>
                          <RiDeleteBin2Fill
                            size={20}

                            style={{ color: 'red', cursor: 'pointer' }}
                          />
                        </button>
                      </div>
                    </>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen &&
        <SendForVital
          closeModal={closeModal}
        />
      }
      {
        add && (
          <AppointmentModal
            closeModal={closeModal}
            appointmentId={viewing}
            type={'appointment'}
            fetchData={fetchData}
            currentPage={currentPage}
          />
        )
      }
      {
        isModalOpenDel && (
          <DeleteConfirmationModal
            closeModal={closeModalDel}
            confirmDelete={confirmDelete}
            equipment={'patient'}
          />
        )
      }
    </div>
  );
}

export default PatientsAppointTable;
