import React from "react";

function ReferralTable({ data }) {
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Hospital</th>
              <th>Diagnosis</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.hospital}</td>
                <td>{row.diagnosis}</td>
                <td>{row.dateCreated}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReferralTable;
