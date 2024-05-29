import React, { useEffect, useState } from "react";
import FacilityCard from "../UI/FacilityCard";
import StatCard from "../UI/StatCard";
import { RiAccountCircleFill, RiGroup2Fill, RiHotelBedFill } from "react-icons/ri";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import axios from "axios";

function Facility() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("beds");
  const [admittedpatients, setAdmittedPatients] = useState(0)
  const [beds, setBeds] = useState([])
  const [availableBed, setAvailableBed] = useState(0)
  const [occupiedBeds, setOccupiedBeds] = useState(0);
  const [wards, setWards] = useState([])
  const [bedList, setBedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false)


  const getAdmittedPatients = async () => {
    try {
      let res = await get("/dashboard/doctor/admittedpatients")
      console.log(res)
      setAdmittedPatients(res)

    } catch (error) {
      console.error('Error fetching in and out patients:', error);

    }

  }

  const getAvailableBed = async () => {
    try {
      let res = await get("/facilities/Available-Beds-Count");
      console.log(res);
      setAvailableBed(res);
    } catch (error) {
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getOccupiedBed = async () => {
    try {
      let res = await get("/facilities/Occupied-Beds-Count");
      console.log(res);
      setOccupiedBeds(res);
    } catch (error) {
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const getAssigneddBed = async () => {
    try {
      let res = await get("/facilities/beds/assignedtodoctor");
      console.log(res);
      setBeds(res);
    } catch (error) {
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };




  const getBedList = async () => {
    const token = sessionStorage.getItem('token');

    // If token is not available, handle accordingly
    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    try {
      setLoading(true)
      let res = await axios.get(`https://edogoverp.com/clinicapi/api/bed/list/${currentPage}/10`, options);
      console.log(res);
      setBedList(res?.data?.resultList);
      setTotalPages(res?.data?.totalPages);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching in and out patients:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };



  useEffect(() => {
    getAdmittedPatients()
    getAvailableBed()
    getOccupiedBed()
    getAssigneddBed()
    getBedList()
  }, [])


  const wardOptions = [
    { name: "Select Ward", value: "" },
    { name: "Ward A", value: "Ward A" },
    { name: "Ward B", value: "Ward B" },
    { name: "Ward C", value: "Ward C" },
    { name: "Ward D", value: "Ward D" }
  ];

  console.log(wards)

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    getBedList()
  }, [currentPage])

  const renderTabContent = () => {
    switch (selectedTab) {
      case "beds":
        return (
          <div className="flex space-betwen">
            <div>
              <div className="m-t-20 m-b-20  bold-text">
                {wards} | {availableBed} Beds Available  | {occupiedBeds} Beds Occupied
              </div>
              {loading === false &&
                <div>
                  <div className="grid gap-16 m-t-20">
                    {Array.isArray(bedList) && bedList?.map((patient, index) => (
                      <FacilityCard wards={wards} availableBed={availableBed} occupiedBeds={occupiedBeds} key={index} fetchBedList={getBedList} data={patient} />
                    ))}


                  </div>
                  <div className="pagination flex space-between float-right col-5">
                    <div className="flex gap-8">
                      <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
                    </div>
                    <div className="flex gap-8">
                      {/* Previous button */}
                      <button
                        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {"Previous"}
                      </button>
                      {/* Page numbers */}
                      {Array.from({ length: totalPages > 3 ? 3 : totalPages }, (_, i) => (
                        <button
                          key={`page-${i + 1}`}
                          className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      {/* Ellipsis */}
                      {totalPages > 3 && <span>...</span>}
                      {/* Next button */}
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
              }
            </div>

            <div className="flex m-t-60 flex-direction-v">
              {" "}

              <div className="m-b-10 m-r-20">
                <StatCard data={{
                  number: admittedpatients,
                  title: "Admitted Patients",
                }} icon={<RiHotelBedFill className="icon" size={32} />}
                />
              </div>
              <div className="m-b-10 m-r-20">
                <StatCard data={{
                  number: availableBed,
                  title: "Available Beds",
                }} icon={<RiHotelBedFill className="icon" size={32} />}
                />
              </div>
              <div className="m-b-10 m-r-20">
                <StatCard data={{
                  number: occupiedBeds,
                  title: "Occupied Beds",
                }} icon={<RiHotelBedFill className="icon" size={32} />}
                />
              </div>


            </div>


          </div>
        );
      case "equipments":
        // Render equipment content here
        return <div>Equipment Content</div>;
      case "ambulance":
        // Render ambulance content here
        return <div>Ambulance Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="m-t-20 bold-text">Facility | Bed Management</div>

      <div className="tabs m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "beds" ? "active" : ""}`}
          onClick={() => setSelectedTab("beds")}
        >
          Beds
        </div>

        <div
          className={` ${selectedTab === "equipments" ? "active" : ""}`}
        // onClick={() => setSelectedTab("equipments")}
        >

        </div>

        {/* <div
          className={`tab-item ${selectedTab === "ambulance" ? "active" : ""}`}
          onClick={() => setSelectedTab("ambulance")}
        >
          Ambulance
        </div> */}
      </div>

      <div className="w-25 m-t-20 ">
        <TagInputs label="Select Ward" onChange={(value) => { setWards(value?.target?.value) }} options={wardOptions} name="ward" type='select' />

      </div>



      {renderTabContent()}
    </div>
  );
}

export default Facility;
