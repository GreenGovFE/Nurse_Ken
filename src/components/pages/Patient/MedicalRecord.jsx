import React, { useState } from "react";
import InputField from "../../UI/InputField";
import TextArea from "../../UI/TextArea";
import { RiToggleFill } from "react-icons/ri";
import AllergyTable from "../../tables/AlllergyTable";
import { PatientData, allergyData, stats } from "../mockdata/PatientData";

function MedicalRecord() {
  const [selectedTab, setSelectedTab] = useState("allergies");
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

  const handleInputChange = (index, key, value) => {
    switch (selectedTab) {
      case "allergies":
        const updatedAllergies = [...allergies];
        updatedAllergies[index][key] = value;
        setAllergies(updatedAllergies);
        break;
      case "pastIllnesses":
        const updatedPastIllnesses = [...pastIllnesses];
        updatedPastIllnesses[index][key] = value;
        setPastIllnesses(updatedPastIllnesses);
        break;
      case "chronicConditions":
        const updatedChronicConditions = [...chronicConditions];
        updatedChronicConditions[index][key] = value;
        setChronicConditions(updatedChronicConditions);
        break;
      case "surgicalHistory":
        const updatedSurgicalHistory = [...surgicalHistory];
        updatedSurgicalHistory[index][key] = value;
        setSurgicalHistory(updatedSurgicalHistory);
        break;
      case "familyHistory":
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

  const handleContinue = () => {
    // Handle the logic for continuing with the data
    console.log("Allergies:", allergies);
    console.log("Past Illnesses:", pastIllnesses);
    console.log("Chronic Conditions:", chronicConditions);
    console.log("Surgical History:", surgicalHistory);
    console.log("Family History:", familyHistory);
  };

  return (
    <div>
      <div className="m-t-40">Medical Record</div>
      {/* Render tabs */}
      <div className="flex">
        <div className="m-r-80">
          <div
            className={`pointer m-t-20  ${
              selectedTab === "allergies" ? "pilled bold-text" : ""
            }`}
            onClick={() => setSelectedTab("allergies")}
          >
            1. Allergies
          </div>
          <div
            className={`pointer m-t-20  ${
              selectedTab === "pastIllnesses" ? "pilled bold-text" : ""
            }`}
            onClick={() => setSelectedTab("pastIllnesses")}
          >
            2. Past Illnesses
          </div>
          <div
            className={`pointer m-t-20  ${
              selectedTab === "chronicConditions" ? "pilled bold-text" : ""
            }`}
            onClick={() => setSelectedTab("chronicConditions")}
          >
            3. Chronic Conditions
          </div>
          <div
            className={`pointer m-t-20  ${
              selectedTab === "surgicalHistory" ? "pilled bold-text" : ""
            }`}
            onClick={() => setSelectedTab("surgicalHistory")}
          >
            4. Surgical History
          </div>
          <div
            className={`pointer m-t-20 ${
              selectedTab === "familyHistory" ? "pilled bold-text" : ""
            }`}
            onClick={() => setSelectedTab("familyHistory")}
          >
            5. Family History
          </div>
        </div>
        {/* Render content based on the selected tab */}

        <div>
          {selectedTab === "allergies" && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
                <div>Not Applicable</div>
                <RiToggleFill color="green" size={32} />
              </div>

              {allergies.map((allergy, index) => (
                <div key={index}>
                  <InputField
                    label="Allergy Name"
                    type="text"
                    placeholder="Allergy Name"
                    value={allergy.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextArea
                    label="Comment"
                    type="text"
                    placeholder="Comment"
                    value={allergy.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Allergy
                </button>
              </div>
            </div>
          )}
          {selectedTab === "pastIllnesses" && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
                <div>Not Applicable</div>
                <RiToggleFill color="green" size={32} />
              </div>
              {pastIllnesses.map((Illness, index) => (
                <div key={index}>
                  <InputField
                    label="Illness Name"
                    type="text"
                    placeholder="Illness Name"
                    value={Illness.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextArea
                    label="Comment"
                    type="text"
                    placeholder="Comment"
                    value={Illness.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Illness
                </button>
              </div>
            </div>
          )}

          {selectedTab === "chronicConditions" && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
                <div>Not Applicable</div>
                <RiToggleFill color="green" size={32} />
              </div>
              {chronicConditions.map((condition, index) => (
                <div key={index}>
                  <InputField
                    label="Condition Name"
                    type="text"
                    placeholder="Condition Name"
                    value={condition.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextArea
                    label="Comment"
                    type="text"
                    placeholder="Comment"
                    value={condition.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="w-100 flex flex-h-end">
                <button className="rounded-btn m-t-20" onClick={handleAddField}>
                  Add Chronic Conditions
                </button>
              </div>
            </div>
          )}

          {selectedTab === "surgicalHistory" && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
                <div>Not Applicable</div>
                <RiToggleFill color="green" size={32} />
              </div>
              {surgicalHistory.map((surgery, index) => (
                <div key={index}>
                  <InputField
                    label="Surgery Name"
                    type="text"
                    placeholder="Surgery Name"
                    value={surgery.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextArea
                    label="Comment"
                    type="text"
                    placeholder="Comment"
                    value={surgery.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="w-100 flex flex-h-end">
                <button
                  className="rounded-btn m-t-20"
                  onClick={() => handleAddField("surgicalHistory")}
                >
                  Add Surgery
                </button>
              </div>
            </div>
          )}

          {selectedTab === "familyHistory" && (
            <div>
              <div className="w-100 flex flex-h-end flex-v-center gap-4">
                <div>Not Applicable</div>
                <RiToggleFill color="green" size={32} />
              </div>
              {familyHistory.map((familyMember, index) => (
                <div key={index}>
                  <InputField
                    label="Name"
                    type="text"
                    placeholder="Family Member Name"
                    value={familyMember.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                  <TextArea
                    label="Comment"
                    type="text"
                    placeholder="Comment"
                    value={familyMember.comment}
                    onChange={(e) =>
                      handleInputChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="w-100 flex flex-h-end">
                <button
                  className="rounded-btn m-t-20"
                  onClick={() => handleAddField("familyHistory")}
                >
                  Add Family History
                </button>
              </div>
            </div>
          )}

          {/* Repeat the above structure for other tabs */}
          {/* ... */}
          <div>
            <button className="btn w-100 m-t-20" onClick={handleContinue}>
              Continue
            </button>
            <AllergyTable data={allergyData} />

          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecord;

// i want this code to be a component where i can input data and submit. from the left it has five(5) tabs allergies, past illnesses, chronic conditions, Surgical history, family history. next is a each tab displays eg(alergy tab would have alergy 1 input field and comment and a plus button to add allergy 2 and comment etc) same with the rest tabs. and a continue button at the bottom
