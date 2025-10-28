import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { post, put } from "../utility/fetch";
import toast from "react-hot-toast";

const initialVitals = [
  {
    date: "2025-06-01T12:54:13.376Z",
    time: null,
    // time: "12:54",
    pr: "80",
    bp: "120/80",
    temp: "37.0",
    fhr: "140",
    contractions: "Mild",
    ve: "3cm",
    remark: "Stable",
    nurseId: 1,
  },
];

const AntenatalLabourMonitoringVitalsTable = ({
  patientId,
  appointmentId,
  laboutMonitoringId,
  labourVitals,
  setchange,
}) => {
  const [vitals, setVitals] = useState(labourVitals);
  const [newVital, setNewVital] = useState({
    date: "",
    time: null,
    // time: "",
    pr: "",
    bp: "",
    temp: "",
    fhr: "",
    contractions: "",
    ve: "",
    remark: "",
    nurseId: 0,
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVital((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data) => {
    let payload = {
      ...data,
    };

    // e.preventDefault();
    //   console.log("Form Submitted:", formData);

    const response = await put(
      `/AntenatalLabourMonitoring/${laboutMonitoringId}/patient/${patientId}/appointment/${appointmentId}/add-antenatal-labour-vital`,
      { ...payload } // send formData directly
    );
    console.log(response);

    if (response?.isSuccess) {
      toast.success(response.message);

      setchange((prev) => !prev);
    }

    //   setchange((prev)=>!prev));
  };

  //   Emmanuel@1
  //   Emmanuel@outlook

  const handleAddOrUpdate = () => {
    if (!newVital.date) {
      alert("Date and Time are required!");
      return;
    }

    if (editIndex !== null) {
      // Update existing
      const updatedVitals = [...vitals];
      updatedVitals[editIndex] = newVital;
      setVitals(updatedVitals);
      setEditIndex(null);
    } else {
      // Add new
      //   setVitals((prev) => [...prev, newVital]);
      handleSubmit(newVital);
    }

    // Reset form
    setNewVital({
      date: "",
      time: null,
      //   time: "",
      pr: "",
      bp: "",
      temp: "",
      fhr: "",
      contractions: "",
      ve: "",
      remark: "",
      nurseId: 0,
    });
  };

  const handleEdit = (index) => {
    const item = vitals[index];
    setNewVital(item);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedVitals = vitals.filter((_, i) => i !== index);
    setVitals(updatedVitals);
    // If deleting the row currently being edited, reset edit state
    if (editIndex === index) {
      setEditIndex(null);
      setNewVital({
        date: "",
        time: null,
        pr: "",
        bp: "",
        temp: "",
        fhr: "",
        contractions: "",
        ve: "",
        remark: "",
        nurseId: 0,
      });
    }
  };

  return (
    <div>
      <h3>{editIndex !== null ? "Edit Vital" : "Add Vital"}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <input
          type="date"
          name="date"
          value={newVital.date}
          onChange={handleChange}
        />
        {/* <input
          type="time"
          name="time"
          value={newVital.time}
          onChange={handleChange}
        /> */}
        <input
          type="text"
          name="pr"
          placeholder="PR"
          value={newVital.pr}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bp"
          placeholder="BP"
          value={newVital.bp}
          onChange={handleChange}
        />
        <input
          type="text"
          name="temp"
          placeholder="Temp"
          value={newVital.temp}
          onChange={handleChange}
        />
        <input
          type="text"
          name="fhr"
          placeholder="FHR"
          value={newVital.fhr}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contractions"
          placeholder="Contractions"
          value={newVital.contractions}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ve"
          placeholder="VE"
          value={newVital.ve}
          onChange={handleChange}
        />
        <input
          type="text"
          name="remark"
          placeholder="Remark"
          value={newVital.remark}
          onChange={handleChange}
        />
        {/* <input
          type="number"
          name="nurseId"
          placeholder="Nurse ID"
          value={newVital.nurseId}
          onChange={handleChange}
        /> */}
      </div>
      <button className="m-t-10" onClick={handleAddOrUpdate}>
        {editIndex !== null ? "Update Vital" : "Add Vital"}
      </button>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>PR</th>
            <th>BP</th>
            <th>Temp</th>
            <th>FHR</th>
            <th>Contractions</th>
            <th>VE</th>
            <th>Remark</th>
            {/* <th>Nurse ID</th> */}
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {labourVitals?.map((vital, index) => (
            <tr key={index}>
              <td>{new Date(vital.date).toLocaleDateString()}</td>
              <td>{vital.time}</td>
              <td>{vital.pr}</td>
              <td>{vital.bp}</td>
              <td>{vital.temp}</td>
              <td>{vital.fhr}</td>
              <td>{vital.contractions}</td>
              <td>{vital.ve}</td>
              <td>{vital.remark}</td>
              {/* <td>{vital.nurseId}</td> */}
              {/* <td>
                <div class="flex-row-gap">
                  <FaEdit
                    onClick={() => handleEdit(index)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    color="#4A90E2"
                  />

                  <FaTrash
                    onClick={() => handleDelete(index)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    color="#D0021B"
                  />
                </div>
              </td> */}
            </tr>
          ))}
          {labourVitals?.length === 0 && (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AntenatalLabourMonitoringVitalsTable;
