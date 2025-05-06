import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import SendForVital from "../modals/SendForVital";
import Cookies from "js-cookie";
import Blacklist from "../modals/Blacklist";

function PatientsTable({ data, currentPage, itemsPerPage, renderTabContent }) {
  const { setPatientId, setPatientName, setPatientPage, setHmoId, setPatientInfo, nurseRoles, setHmoDetails } = usePatient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenBlackList, setIsModalOpenBlackList] = useState(false);

  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpenBlackList(false);

  };



  const selectRecord = (id, data) => {
    setIsModalOpen(true);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setPatientInfo(data);
    setPatientId(id);
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', JSON.stringify(data));
    Cookies.set('patientName', `${data.firstName} ${data.lastName}`);
  };

  const selectRecordBlackList = (id, data) => {
    setIsModalOpenBlackList(true);
    setPatientName(`${data.firstName} ${data.lastName}`);
    setPatientInfo(data);
    setPatientId(id);
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', JSON.stringify(data));
    Cookies.set('patientName', `${data.firstName} ${data.lastName}`);
  };


  const continueUpdate = (id, data) => {
    setPatientId(id);
    setPatientName(`${data?.firstName} ${data?.lastName}`);
    setHmoId(data?.hmoId);
    setPatientInfo(data);
    setHmoDetails(data);
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', JSON.stringify(data));
    Cookies.set('patientName', `${data.firstName} ${data.lastName}`);
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
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Email</th>
              <th className="center-text">Modified By</th>
              <th className="center-text">Created On</th>
              <>
                {(nurseRoles?.includes('checkin') && nurseRoles?.includes('nurse')) &&
                  <>
                    <th className="center-text"></th>
                    <th className="center-text"></th>
                  </>
                }
              </>
              <>
                {(nurseRoles?.includes('checkin') || nurseRoles?.includes('nurse')) &&
                  <>
                    <th className="center-text"></th>
                  </>
                }
              </>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr className="hovers pointer" onClick={() => continueUpdate(row?.patientId || row?.id, row)} key={row?.patientId || row?.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patientRef}</td>
                  <td>
                    <div>
                      {row?.firstName} {row?.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{row?.lastName}</td>
                  <td>{row?.email}</td>
                  <td>{row?.modifiedByName}</td>
                  <td>{new Date(row?.createdAt).toLocaleDateString()}</td>
                  <>
                    {(nurseRoles?.includes('checkin')) && (
                      <>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              selectRecord(row?.patientId || row?.id, row);
                            }}
                            className="submit-btn m-b-10"
                          >
                            Send for vitals
                          </button>
                          
                        </td>
                      </>
                    )}

                  </>
                  <>
                    {nurseRoles?.includes('nurse')&& (
                      <>
                        <td>
                         
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              selectRecordBlackList(row?.patientId || row?.id, row);
                            }}
                            className="submit-btn"
                          >
                            BlackList
                          </button>
                        </td>
                      </>
                    )}

                  </>
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
      {isModalOpenBlackList &&
        <Blacklist
          closeModal={closeModal}
        />
      }
    </div>
  );
}

export default PatientsTable;
