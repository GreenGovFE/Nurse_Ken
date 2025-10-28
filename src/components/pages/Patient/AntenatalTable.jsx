import React, { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import ServiceTreatmentTable from "../../ServiceTreatmentTable";
import Antinatal from "../../Antinatal";
import PatientsToSeeDoctorTable from "../../tables/PatientsToSeeDoctorTable";
import { FiArrowLeft } from "react-icons/fi";

function AntenatalTable() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([]);
  const [currenttreatmentrecord, setCurrenttreatmentrecord] = useState([]);
  const [show, setShow] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ant-record");
  const [allPatientsAssignedToDoctor, setAllPatientsAssignedToDoctor] =
    useState([]);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  useEffect(() => {
    // getTreatment()
  }, [currentPage]);

  useEffect(() => {
    getPatientsAssignedToDoctor(1, 1000);
    // getTreatment()
  }, [reset]);

  // const getTreatment = async () => {
  //   try {
  //     let res = await get(`/ServiceTreatment/list/${currentPage}/10000`);
  //     setTreatment(res?.data?.recordList);
  //     setTotalPages(res?.metadata?.totalPages)
  //   } catch (error) {
  //     console.error('Error fetching treatment records:', error);
  //   }
  // }

  // Group treatment by their specific type IDs
  const groupTreatmentsByType = (treatments) => {
    return {
      ante: treatments?.filter((t) => t.antenatalId !== 0),
      general: treatments?.filter((t) => t.generalPracticeId !== 0),
      ogIvf: treatments?.filter((t) => t.oG_IVFId !== 0),
      ortho: treatments?.filter((t) => t.orthopedicId !== 0),
      surg: treatments?.filter((t) => t.generalSurgeryId !== 0),
      famPlan: treatments?.filter((t) => t.familyMedicineId !== 0),
    };
  };

  const groupedTreatments = groupTreatmentsByType(treatment);

  console.log("groupedTreatments", groupedTreatments);

  const getPatientsAssignedToDoctor = async (
    pageIndex = 1,
    pageSize = 1000
  ) => {
    setLoading(true);
    try {
      const res = await get(
        `/patients/assignedtodoctor?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      console.log(res.data);
      setAllPatientsAssignedToDoctor(res?.data);
      setTotalPages(res?.pageCount);
      return res;
    } catch (error) {
      console.error("Error fetching patients assigned to doctor:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAntenatalRowClick = (row) => {
    console.log(row);
    localStorage.setItem("appointmentId", row.appointmentId);
    setShow(!show);
    setPatientData(row);
  };

  return (
    <div className="w-100">
      {!show ? (
        <div className="m-t-80">
          <div className="tabs m-t-20 bold-text">
            <div
              className={`tab-item ${
                selectedTab === "ant-record" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("ant-record")}
            >
              Antenatal Record
            </div>
            <div
              className={`tab-item ${
                selectedTab === "treatment-table" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("treatment-table")}
            >
              Treatment Table
            </div>
          </div>

          {selectedTab === "ant-record" && (
            <PatientsToSeeDoctorTable
            antenatal
            onAntenatalRowClick={handleAntenatalRowClick}
            data={allPatientsAssignedToDoctor}
            currentPage={1}
            itemsPerPage={1000}
            fetchData={getPatientsAssignedToDoctor}
          />
          )}
          {selectedTab === "treatment-table" && (
           <ServiceTreatmentTable
              data={groupedTreatments.ante}
              reset={setReset}
            />
          )}
         
        </div>
      ) : (
        <div className="m-t-80">
          <div
            className="flex"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <FiArrowLeft />
              <p onClick={() => setShow(!show)} style={{ marginLeft: 8 }}>
                Back
              </p>
            </div>
            <div style={{ fontWeight: "bold" }}>
              {patientData?.firstName} {patientData?.lastName}
            </div>
          </div>

            <Antinatal patientData={patientData} />
         
        </div>
      )}
    </div>
  );
}

export default AntenatalTable;
