import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import axios from "axios";
import { usePatient } from "../../contexts";
import { useNavigate } from "react-router-dom";


function InsuranceTable({ data }) {
  const [allPatients, setAllPatients] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const { setPatientId, setPatientName, } = usePatient();
  const { patientId, patientName, hmoId, patientInfo, setPatientInfo } = usePatient();


  let navigate = useNavigate();

  const selectRecord = (record) => () => {
    console.log(record);
    setPatientId(record.patientId);
   
    navigate("/patient-hmo-details");
  };

  const getAllPatientsHmo = async () => {
    try {
      const res = await get(`/HMO/all-patient-hmo/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=30`);
      console.log(res);
      setAllPatients(res.data);
      setDataFetched(true); // Set dataFetched to true once data is fetched
    } catch (error) {
      console.error('Error fetching all patients:', error);
      // Handle the error here, such as displaying an error message to the user
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

  const fetchPatientById = async (id) => {
    try {
      const res = await get(`/patients/AllPatientById?patientId=${id}`);
      console.log("Patient data for ID", id, ":", res.data); // Log patient data
      const name = `${res?.firstName} ${res?.lastName}`;
      console.log("Patient name for ID", id, ":", name); // Log patient name
      setPatientInfo(res)
      // Fetch HMO details
      const hmoDetails = await fetchHmoById(res?.hmoId);
      console.log("HMO details for ID", res?.hmoId, ":", hmoDetails); // Log HMO details

      return { name, hmoDetails };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return null;
    }
  };

  useEffect(() => {
    getAllPatientsHmo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched) {
        const patientsWithDetails = await Promise.all(allPatients.map(async (row) => {
          const { name, hmoDetails } = await fetchPatientById(row.patientId);
          return {
            ...row,
            patientName: name,
            hmo: hmoDetails // Update hmo with fetched details
          };
        }));
        setAllPatients(patientsWithDetails);
      }
    };

    fetchData();
  }, [dataFetched]); // Run the effect only when dataFetched changes

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Payment Plan</th>
              <th>HMO</th>
              <th>Package</th>
              <th>Enrolment Date</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(allPatients) && allPatients?.map((row) => (
              <tr  className="hovers pointer" onClick={selectRecord(row)} key={row.id}>
                <td>{row.patientId}</td>
                <td>{row.patientName}</td>
                <td>{row.hmo ? 'HMO' : 'Self' }</td>
                <td>{row.hmo?.vendorName}</td>
                <td>{row.hmo?.packages[0]?.name}</td>
                <td>{new Date(row.membershipValidity).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsuranceTable;
