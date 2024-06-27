
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import axios from "axios";
import Paginate from "../UI/paginate";
import notification from "../../utility/notification";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";
import { RiDeleteBin2Fill } from "react-icons/ri";

function AmbulanceTableAssigned({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewing, setViewing] = useState({});
    const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();
    const [TablePages, setTablePages] = useState(1);
    const [TablePage, setTablePage] = useState(1);
    const [ambulances, setAmbulances] = useState([]);
    const [isModalOpenDel, setIsModalOpenDel] = useState(false);
    const closeModalDel = () => { setIsModalOpenDel(false); }
    const [recordToDelete, setRecordToDelete] = useState(null);




    const handleDeleteConfirmation = (recordId) => {
        setRecordToDelete(recordId);
        setIsModalOpenDel(true);
    };
    const confirmDelete = () => {
        if (recordToDelete) {
            UnAssignAmbulance(recordToDelete);
            setIsModalOpenDel(false);
        }
    };


    const UnAssignAmbulance = async (id) => {

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
            let res = await axios.put(` https://edogoverp.com/clinicapi/api/assignambulance/unassign-ambulance/${id}`, options);
            console.log(res);
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


    let navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getAmbulance = async (page) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'GET', // Change method to GET for axios.get
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            let res = await axios.get(`https://edogoverp.com/clinicapi/api/assignambulance/list/${page}/10`, options);
            console.log(res);
            setAmbulances(res?.data?.resultList || []); // Adjusted to access data property
        } catch (error) {
            console.error('Error fetching ambulances:', error);
        }
    };

    useEffect(() => {
        getAmbulance(TablePage);
    }, [TablePage]);

   
    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40 m-b-20">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="center-text">S/N</th>
                            <th className="center-text">Assigned To</th>
                            <th className="center-text">Driver</th>
                            <th className="center-text">Destination</th>
                            <th className="center-text">Date Assigned</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {Array.isArray(ambulances) && ambulances?.map((row, index) => (
                            <tr className="" key={row.id}>
                                <td>{index + 1}</td>
                                <td>{row.patient.firstName} {row.patient.lastName}</td>
                                <td >{row.driver.firstName} {row.driver.lastName}</td>
                                <td>{row.destination}</td>
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
                    equipment={'ambulance'}
                    confirmDelete={confirmDelete}
                />
            )}
        </div>
    );
}

export default AmbulanceTableAssigned;
