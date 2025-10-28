import { useEffect, useState } from "react";
import { del, get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import AppointmentModal from "../../modals/AppointmentModal";
import Discharge from "../../modals/Discharge";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import notification from "../../../utility/notification";
import DeleteConfirmationModal from "../../modals/DeleteConfirmation";
import { AiOutlinePlus } from "react-icons/ai";
import ReferralModal from "../../modals/RefferalModal";

function Appointment({ data, setCurrent }) {
  const { patientId } = usePatient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenReferral, setIsModalOpenReferral] = useState(false);

  const [viewing, setViewing] = useState({});
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const [add, setAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  const closeModalDel = () => {
    setIsModalOpenDel(false);
  };
  const [recordToDelete, setRecordToDelete] = useState(null);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setCurrent(newPage);
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;
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

  const fetchData = async (currentPage) => {
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${patientId}?pageIndex=${currentPage}&pageSize=10`
      );

      if (response?.data?.length > 0) {
        const filteredData = response?.data?.filter(
          (item) => item?.tracking !== "DisCharge"
        );

        setCombinedData(filteredData);
        setTotalPages(response.pageCount);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCombinedData(data);
  }, [data]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false);
    setIsModalOpenReferral(false);
  };

  const selectRecord = (record) => () => {
    setViewing(record);
    setIsModalOpen(true);
  };

  const handleEdit = (recordId) => {
    setViewing(recordId);
    setAdd(true);
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Time</th>
              <th className="center-text">Additional Notes</th>
              <th className="center-text">Vital Nurse</th>
              <th className="center-text">Assigned Doctor</th>
              <th className="center-text">Status</th>
              {/* <th className="center-text">Discharge/Visit Summary</th> */}
              <th className="center-text">Action</th>
              <th
                style={{ borderLeft: "none !important" }}
                className="center-text"
              ></th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {combinedData?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.appointDate)?.toLocaleDateString()}</td>
                <td>
                  {(() => {
                    const [hours, minutes] = row?.appointTime?.split(":");
                    const date = new Date();
                    date.setHours(hours, minutes);
                    return date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()}
                </td>
                <td
                  style={{
                    maxWidth: "650px",
                    whiteSpace: "wrap",
                    textAlign: "left",
                    paddingLeft: "12px",
                  }}
                >
                  {row?.description}
                </td>
                <td>{row?.nurse}</td>
                <td>{row?.doctor}</td>
                <td>
                  {row?.tracking == "DisCharge"
                    ? "Discharged"
                    : row?.tracking == "ReferralInProgress"
                    ? "Referral In Progress"
                    : row?.tracking == "isReferred"
                    ? "Is Referred"
                    : row?.tracking == "AwaitingVitals"
                    ? "Awaiting Vitals"
                    : row?.tracking == "AwaitingDoctor"
                    ? "Awaiting Doctor"
                    : row?.tracking == "AwaitingLabRequest"
                    ? "Awaiting Lab Request"
                    : row?.tracking == "TakingTreatment"
                    ? "Ongoing treatment"
                    : row?.tracking}
                </td>
                <>
                  <td>
                    <>
                      <button
                        className="submit-btn m-b-10"
                        onClick={selectRecord(row)}
                        style={{
                          backgroundColor: "#F13529",
                          cursor: "pointer",
                          border: "none",
                        }}
                        disabled={
                          row?.tracking === "DisCharge" ||
                          row?.tracking === "IsReferred" ||
                          row?.tracking === "ReferralInProgress"
                        }
                      >
                        Discharge
                      </button>
                      <>
                        {row?.tracking !== "ReferralInProgress" &&
                          row?.tracking !== "AwaitingVitals" && (
                            <button
                              disabled={
                                row?.tracking === "DisCharge" ||
                                row?.tracking === "IsReferred" ||
                                row?.tracking === "ReferralInProgress"
                              }
                              onClick={() => {
                                setIsModalOpenReferral(true);
                                setViewing(row);
                                sessionStorage.setItem("patientId", "");
                              }}
                              className="submit-btn"
                            >
                              <div className="flex flex-h-center flex-v-center">
                                {/* <AiOutlinePlus size={24} color="white" /> */}
                                <p className="m-l-10 m-r-10">+ Refer Patient</p>
                              </div>
                            </button>
                          )}
                      </>
                    </>
                  </td>
                  <td>
                    <>
                      <div className="flex space-around">
                        <button
                          id="border-none"
                          onClick={() => handleEdit(row?.id)}
                          disabled={
                            row?.tracking === "DisCharge" ||
                            row?.tracking === "IsReferred" ||
                            row?.tracking === "ReferralInProgress"
                          }
                        >
                          <RiEdit2Fill
                            size={20}
                            style={{ color: "green", cursor: "pointer" }}
                          />
                        </button>
                        <button
                          id="border-none"
                          onClick={() => handleDeleteConfirmation(row.id)}
                          disabled={
                            row?.tracking === "DisCharge" ||
                            row?.tracking === "IsReferred" ||
                            row?.tracking === "ReferralInProgress"
                          }
                        >
                          <RiDeleteBin2Fill
                            size={20}
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </button>
                      </div>
                    </>
                  </td>
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div
          className="pagination flex flex-v-center gap-12 m-t-20"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex flex-v-center gap-4">
            <button
              className={`pagination-btn-small ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                color: currentPage === 1 ? "#999" : "#333",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {generatePageNumbers().map((page, index) => (
              <button
                key={`page-${index}`}
                className={`pagination-btn-small ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: "6px 10px",
                  fontSize: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: currentPage === page ? "#007bff" : "#fff",
                  color: currentPage === page ? "#fff" : "#333",
                  cursor: "pointer",
                  minWidth: "32px",
                }}
              >
                {page}
              </button>
            ))}

            <button
              className={`pagination-btn-small ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor:
                  currentPage === totalPages ? "#f5f5f5" : "#fff",
                color: currentPage === totalPages ? "#999" : "#333",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
          <div className="flex flex-v-center gap-8">
            <span className="bold-text">Page</span>
            <span>
              {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Discharge
          closeModal={closeModal}
          appointment={viewing}
          fetch={fetchData}
          currentPage={currentPage}
        />
      )}
      {isModalOpenReferral && (
        <ReferralModal
          closeModal={closeModal}
          fetchData={fetchData}
          currentPage={currentPage}
          AppointmentId={viewing?.id}
        />
      )}
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
          equipment={"patient"}
        />
      )}
    </div>
  );
}
export default Appointment;
