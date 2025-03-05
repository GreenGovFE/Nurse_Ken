import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import axios from "axios";
import Paginate from "../UI/paginate";
import notification from "../../utility/notification";
import { RiDeleteBin2Fill } from "react-icons/ri";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";

function EquipmentTableAssigned({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewing, setViewing] = useState({});
    const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();
    const [TablePages, setTablePages] = useState(1);
    const [TablePage, setTablePage] = useState(1);
    const [equipments, setEquipments] = useState([]);
    const [isModalOpenDel, setIsModalOpenDel] = useState(false);
    const closeModalDel = () => { setIsModalOpenDel(false); }
    const [recordToDelete, setRecordToDelete] = useState(null);



 const itemsPerPage = 10
    const handleDeleteConfirmation = (recordId) => {
        setRecordToDelete(recordId);
        setIsModalOpenDel(true);
    };
    const confirmDelete = () => {
        if (recordToDelete) {
            UnAssignEquipment(recordToDelete);
            setIsModalOpenDel(false);
        }
    };

    let navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getAssignedEquipment = async (page) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/assignequipmentpatient/list/${page}/10`, options);
            setEquipments(res?.data?.resultList || []);
            setTablePages(res?.data?.totalPages)
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    const UnAssignEquipment = async (id) => {

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.put(` ${process.env.REACT_APP_BASE_URL}/clinicapi/api/assignequipmentpatient/unassign-equipment-patient/${id}`, options);
            if (res?.statusCode === 409) {
                notification({ message: "Equipment Already Assigned", type: "error" });
                return;
            } else if (res) {
                notification({ message: "Equipment  Un-assigned Successfully", type: "success" });

                closeModal();
            }
        } catch (error) {
            console.error('Error assigning equipment:', error);
            notification({ message: "Failed to Un-assign equipment", type: "error" });
        }
    };

    useEffect(() => {
        getAssignedEquipment(TablePage);
    }, [TablePage]);

    const selectRecord = (record) => () => {
        setIsModalOpen(true);
        setViewing(record)


    };
    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40 m-b-20">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="center-text">S/N</th>
                            <th className="center-text">Patient's Name</th>
                            <th className="center-text">Equipment Assigned</th>
                            <th className="center-text">Assigned By</th>
                            <th className="center-text">Date Assigned</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {Array.isArray(equipments) && equipments?.map((row, index) => (
                            <tr key={row.id}>
                                <td>{index + 1 + (TablePage - 1) * itemsPerPage}</td>
                                <td>{row.patient.firstName} {row.patient.lastName}</td>
                                <td >{row.equipment.name}</td>
                                <td>{row.assignedBy.firstName} {row.assignedBy.lastName}</td>
                                <td>{new Date(row.assignDate).toLocaleDateString()}</td>
                                {/* <td>
                                    <RiDeleteBin2Fill size={20} onClick={() => handleDeleteConfirmation(row.id)} style={{ color: 'red', cursor: 'pointer' }} />
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Paginate
                setCurrentPage={setTablePage}
                totalPages={TablePages}
                currentPage={TablePage}
            />
            {isModalOpenDel === true && (
                <DeleteConfirmationModal
                    closeModal={closeModalDel}
                    equipment={'equipment'}
                    confirmDelete={confirmDelete}
                />
            )}
        </div>
    );
}

export default EquipmentTableAssigned;
