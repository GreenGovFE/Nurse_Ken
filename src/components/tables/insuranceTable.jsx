import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import axios from "axios";
import { usePatient } from "../../contexts";
import { useNavigate } from "react-router-dom";
import Spinner from "../UI/Spinner";

function InsuranceTable({ data, }) {
  const [allPatients, setAllPatients] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { setPatientId, setPatientName, setPatientInfo, setHmoDetails } = usePatient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const itemsPerPage = 10

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


  let navigate = useNavigate();

  const selectRecord = (record) => () => {
    console.log(record);
    setPatientId(record.patientId);
    fetchPatientById(record.patientId)
    setHmoDetails(record)
    navigate("/patient-hmo-details");
  };

  const getAllPatientsHmo = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const res = await get(`/HMO/all-patient-hmo/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=10`);
      console.log(res);
      setAllPatients(res.data);
      setTotalPages(res.pageCount);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const fetchPatientById = async (id) => {
    try {
      const res = await get(`/patients/AllPatientById?patientId=${id}`);
      setPatientInfo(res);
      console.log("Patient data for ID", id, ":", res.data); // Log patient data
      const name = `${res?.firstName} ${res?.lastName}`;
      console.log("Patient name for ID", id, ":", name); // Log patient name
      // Fetch HMO details

      return { name, };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };




  useEffect(() => {
    getAllPatientsHmo();
  }, [currentPage]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (dataFetched && allPatients) {
  //       const patientsWithDetails = await Promise.all(allPatients?.map(async (row) => {
  //         const { name } = await fetchPatientById(row.patientId);
  //         return {
  //           ...row,
  //           patientName: name,
  //         };
  //       }));
  //       setAllPatients(patientsWithDetails);
  //     }
  //   };

  //   fetchData();
  // }, [dataFetched]);

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        {loading ? ( // Conditionally render loading spinner
          <Spinner />
        ) : (
          <div>
            <table className="bordered-table">
              <thead className="border-top-none">
                <tr className="border-top-none">
                  <th className="center-text">S/N</th>
                  <th className="center-text">Patient Name</th>
                  <th className="center-text">Payment Plan</th>
                  <th className="center-text">HMO</th>
                  <th className="center-text">Package</th>
                  <th className="center-text">Enrollment Date</th>
                </tr>
              </thead>

              <tbody className="white-bg view-det-pane">
                {Array.isArray(allPatients) && allPatients?.map((row, index) => (
                  <tr className="hovers pointer" onClick={selectRecord(row)} key={row.id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>
                      <div>
                        {row.patientFullName}
                        {row.isReferred ? <span className="add-note">Referred</span> : ''}
                      </div>
                    </td>
                    <td>{row.hmoProviderName ? 'HMO' : 'Self'}</td>
                    <td>{row ? row?.hmoProviderName : ''}</td>
                    <td>{row ? row?.hmoPackageName : ''}</td>
                    <td>{new Date(row.membershipValidity).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination flex space-between float-right col-4 m-t-20">
              <div className="flex gap-8">
                <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
              </div>
              <div className="flex gap-8">
                <button
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"Previous"}
                </button>

                {generatePageNumbers().map((page, index) => (
                  <button
                    key={`page-${index}`}
                    className={`pagination-btn ${currentPage === page ? 'bg-green text-white' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {"Next"}
                </button>
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}

export default InsuranceTable;
