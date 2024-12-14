import React, { useEffect, useState } from "react";
import axios from "axios";
import Paginate from "../UI/paginate";
import { RiEdit2Fill } from "react-icons/ri";
import AmbulanceModal from "../modals/AmbulanceModal";

function AmbulanceTable({ data }) {
    const [TablePages, setTablePages] = useState(1);
    const [TablePage, setTablePage] = useState(1);
    const [ambulances, setAmbulances] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewing, setViewing] = useState({});
    const [image, setImage] = useState(null);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const itemsPerPage = 10
    const getAmbulance = async (page) => {
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
            let res = await axios.get(`https://edogoverp.com/clinicapi/api/equipment/ambulance/list/${page}/10`, options);
            setAmbulances(res?.data?.resultList || []);
            setTablePages(res?.data?.totalPages) // Adjusted to access data property
        } catch (error) {
            console.error('Error fetching ambulances:', error);
        }
    };

    useEffect(() => {
        getAmbulance(TablePage);
    }, [TablePage]);

    const handleMouseEnter = (record) => {
        setImage(record);
    };

    const handleMouseLeave = () => {
        setImage(null);
    };

    const continueUpdate = (data) => {
        setViewing(data)
        setIsModalOpen(true);
    };

    return (
        <div className="w-100 ">
            <div className="flex">
                <div className="col-8 none-flex-item m-t-40 m-b-40">
                    <table className="bordered-table m-b-20">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">S/N</th>
                                <th className="center-text">Details</th>
                                <th className="center-text">Qty</th>
                                <th className="center-text">Date Created</th>
                                {/* <th></th> */}
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">
                            {Array.isArray(ambulances) && ambulances?.map((row, index) => (
                                <tr
                                    className=" hovers" key={row.id}
                                    onMouseEnter={() => handleMouseEnter(row)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <td>{index + 1 + (TablePage - 1) * itemsPerPage}</td>
                                    <td style={{ maxWidth: '100px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>{row.details}</td>
                                    <td >{row.quantity}</td>
                                    <td >{new Date(row.createdAt).toLocaleDateString()}</td>
                                    {/* <td>
                                        <RiEdit2Fill size={20} onClick={() => continueUpdate(row)} style={{ color: '#3C7E2D', cursor: 'pointer' }} />
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
                {
                    <div className="card-Image m-t-40 m-l-40">
                        {image && <img src={image?.image} style={{ width: '198px', height: '198px' }} alt="ambulance" />}
                        <span  style={{ maxWidth: '240px', marginTop: '20px' }}>{image?.details}</span>
                    </div>
                }
            </div>
            {isModalOpen && (
                <AmbulanceModal
                    closeModal={closeModal}
                    data={viewing}
                />
            )}
        </div>
    );
}

export default AmbulanceTable;
