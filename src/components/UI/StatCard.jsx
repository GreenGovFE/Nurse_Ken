import React from "react";

function StatCard({ data, icon }) {
  return (
    <div>
      <div className="stat-card ">
        <div className="flex flex-v-center  gap-6">
          <div className="rounded-bg text-green">{icon}</div>
          <div>
            <h3 className="bold-text">{data.number}</h3>
            <p className="text-gray text-caption">{data.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
