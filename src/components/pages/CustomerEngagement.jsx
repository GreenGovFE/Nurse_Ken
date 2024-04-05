import React, { useEffect, useState } from "react";
import { months } from "../../utility/general";
import Select from "react-select";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";
import { get } from "../../utility/fetch";



const data = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
];
const COLORS = ["#109615", "#FFC700", "#FF0000"];

function CustomerEngagement() {
  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);
  const [selectedTab, setSelectedTab] = useState(1);
  const [month, setMonth] = useState("")

  const handleMonths = (month) => {
    console.log(month)
    setMonth(month?.label?.toLowerCase())
  }


  const getReviewData = async () => {
    let res = await get(`/customerengagements/customerengagements/${selectedTab}/${month || "january"}?pageIndex=1&pageSize=100`)
    console.log(res)
  }



  useEffect(() => {
    getReviewData();
  }, [month, selectedTab])



  return (
    <div className="w-100">

      <div className="tabs m-t-40 w-100 bold-text">
        <div
          className={`tab-item ${selectedTab === "personal" ? "active" : ""}`}
          onClick={() => setSelectedTab(1)}
        >
          Patients
        </div>

        <div
          className={`tab-item ${selectedTab === "contactDetails" ? "active" : ""
            }`}
          onClick={() => setSelectedTab(2)}
        >
          Colleagues
        </div>


      </div>
      <div className="m-t-20">...</div>
      <div className="m-t-20"> Customer Management</div>
      <div className="container w-40 m-t-20">
        <div className="w-100 flex flex-v-center space-between border-bottom p-b-20">
          <div className="bold-text">Patients Evaluation</div>
          <div className="w-60" >
            <Select options={months} onChange={handleMonths} />
          </div>
        </div>
        <PieChart width={300} height={300}>
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
          />
          <Pie
            data={data}
            cx={120}
            cy={100}
            innerRadius={60}
            outerRadius={75}
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
            <Label
              className="bold-text"
              fontSize={24}
              value={totalValue}
              position="center"
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}

export default CustomerEngagement;
