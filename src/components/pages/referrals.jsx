import "react-datepicker/dist/react-datepicker.css";
import { PatientData, stats } from "./mockdata/PatientData";
import ReferralTable from "../tables/referralTable";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import StatCard from "../UI/StatCard";
import { RiCalendar2Fill } from "react-icons/ri";
import SearchInput from "../../Input/SearchInput";
import SelectInput from "../../Input/SelectInput";
import HeaderSearch from "../../Input/HeaderSearch";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";

function RefferedPatients() {

  const [allPatients, setAllPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payload, setPayload] = useState('');
  const [filterSelected, setFilterSelected] = useState("");
  const [filterOption, setFilterOptions] = useState("");



  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  let navigate = useNavigate()
  // Function to format the date as "dd-MM-yyyy"
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Function to check if the selected date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Custom input for the date picker
  const CustomInput = ({ value, onClick }) => (
    <button
      onClick={onClick}
      onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date field
      className="custom-datepicker-input flex gap-6 flex-v-center"
    >
      {isToday(selectedDate) ? "Today" : formatDate(selectedDate)}
      <RiCalendar2Fill />
    </button>
  );

  const getAllReferralFilters = async () => {
    try {
      let res = await get(`/Referrals/GetAllFilterBy`);
      console.log(res);
      let tempDoc = res?.map((doc, idx) => {
        return {
          name: doc?.value, value: parseFloat(doc?.index)
        };
      });
  
      tempDoc?.unshift({
        name: "Select Filter", value: ""
      });
  
      setFilterOptions(tempDoc);
    } catch (error) {
      console.error('Error fetching all patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  const getAllReferralNotes = async () => {
    try {
      let res = await get(`/Referrals/GetAll-Referral-notes/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=30`);
      console.log(res);
      setAllPatients(res.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const searchPatients = async (searchParam) => {
    try {
      let url = `/Referrals/GetAll-Referral-notes/${sessionStorage?.getItem("clinicId")}?pageIndex=1&pageSize=30&search=${searchParam}&FilterBy=${filterSelected}`;     
      let res = await get(url);
      console.log(res);
      setAllPatients(res.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
      // Handle the error here, such as displaying an error message to the user
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
    getAllReferralFilters();
    getAllReferralNotes();
  }, []);

  useEffect(() => {
    if (filterSelected && payload) {
      searchPatients(payload);
    } else {
      getAllReferralNotes();
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
    <div className="w-100 m-t-80">
      <div className="flex flex-v-center flex-h-center space-between  m-t-20">
        <h3 className="float-left col-4">Refered Patients</h3>
        <div className="flex flex-v-center flex-h-center">
          <div className="col-10">
            <TagInputs onChange={handleChange} name="firstName" label="Find Patient" />
          </div>
          <div className="col-4 ">
            <TagInputs
              onChange={handleChange}
              name="filter"
              // label="Filter"
              type="select"
              options={filterOption}
            />
          </div>
          {/* <div className="m-b-10 col-4"><button onClick={() => { navigate("/patient-details"); sessionStorage.setItem("personalInfo", JSON.stringify({})); sessionStorage.setItem("patientId", '') }} className="submit-btn"><div className="flex flex-h-center flex-v-center"><AiOutlinePlus size={24} color="white" /> <p className="m-l-10 m-r-10">Onboard a Patient</p></div></button>
          </div> */}
        </div>
      </div>
      <div >
        <ReferralTable data={allPatients} />
      </div>
    </div>
  );
}

export default RefferedPatients;
