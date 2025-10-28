import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import SendForVital from "../modals/SendForVital";
import Cookies from "js-cookie";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { del } from "../../utility/fetch";
import notification from "../../utility/notification";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";
import AppointmentModal from "../modals/AppointmentModal";

function PatientsAppointTable({
  data,
  currentPage,
  itemsPerPage,
  fetchData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const {
    setPatientId,
    setPatientName,
    setPatientPage,
    setHmoId,
    setPatientInfo,
    nurseRoles,
    setHmoDetails,
  } = usePatient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [add, setAdd] = useState(false);
  const [appointmentData, setAppointmentData] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const [filteredData, setFilteredData] = useState([]);

  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false);
  };

  const closeModalDel = () => {
    setIsModalOpenDel(false);
  };

  // Filter logic: apply date range and status filter
  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let filtered = [...data];

    if (startDate) {
      const s = new Date(startDate);
      filtered = filtered.filter((item) => {
        const d = new Date(item?.appointDate);
        return !isNaN(d) && d >= s;
      });
    }

    if (endDate) {
      const e = new Date(endDate);
      filtered = filtered.filter((item) => {
        const d = new Date(item?.appointDate);
        return !isNaN(d) && d <= e;
      });
    }

    if (filterValue && filterValue !== "all") {
      filtered = filtered.filter((item) => item?.tracking === filterValue);
    }

    setFilteredData(filtered);
  }, [data, filterValue, startDate, endDate]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  // Get unique tracking values for dropdown options
  const getTrackingOptions = () => {
    const uniqueTracking = [
      ...new Set(data && data?.map((item) => item?.tracking)),
    ].filter(Boolean);
    return uniqueTracking;
  };

  const handleDelete = (id) => {
    del(`/Appointment/Delete-appointment?Id=${id}`)
      .then((res) => {
        if (
          res.message ===
          "The appointment has been removed from the doctor schedule table"
        ) {
          notification({
            message: "Cancelled appointment successfully",
            type: "success",
          });
          fetchData(currentPage);
        } else {
          notification({
            message: "Failed to delete appointment",
            type: "error",
          });
        }
      })
      .catch((err) => {
        notification({
          message: "Failed to delete appointment",
          type: "error",
        });
      });
  };

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
    setIsModalOpen(true);
    setPatientName(`${data.patientName}`);
    setPatientId(id);
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", JSON.stringify(data));
    Cookies.set("patientName", `${data.patientName} `);
  };

  const handleEdit = (recordId, name, id, data) => {
    setViewing(recordId);
    setPatientName(name);
    setPatientId(id);
    setAdd(true);
    setAppointmentData(data);
  };

  const continueUpdate = (id, data) => {
    setPatientId(id);
    setPatientName(`${data?.patientName}`);
    setPatientInfo(data);
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", JSON.stringify(data));
    Cookies.set("patientName", `${data.patientName}`);
    navigate("/patient-details");
  };

  const rowsToRender = Array.isArray(filteredData) ? filteredData : [];

  return (
    <div className="w-100">
      {/* Date Range Filter */}
      <div className="flex flex-v-center gap-10 m-b-20">
        <span className="bold-text">Start Date:</span>
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            minWidth: "150px",
          }}
        />
        <span className="bold-text">End Date:</span>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            minWidth: "150px",
          }}
        />
        {/* <span className="bold-text">Filter by Status:</span>
        <select
          value={filterValue}
          onChange={handleFilterChange}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          <option value="all">All Status</option>
          {getTrackingOptions()?.map((tracking, index) => (
            <option key={index} value={tracking}>
              {tracking}
            </option>
          ))}
        </select>
        <span className="text-gray">
          Showing {rowsToRender?.length || 0} of{" "}
          {Array.isArray(data) ? data.length : 0} appointments
        </span> */}
      </div>

      {/* table or empty message */}
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
              <th className="center-text">Status</th>

              {nurseRoles?.includes("checkin") && (
                <>
                  <th className="center-text"></th>
                  <th className="center-text"></th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {rowsToRender && rowsToRender.length > 0 ? (
              rowsToRender.map((row, index) => (
                <tr className="" key={row?.patientId ?? `${index}`}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{row?.patientRef}</td>
                  <td>
                    <div>
                      {row?.patientName}{" "}
                      {row?.isReferred ? (
                        <span className="add-note">Referred</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td>{row?.appointDate}</td>
                  <td>{row?.appointTime}</td>

                  <td>{row?.doctor}</td>
                  <td>{row?.nurse}</td>
                  <td>{row?.description}</td>
                  <td>{row?.tracking}</td>
                  <td>
                    <div className="flex space-around">
                      <button
                        id="border-none"
                        onClick={() =>
                          handleEdit(
                            row?.id,
                            row?.patientName,
                            row?.patientId,
                            row
                          )
                        }
                        disabled={row?.tracking !== "AwaitingVitals"}
                      >
                        <RiEdit2Fill
                          size={20}
                          style={{ color: "green", cursor: "pointer" }}
                        />
                      </button>
                      <button
                        id="border-none"
                        onClick={() => handleDeleteConfirmation(row.id)}
                        disabled={row?.tracking !== "AwaitingVitals"}
                      >
                        <RiDeleteBin2Fill
                          size={20}
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={nurseRoles?.includes("checkin") ? 12 : 10}
                  className="m-t-40 p-20 text-center"
                >
                  <p className="text-gray">
                    No appointments found for the selected criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <SendForVital closeModal={closeModal} />}
      {add && (
        <AppointmentModal
          closeModal={closeModal}
          appointmentId={viewing}
          type={"appointment"}
          fetchData={fetchData}
          currentPage={currentPage}
          data={appointmentData}
        />
      )}
      {isModalOpenDel && (
        <DeleteConfirmationModal
          closeModal={closeModalDel}
          confirmDelete={confirmDelete}
          equipment={"patient"}
        />
      )}
    </div>
  );
}

export default PatientsAppointTable;
