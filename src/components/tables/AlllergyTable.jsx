function AllergyTable({ data }) {
  
  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };

  console.log(data)

    return (
      <div className="w-100 ">
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>Date</th>
                <th>Allergy type</th>
                <th>Details</th>
                <th>Prescribed Medication</th>
             </tr>
            </thead>
  
            <tbody className="white-bg view-det-pane">
              {data.map((row) => (
                <tr key={row?.id}>
                  <td>{formatDate(row?.createdAt)}</td>
                  <td>{row?.name}</td>
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
  