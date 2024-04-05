/* eslint-disable react/destructuring-assignment */
import {useState} from 'react';
import DatePicker from 'react-datepicker';




const Search = (props) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    const handleStartDateChange = date => {
      setStartDate(date);
    };
    
    const handleEndDateChange = date => {
      setEndDate(date);
    };

    return(<div className="w-100 searchcard">
            <div className='innerSearch'></div>
            <div className='flex flex-v-center space-between col-12'>
              <input type="text" className="searchinput col-4" placeholder="search" title='search'/>
              <div className='flex flex-v-center col-2'>
              <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  placeholderText='Start date'
                  className="dateinput"
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={200}
                  isClearable
                />
              </div>
              <div className='flex flex-v-center col-2'>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  placeholderText='End date'
                  className="dateinput"
                  isClearable
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={200}
                />
              </div>
              <button className="search-button m-t-10 col-2">Search</button>
            </div>
      </div>)
};

export default Search;
