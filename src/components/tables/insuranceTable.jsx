import React from "react";

function InsuranceTable({ data }) {
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Payment Plan</th>
              <th>HMO</th>
              <th>Package</th>
              <th>Enrolment Date</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.paymentPlan}</td>
                <td>{row.hmo}</td>
                <td>{row.package}</td>
                <td>{row.erolmentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsuranceTable;
