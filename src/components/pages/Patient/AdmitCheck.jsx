import { useEffect, useState } from "react";
import { del, get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import AppointmentModal from "../../modals/AppointmentModal";
import Discharge from "../../modals/Discharge";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import notification from "../../../utility/notification";
import DeleteConfirmationModal from "../../modals/DeleteConfirmation";
import { AiOutlinePlus } from "react-icons/ai";
import ReferralModal from "../../modals/RefferalModal";
import axios from "axios";
import AddBed from "../../modals/AddBed";
import { useNavigate } from "react-router-dom";

function AdmitCheck({ data, setCurrent, totalPages, currentPage }) {
  const { patientId, setPatientId, setPatientInfo, setPatientName, setDiagnosis, setHmoDetails, setAppointmentId } = usePatient();

  const [viewing, setViewing] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState([]);
  const [bedList, setBedsList] = useState([]);
  const navigate = useNavigate()


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrent(newPage);
      setCurrent(newPage);
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;

  };

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=${1}&pageSize=${1000}`);
      setPatient(res?.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignedBeds = async () => {
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
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/assign-bed/list/${1}/1000`, options);
      setBeds(res?.data?.resultList || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const findPatientName = (id) => {
    if (!Array.isArray(patient)) {
      console.error("Error: 'patient' is not an array", patient);
      return "";
    }
    const patientRecord = patient?.find((p) => p?.patientId === id);

    return patientRecord ? `${patientRecord?.firstName} ${patientRecord?.lastName}` : "";
  };

  const isPatientOccupyingBed = (patientId) => {
    const bed = beds?.find((b) => b?.patient?.id === patientId);
    return bed ? bed?.bed?.name : 'Assign patient a bed';
  };



  useEffect(() => {
    getAllPatients();
    getAssignedBeds()
  }, []);

  useEffect(() => {
    setCombinedData(data);
  }, [data]);


  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false)
  };

  const selectRecord = (record) =>  {
    console.log('Selected record:', record.appointmentId);
    setPatientId(record?.patientId);
    setAppointmentId(record?.appointmentId);
    const patientRecord = patient?.find((p) => p?.patientId === record?.patientId);

    if (patientRecord) {
      const hmoDetails = {
        hmoId: patientRecord?.hmoId,
        hmoPackageId: patientRecord?.hmoPackageId
      };
      setHmoDetails(hmoDetails);
      const patientName = `${patientRecord?.firstName} ${patientRecord?.lastName}`;
      setPatientName(patientName);
    }
    setDiagnosis(record?.diagnosis);
    setViewing(record);
    navigate('/facility');
  };

  const selectRecord2 = (record) => {
    console.log('Selected record:', record.appointmentId);
    setPatientId(record?.patientId);
    setAppointmentId(record?.appointmentId);
    const patientRecord = patient?.find((p) => p?.patientId === record?.patientId);

    if (patientRecord) {
      const hmoDetails = {
        hmoId: patientRecord?.hmoId,
        hmoPackageId: patientRecord?.hmoPackageId
      };
      setHmoDetails(hmoDetails);
      const patientName = `${patientRecord?.firstName} ${patientRecord?.lastName}`;
      setPatientName(patientName);
    }
    setDiagnosis(record?.diagnosis);
    localStorage.setItem('admit', true);
    navigate('/patient-details');
  };


  const handleEdit = (recordId) => {
    setViewing(recordId);
    setAdd(true);
  }

  const getBedList = async () => {
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
      setLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/list/${1}/10`, options);
      if (res.status === 200) {
        setBedsList(res?.data?.resultList || []);
      } else if (res.status === 500) {
        notification({ message: 'Server Error', type: "error" });
        setBedsList([]);
      } else {
        setBedsList([]);
      }
    } catch (error) {
      setBedsList([]);
      console.error('Error fetching bed list:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Time</th>
              <th className="center-text">Age</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Patient</th>
              <th className="center-text">Bed Occupying</th>
              <th className="center-text">Action</th>


            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {combinedData?.map((row) => {
              const patientName = findPatientName(row.patientId);
              const bed = isPatientOccupyingBed(row.patientId);
              return (
                <tr className="hovers pointer" onClick={() => selectRecord2(row)} key={row?.id}>
                  <td>{new Date(row?.dateOfVisit).toLocaleDateString()}</td>
                  <td>
                    {new Date(row?.createdAt?.split('.')[0]).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true, // 12-hour format
                    })}
                  </td>
                  <td>{row?.age} years</td>
                  <td>
                    {row?.diagnosis}
                  </td>
                  <td>{patientName ? patientName : ''}</td>
                  <td>{bed ? bed : ''}</td>
                  <td>
                    <RiEdit2Fill
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        selectRecord(row); // Trigger edit icon click handler
                      }}
                      style={{ color: 'green', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
      <div>
        <div className="pagination flex space-between  col-4 m-t-20">
          <div className="flex gap-8">
            <div className="bold-text">Page</div> <div className=" m-r-20">{currentPage}/{totalPages}</div>
          </div>
          <div className="flex gap-8">
            <button
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"Previous"}
            </button>

            {generatePageNumbers().map((page, index) => (
              <button
                key={`page-${index}`}
                className={`pagination-btn ${currentPage === page ? 'bg-green text-white' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {"Next"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen &&
        <div>
          <AddBed
            closeModal={closeModal}
            bedId={data?.id}
            fetchBedList={getBedList}
          />
        </div>
      }
    </div>
  );
}
export default AdmitCheck;
