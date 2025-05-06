import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Select from 'react-select';


function OutAndInpatientGraph({ monthlyStats }) {
  // ensure we have an array
  const statsArray = Array.isArray(monthlyStats)
    ? monthlyStats
    : monthlyStats?.monthlyStats ?? [];

  const [viewMode, setViewMode] = useState("monthly"); // "monthly" or "daily"
  const [selectedMonth, setSelectedMonth] = useState(null);

  // auto-select the first month as soon as data arrives
  useEffect(() => {
    if (statsArray.length > 0 && !selectedMonth) {
      setSelectedMonth(statsArray[0].month);
    }
  }, [statsArray, selectedMonth]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formatMonthYear = dateString => {
    const d = new Date(dateString);
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  const monthlyData = statsArray.map(item => ({
    name: formatMonthYear(item.month),
    OutPatients: item.outPatientCount,
    InPatients: item.inPatientCount,
  }));

  const dailyData = statsArray
    .find(item => item.month === selectedMonth)
    ?.dailyStats.map(day => ({
      name: new Date(day.date).getDate(),
      OutPatients: day.outPatientCount,
      InPatients: day.inPatientCount,
    }));

  const dataToDisplay = viewMode === "monthly" ? monthlyData : dailyData;

  return (
    <div className="container w-100">
      <div className="flex space-between align-center ">
        <div className="bold-text">Outpatient vs Inpatient</div>
        <div className="flex gap-8 m-b-20">
          {/* Monthly is now _always_ clickable */}
          <button className={`${viewMode == 'monthly' ? 'submit-btn' : 'save-drafts'}`} onClick={() => setViewMode("monthly")}>
            Monthly
          </button>
          {/* Daily only disabled if we literally have no month selected */}
          <button
            className={`${viewMode == 'daily' ? 'submit-btn' : 'save-drafts'}`}
            onClick={() => setViewMode("daily")}
            disabled={!selectedMonth}
          >
            Daily
          </button>
        </div>
      </div>

      {viewMode === "daily" && (
        <div className="flex space-between  border-bottom m-b-20">
          {/** prepare your options once per render */}
          {(() => {
            const monthOptions = statsArray.map(item => ({
              value: item.month,
              label: formatMonthYear(item.month),
            }));
            return (
              <Select
                options={monthOptions}
                styles={{
                  container: provided => ({ ...provided, width: '30%', marginBottom: '10px', marginLeft: 'auto' }), 
                  control: provided => ({
                    ...provided,
                    height: '40px',
                    border: '1px solid #3c7e2d73',
                    borderRadius: '4px 4px 4px 4px',
                  }),
                  menu: provided => ({ ...provided, maxHeight: '200px' }),
                }}
                value={monthOptions.find(o => o.value === selectedMonth)}
                onChange={opt => setSelectedMonth(opt.value)}
                isSearchable={false}
                placeholder="Select Month…"
              />
            );
          })()}
        </div>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dataToDisplay}
          margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            label={{
              value: viewMode === "monthly" ? "Month" : "Day",
              position: "insideBottom",
              offset: -5,
            }}
          />
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
  );
}

export default OutAndInpatientGraph;
