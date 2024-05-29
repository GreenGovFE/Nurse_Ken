import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ResponsiveContainer } from "recharts";

function OutAndInpatientGraph({ InPatients, OutPatients }) {
  const dist = [
    { name: "OutPatients", value: OutPatients },
    { name: "InPatients", value: InPatients },
  ];
  const COLORS = ["#3BFF43", "#109615"];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const distro = Array.isArray(InPatients) && InPatients?.map((item) => {
    // Parsing month and year from the inPatient object
    const month = item?.month;
    const year = item?.year;

    // Formatting month and year into "Month Year" format
    const monthName = monthNames[month - 1]; // Adjusting index since month starts from 1
    const name = `${monthName} ${year}`;

    return {
      name: name,
      OutPatients: item?.inPatient,
      InPatients: item?.outPatient,
    };
  });

  return (
    <div className="w-100 container">
      <div className="w-100 flex flex-v-center space-between border-bottom p-b-20">
        <div className="bold-text">Outpatient vs Inpatient</div>{" "}
        <div>Month</div>
      </div>
      <div className="w-100">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={distro}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 80, // Increase bottom margin to accommodate rotated labels
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar
              barSize={10}
              dataKey="OutPatients"
              fill="#3BFF43"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              barSize={10}
              dataKey="InPatients"
              fill="#109615"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OutAndInpatientGraph;
