import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import SendForVital from "../modals/SendForVital";
import Cookies from "js-cookie";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { del, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";
import AppointmentModal from "../modals/AppointmentModal";

function PatientsToSeeDoctorTable({
  data,
  onAntenatalRowClick,
  currentPage,
  itemsPerPage,
  totalPages,
  fetchData,
  antenatal = false,
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
  const closeModalDel = () => {
    setIsModalOpenDel(false);
  };
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [add, setAdd] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false);
  };

  console.log(data);

  // Filter logic
  useEffect(() => {
    if (!filterValue.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data?.filter((item) => {
        const fullName = `${item?.firstName} ${item?.lastName}`.toLowerCase();
        return fullName.includes(filterValue.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [data, filterValue]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleDelete = (id) => {
    console.log(id);
    // return

    let payload = {
      appointId: id,
      dischargeNote: "Discharge",
    };
    post(`/patients/discharge-patient`, payload)
      .then((res) => {
        console.log(res);
        if (res.message === "The patient has dis-charged") {
          notification({
            message: "Discharged patient successfully",
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
    console.log(id);
    setIsModalOpen(true);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setPatientId(id);
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", data);
    Cookies.set("patientName", `${data.firstName} ${data.lastName}`);
  };

  const continueUpdate = (id, data) => {
    setPatientId(id);
    setPatientName(`${data?.firstName} ${data?.lastName}`);
    // setHmoId(data?.hmoId);
    setPatientInfo(data);
    // setHmoDetails(data)
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", data);
    Cookies.set("patientName", `${data.firstName} ${data.lastName}`);
    navigate("/patient-details");
  };

  return (
    <div className="w-100">
      {/* Filter Input */}
      <div className="flex flex-v-center gap-10 m-b-20">
        <span className="bold-text">Search by Name:</span>
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Enter first or last name..."
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            minWidth: "250px",
            outline: "none",
          }}
        />
        <span className="text-gray">
          Showing {filteredData?.length || 0} of {data?.length || 0} patients
        </span>
      </div>

      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">Patient Id</th>
              <th className="center-text">Patient's Name</th>
              <th className="center-text">Date of Birth</th>
              <th className="center-text">Age</th>
              <th className="center-text">Assigned Nurse</th>
              <th className="center-text">Date Created</th>
              <th className="center-text">Action</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(filteredData) &&
              filteredData.map((row, index) => (
                <tr className="" key={row?.patientId}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{row?.patientId}</td>
                  <td>
                    <div>
                      {row?.firstName} {row?.lastName}
                      {row?.isReferred ? (
                        <span className="add-note">Referred</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td>{new Date(row?.dateOfBirth).toLocaleDateString()}</td>
                  <td>{row?.age}</td>
                  <td>{row?.assignedNurse}</td>
                  <td>{row?.dateCreated}</td>
                  <td>
                    <div className="flex space-around">
                      <button
                        id="border-none"
                        onClick={() => {
                          if (!antenatal) {
                            continueUpdate(row?.patientId, row);
                          } else if (
                            typeof onAntenatalRowClick === "function"
                          ) {
                            onAntenatalRowClick(row);
                          }
                        }}
                      >
                        <RiEdit2Fill
                          size={20}
                          style={{ color: "green", cursor: "pointer" }}
                        />
                      </button>
                      {!antenatal && (
                        <button
                          id="border-none"
                          onClick={() => handleDeleteConfirmation(row.id)}
                          disabled={row?.vitals !== null}
                        >
                          <RiDeleteBin2Fill
                            size={20}
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex flex-center m-t-20">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchData(currentPage - 1)}
            style={{
              padding: "6px 12px",
              marginRight: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              background: currentPage === 1 ? "#eee" : "",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ margin: "0 12px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchData(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              cursor: currentPage < totalPages ? "not-allowed" : "pointer",
              background: currentPage === totalPages ? "#eee" : "",

            }}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && <SendForVital closeModal={closeModal} />}
      {add && (
        <AppointmentModal
          closeModal={closeModal}
          appointmentId={viewing}
          type={"appointment"}
          fetchData={fetchData}
          currentPage={currentPage}
        />
      )}
      {isModalOpenDel && (
        <DeleteConfirmationModal
          closeModal={closeModalDel}
          confirmDelete={confirmDelete}
          equipment={"discharge"}
        />
      )}
    </div>
  );
}

export default PatientsToSeeDoctorTable;
