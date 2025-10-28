import React, { useEffect, useState } from "react";

import Antenatal from "./Antenatal";
import StepsComponent from "./StepsComponent";

const AntinatalContainer = () => {
 
 const [currentStep, setCurrentStep] = useState(0);

  const steps = ["Antenatal", "Baby Vitals", "Medications", "Summary"];

  const handleStepChange = (index) => {
    setCurrentStep(index);
  };
  return (
    <div className="consultation-container" style={{ paddingTop: "60px" }}>

    <div style={{ padding: "20px" }}>
      {/* <h2>Delivery Process</h2> */}
      <StepsComponent steps={steps} onStepChange={handleStepChange} />

      <div style={{ marginTop: "20px" }}>
        {currentStep === 0 && <div><Antenatal/></div>}
        {currentStep === 1 && <div>Baby Vital Form</div>}
        {currentStep === 2 && <div>Medication Form</div>}
        {currentStep === 3 && <div>Summary & Review</div>}
      </div>
    </div>
    
    </div>
  );
};

export default AntinatalContainer;

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};
