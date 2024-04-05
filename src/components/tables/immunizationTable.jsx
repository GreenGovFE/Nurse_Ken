function ImmunizationTable({ data }) {
    return (
      <div className="w-100 ">
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>Date</th>
                <th>Vaccine</th>
                <th>Quantity</th>
                <th>Age</th>
                <th>Weight</th>
                <th>Temp</th>
                <th>Brand</th>
                <th>Admin Nurse</th>
             </tr>
            </thead>
  
            <tbody className="white-bg view-det-pane">
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.dateGiven).toLocaleDateString()}</td>
                  <td>{row.vaccine}</td>
                  <td>{row.quantity}</td>
                  <td>{row.age}</td>
                  <td>{row.weight}</td>
                  <td>{row.temperature}</td>
                  <td>{row.vaccineBrand}</td>
                  <td>{row.prescribedMedication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default ImmunizationTable;
  