import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import { RiCalendar2Fill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import ReferralModal from "../modals/RefferalModal";
import Spinner from "../UI/Spinner";
import { usePatient } from "../../contexts";
import Pagination from "../layouts/Pagination";
import VitalPatientsTable from "../tables/VitalPatientTable";
import AdmitCheck from "./Patient/AdmitCheck";
import PatientsAppointTable from "../tables/PatientsAppointTable";
import BlackListTable from "../tables/BlackListTable";
import LabsTablePending from "../tables/awaitingLab";

function Patients() {
  const [allPatients, setAllPatients] = useState([]);
  const [vitalPatients, setVitalPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payload, setPayload] = useState('');
  const [filterSelected, setFilterSelected] = useState("firstName");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesVital, setTotalPagesVital] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [admittedPatients, setAdmittedPatients] = useState([])
  const [appointPatients, setAppointPatients] = useState([])
  const [labPatient, setLabPatient] = useState([])
  const [BlacklistPatient, setBlacklistPatient] = useState([])
  const [checkinPatients, setCheckinPatients] = useState(false)
  const [nurseTypes, setNurseTypes] = useState('admin');



  const itemsPerPage = 10;

  const { setHmoDetails, patientId, nurseRoles } = usePatient();

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const admitPatients = localStorage.getItem("admitPatients");
    const hmoPatients = localStorage.getItem("hmoPatients");
    const patients = localStorage.getItem("patients");

    console.log(admitPatients)

    if (admitPatients) {
      setNurseTypes("admit");
    } else if (hmoPatients) {
      setNurseTypes("hmo");
    } else if (patients) {
      setNurseTypes("admin");
    }
  }, []);

  console.log(nurseRoles)

  const generatePageNumbers = (currentPage, totalPages) => {
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectRecord = () => () => {
    setIsModalOpen(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  let navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const CustomInput = ({ value, onClick }) => (
    <button
      onClick={onClick}
      onKeyDown={(e) => e.preventDefault()}
      className="custom-datepicker-input flex gap-6 flex-v-center"
    >
      {isToday(selectedDate) ? "Today" : formatDate(selectedDate)}
      <RiCalendar2Fill />
    </button>
  );

  const getAllAdmittedPatients = async (currentPage) => {
    setLoading(true);
    try {
      let res = await get(`/patients/admitted-patients-service?pageNumber=${currentPage}&pageSize=10`);
      setAdmittedPatients(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientsAwaitingLab = async () => {
    setLoading(true);
    try {
      let res = await get(`/patients/labrequests-not-attended/${sessionStorage.getItem('clinicId')}`);
      setLabPatient(res);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=${itemsPerPage}`);
      setAllPatients(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBlacklistedPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/PatientBlackList/list/${currentPage}/${itemsPerPage}`);
      setBlacklistPatient(res?.resultList);
      setTotalPages(res?.totalPages);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/Appointment/get-pending-appointments?pageIndex=${currentPage}&pageSize=${itemsPerPage}`);
      setAppointPatients(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientsAwaitingVital = async (searchParam) => {
    setLoading(true);
    try {
      let url = '/patients/patient-awaiting-vital?'
      if (searchParam) {
        url += `pageIndex=${currentPage}&pageSize=${itemsPerPage}&AppointmentDate=${searchParam}`
      } else {
        url += `pageIndex=${currentPage}&pageSize=${itemsPerPage}`;
      }

      let res = await get(url);
      setVitalPatients(res?.data);
      setTotalPagesVital(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (searchParam) => {
    setLoading(true);
    try {
      let url = '/patients/filter?';
      if (filterSelected) {
        url += `${filterSelected}=${searchParam}&`;
      }
      url += `pageIndex=1&pageSize=100`;
      let res = await get(url);
      setAllPatients(res?.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "filter") {
      setFilterSelected(value);
    } else if (name === 'searchDate') {
      const formattedDate = formatDate(value);
      setSearchTerm(value)
    } else {
      setPayload(value);
    }
  };

  useEffect(() => {
    if (nurseTypes === ('admit')) {
      getAllAdmittedPatients(currentPage);
    } else if (nurseTypes === ('vital')) {
      getPatientsAwaitingVital(searchTerm);
    }
    else if (nurseTypes === ('blacklist') && checkinPatients === true) {
      getBlacklistedPatients(currentPage);
    } else if (nurseTypes === ('checkin') && checkinPatients === true) {
      getAppointmentPatients(currentPage);
    }
    else if (nurseTypes === ('checkin') && checkinPatients === 'notify') {
      getPatientsAwaitingLab()
    }
    else {
      getAllPatients(currentPage);
    }
  }, [currentPage, searchTerm, nurseTypes, checkinPatients]);

  useEffect(() => {
    if (payload) {
      searchPatients(payload);
    } else {
      getAllPatients();
    }
  }, [filterSelected, payload]);

  const filterOptions = [
    { value: "firstName", name: "First Name" },
    { value: "lastName", name: "Last Name" },
    { value: "email", name: "Email" },
    { value: "phoneNumber", name: "Phone Number" },
    { value: "patientRef", name: "Patient Id" },
  ];

  return (
    <div className="w-100 m-t-40">
      <>
        {
          nurseTypes !== 'vital' ? (
            <div className="flex flex-v-center space-between wrap  m-t-20">
              <h3 className="float-left">Patients Management</h3>
              <div className="flex flex-v-center gap-6">
                <div className="">
                  <TagInputs onChange={handleChange} name="firstName" label="Find Patient" />
                </div>
                <div className=" ">
                  <TagInputs
                    onChange={handleChange}
                    name="filter"
                    type="select"
                    options={filterOptions}
                  />
                </div>
                {nurseRoles?.includes('checkin') &&
                  <div className=" m-t-10 ">
                    <button onClick={() => { setIsModalOpen(true); navigate('/patient-details'); setHmoDetails(null) }} className="submit-btn flex gap-16 flex-h-center flex-v-center">
                      <>
                        <AiOutlinePlus size={24} color="white" />
                        <p className="m-l-10 m-r-10">Onboard a Patient</p>
                      </>
                    </button>
                  </div>
                }
              </div>
            </div>
          ) : (
            <div className="flex flex-v-center  space-between" >
              <h3 className="m-t-20 float-left col-4">Patients Awaiting Vital</h3>
              <div className="col-3  m-t-20 ">
                <TagInputs
                  label="Search By Date"
                  onChange={handleChange}
                  name="searchDate"
                  type="date"
                />
              </div>
              <>
                {
                  nurseRoles?.includes('checkin') && (
                    <button onClick={() => { setIsModalOpen(true); navigate('/patient-details'); setHmoDetails(null) }} className="submit-btn flex gap-16 flex-h-center col-3 m-t-30 flex-v-center">
                      <>
                        <AiOutlinePlus size={24} color="white" />
                        <p className="m-l-10 m-r-10">Onboard a Patient</p>
                      </>
                    </button>
                  )
                }
              </>
            </div>
          )
        }
      </>
      <div>
        <div className=" tabs m-t-20 bold-text">
          <>
            {nurseRoles?.includes('nurse') && (
              <>
                <div
                  className={`tab-item ${nurseTypes === "admin" ? "active" : ""}`}
                  onClick={() => { setNurseTypes("admin"); setCurrentPage(1) }}
                >
                  Patients
                </div>
                <div
                  className={`tab-item ${nurseTypes === "vital" ? "active" : ""}`}
                  onClick={() => { setNurseTypes("vital"); setCurrentPage(1) }}
                >
                  Patients Awaiting Vital
                </div>
                <div
                  className={`tab-item ${nurseTypes === "admit" ? "active" : ""}`}
                  onClick={() => { setNurseTypes("admit"); setCurrentPage(1) }}
                >
                  Patients For Admission
                </div>
                <div
                  className={`tab-item ${nurseTypes === "checkin" && checkinPatients === true ? "active" : ""}`}
                  onClick={() => { setNurseTypes("checkin"); setCurrentPage(1); setCheckinPatients(true) }}
                >
                  Patients For Appointment
                </div>
                <div
                  className={`tab-item ${nurseTypes === "blacklist" && checkinPatients === true ? "active" : ""}`}
                  onClick={() => { setNurseTypes("blacklist"); setCurrentPage(1); setCheckinPatients(true) }}
                >
                  Patients Blacklisted
                </div>
              </>
            )}
            {nurseRoles?.includes('vitalnurse') && (
              <>
                <div
                  className={`tab-item ${nurseTypes === "vital" ? "active" : ""}`}
                  onClick={() => { setNurseTypes("vital"); setCurrentPage(1) }}
                >
                  Patients Awaiting Vital
                </div>
              </>
            )}
            {nurseRoles?.includes('checkin') && (
              <>
                <div
                  className={`tab-item ${nurseTypes === "admin" ? "active" : ""}`}
                  onClick={() => { setNurseTypes("admin"); setCurrentPage(1) }}
                >
                  Patients
                </div>
                <div
                  className={`tab-item ${nurseTypes === "checkin" && checkinPatients === true ? "active" : ""}`}
                  onClick={() => { setNurseTypes("checkin"); setCurrentPage(1); setCheckinPatients(true) }}
                >
                  Patients For Appointment
                </div>
                {/* <div
                  className={`tab-item ${nurseTypes === "checkin" && checkinPatients === 'notify' ? "active" : ""}`}
                  onClick={() => { setNurseTypes("checkin"); setCurrentPage(1); setCheckinPatients('notify') }}
                >
                  Patients Awaiting Lab Reports
                </div> */}
              </>
            )}
          </>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {nurseTypes === "vital" ? (
              <>
                <VitalPatientsTable data={vitalPatients} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPagesVital}
                  handlePageChange={handlePageChange}
                  generatePageNumbers={generatePageNumbers}
                />
              </>
            ) : nurseTypes === "admit" ? (
              <AdmitCheck data={admittedPatients} setCurrent={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
            ) : nurseTypes === "hmo" ? (
              <div className="center-text m-t-40">
                <h3>No Patients with HMO</h3>
                <p>Coming Soon</p>
              </div>
            ) : nurseTypes === "checkin" && checkinPatients === true ? (
              <>
                <PatientsAppointTable data={appointPatients} currentPage={currentPage} itemsPerPage={itemsPerPage} fetchData={getAppointmentPatients} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  generatePageNumbers={generatePageNumbers}
                />
              </>
            )
              : nurseTypes === "checkin" && checkinPatients === 'notify' ? (
                <>
                  <LabsTablePending data={labPatient} currentPage={currentPage} itemsPerPage={itemsPerPage} fetchData={getPatientsAwaitingLab} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    generatePageNumbers={generatePageNumbers}
                  />
                </>
              )
                : nurseTypes === "blacklist" ? (
                  <>
                    <BlackListTable data={BlacklistPatient} currentPage={currentPage} itemsPerPage={itemsPerPage} fetchData={getAppointmentPatients} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                      generatePageNumbers={generatePageNumbers}
                    />
                  </>
                ) : (
                  <>
                    <PatientsTable data={allPatients} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                      generatePageNumbers={generatePageNumbers}
                    />
                  </>
                )}
          </>

        )}
      </div>
      {isModalOpen &&
        <ReferralModal
          closeModal={closeModal}
        />
      }
    </div>
  );
}

export default Patients;
