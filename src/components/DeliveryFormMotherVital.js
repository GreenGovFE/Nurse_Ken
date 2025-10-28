import React, { useState, useEffect } from "react";
import { put } from "../utility/fetch";
import moment from "moment";

const DeliveryFormMotherVital = ({ deliveryData, setwatcher }) => {
  const [data, setData] = useState([
    {
      date: "",
      time: "",
      pr: "",
      bp: "",
      temp: "",
      spO2: "",
      nurseId: 0,
    },
  ]);

  useEffect(() => {
    setData(deliveryData?.motherPostDeliveryVitals);
  }, [deliveryData]);

  const [newRecord, setNewRecord] = useState({
    date: "",
    time: "",
    pr: "",
    bp: "",
    temp: "",
    spO2: "",
    nurseId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddRecord = async () => {
    if (
      newRecord.date &&
      newRecord.pr &&
      newRecord.bp &&
      newRecord.temp &&
      newRecord.spO2
    ) {
      let payload = { ...newRecord, nurseId: 0, time: {} };

      const response = await put(
        `/AntenatalDelivery/${deliveryData?.id}/patient/${deliveryData?.patient.id}/appointment/${deliveryData?.appointmentId}/add_antenatal_mother_post_delivery_vital`,
        payload
      );

      if (response.isSuccess) {
        setwatcher((prev) => !prev);
      }

      setNewRecord({
        date: "",
        time: "",
        pr: "",
        bp: "",
        temp: "",
        spO2: "",
        nurseId: "",
      });
    }
  };

  return (
    <div className="w-100">
      <h2 style={{ textAlign: "center", margin: "15px 20px" }}>
        Mother Post Delivery Vital
      </h2>

      <div
        className="vitals-container"
        style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
      >
        {/* Form Section */}
        <div className="">
          <div
            className="add-form"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              type="datetime-local"
              name="date"
              value={newRecord.date}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="pr"
              placeholder="PR"
              value={newRecord.pr}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="bp"
              placeholder="BP (mmHg)"
              value={newRecord.bp}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="temp"
              placeholder="Temp (°C)"
              value={newRecord.temp}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="spO2"
              placeholder="SpO₂ (%)"
              value={newRecord.spO2}
              onChange={handleInputChange}
            />
          </div>
          <button className="mt--10" onClick={handleAddRecord}>
            Add
          </button>
        </div>

        {/* Table Section */}
        <div className="table-section" style={{ flex: "2" }}>
          <table className="readonly-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>PR</th>
                <th>BP</th>
                <th>Temp</th>
                <th>SpO₂</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((record, index) => (
                  <tr key={index}>
                    <td>{moment(record?.date).format('ll')}</td>
                    <td>{record?.pr}</td>
                    <td>{record?.bp}</td>
                    <td>{record?.temp}</td>
                    <td>{record?.spO2}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No vitals recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFormMotherVital;
