import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import { PatientData, stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import { RiCalendar2Fill } from "react-icons/ri";
import SearchInput from "../../Input/SearchInput";
import SelectInput from "../../Input/SelectInput";
import HeaderSearch from "../../Input/HeaderSearch";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import ReferralModal from "../modals/RefferalModal";
import Spinner from "../UI/Spinner";
import { usePatient } from "../../contexts";

function Patients() {
  const [allPatients, setAllPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payload, setPayload] = useState('');
  const [filterSelected, setFilterSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewing, setViewing] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { setPatientId, setPatientInfo, setHmoDetails } = usePatient();





  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  useEffect(() => {
    getAllPatients();
  }, [currentPage]);

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

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

  const getAllPatients = async () => {
    setLoading(true); // Set loading to true before fetch
    try {
      let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=30`);
      console.log(res);
      setAllPatients(res.data);
      setTotalPages(res.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  const searchPatients = async (searchParam) => {
    setLoading(true); // Set loading to true before search
    try {
      let url = '/patients/filter?';
      if (filterSelected) {
        url += `${filterSelected}=${searchParam}&`;
      }
      url += `pageIndex=1&pageSize=100`;
      let res = await get(url);
      console.log(res);
      setAllPatients(res.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false); // Set loading to false after search
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "filter") {
      setFilterSelected(value);
    } else {
      setPayload(value);
    }
  };

  useEffect(() => {
    if (filterSelected && payload) {
      searchPatients(payload);
    } else {
      getAllPatients();
    }
  }, [filterSelected, payload]);

  const filterOptions = [
    { value: "", name: "Select Filter" },
    { value: "firstName", name: "First Name" },
    { value: "lastName", name: "Last Name" },
    { value: "email", name: "Email" },
    { value: "phoneNumber", name: "Phone Number" }
  ];

  return (
    <div className="w-100 m-t-40">
      <div className="flex flex-v-center flex-h-center space-between  m-t-20">
        <h3 className="float-left col-4">Patients Management</h3>
        <div className="flex flex-v-center flex-h-center ">
          <div className="col-4">
            <TagInputs onChange={handleChange} name="firstName" label="Find Patient" />
          </div>
          <div className="col-3 ">
            <TagInputs
              onChange={handleChange}
              name="filter"
              type="select"
              options={filterOptions}
            />
          </div>
          <div className="m-b-10 col-4">
            <button onClick={() => { setIsModalOpen(true); navigate('/patient-details'); setHmoDetails(null)  }} className="submit-btn">
              <div className="flex flex-h-center flex-v-center">
                <AiOutlinePlus size={24} color="white" />
                <p className="m-l-10 m-r-10">Onboard a Patient</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <PatientsTable data={allPatients} />

            <div className="pagination flex space-between float-right col-3 m-t-20">
              <div className="flex gap-8">
                <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
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
