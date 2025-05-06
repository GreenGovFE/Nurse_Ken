import React, { useEffect, useState } from "react";
import TreatmentTable from "../../tables/TreatmentTable";
import { allergyData } from "../mockdata/PatientData";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function Treatments() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([])
  const [currenttreatmentrecord, setCurrenttreatmentrecord] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false)
  const [selectedTab, setSelectedTab] = useState("general");


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
    getTreatment()
    getTreatmentHistory()
  }, [currentPage])

  useEffect(() => {
    getTreatment()
    // getTreatmentHistory()
  }, [reset])

  const getTreatmentHistory = async () => {
    try {
      let res = await get(`/ServiceTreatment/list/patient/${patientId}/${currentPage}/10`);
      setCurrenttreatmentrecord(res?.data);
      setTotalPages(res?.pageCount)
    } catch (error) {
      console.error('Error fetching treatment records:', error);
    }
  }

  const getTreatment = async () => {
    try {
      let res = await get(`/ServiceTreatment/list/patient/${patientId}/${currentPage}/10000`);
      setTreatment(res?.data?.recordList);
      setTotalPages(res?.pageCount)
    } catch (error) {
      console.error('Error fetching treatment records:', error);
    }
  }

  // Group treatment by their specific type IDs
  const groupTreatmentsByType = (treatments) => {
    return {
      general: treatments?.filter(t => t.generalPracticeId !== 0),
      ogIvf: treatments?.filter(t => t.oG_IVFId !== 0),
      ortho: treatments?.filter(t => t.orthopedicId !== 0),
      ante: treatments?.filter(t => t.antenatalId !== 0),
      surg: treatments?.filter(t => t.generalSurgeryId !== 0),
      famPlan: treatments?.filter(t => t.familyMedicineId !== 0),
    };
  };

  const groupedTreatments = groupTreatmentsByType(treatment);


  return (
    <div>
      <div className="w-100">
        <div className="tabs m-t-20 bold-text">
          <div
            className={`tab-item ${selectedTab === "general" ? "active" : ""}`}
            onClick={() => setSelectedTab("general")}
          >
            General Practice
          </div>
          <div
            className={`tab-item ${selectedTab === "og-ivf" ? "active" : ""}`}
            onClick={() => setSelectedTab("og-ivf")}
          >
            OG & IVF
          </div>
          <div
            className={`tab-item ${selectedTab === "ortho" ? "active" : ""}`}
            onClick={() => setSelectedTab("ortho")}
          >
            Orthopedic
          </div>
          <div
            className={`tab-item ${selectedTab === "ante" ? "active" : ""}`}
            onClick={() => setSelectedTab("ante")}
          >
            Antenatal
          </div>
          <div
            className={`tab-item ${selectedTab === "surg" ? "active" : ""}`}
            onClick={() => setSelectedTab("surg")}
          >
            Surgery
          </div>
          <div
            className={`tab-item ${selectedTab === "fam-plan" ? "active" : ""}`}
            onClick={() => setSelectedTab("fam-plan")}
          >
            Family Planning
          </div>
        </div>
        <TreatmentTable
          data={
            selectedTab === "general" ? groupedTreatments.general :
              selectedTab === "og-ivf" ? groupedTreatments.ogIvf :
                selectedTab === "ortho" ? groupedTreatments.ortho :
                  selectedTab === "ante" ? groupedTreatments.ante :
                    selectedTab === "surg" ? groupedTreatments.surg :
                      selectedTab === "fam-plan" ? groupedTreatments.famPlan :
                        []
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
