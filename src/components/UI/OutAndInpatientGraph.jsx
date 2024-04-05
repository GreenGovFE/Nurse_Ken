import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dist = [
  { name: "Out-Patients", value: 400 },
  { name: "In-Patients", value: 300 },
];
const COLORS = ["#3BFF43", "#109615"];

const data = [
  {
    name: "Jul 23",
    OutPatients: 4000,
    InPatients: 2400,
    amt: 2400,
  },
  {
    name: "Aug 23",
    OutPatients: 3000,
    InPatients: 1398,
    amt: 2210,
  },
  {
    name: "Sep 23",
    OutPatients: 2000,
    InPatients: 9800,
    amt: 2290,
  },
  {
    name: "oct 23",
    OutPatients: 2780,
    InPatients: 3908,
    amt: 2000,
  },
  {
    name: "Nov 23",
    OutPatients: 1890,
    InPatients: 4800,
    amt: 2181,
  },
  {
    name: "Dec 23",
    OutPatients: 2390,
    InPatients: 3800,
    amt: 2500,
  },
];
function OutAndInpatientGraph() {
  return (
    <div className="w-100 container">
      <div className="w-100 flex flex-v-center space-between border-bottom p-b-20">
        <div className="bold-text">Outpatient vs Inpatient seen</div>{" "}
        <div>Month</div>
      </div>
      <div className="w-100 flex  ">
        <BarChart
          width={800}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3" />
          <XAxis dataKey="name" />
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

        <PieChart width={250} height={250}>
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
          />
          <Pie
            data={dist}
            cx={120}
            cy={100}
            innerRadius={53}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
            {dist.map((entry, index) => (
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

export default OutAndInpatientGraph;
