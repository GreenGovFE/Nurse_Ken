import React, { useState } from "react";
import './labrequestTable.css'
import { get } from "../utility/fetch";

const LabRequestTable = ({ data, isFamily=true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openRow, setOpenRow] = useState(null); // Tracks which row is expanded
  const [reportMap, setReportMap] = useState({}); // Store fetched reports by labRequestId

  const fetchLabData = async (
    patientId,
    labRequestId,
    isFamilyMedicine = true
  ) => {
    if (openRow === labRequestId) {
      setOpenRow(null); // Collapse if already open
      return;
    }

    setIsLoading(true);
    try {
      const url = `/patients/${patientId}/labrequest/${labRequestId}/is-family-medicine/${isFamily}/internal_report`;
      const response = await get(url);
      setReportMap((prev) => ({ ...prev, [labRequestId]: response }));
      setOpenRow(labRequestId);
    } catch (e) {
      console.error("Error fetching lab report:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <p className="mb-2 text-sm text-blue-600">Loading report...</p>
      )}

      <table className="min-w-full readonly-table border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Diagnosis</th>
            <th className="border p-2">Lab Centre</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((request) =>
            request?.testRequests?.map((test) => {
              const isOpen = openRow === request.id;
              const report = reportMap[request.id];

              return (
                <React.Fragment key={test.id}>
                  <tr>
                    <td className="border p-2">{request.patientFullName}</td>
                    <td className="border p-2">{request.diagnosis}</td>
                    <td className="border p-2">{test.labCentre}</td>
                    <td className="border p-2">{request.additionalNote}</td>
                    <td className="border p-2">{request.status}</td>
                    <td className="border p-2">
                     {request.status=='Attended'&& <button
                        className="btn"
                        onClick={() =>
                          fetchLabData(request.patientId, request.id)
                        }
                      >
                        {isOpen ? "Hide results" : "View results"}
                      </button>}
                    </td>
                  </tr>

                  {isOpen && report && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ backgroundColor: "#f9fafb", padding: "px" }}
                      >
                        <div className="report-card">
                          <div className="field-column">
                            <label className="report-label">Subject</label>
                            <p className="report-text">{report.subject}</p>
                          </div>

                          <div className="field-column">
                            <label className="report-label">Lab Findings</label>
                            <p className="report-text">{report.labFindings}</p>
                          </div>

                          <div className="field-column">
                            <label className="report-label">
                              Lab Documents
                            </label>
                            {report.patientLabDocuments?.length > 0 ? (
                              <div className="report-docs">
                                {report.patientLabDocuments.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={`https://edogoverp.com/labapi/api/document/view-document/${doc.docName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {doc.docName}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="report-text">
                                No documents available.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabRequestTable;
