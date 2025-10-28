import React, { useEffect, useState } from "react";
import { put } from "../utility/fetch";
// import "./tableStyles.css";

const DeliveryFormDrugsTable = ({ deliveryData, setwatcher }) => {
  const [data, setData] = useState([
    {
      oxytocin: "10 IU",
      ergot: "0.5 mg",
      traxanamicAcid: "500 mg",
      dextrose: "100 ml",
      nurseId: 3,
    },
  ]);

  useEffect(() => {
    setData(deliveryData?.drugsGiven);
  }, [deliveryData]);

  const [newRecord, setNewRecord] = useState({
    oxytocin: "",
    ergot: "",
    traxanamicAcid: "",
    dextrose: "",
    nurseId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddRecord = async (e) => {
    // e.preventDefault();
    if (
      newRecord.oxytocin &&
      newRecord.ergot &&
      newRecord.traxanamicAcid &&
      newRecord.dextrose
      //   newRecord.nurseId
    ) {
      setData([...data, newRecord]);
      let payload = { ...newRecord, nurseId: 0 };

      const response = await put(
        `/AntenatalDelivery/${deliveryData?.id}/patient/${deliveryData?.patient.id}/appointment/${deliveryData?.appointmentId}/add_antenatal_delivery_drug_given`,
        { ...payload } // send formData directly
      );

      if (response.isSuccess) {
        setwatcher((prev) => !prev);
      }

      setNewRecord({
        oxytocin: "",
        ergot: "",
        traxanamicAcid: "",
        dextrose: "",
        nurseId: "",
      });
    }
  };

  return (
    <div className="table-container">
      <h2 style={{ textAlign: "center", margin: "15px 20px" }}>
        Drugs Administered
      </h2>

      <div className="add-form w-full flex-row-gap">
        <input
          type="text"
          name="oxytocin"
          placeholder="Oxytocin"
          value={newRecord.oxytocin}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ergot"
          placeholder="Ergot"
          value={newRecord.ergot}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="traxanamicAcid"
          placeholder="Traxanamic Acid"
          value={newRecord.traxanamicAcid}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dextrose"
          placeholder="Dextrose"
          value={newRecord.dextrose}
          onChange={handleInputChange}
        />
        {/* <input
          type="number"
          name="nurseId"
          placeholder="Nurse ID"
          value={newRecord.nurseId}
          onChange={handleInputChange}
        /> */}
      </div>
      <button className="mt--10" onClick={handleAddRecord}>
        Add
      </button>

      <table className="readonly-table ">
        <thead>
          <tr>
            <th>Oxytocin</th>
            <th>Ergot</th>
            <th>Traxanamic Acid</th>
            <th>Dextrose</th>
            {/* <th>Nurse ID</th> */}
          </tr>
        </thead>
        <tbody>
          {data?.map((record, index) => (
            <tr key={index}>
              <td>{record?.oxytocin} IU</td>
              <td>{record?.ergot} mg</td>
              <td>{record?.traxanamicAcid} mg</td>
              <td>{record?.dextrose} ml</td>
              {/* <td>{record?.nurseId}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryFormDrugsTable;
