import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { ResponsiveContainer } from "recharts";

function GenderDistribution({ malePatientPercentage, femalePatientPercentage }) {
  const data = [
    { name: "Male", value: malePatientPercentage },
    { name: "Female", value: femalePatientPercentage },
  ];
  const COLORS = ["#109615", "#FFC700"];

  return (
    <div className="w-100 container">
      <div className="bold-text w-100 border-bottom p-b-20">
        Patient's By Gender
      </div>{" "}
      <div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
            />
            <Tooltip />

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={53}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GenderDistribution;
