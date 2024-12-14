import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import axios from "axios";
import { usePatient } from "../../contexts";
import { useNavigate } from "react-router-dom";
import Spinner from "../UI/Spinner";
import Paginate from "../UI/paginate";

function InsuranceTable({ data, }) {
  const [allPatients, setAllPatients] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { setPatientId, setPatientName, setPatientInfo, setHmoDetails } = usePatient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  const itemsPerPage = 10

  


  let navigate = useNavigate();

  const selectRecord = (record) => () => {
    setPatientId(record?.patientId || record?.id);
    fetchPatientById(record?.patientId || record?.id)
    setHmoDetails(record)
    navigate("/patient-hmo-details");
  };

  const getAllPatientsHmo = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const res = await get(`/HMO/all-patient-hmo/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=10`);
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
      const name = `${res?.firstName} ${res?.lastName}`;
      return { name, };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };

  useEffect(() => {
    getAllPatientsHmo();
  }, [currentPage]);

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
            <div className="m-t-20"><Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/></div>
          </div>

        )}
      </div>
    </div>
  );
}

export default InsuranceTable;
