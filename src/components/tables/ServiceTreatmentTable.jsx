import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import "./FamilyMedicineTable.css";
import { RiCloseFill } from "react-icons/ri";
import { get } from "../utility/fetch";
import { usePatient } from "../contexts";

const ServiceTreatmentTable = ({ }) => {
    const navigate = useNavigate();
    const { patientId, setPatientId, setPatientInfo, setPatientName, setDiagnosis, setHmoDetails, setAppointmentId } = usePatient();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchRecords(page);
    }, []);

    const fetchRecords = async (currentPage,) => {
        setLoading(true);
        try {
            const response = await get(`/Antenatal/list/${currentPage}/10`);
            if (response?.isSuccess) {
                setRecords(response.data.recordList);
                setTotalPages(response.data.metadata.totalPages || 1);
            }
        } catch (error) {
            console.error("Failed to fetch records:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectRecord = (record) => {
        console.log('record', record)
        setPatientInfo(record);
        setAppointmentId(record?.appointmentId);
        setPatientId(record?.patient?.id);
        setPatientName(`${record?.patient?.firstName} ${record?.patient?.lastName}`);
        setDiagnosis(record?.diagnosis);
        navigate('/antenatal-record');
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="">
            <div className="modal-box max-w-600">
                <div className="family-table-container">
                    <div className="header-section">
                        <h3>Antenatal</h3>
                    </div>

                    <div className="table-section">
                        <h4>Consultation Log</h4>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <table className="family-table">
                                    <thead>
                                        <tr>
                                            <th>Patient Name</th>
                                            <th>Date</th>
                                            <th>Case Type</th>
                                            <th>Medical Record/History</th>
                                            <th>Doctor's Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.length > 0 ? (
                                            records?.map((record) => (
                                                <tr key={record.id}>
                                                    <td>
                                                        {record.patient?.firstName} {record.patient?.lastName}
                                                    </td>
                                                    <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                                                    <td>{record.deliveryType || "Antenatal Consultation"}</td>
                                                    <td>{record.pastMedicalHistory}</td>
                                                    <td>
                                                        Dr. {record.surgeon?.firstName}{" "}
                                                        {record.doctor?.lastName}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                               selectRecord(record)
                                                            }}
                                                            className="icon-btn"
                                                        >
                                                            <FiEdit3 size={16} color="#109615" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="pagination-controls">
                                    <button onClick={handlePrev} disabled={page === 1}>
                                        Previous
                                    </button>
                                    <span>
                                        Page {page} of {totalPages}
                                    </span>
                                    <button onClick={handleNext} disabled={page === totalPages}>
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceTreatmentTable;
