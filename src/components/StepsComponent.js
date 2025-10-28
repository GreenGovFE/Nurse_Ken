import React, { useState } from "react";

const StepsComponent = ({ steps, onStepChange }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index) => {
    setActiveStep(index);
    onStepChange(index);
  };

  return (
    <div className="steps-wrapper" style={{ display: "flex", margin: "20px 0" }}>
      {steps?.map((step, index) => (
        <div
          key={index}
          onClick={() => handleStepClick(index)}
          style={{
            flex: 1,
            padding: "10px 0",
            textAlign: "center",
            cursor: "pointer",
            background: index === activeStep ? "#3498db" : "#ecf0f1",
            color: index === activeStep ? "#fff" : "#333",
            borderRadius: "4px",
            marginRight: index !== steps.length - 1 ? "10px" : "0",
            transition: "all 0.3s ease",
          }}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default StepsComponent;
