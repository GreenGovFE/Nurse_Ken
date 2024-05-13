import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";


function GenderDistribution({malePatientPercentage, femalePatientPercentage}) {
  const data = [
    { name: "Male", value: malePatientPercentage },
    { name: "Female", value: femalePatientPercentage },
  ];
  const COLORS = ["#109615", "#FFC700"];


  return (
    <div className="w-100 container">
      <div className="bold-text w-100 border-bottom p-b-20">
        Gender Distribution
      </div>{" "}
      <div>
        <PieChart width={250} height={250}>
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
          />
          <Tooltip/>
          
          <Pie
            data={data}
            cx={100}
            cy={100}
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
      </div>
    </div>
  );
}

export default GenderDistribution;
