import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import axios from "axios";
import Paginate from "../UI/paginate";
import notification from "../../utility/notification";
import { RiDeleteBin2Fill } from "react-icons/ri";
import DeleteConfirmationModal from "../modals/DeleteConfirmation";

function AssignedBed({ data, fetchBedList, }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewing, setViewing] = useState({});
    const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();
    const [bedsTablePages, setBedTablePages] = useState(1);
    const [bedsTablePage, setBedTablePage] = useState(1);
    const [beds, setBeds] = useState([]);
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
            UnAssigneBed(recordToDelete);
            setIsModalOpenDel(false);
        }
    };



    const UnAssigneBed = async (bedId) => {

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found in session storage');
            return;
        }

        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const url = `https://edogoverp.com/clinicapi/api/bed/unassign-bed/${bedId}`;

        try {
            let res = await axios.put(url, null, options);
            notification({ message: 'Unassigned Successfully', type: 'success' });
            fetchBedList();
            closeModal();
        } catch (error) {
            notification({ message: error?.response?.data?.errorData[0] || error?.message, type: 'error' });
            console.error('Error unassigning bed:', error);
        }
    };


    let navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getAssignedBeds = async (page) => {
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
            let res = await axios.get(`https://edogoverp.com/clinicapi/api/bed/assign-bed/list/${page}/10`, options);
            console.log(res);
            setBeds(res?.data?.resultList || []);
            setBedTablePages(res?.data?.totalPages)
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    useEffect(() => {
        getAssignedBeds(bedsTablePage);
    }, [bedsTablePage]);

    const selectRecord = (record) => () => {
        setIsModalOpen(true);
        setPatientId(record.patientId);
        setPatientName(`${record.firstName} ${record.lastName}`);
        setHmoId(record.paymentBreakdowns[0]?.hmoId);


    };
    return (
        <div className="w-100 ">
            <h3>Bed Usage Log</h3>
            <div className="w-100 none-flex-item m-t-40 m-b-20">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="center-text">S/N</th>
                            <th className="center-text">Patient's Name</th>
                            <th className="center-text">Bed</th>
                            <th className="center-text">Room</th>
                            <th className="center-text">Assigned By</th>
                            <th className="center-text">Date Assigned</th>
                            <th>Unassign</th>
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {Array.isArray(beds) && beds?.map((row, index) => (
                            <tr className=""  key={row?.id}>
                                <td>{index + 1 + (bedsTablePage - 1) * itemsPerPage}</td>
                                <td>{row?.patient.firstName} {row?.patient.lastName}</td>
                                <td >{row?.bed.name}</td>
                                <td>{row?.bed?.room?.name}</td>
                                <td>{row?.assignedBy.firstName} {row?.assignedBy.lastName}</td>
                                <td>{new Date(row?.bedAssignDate).toLocaleDateString()}</td>
                                <td>
                                    <RiDeleteBin2Fill size={20} onClick={() => handleDeleteConfirmation(row?.id)} style={{ color: 'red', cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Paginate
                setCurrentPage={setBedTablePage}
                totalPages={bedsTablePages}
                currentPage={bedsTablePage}
            />
            {isModalOpenDel === true && (
                <DeleteConfirmationModal
                    closeModal={closeModalDel}
                    equipment={'bed'}
                    confirmDelete={confirmDelete}
                />
            )}
        </div>
    );
}

export default AssignedBed;
