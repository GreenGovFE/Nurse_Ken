import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TextArea from "../../UI/TextArea";
import { RiToggleFill } from "react-icons/ri";
import AllergyTable from "../../tables/AlllergyTable";
import { PatientData, allergyData, stats } from "../mockdata/PatientData";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import TagInputs from "../../layouts/TagInputs";

function MedicalRecord() {
  const [selectedTab, setSelectedTab] = useState(1);
  const [allergies, setAllergies] = useState([{ name: "", comment: "" }]);
  const [pastIllnesses, setPastIllnesses] = useState([
    { name: "", comment: "" },
  ]);
  const [chronicConditions, setChronicConditions] = useState([
    { name: "", comment: "" },
  ]);
  const [surgicalHistory, setSurgicalHistory] = useState([
    { name: "", comment: "" },
  ]);
  const [familyHistory, setFamilyHistory] = useState([
    { name: "", comment: "" },
  ]);
  const [payload, setPayload] = useState({})

  const patientId = Number(sessionStorage.getItem("patientId"))
  const [medTableData, setMedTableData] = useState([])

  useEffect(() => {
    getMedRecords();
  }, []);

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
      case "allergies":
        setAllergies([...allergies, { name: "", comment: "" }]);
        break;
      case "pastIllnesses":
        setPastIllnesses([...pastIllnesses, { name: "", comment: "" }]);
        break;
      case "chronicConditions":
        setChronicConditions([...chronicConditions, { name: "", comment: "" }]);
        break;
      case "surgicalHistory":
        setSurgicalHistory([...surgicalHistory, { name: "", comment: "" }]);
        break;
      case "familyHistory":
        setFamilyHistory([...familyHistory, { name: "", comment: "" }]);
        break;
      default:
        break;
    }
  };

  const submitPayload = async (payload) => {
    try {
      const patientId = Number(sessionStorage.getItem("patientId"));
      if (!patientId) {
        throw new Error("Patient ID not found in session storage");
      }

      const res = await post("/patients/AddMedicalRecord", { ...payload, PatientId: patientId });
      console.log(res);

      if (res.recordId) {
        notification({ message: res?.messages, type: "success" });
        // sessionStorage.setItem("patientId", res?.patientId);
      }else if (res.StatusCode === 401) {
        notification({ message: 'Unathorized Session', type: "error" });
      }
      else if (res.StatusCode === 500) {
        notification({ message: 'Internal Server Error', type: "error" });
      }
       else {
        console.log(res);

        let errorMessage = "An error occurred";

        if (res && res.errors) {
          // Check if 'Name' or 'Comment' field has an error
          if (res.errors.Name && res.errors.Comment) {
            errorMessage = "Both Name and Comment are required";
          } else if (res.errors.Comment) {
            errorMessage = res.errors.Comment[0];
          }else if (res.errors.Name) {
            errorMessage = res.errors.Name[0];
          }
        }
        notification({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      console.log(error);
    };
  }

  const getMedRecords = async () => {
    try {
      let res = await get(`/patients/${patientId}/medicalRecord`)
      if (res) {
        setMedTableData(res)
        // sessionStorage.setItem("patientId", res?.patientId)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);

    }

  }


  const handleContinue = () => {
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

    const payload = {
      medicalRecordType: selectedTab,
      name: currentTabData[0]?.name,
      comment: currentTabData[0]?.comment,
    };
    console.log("Allergies:", allergies, payload, Number(sessionStorage.getItem("patientId")));
    console.log("Past Illnesses:", pastIllnesses);
    console.log("Chronic Conditions:", chronicConditions);
    console.log("Surgical History:", surgicalHistory);
    console.log("Family History:", familyHistory);
    submitPayload(payload);
  };



  return (
    <div>
      <div className="m-t-40">Medical Record</div>
      {/* Render tabs */}
      <div className="flex">
        <div className="m-r-80">
          <div
            className={`pointer m-t-20  ${selectedTab === 1 ? "pilled bold-text" : ""
              }`}
            onClick={() => setSelectedTab(1)}
          >
            1. Allergies
          </div>
          <div
            className={`pointer m-t-20  ${selectedTab === 2 ? "pilled bold-text" : ""
              }`}
            onClick={() => setSelectedTab(2)}
          >
            2. Past Illnesses
          </div>
          <div
            className={`pointer m-t-20  ${selectedTab === 3 ? "pilled bold-text" : ""
              }`}
            onClick={() => setSelectedTab(3)}
          >
            3. Chronic Conditions
          </div>
          <div
            className={`pointer m-t-20  ${selectedTab === 4 ? "pilled bold-text" : ""
              }`}
            onClick={() => setSelectedTab(4)}
          >
            4. Surgical History
          </div>
          <div
            className={`pointer m-t-20 ${selectedTab === 5 ? "pilled bold-text" : ""
              }`}
            onClick={() => setSelectedTab(5)}
          >
            5. Family History
          </div>
        </div>
        {/* Render content based on the selected tab */}

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
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={allergy.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              {/* <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Allergy
                </button>
              </div> */}
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
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={Illness.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              {/* <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Illness
                </button>
              </div> */}
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
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={condition.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              {/* <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Chronic Conditions
                </button>
              </div> */}
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
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={surgery.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              {/* <div className="w-100 flex flex-h-end">
                <button
                  className="rounded-btn m-t-20"
                  onClick={() => handleAddField("surgicalHistory")}
                >
                  Add Surgery
                </button>
              </div> */}
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
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TagInputs
                    label="Comment"
                    type="textArea"
                    placeholder="Comment"
                    value={familyMember.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              {/* <div className="w-100 flex flex-h-end">
                <button
                  className="rounded-btn m-t-20"
                  onClick={() => handleAddField("familyHistory")}
                >
                  Add Family History
                </button>
              </div> */}
            </div>
          )}

          {/* Repeat the above structure for other tabs */}
          {/* ... */}
          <button className="submit-btn w-100 m-t-20" onClick={handleContinue}>
            Add
          </button>
        </div>
      </div>
      <div>
        <AllergyTable data={medTableData} />

      </div>
    </div>
  );
}

export default MedicalRecord;

// i want this code to be a component where i can input data and submit. from the left it has five(5) tabs allergies, past illnesses, chronic conditions, Surgical history, family history. next is a each tab displays eg(alergy tab would have alergy 1 input field and comment and a plus button to add allergy 2 and comment etc) same with the rest tabs. and a continue button at the bottom
