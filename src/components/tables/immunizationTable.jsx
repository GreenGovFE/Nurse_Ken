import { useState } from "react";
import ViewImunizationNotes from "../modals/Immunization";

function ImmunizationTable({ data,  }) {
  const [viewing, setViewing] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);

  };



  const selectRecord = (record) => () => {
    setViewing(record);
    setIsModalOpen(true);
  };
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-10">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Vaccine</th>
              <th className="center-text">Quantity</th>
              <th className="center-text">Age</th>
              <th className="center-text">Weight (Kg)</th>
              <th className="center-text">Temperature  (°C)</th>
              <th className="center-text">Brand</th>
              <th className="center-text">Admin Nurse</th>
              <th className="center-text"></th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.dateGiven).toLocaleDateString()}</td>
                <td>{row?.vaccine}</td>
                <td>{row?.quantity}</td>
                <td>{row?.age}</td>
                <td>{row?.weight}</td>
                <td>{row?.temperature}</td>
                <td>{row?.vaccineBrand}</td>
                <td>{row?.nurseName}</td>
                <td onClick={selectRecord(row)}><img className="hovers pointer" src="/details.png" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      { isModalOpen &&
        <ViewImunizationNotes
          visit={viewing}
          closeModal={closeModal}
        />
      }
    </div>
  );
}

export default ImmunizationTable;
