import React, { useEffect, useState } from "react";
import "./AntenatalTable.css";
import toast from "react-hot-toast";
import { put } from "../utility/fetch";

const AntenatalVisitTable = ({
  id,
  patientId,
  appointmentId,
  visits,
  catchAddedVisits,
  fetchRecord,
}) => {
  const [formData, setFormData] = useState({
    antenatalVisits: [...visits],
  });

  useEffect(() => {
    setFormData({
      antenatalVisits: [...visits],
    });
  }, [visits]);

  const handleSubmit = async () => {
    // e.preventDefault();

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
          ?.festalHeartRate,
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
    date: "",
    gestationalAgeWeeks: "",
    bp: "",
    pr: "",
    weightKg: "",
    oedma: "",
    sfhCm: "",
    presentation: "",
    lie: "",
    position: "",
    festalHeartRate: "",
    ve: "",
    tt: "",
    pcv: "",
    urine: { prot: "", glu: "" },
    remark: "",
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
      gestationalAgeWeeks: "",
      bp: "",
      pr: "",
      weightKg: "",
      oedma: "",
      sfhCm: "",
      presentation: "",
      lie: "",
      position: "",
      festalHeartRate: "",
      ve: "",
      tt: "",
      pcv: "",
      urine: { prot: "", glu: "" },
      remark: "",
    });
  };

  const deleteAntenatalVisit = (index) => {
    const newVisits = [...formData.antenatalVisits];
    newVisits.splice(index, 1);
    setFormData({ antenatalVisits: newVisits });
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
              <th>GA (Weeks)</th>
              <th>BP (mmHg)</th>
              <th>PR (Bpm)</th>
              <th>Weight (kg)</th>
              <th>Oedema</th>
              <th>SFHCM (cm)</th>
              <th>Presentation</th>
              <th>Lie</th>
              <th>Position</th>
              <th>Foetal Heart Rate (Bpm)</th>
              <th>VE</th>
              <th>TT</th>
              <th>PCV (%)</th>
              <th>Urine (Prot/Glu)</th>
              <th>Remarks</th>
              <th>Actions</th>
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
                            gestationalAgeWeeks: e.target.value,
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
                          setEditEntry({ ...editEntry, pr: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.weightKg}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            weightKg: e.target.value,
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
                          setEditEntry({ ...editEntry, sfhCm: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.presentation}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            presentation: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.lie}
                        onChange={(e) =>
                          setEditEntry({ ...editEntry, lie: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.position}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            position: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editEntry.festalHeartRate}
                        onChange={(e) =>
                          setEditEntry({
                            ...editEntry,
                            festalHeartRate: e.target.value,
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
                      <div className="flex gap-1">
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
                      </div>
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
                          <button onClick={() => saveEdit(index)}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </div>
                      }
                    </td>
                  </>
                ) : (
                  <>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.gestationalAgeWeeks}</td>
                    <td>{item.bp}</td>
                    <td>{item.pr}</td>
                    <td>{item.weightKg}</td>
                    <td>{item.oedma}</td>
                    <td>{item.sfhCm}</td>
                    <td>{item.presentation}</td>
                    <td>{item.lie}</td>
                    <td>{item.position}</td>
                    <td>{item.festalHeartRate}</td>
                    <td>{item.ve}</td>
                    <td>{item.tt}</td>
                    <td>{item.pcv}</td>
                    <td>
                      <div className="flex gap-1">
                        {item.urine?.prot} / {item.urine?.glu}
                      </div>
                    </td>
                    <td>{item.remark}</td>
                    <td>
                      {index < formData.antenatalVisits.length && (
                        <div>
                          <button onClick={() => startEdit(index)}>Edit</button>
                          <button onClick={() => deleteAntenatalVisit(index)}>
                            Delete
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
              </td>
              <td>
                <input
                  type="number"
                  value={antenatalEntry.festalHeartRate}
                  onChange={(e) =>
                    setAntenatalEntry({
                      ...antenatalEntry,
                      festalHeartRate: +e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  value={antenatalEntry.ve}
                  onChange={(e) =>
                    setAntenatalEntry({ ...antenatalEntry, ve: e.target.value })
                  }
                />
              </td>
              <td>
                <input
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

      <div class="flex-row-gap">
        <button className="btn" type="button" onClick={addAntenatalVisit}>
          Add Visit
        </button>
       {id && <button className="btn" type="button" onClick={handleSubmit}>
          Update Visit
        </button>}
      </div>
    </div>
  );
};

export default AntenatalVisitTable;
