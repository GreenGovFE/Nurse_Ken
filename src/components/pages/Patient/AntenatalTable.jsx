import React, { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import ServiceTreatmentTable from "../../ServiceTreatmentTable";

function AntenatalTable() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([])
  const [currenttreatmentrecord, setCurrenttreatmentrecord] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false)
  const [selectedTab, setSelectedTab] = useState("ante");


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
  }, [currentPage])

  useEffect(() => {
    getTreatment()
  }, [reset])

  

  const getTreatment = async () => {
    try {
      let res = await get(`/ServiceTreatment/list/${currentPage}/10000`);
      setTreatment(res?.data?.recordList);
      setTotalPages(res?.metadata?.totalPages)
    } catch (error) {
      console.error('Error fetching treatment records:', error);
    }
  }

  // Group treatment by their specific type IDs
  const groupTreatmentsByType = (treatments) => {
    return {
      ante: treatments?.filter(t => t.antenatalId !== 0),
      general: treatments?.filter(t => t.generalPracticeId !== 0),
      ogIvf: treatments?.filter(t => t.oG_IVFId !== 0),
      ortho: treatments?.filter(t => t.orthopedicId !== 0),
      surg: treatments?.filter(t => t.generalSurgeryId !== 0),
      famPlan: treatments?.filter(t => t.familyMedicineId !== 0),
    };
  };

  const groupedTreatments = groupTreatmentsByType(treatment);

  console.log("groupedTreatments", groupedTreatments);


  return (
    <div className="w-100">
      <div className=" m-t-80">
        <div className="tabs m-t-20 bold-text">
          <div
            className={`tab-item ${selectedTab === "ante" ? "active" : ""}`}
            onClick={() => setSelectedTab("ante")}
          >
            Antenatal
          </div>
        </div>
        <ServiceTreatmentTable
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

export default AntenatalTable;
