import React, { useEffect, useState } from "react";
import "./AntenatalTable.css";
import { put } from "../../../utility/fetch";
import toast from "react-hot-toast";
import moment from "moment";
import GhostTextCompletion from "../../UI/TextPrediction";
import { RiCloseFill } from "react-icons/ri"
const AntenatalVisitTable = ({
  id,
  patientId,
  appointmentId,
  visits,
  catchAddedVisits,
  fetchRecord,
}) => {
  const [clinicalNotes, setclinicalNotes] = useState("");
  const [open, setopen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const [formData, setFormData] = useState({
    antenatalVisits: [...visits],
  });

  const addClinicalNotes = async () => {
    // https://edogoverp.com/medicals/api/Antenatal/1/antenatal-visit/1/patient/1/appointment/1/add-clinical-note-to-antenatal-visit
    const response = await put(
      `/Antenatal/${id}/antenatal-visit/${currentData.id}/patient/${patientId}/appointment/${appointmentId}/add-clinical-note-to-antenatal-visit`,
      { clinicalNote: clinicalNotes } // send formData directly
    );

    console.log(response);
    if (response.isSuccess) {
      toast.success(response.data.message);
    }
  };
  const closeModal = () => {
    setopen(!open);
  };

  const handleChange = (e) => {
    setclinicalNotes(e.target.value);
    // setclinicalNotes()
    // const { name, value, type, checked } = e.target;
    // console.log(name);
    // console.log(value);

    // if (type === "checkbox") {
    //   console.log(checked);
    // }
    // setFormData({
    //   ...formData,
    //   [name]: type === "checkbox" ? checked : value,
    // });
  };

  useEffect(() => {
    setFormData({
      antenatalVisits: [...visits],
    });
  }, [visits]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData.antenatalVisits[formData.antenatalVisits.length - 1]);

    let payload = {
      date: "2025-05-06T07:25:06.181Z",
      bp: "string",
      oedma: "string",
      presentation: "string",
      lie: "string",
      position: "string",
      ve: "string",
      tt: "string",
      pcv: "string",
      urine: {
        prot: "string",
        glu: "string",
      },
      remark: "string",
      remarkSignature: "string",
      ...formData.antenatalVisits[formData.antenatalVisits.length - 1],
      visitNo:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]?.visitNo,
      gestationalAgeWeeks:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]
          .gestationalAgeWeeks,
      pr: +formData.antenatalVisits[formData.antenatalVisits.length - 1]?.pr,
      weightKg:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]
          ?.weightKg,
      sfhCm:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]?.sfhCm,
      fetalHeartRate:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]
          ?.fetalHeartRate,
      temperature:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]
          ?.temperature,
      respirationRate:
        +formData.antenatalVisits[formData.antenatalVisits.length - 1]
          ?.respirationRate,

      //        "temperature": 0,
      // "respirationRate": 0,
    };
    // return;
    // console.log("FormData:", formData);

    try {
      const response = await put(
        `/Antenatal/${id}/patient/${patientId}/appointment/${appointmentId}/add-antenatal-visit`,
        payload // send formData directly
      );
      fetchRecord();
      toast.success("Updated successfully");

      console.log("API Response:", response);
    } catch (error) {
      toast.error("Please make sure all fields are properly filled");
      fetchRecord();

      console.error("Submission failed:", error);
      if (error?.response?.data?.errors) {
        Object.entries(error.response?.data.data.errors).forEach(
          ([field, messages]) => {
            messages.forEach((msg) => {
              console.warn(`${field}: ${msg}`);
            });
          }
        );
      }
    }
  };

  const [antenatalEntry, setAntenatalEntry] = useState({
    visitNo: 1,
    date: null,
    gestationalAgeWeeks: 0,
    bp: "",
    pr: 0,
    weightKg: 0,
    oedma: "",
    sfhCm: 0,
    presentation: "",
    lie: "",
    position: "",
    fetalHeartRate: 0,
    temperature: 0,
    respirationRate: 0,
    ve: "",
    tt: "",
    pcv: "",
    urine: { prot: "", glu: "" },
    remark: "",
    status: true,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editEntry, setEditEntry] = useState({});

  const addAntenatalVisit = () => {
    setFormData({
      antenatalVisits: [...formData.antenatalVisits, antenatalEntry],
    });

    catchAddedVisits([...formData.antenatalVisits, antenatalEntry]);
    setAntenatalEntry({
      visitNo: 1,
      date: "",
      gestationalAgeWeeks: 0,
      bp: "",
      pr: 0,
      weightKg: 0,
      oedma: "",
      sfhCm: 0,
      presentation: "",
      lie: "",
      position: "",
      fetalHeartRate: 0,
      temperature: 0,
      respirationRate: 0,
      ve: "",
      tt: "",
      pcv: "",
      urine: { prot: "", glu: "" },
      remark: "",
      status: true,
    });
  };

  const deleteAntenatalVisit = (index) => {
    const newVisits = [...formData.antenatalVisits];
    newVisits.splice(index, 1);
    setFormData({ antenatalVisits: newVisits });
    catchAddedVisits([...newVisits]);

    console.log(newVisits);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditEntry(formData.antenatalVisits[index]);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditEntry({});
  };

  const saveEdit = (index) => {
    const updatedVisits = [...formData.antenatalVisits];
    updatedVisits[index] = editEntry;
    setFormData({ antenatalVisits: updatedVisits });

    console.log(updatedVisits);
    setEditIndex(null);
    catchAddedVisits(updatedVisits);
  };

  return (
    <div className="readonly-table-wrapperR">
      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
            // cellPadding={5}
            className="w-full text-sm readonly-tableR"
          >
            <thead>
            <tr>
              <th>Visit#</th>
              <th>Date</th>
              <th>GA (weeks)</th>
              <th>BP (mmHg)</th>
              <th>PR (bpm)</th>
              <th>Weight (kg)</th>
              <th>Oedema</th>
              <th>SFH (cm)</th>
              <th>Presentation</th>
              <th>Lie</th>
              <th>Position</th>
              <th>FHR (bpm)</th>
              <th>Temp (°C)</th>
              <th>Resp Rate </th>
              <th>VE</th>
              <th>TT</th>
              <th>PCV (%)</th>
              <th colSpan={2}>Urine (Prot/Glu)</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th> </th>
              <th> </th>
              <th> </th>
              <th></th>
              <th> </th>
              <th></th>
              <th></th>
              <th></th>
              <th> </th>
              <th></th>
              <th></th>
              <th> </th> <th></th>
              <th></th>
              <th> (Prot)</th>
              <th> (Glu)</th>
             
            </tr>
            </thead>
            <tbody>
            {formData?.antenatalVisits?.map((item, index) => (
              <tr key={index}>
              {editIndex === index ? (
                <>
                <td>
                  <div>{index}</div>
                  {/* <input
                  value={editEntry.visitNo}
                  onChange={(e) =>
                    setEditEntry({
                    ...editEntry,
                    visitNo: e.target.value,
                    })
                  }
                  /> */}
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editEntry.date}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, date: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.gestationalAgeWeeks}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            gestationalAgeWeeks: +e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.bp}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, bp: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.pr}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, pr: +e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.weightKg}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            weightKg: +e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.oedma}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, oedma: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.sfhCm}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, sfhCm: +e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="input-field"
                        value={editEntry.presentation}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            presentation: e.target.value,
                          })
                        }
                      >
                        <option value="">--Select--</option>
                        <option value={"Cephalic"}>Cephalic</option>
                        <option value={"Breech"}>Breech</option>
                        <option value={"Shoulder"}>Shoulder</option>
                        <option value={"Palpable"}>Palpable</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="input-field"
                        value={editEntry.lie}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, lie: e.target.value })
                        }
                      >
                        <option value="">--Select--</option>
                        <option value={"Longitudinal"}>Longitudinal</option>
                        <option value={"Transverse"}>Transverse</option>
                        <option value={"Oblique"}>Oblique</option>
                        <option value={"Palpable"}>Palpable</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="input-field"
                        value={editEntry.position}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            position: e.target.value,
                          })
                        }
                      >
                        <option value="">--Select--</option>
                        <option value={"Longitudinal"}>Longitudinal</option>
                        <option value={"Transverse"}>Transverse</option>
                        <option value={"Oblique"}>Oblique</option>
                        <option value={"Palpable"}>Palpable</option>
                      </select>
                    </td>
                    <td>
                      <input
                        value={editEntry.fetalHeartRate}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            fetalHeartRate: +e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.temperature}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            temperature: +e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.respirationRate}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            respirationRate: +e.target.value,
                          })
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={editEntry.ve}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, ve: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.tt}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, tt: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.pcv}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, pcv: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.urine?.prot}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            urine: {
                              ...editEntry.urine,
                              prot: e.target.value,
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.urine?.glu}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            urine: {
                              ...editEntry.urine,
                              glu: e.target.value,
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.remark}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, remark: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      {
                        <div>
                          <button
                            style={{
                              backgroundColor: "yellow",
                              color: "white",
                            }}
                            onClick={() => saveEdit(index)}
                          >
                            Save
                          </button>
                          <button
                            style={{ backgroundColor: "red", color: "white" }}
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      }
                    </td>
                  </>
                ) : (
                  <>
                    <td>{index + 1}</td>
                    <td>{moment(item.date).format("DD-MM-YYYY")}</td>
                    <td>{item.gestationalAgeWeeks}</td>
                    <td>{item.bp}</td>
                    <td>{item.pr}</td>
                    <td>{item.weightKg}</td>
                    <td>{item.oedma}</td>
                    <td>{item.sfhCm}</td>
                    <td>{item.presentation}</td>
                    <td>{item.lie}</td>
                    <td>{item.position}</td>
                    <td>{item.fetalHeartRate}</td>
                    <td>{item.temperature}</td>
                    <td>{item.respirationRate}</td>

                    <td>{item.ve}</td>
                    <td>{item.tt}</td>
                    <td>{item.pcv}</td>
                    <td>{item.urine?.prot}</td>
                    <td>{item.urine?.glu}</td>
                    <td>{item.remark}</td>
                    <td>
                      {item.status && (
                        <div>
                          <button
                            style={{
                              backgroundColor: "yellow",
                              color: "black",
                            }}
                            onClick={() => startEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            style={{ backgroundColor: "red", color: "white" }}
                            onClick={() => deleteAntenatalVisit(index)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {!item.status && (
                        <div>
                          <button
                            style={{
                              backgroundColor: "yellow",
                              color: "black",
                            }}
                            onClick={() => startEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            style={{ backgroundColor: "blue", color: "white" }}
                            onClick={() => {
                              closeModal();
                              setclinicalNotes(item?.clinicalNote);
                              setCurrentData(item);
                              console.log(item);
                            }}
                          >
                            {item?.clinicalNote
                              ? "View Clinical Note"
                              : "Add Clinical Notes"}
                          </button>
                        </div>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr>
              {/** input row */}
              <td>
                {/* <input
                  value={antenatalEntry.visitNo}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      visitNo: e.target.value,
                    })
                  }
                /> */}
              </td>
              <td>
                <input
                  type="date"
                  value={antenatalEntry.date}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      date: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.gestationalAgeWeeks}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      gestationalAgeWeeks: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  value={antenatalEntry.bp}
                  onChange={(e) =>
                    setAntenatalEntry({ ...antenatalEntry, bp: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.pr}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      pr: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.weightKg}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      weightKg: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  value={antenatalEntry.oedma}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      oedma: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.sfhCm}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      sfhCm: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <select
                  style={{ width: "100px" }}
                  className="input-field"
                  value={antenatalEntry.presentation}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      presentation: e.target.value,
                    })
                  }
                >
                  <option value="">--Select--</option>
                  <option value={"Cephalic"}>Cephalic</option>
                  <option value={"Breech"}>Breech</option>
                  <option value={"Shoulder"}>Shoulder</option>
                  <option value={"Palpable"}>Palpable</option>
                </select>
              </td>
              <td>
                <select
                  className="input-field"
                  value={antenatalEntry.lie}
                  style={{ width: "100px" }}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      lie: e.target.value,
                    })
                  }
                >
                  <option value="">--Select--</option>
                  <option value={"Longitudinal"}>Longitudinal</option>
                  <option value={"Transverse"}>Transverse</option>
                  <option value={"Oblique"}>Oblique</option>
                  <option value={"Palpable"}>Palpable</option>
                </select>
              </td>
              <td>
                <select
                  style={{ width: "100px" }}
                  className="input-field"
                  value={antenatalEntry.position}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      position: e.target.value,
                    })
                  }
                >
                  <option value="">--Select--</option>
                  <option value={"ROA"}>ROA</option>
                  <option value={"NOA"}>NOA</option>
                  <option value={"ND"}>ND</option>
                </select>
              </td>
              {/* <td>
                <input
                  value={antenatalEntry.presentation}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      presentation: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  style={{ width: "60px" }}
                  value={antenatalEntry.lie}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      lie: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  value={antenatalEntry.position}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      position: e.target.value,
                    })
                  }
                />
              </td> */}
              <td>
                <input
                  type="number"
                  value={antenatalEntry.fetalHeartRate}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      fetalHeartRate: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.temperature}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      temperature: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.respirationRate}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      respirationRate: +e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  style={{ width: "60px" }}
                  value={antenatalEntry.ve}
                  onChange={(e) =>
                    setAntenatalEntry({ ...antenatalEntry, ve: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  style={{ width: "60px" }}
                  value={antenatalEntry.tt}
                  onChange={(e) =>
                    setAntenatalEntry({ ...antenatalEntry, tt: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  value={antenatalEntry.pcv}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      pcv: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <div className="flex gap-1">
                  <input
                    value={antenatalEntry.urine?.prot}
                    onChange={(e) =>
                      setAntenatalEntry({
                        ...antenatalEntry,
                        urine: {
                          ...antenatalEntry.urine,
                          prot: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </td>
              <td>
                <div className="flex gap-1">
                  <input
                    value={antenatalEntry.urine?.glu}
                    onChange={(e) =>
                      setAntenatalEntry({
                        ...antenatalEntry,
                        urine: {
                          ...antenatalEntry.urine,
                          glu: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </td>
              <td>
                <input
                  value={antenatalEntry.remark}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      remark: e.target.value,
                    })
                  }
                />
              </td>
              {/** the rest of the input row cells follow same pattern as above */}
            </tr>
          </tbody>
        </table>
      </div>

      {open && (
        <div className="overlay">
          <RiCloseFill className="close-btn pointer" onClick={closeModal} />
          <div className="modal-box max-w-800">
            <div className="field-column">
              <label>CLinical Notes</label>
              {!currentData.clinicalNote ? (
                <div>
                  <GhostTextCompletion
                    // label="Patient Diagnosis"
                    name="clinicalNotes"
                    value={clinicalNotes || ""}
                    handleChange={handleChange}
                    none={true}
                  />
                  <button
                    className="btn"
                    type="button"
                    onClick={addClinicalNotes}
                  >
                    Add Clinical Note
                  </button>
                </div>
              ) : (
                <textarea value={currentData.clinicalNote} rows={4}></textarea>
              )}
            </div>
          </div>
        </div>
      )}

      <div class="flex-row-gap">
        <button className="btn" type="button" onClick={addAntenatalVisit}>
          Add Visit
        </button>
        {/* {id && (
          <button className="btn" type="button" onClick={handleSubmit}>
            Update Visit
          </button>
        )} */}
      </div>
    </div>
  );
};

export default AntenatalVisitTable;
