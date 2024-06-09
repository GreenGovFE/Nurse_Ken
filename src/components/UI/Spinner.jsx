import React from "react";

const Spinner = () => {
  const spinnerStyle = {
    display: "inline-block",
    width: "80px",
    height: "80px",
  };

  const circleStyle = {
    boxSizing: "border-box",
    display: "block",
    position: "absolute",
    width: "64px",
    height: "64px",
    margin: "8px",
    border: "8px solid #3C7E2D",
    borderRadius: "50%",
    animation: "spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
    borderColor: "#3C7E2D transparent transparent transparent",
  };

  const spinnerKeyframes = `
    @keyframes spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <div style={{ ...spinnerStyle, position: "relative" }}>
      <style>{spinnerKeyframes}</style>
      <div style={circleStyle}></div>
      <div style={{ ...circleStyle, animationDelay: "-0.45s" }}></div>
      <div style={{ ...circleStyle, animationDelay: "-0.3s" }}></div>
      <div style={{ ...circleStyle, animationDelay: "-0.15s" }}></div>
    </div>
  );
};

export default Spinner;
