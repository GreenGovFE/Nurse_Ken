import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../contexts";
import axios from "axios";
import Paginate from "../UI/paginate";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import EquipmentModal from "../modals/EquipmentModal";
import notification from "../../utility/notification";

function EquipmentTable({ data, }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewing, setViewing] = useState({});
    const { setPatientId, setPatientName, setPatientPage, setHmoId } = usePatient();
    const [TablePages, setTablePages] = useState(1);
    const [TablePage, setTablePage] = useState(1);
    const [equipments, setEquipments] = useState([]);
    const [image, setImage] = useState(null);

    let navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const itemsPerPage = 10

    const getEquipment = async (page) => {
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
            let res = await axios.get(`https://edogoverp.com/clinicapi/api/equipment/list/${page}/10`, options);
            setEquipments(res?.data?.resultList || []);
            setTablePages(res?.data?.totalPages); // Adjusted to access data
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    const continueUpdate = (data) => {
        setViewing(data)
        setIsModalOpen(true);
    };


    useEffect(() => {
        getEquipment(TablePage);
    }, [TablePage]);

    const handleMouseEnter = (record) => {
        setImage(record);
    };

    const handleMouseLeave = () => {
        setImage(null);
    };

    return (
        <div className="w-100 ">
            <div className="flex ">
                <div className="col-8 none-flex-item m-t-40 m-b-40">
                    <table className="bordered-table m-b-20">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">S/N</th>
                                <th className="center-text">Name</th>
                                <th className="center-text">Qty</th>
                                <th className="center-text">Available</th>
                                <th className="center-text">Date Created</th>
                                {/* <th className="center-text"></th> */}
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">
                            {Array.isArray(equipments) && equipments?.map((row, index) => (
                                <tr
                                    className=" hovers" key={row.id}
                                    onMouseEnter={() => handleMouseEnter(row)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <td>{index + 1 + (TablePage - 1) * itemsPerPage}</td>
                                    <td style={{maxWidth: '160px'}}>{row.name}</td>
                                    <td >{row.quantity}</td>
                                    <td>{row.quantity}</td>
                                    <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                                    {/* <td style={{display: 'flex',  justifyContent: 'space-around'}} >
                                        <RiEdit2Fill size={20} onClick={() => continueUpdate(row)} style={{ color: '#3C7E2D', cursor: 'pointer'}} />
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Paginate
                        setCurrentPage={setTablePage}
                        totalPages={TablePages}
                        currentPage={TablePage}
                    />
                </div>
                {image?.image &&
                    <div className="card-Image m-t-40 m-l-40">
                        {image && <img src={image?.image} style={{ width: '198px', height: '198px' }} alt="ambulance" />}
                        <span style={{ maxWidth: '240px', marginTop: '20px' }}>{image?.details}</span>
                    </div>
                }
            </div>
            {isModalOpen && (
                <EquipmentModal
                    closeModal={closeModal}
                    data={viewing}
                />
            )}
        </div>
    );
}

export default EquipmentTable;
