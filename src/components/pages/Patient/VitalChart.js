// VitalsChart.js
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const vitalOptions = [
  { key: "temperature", label: "Temperature", stroke: "#ff7300" },
  { key: "heartPulse", label: "Heart Pulse", stroke: "#387908" },
  { key: "bloodSugar", label: "Blood Sugar", stroke: "#8884d8" },
  { key: "oxygenSaturation", label: "Oxygen Saturation", stroke: "#82ca9d" },
  { key: "bloodPressure", label: "Blood Pressure", stroke: "#ffc658" },
  { key: "weight", label: "Weight", stroke: "#ff0000" },
  { key: "height", label: "Height", stroke: "#0000ff" },
  { key: "respiratory", label: "Respiratory Rate", stroke: "#ff00ff" },
  { key: "bmi", label: "BMI", stroke: "#00ffff" },

  // Add other vital options as needed.
];

const VitalsChart = ({ visitsData }) => {
  const [selectedVitals, setSelectedVitals] = useState(["temperature"]);

  // Ensure visitsData is an array before sorting
  const sortedData = Array.isArray(visitsData)
    ? [...visitsData].sort((a, b) => new Date(a.dateOfVisit) - new Date(b.dateOfVisit))
    : [];

  const toggleVital = (vitalKey) => {
    setSelectedVitals((prev) =>
      prev.includes(vitalKey)
        ? prev.filter((key) => key !== vitalKey)
        : [...prev, vitalKey]
    );
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Vitals Over Time</h3>
      {/* Vital Selection Checkboxes */}
      <div>
        {vitalOptions.map((vital) => (
          <label key={vital.key} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={selectedVitals.includes(vital.key)}
              onChange={() => toggleVital(vital.key)}
            />
            {vital.label}
          </label>
        ))}
      </div>
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={sortedData}>
          <XAxis dataKey="dateOfVisit" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedVitals.map((vitalKey) => {
            const option = vitalOptions.find((v) => v.key === vitalKey);
            return (
              <Line
                key={vitalKey}
                type="monotone"
                dataKey={vitalKey}
                stroke={option ? option.stroke : "#000"}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
