import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import AllergyTable from "../../tables/AlllergyTable";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function MedicalRecord() {
  const { patientId } = usePatient();

  const [selectedTab, setSelectedTab] = useState(1);
  const [allergies, setAllergies] = useState([{ name: "", comment: "" }]);
  const [pastIllnesses, setPastIllnesses] = useState([{ name: "", comment: "" }]);
  const [chronicConditions, setChronicConditions] = useState([{ name: "", comment: "" }]);
  const [surgicalHistory, setSurgicalHistory] = useState([{ name: "", comment: "" }]);
  const [familyHistory, setFamilyHistory] = useState([{ name: "", comment: "" }]);
  const [payload, setPayload] = useState({});
  const [medTableData, setMedTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    getMedRecords();
  }, [currentPage]);

  const handleInputChange = (index, key, value) => {
    switch (selectedTab) {
      case 1:
        const updatedAllergies = [...allergies];
        updatedAllergies[index][key] = value;
        setAllergies(updatedAllergies);
        break;
      case 2:
        const updatedPastIllnesses = [...pastIllnesses];
        updatedPastIllnesses[index][key] = value;
        setPastIllnesses(updatedPastIllnesses);
        break;
      case 3:
        const updatedChronicConditions = [...chronicConditions];
        updatedChronicConditions[index][key] = value;
        setChronicConditions(updatedChronicConditions);
        break;
      case 4:
        const updatedSurgicalHistory = [...surgicalHistory];
        updatedSurgicalHistory[index][key] = value;
        setSurgicalHistory(updatedSurgicalHistory);
        break;
      case 5:
        const updatedFamilyHistory = [...familyHistory];
        updatedFamilyHistory[index][key] = value;
        setFamilyHistory(updatedFamilyHistory);
        break;
      default:
        break;
    }
  };

  const handleAddField = () => {
    switch (selectedTab) {
      case 1:
        setAllergies([...allergies, { name: "", comment: "" }]);
        break;
      case 2:
        setPastIllnesses([...pastIllnesses, { name: "", comment: "" }]);
        break;
      case 3:
        setChronicConditions([...chronicConditions, { name: "", comment: "" }]);
        break;
      case 4:
        setSurgicalHistory([...surgicalHistory, { name: "", comment: "" }]);
        break;
      case 5:
        setFamilyHistory([...familyHistory, { name: "", comment: "" }]);
        break;
      default:
        break;
    }
  };

  const resetFields = () => {
    setAllergies([{ name: "", comment: "" }]);
    setPastIllnesses([{ name: "", comment: "" }]);
    setChronicConditions([{ name: "", comment: "" }]);
    setSurgicalHistory([{ name: "", comment: "" }]);
    setFamilyHistory([{ name: "", comment: "" }]);
  };

  const submitPayload = async (payload) => {
    try {
      if (!patientId) {
        notification({ message: "No Patient found please create one and try again", type: "error" });
        throw new Error("Patient ID not found");
      }

      const res = await post("/patients/AddMedicalRecord", { ...payload, PatientId: patientId });
      console.log(res);

      if (res.recordId) {
        notification({ message: res?.message, type: "success" });
        resetFields();
        getMedRecords()
      } else if (res.StatusCode === 401) {
        notification({ message: 'Unauthorized Session', type: "error" });
      } else if (res.StatusCode === 500) {
        notification({ message: 'Internal Server Error', type: "error" });
      } else {
        console.log(res);

        let errorMessage = "An error occurred";

        if (res && res.errors) {
          if (res.errors.Name && res.errors.Comment) {
            errorMessage = "Both Name and Comment are required";
          } else if (res.errors.Comment) {
            errorMessage = res.errors.Comment[0];
          } else if (res.errors.Name) {
            errorMessage = res.errors.Name[0];
          }
        }
        notification({ message: errorMessage, type: "error" });
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const getMedRecords = async () => {
    try {
      let res = await get(`/patients/GetAllMedicalRecordByPatientId?patientId=${patientId}&pageIndex=${currentPage}&pageSize=10`);
      if (res) {
        setMedTableData(res.data);
        setTotalPages(res.pageCount)
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const validateFields = (data) => {
    for (let item of data) {
      if (!item.name || !item.comment) {
        if (!item.name && !item.comment) {
          notification({ message: "Both Name and Comment are required", type: "error" });
        } else if (!item.name) {
          notification({ message: "Name is required", type: "error" });
        } else if (!item.comment) {
          notification({ message: "Comment is required", type: "error" });
        }
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    setLoading(true)
    let currentTabData = {};
    switch (selectedTab) {
      case 1:
        currentTabData = allergies;
        break;
      case 2:
        currentTabData = pastIllnesses;
        break;
      case 3:
        currentTabData = chronicConditions;
        break;
      case 4:
        currentTabData = surgicalHistory;
        break;
      case 5:
        currentTabData = familyHistory;
        break;
      default:
        break;
    }


    if (validateFields(currentTabData)) {
      const payload = {
        medicalRecordType: selectedTab,
        name: currentTabData[0]?.name,
        comment: currentTabData[0]?.comment,
      };
      submitPayload(payload);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="m-r-80">
          <div
            className={`pointer m-t-20 ${selectedTab === 1 ? "pilled bold-text" : ""}`}
            onClick={() => setSelectedTab(1)}
          >
            1. Allergies
          </div>
          <div
            className={`pointer m-t-20 ${selectedTab === 2 ? "pilled bold-text" : ""}`}
            onClick={() => setSelectedTab(2)}
          >
            2. Past Illnesses
          </div>
          <div
            className={`pointer m-t-20 ${selectedTab === 3 ? "pilled bold-text" : ""}`}
            onClick={() => setSelectedTab(3)}
          >
            3. Chronic Conditions
          </div>
          <div
            className={`pointer m-t-20 ${selectedTab === 4 ? "pilled bold-text" : ""}`}
            onClick={() => setSelectedTab(4)}
          >
            4. Surgical History
          </div>
          <div
            className={`pointer m-t-20 ${selectedTab === 5 ? "pilled bold-text" : ""}`}
            onClick={() => setSelectedTab(5)}
          >
            5. Family Medical History

          </div>
        </div>

        <div>
          {selectedTab === 1 && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
              </div>
              {allergies.map((allergy, index) => (
                <div key={index}>
                  <TagInputs
                    label="Allergy Name"
                    type="text"
                    placeholder="Allergy Name"
                    value={allergy.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={allergy.comment}
                    onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedTab === 2 && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
              </div>
              {pastIllnesses.map((Illness, index) => (
                <div key={index}>
                  <TagInputs
                    label="Illness Name"
                    type="text"
                    placeholder="Illness Name"
                    value={Illness.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={Illness.comment}
                    onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedTab === 3 && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
              </div>
              {chronicConditions.map((condition, index) => (
                <div key={index}>
                  <TagInputs
                    label="Condition Name"
                    type="text"
                    placeholder="Condition Name"
                    value={condition.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={condition.comment}
                    onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedTab === 4 && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
              </div>
              {surgicalHistory.map((surgery, index) => (
                <div key={index}>
                  <TagInputs
                    label="Surgery Name"
                    type="text"
                    placeholder="Surgery Name"
                    value={surgery.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={surgery.comment}
                    onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedTab === 5 && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
              </div>
              {familyHistory.map((familyMember, index) => (
                <div key={index}>
                  <TagInputs
                    label="Name"
                    type="text"
                    placeholder="Family Member Name"
                    value={familyMember.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={familyMember.comment}
                    onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <button disabled={loading} className="submit-btn w-100 m-t-20" onClick={handleContinue}>
            Add
          </button>
        </div>
      </div>
      <h3 className="m-t-20">Medical History</h3>
      <div>
        <div>
          <AllergyTable data={medTableData} />
          <div className="pagination flex space-between float-right col-3 m-t-20">
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
      </div>
    </div>
  );
}

export default MedicalRecord;
