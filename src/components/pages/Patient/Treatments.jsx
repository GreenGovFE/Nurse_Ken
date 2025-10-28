import React, { useEffect, useState } from "react";
import TreatmentTable from "../../tables/TreatmentTable";
import { allergyData } from "../mockdata/PatientData";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

// Add styles for tab indicators
const tabIndicatorStyles = `
  .tab-indicator {
    display: inline-block;
    background-color: #007bff;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
    min-width: 18px;
    text-align: center;
  }
  
  .tab-item.active .tab-indicator {
    background-color: white;
    color: #007bff;
  }
`;

function Treatments() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([]);
  const [currenttreatmentrecord, setCurrenttreatmentrecord] = useState([]);
  const [oldreatmentrecord, setoldreatmentrecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false);
  const [selectedTab, setSelectedTab] = useState("cardiology");

  // Inject styles
  React.useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = tabIndicatorStyles;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

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
    getTreatment();
    getTreatmentHistory();
    getTreatmentCardiology();
  }, [currentPage]);

  useEffect(() => {
    getTreatment();
    // getTreatmentHistory()
  }, [reset]);

  const getTreatmentHistory = async () => {
    try {
      let res = await get(
        `/ServiceTreatment/list/patient/${patientId}/${currentPage}/10`
        // `/ServiceTreatment/list/patient/${patientId}/${currentPage}/10`
      );
      setCurrenttreatmentrecord(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error("Error fetching treatment records:", error);
    }
  };

  const getTreatment = async () => {
    try {
      let res = await get(
        `/ServiceTreatment/list/patient/${patientId}/${currentPage}/10000`
      );
      setTreatment(res?.data?.recordList);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error("Error fetching treatment records:", error);
    }
  };

  const getTreatmentCardiology = async (path = "cardiology") => {
    try {
      let res = await get(
        `/patients/${patientId}/treatmentrecord?pageNumber=${1}&pageSize=1000`
        // `/${path}/list/patient/${patientId}/${currentPage}/10000`
      );
      console.log(res);
      setoldreatmentrecord(res?.data);
      // setTotalPages(res?.pageCount);
    } catch (error) {
      console.error("Error fetching treatment records:", error);
    }
  };

  // Group treatment by their specific type IDs
  const groupTreatmentsByType = (treatments) => {
    return {
      general: treatments?.filter((t) => t.generalPracticeId !== 0),
      ogIvf: treatments?.filter((t) => t.oG_IVFId !== 0),
      ortho: treatments?.filter((t) => t.orthopedicId !== 0),
      ante: treatments?.filter((t) => t.antenatalId !== 0),
      surg: treatments?.filter((t) => t.generalSurgeryId !== 0),
      famPlan: treatments?.filter((t) => t.familyMedicineId !== 0),
      cardiology: treatments?.filter((t) => t.cardiologyId !== 0),
    };
  };

  const groupedTreatments = groupTreatmentsByType(treatment);

  return (
    <div>
      <div className="w-100">
        <div className="tabs m-t-20 bold-text">
          <div
            className={`tab-item ${selectedTab === "general" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("general");
              // getTreatmentCardiology("generalPractice");
            }}
          >
            General Practice
            {groupedTreatments.general?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.general?.length}
              </span>
            )}
          </div>
          <div
            className={`tab-item ${selectedTab === "og-ivf" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("og-ivf");
              // getTreatmentCardiology("OG_IVF");
            }}
          >
            OG & IVF
            {groupedTreatments.ogIvf?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.ogIvf?.length}
              </span>
            )}
          </div>
          <div
            className={`tab-item ${selectedTab === "ortho" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("ortho");
              // getTreatmentCardiology("orthopedic");
            }}
          >
            Orthopedic
            {groupedTreatments.ortho?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.ortho?.length}
              </span>
            )}
          </div>
          <div
            className={`tab-item ${selectedTab === "ante" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("ante");
              // getTreatmentCardiology("antenatal");
            }}
          >
            Antenatal
            {groupedTreatments.ante?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.ante?.length}
              </span>
            )}
          </div>
          <div
            className={`tab-item ${selectedTab === "surg" ? "active" : ""}`}
            onClick={() => setSelectedTab("surg")}
          >
            Surgery
            {groupedTreatments.surg?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.surg?.length}
              </span>
            )}
          </div>
          <div
            className={`tab-item ${selectedTab === "fam-plan" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("fam-plan");
              // getTreatmentCardiology("generalsurgery");
            }}
          >
            Family Planning
            {groupedTreatments.famPlan?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.famPlan?.length}
              </span>
            )}
          </div>

          <div
            className={`tab-item ${
              selectedTab === "cardiology" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTab("cardiology");
              // getTreatmentCardiology("cardiology");
            }}
          >
            Cardiology
            {groupedTreatments.cardiology?.length > 0 && (
              <span className="tab-indicator">
                {groupedTreatments.cardiology?.length}
              </span>
            )}
          </div>

          <div
            className={`tab-item ${
              selectedTab === "oldRecords" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTab("oldRecords");
              // getTreatmentCardiology("cardiology");
            }}
          >
            Old Records
            {oldreatmentrecord?.length > 0 && (
              <span className="tab-indicator">{oldreatmentrecord?.length}</span>
            )}
          </div>
        </div>
        <TreatmentTable
          data={
            selectedTab === "general"
              ? groupedTreatments.general
              : selectedTab === "og-ivf"
              ? groupedTreatments.ogIvf
              : selectedTab === "ortho"
              ? groupedTreatments.ortho
              : selectedTab === "ante"
              ? groupedTreatments.ante
              : selectedTab === "surg"
              ? groupedTreatments.surg
              : selectedTab === "fam-plan"
              ? groupedTreatments.famPlan
              : selectedTab === "cardiology"
              ? groupedTreatments.cardiology
              : oldreatmentrecord
          }
          reset={setReset}
        />
        {/* <div className="pagination flex space-between float-right col-3 m-t-20">
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
        </div> */}
      </div>
    </div>
  );
}

export default Treatments;
