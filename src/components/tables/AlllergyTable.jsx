import React from "react";

function AllergyTable({ data }) {

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };

  // Mapping of medicalRecordType values to their corresponding names
  const recordTypeMapping = {
    1: "Allergies",
    2: "Past Illnesses",
    3: "Chronic Conditions",
    4: "Surgical History",
    5: "Family Medical History",
  };

  console.log(data);

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Date</th>
              <th className="center-text">Illness</th>
              <th className="center-text">Record type</th>
              <th className="center-text">Details</th>
              <th>Prescribed Medication</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                <td>{row?.name}</td>
                <td>{recordTypeMapping[row?.medicalRecordType]}</td>
                <td>{row?.comment}</td>
                <td>{row?.prescribedMedication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllergyTable;
