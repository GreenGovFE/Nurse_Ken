import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import SendForVital from "../modals/SendForVital";
import Cookies from "js-cookie";
import SendForVitalAsSpecialist from "../modals/SendForVitalAsSpecialist";

function PatientsTable({
  data,
  currentPage,
  nurseTypes,
  itemsPerPage,
  renderTabContent,
  toPatientServices = false,
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

  let navigate = useNavigate();
  //  const { setPatientId, setPatientName, setHmoId, setPatientInfo } =
  //     usePatient();
  // const continueUpdate = (id, data) => {
  //   setPatientId(id);
  //   setPatientName(`${data.firstName} ${data.lastName}`);
  //   setHmoId(data?.hmoId);
  //   setPatientInfo(data);
  //   navigate("/patient-details");
  //   // navigate("/add-patient-services");
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectRecord = (id, data) => {
    setIsModalOpen(true);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setPatientInfo(data);
    setPatientId(id);
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", JSON.stringify(data));
    Cookies.set("patientName", `${data.firstName} ${data.lastName}`);
  };

  const continueUpdate = (id, data) => {
    setPatientId(id);
    setPatientName(`${data?.firstName} ${data?.lastName}`);
    setHmoId(data?.hmoId);
    setPatientInfo(data);
    setHmoDetails(data);
    Cookies.set("patientId", id);
    Cookies.set("patientInfo", JSON.stringify(data));
    Cookies.set("patientName", `${data.firstName} ${data.lastName}`);
    toPatientServices
      ? navigate("/add-patient-services")
      : navigate("/patient-details");
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">Patient Id</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Email</th>
              <th className="center-text">Modified By</th>
              <th className="center-text">Created On</th>
              <>
                {nurseRoles?.includes("checkin") && (
                  <th className="center-text"></th>
                )}
              </>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr
                  className="hovers pointer"
                  onClick={() => continueUpdate(row?.patientId || row?.id, row)}
                  key={row?.patientId || row?.id}
                >
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patientRef}</td>
                  <td>
                    <div>
                      {row?.firstName}{" "}
                      {row?.isReferred ? (
                        <span className="add-note">Referred</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td>{row?.lastName}</td>
                  <td>{row?.email}</td>
                  <td>{row?.modifiedByName}</td>
                  <td>{new Date(row?.createdAt).toLocaleDateString()}</td>
                  <>
                    {nurseRoles?.includes("checkin") && !toPatientServices && (
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectRecord(row?.patientId || row?.id, row);
                          }}
                          className="submit-btn"
                        >
                          Send for vitals
                        </button>
                      </td>
                    )}
                  </>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        nurseTypes === "specialist" ? (
          <SendForVitalAsSpecialist closeModal={closeModal} />
        ) : (
          <SendForVital closeModal={closeModal} />
        )
      )}
    </div>
  );
}

export default PatientsTable;
