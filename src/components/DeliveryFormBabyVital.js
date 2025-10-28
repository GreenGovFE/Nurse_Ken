import React, { useState, useEffect } from "react";
import { put } from "../utility/fetch";
import moment from "moment";

const DeliveryFormBabyVital = ({ deliveryData, setwatcher }) => {
  const [data, setData] = useState([
    {
      date: "",
      time: "",
      pr: "",
      rr: "",
      temp: "",
      spO2: "",
      rbs: "",
      nurseId: 0,
    },
  ]);

  useEffect(() => {
    setData(deliveryData?.babyPostDeliveryVitals);
  }, [deliveryData]);

  const [newRecord, setNewRecord] = useState({
    date: "",
    time: "",
    pr: "",
    rr: "",
    temp: "",
    spO2: "",
    rbs: "",
    nurseId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddRecord = async () => {
    if (
      newRecord.date &&
      //   newRecord.time &&
      newRecord.pr &&
      newRecord.rr &&
      newRecord.temp &&
      newRecord.spO2 &&
      newRecord.rbs
    ) {
    //   setData([...data, newRecord]);
      let payload = { ...newRecord, nurseId: 0, time: {} };

      const response = await put(
        `/AntenatalDelivery/${deliveryData?.id}/patient/${deliveryData?.patient.id}/appointment/${deliveryData?.appointmentId}/add-antenatal-baby-post-delivery-vital
`,
        payload
      );

      if (response.isSuccess) {
        setwatcher((prev) => !prev);
      }

      setNewRecord({
        date: "",
        time: "",
        pr: "",
        rr: "",
        temp: "",
        spO2: "",
        rbs: "",
        nurseId: "",
      });
    }
  };

  return (
    <div class="w-100">
      <h2 style={{ textAlign: "center", margin: "15px 20px" }}>
        Baby Post Delivery Vital
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
              // gridTemplateColumns: "1fr 1fr",
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
            {/* <input
              type="time"
              name="time"
              value={newRecord.time}
              onChange={handleInputChange}
            /> */}
            <input
              type="text"
              name="pr"
              placeholder="PR"
              value={newRecord.pr}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="rr"
              placeholder="RR"
              value={newRecord.rr}
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
            <input
              type="text"
              name="rbs"
              placeholder="RBS"
              value={newRecord.rbs}
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
                {/* <th>Time</th> */}
                <th>PR</th>
                <th>RR</th>
                <th>Temp</th>
                <th>SpO₂</th>
                <th>RBS</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((record, index) => (
                  <tr key={index}>
       <td>{moment(record?.date).format('ll')}</td>
                    {/* <td>{record?.time}</td> */}
                    <td>{record?.pr}</td>
                    <td>{record?.rr}</td>
                    <td>{record?.temp}</td>
                    <td>{record?.spO2}</td>
                    <td>{record?.rbs}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
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

export default DeliveryFormBabyVital;
