import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import axios from "axios";
import { usePatient } from "../../contexts";
import { useNavigate } from "react-router-dom";
import Spinner from "../UI/Spinner";

function InsuranceTable({ data }) {
  const [allPatients, setAllPatients] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { setPatientId, setPatientName, setPatientInfo } = usePatient();
  let navigate = useNavigate();

  const selectRecord = (record) => () => {
    console.log(record);
    setPatientId(record.patientId);
    fetchPatientById(record.patientId)
    navigate("/patient-hmo-details");
  };

  const getAllPatientsHmo = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const res = await get(`/HMO/all-patient-hmo/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=30`);
      console.log(res);
      setAllPatients(res.data);
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
      const hmoDetails = await fetchHmoById(res?.hmoId);
      console.log("HMO details for ID", res?.hmoId, ":", hmoDetails); // Log HMO details
      
      return { name, hmoDetails };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };

  const fetchHmoById = async (hmoId) => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/hmo/${hmoId}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching HMO details:', error);
      return null;
    }
  };


  useEffect(() => {
    getAllPatientsHmo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched && allPatients) {
        const patientsWithDetails = await Promise.all(allPatients?.map(async (row) => {
          const { name, hmoDetails } = await fetchPatientById(row.patientId);
          return {
            ...row,
            patientName: name,
            hmo: hmoDetails
          };
        }));
        setAllPatients(patientsWithDetails);
      }
    };

    fetchData();
  }, [dataFetched]);

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        {loading ? ( // Conditionally render loading spinner
          <Spinner />
        ) : (
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Payment Plan</th>
                <th>HMO</th>
                <th>Package</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>

            <tbody className="white-bg view-det-pane">
              {Array.isArray(allPatients) && allPatients?.map((row) => (
                <tr  className="hovers pointer" onClick={selectRecord(row)} key={row.id}>
                  <td>{row.patientId}</td>
                  <td>{row.patientName}</td>
                  <td>{row.hmo ? 'HMO' : 'Self' }</td>
                  <td>{row.hmo ? row.hmo?.vendorName : ''}</td>
                  <td>{row.hmo ? row.hmo?.packages[0]?.name : ''}</td>
                  <td>{new Date(row.membershipValidity).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InsuranceTable;
