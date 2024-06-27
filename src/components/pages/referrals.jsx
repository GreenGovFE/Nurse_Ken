import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReferralTable from "../tables/referralTable";
import TagInputs from "../layouts/TagInputs";
import { get } from "../../utility/fetch";
import { RiCalendar2Fill } from "react-icons/ri";
import Spinner from "../UI/Spinner";

function ReferredPatients() {
  const [allPatients, setAllPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payload, setPayload] = useState('');
  const [filterSelected, setFilterSelected] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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


  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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

  const getAllReferralFilters = async () => {
    setLoading(true);
    try {
      let res = await get(`/Referrals/GetAllFilterBy`);
      let tempDoc = res?.map((doc, idx) => ({
        name: doc?.value, value: parseFloat(doc?.index)
      }));

      tempDoc?.unshift({ name: "Select Filter", value: "" });
      setFilterOptions(tempDoc);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllReferralNotes = async () => {
    setLoading(true);
    try {
      let res = await get(`/Referrals/GetAll-Referral-notes/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=30`);
      setAllPatients(res.data);
      setTotalPages(res.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (searchParam) => {
    setLoading(true);
    try {
      let url = `/Referrals/GetAll-Referral-notes/${sessionStorage?.getItem("clinicId")}?pageIndex=${currentPage}&pageSize=30&search=${searchParam}&FilterBy=${filterSelected}`;
      let res = await get(url);
      setAllPatients(res.data);
      setTotalPages(res.pageCount);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
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
  }, [currentPage]);

  useEffect(() => {
    if (filterSelected && payload) {
      searchPatients(payload);
    } else {
      getAllReferralNotes();
    }
  }, [filterSelected, payload]);

  return (
    <div className="w-100 m-t-40">
      <div className="flex flex-v-center flex-h-center space-between m-t-20">
        <h3 className="float-left col-4">Referred Patients</h3>
        <div className="flex flex-v-center flex-h-center">
          <div className="col-10">
            <TagInputs onChange={handleChange} name="firstName" label="Find Patient" />
          </div>
          <div className="col-6">
            <TagInputs
              onChange={handleChange}
              name="filter"
              type="select"
              options={filterOptions}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <ReferralTable data={allPatients} fetch={getAllReferralNotes} />
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
        </div>
      )}
    </div>
  );
}

export default ReferredPatients;
