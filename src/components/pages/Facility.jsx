import React, { useEffect, useState } from "react";
import FacilityCard from "../UI/FacilityCard";
import StatCard from "../UI/StatCard";
import { RiHotelBedFill } from "react-icons/ri";
import { get } from "../../utility/fetch";
import TagInputs from "../layouts/TagInputs";
import axios from "axios";
import notification from "../../utility/notification";
import Spinner from "../UI/Spinner";
import AssignedBed from "../tables/AssignedBed";
import AmbulanceTableAssigned from "../tables/AmbulanceAssignedTable";
import EquipmentTableAssigned from "../tables/AssignedEquipmentTable";
import EquipmentTable from "../tables/EquipmentTable";
import AmbulanceTable from "../tables/AmbulanceTable";

function Facility() {
  const [selectedTab, setSelectedTab] = useState("beds");
  const [admittedpatients, setAdmittedPatients] = useState(0);
  const [availableBed, setAvailableBed] = useState(0);
  const [occupiedBeds, setOccupiedBeds] = useState(0);
  const [wards, setWards] = useState(""); // will hold the room label for display
  const [bedList, setBedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [totalBeds, setTotalBeds] = useState(availableBed);
  const [selectedTabInner, setSelectedTabInner] = useState("equipmentList");
  const [room, setRoom] = useState(""); // will hold the room id
  const [vacantBeds, setVacantBeds] = useState(0);
  const [unavailableBeds, setUnavailableBeds] = useState(0);
  const [useAvailableBed, setUseAvailableBed] = useState(true); // Flag to determine which count to display

  const itemsPerPage = 10;

  const getRooms = async () => {
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
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/room/list/1/100`, options);
      let roomList = res?.data?.resultList || [];
      roomList.unshift({ name: "Select Room", id: "" });
      const formattedRooms = roomList.map((item) => ({ value: item?.id, label: item.name }));
      setRooms(formattedRooms);

      // Automatically fetch bedList for the first room in the list
      if (formattedRooms.length > 1) {
        setWards(formattedRooms[1].label); // Set the first room's label
        getBedList(formattedRooms[1].value); // Fetch bedList for the first room
        setUseAvailableBed(false); // Switch to using bedList.length
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const getAdmittedPatients = async () => {
    try {
      let res = await get("/dashboard/doctor/admittedpatients");
      setAdmittedPatients(res);
    } catch (error) {
      console.error('Error fetching admitted patients:', error);
    }
  };

  const getAvailableBed = async () => {
    try {
      let res = await get("/facilities/Available-Beds-Count");
      setAvailableBed(res);
    } catch (error) {
      console.error('Error fetching available beds:', error);
    }
  };

  const getOccupiedBed = async () => {
    try {
      let res = await get("/facilities/Occupied-Beds-Count");
      setOccupiedBeds(res);
    } catch (error) {
      console.error('Error fetching occupied beds:', error);
    }
  };

  const getBedList = async (roomId = "") => {
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
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/list/${currentPage}/${itemsPerPage}/${roomId}`, options);
      if (res.status === 200) {
        const beds = res?.data?.resultList || [];
        setBedList(beds);
        setTotalPages(res?.data?.totalPages || 1);

        // Calculate bed counts based on status
        const vacantCount = beds.filter(bed => bed.status === "Vacant").length;
        const occupiedCount = beds.filter(bed => bed.status === "Occupied").length;
        const unavailableCount = beds.filter(bed => bed.status === "Unavailable").length;

        setVacantBeds(vacantCount);
        setOccupiedBeds(occupiedCount);
        setUnavailableBeds(unavailableCount);
      } else if (res.status === 500) {
        notification({ message: 'Server Error', type: "error" });
        setBedList([]);
      } else {
        setBedList([]);
      }
    } catch (error) {
      setBedList([]);
      console.error('Error fetching bed list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    getAdmittedPatients();
    getAvailableBed();
    getOccupiedBed();
    getRooms();
  }, []);

  // Reload bed list when currentPage or selected room changes
  useEffect(() => {
    if (!useAvailableBed) {
      getBedList(room);
    }
  }, [currentPage, room]);

  // React Select change handler
  const handleWardChange = (selectedOption) => {
    if (!selectedOption) return;
    setWards(selectedOption.label);
    setTotalBeds(null);
    setRoom(selectedOption.value); // this value is used as roomId in getBedList
    setCurrentPage(1); // Reset current page when room changes
    setUseAvailableBed(false); // Switch to using bedList.length after room selection
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  

  const renderTabContent = () => {
    switch (selectedTab) {
      case "beds":
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
              <div className="col-8">
                <div className="m-t-20 m-b-20 bold-text">
                  <h2 style={{color: "green"}}>{wards} </h2>| {useAvailableBed ? availableBed : bedList.length} Total Beds | {vacantBeds} Vacant | {occupiedBeds} Occupied | {unavailableBeds} Unavailable
                </div>
                <div>
                  <div className="grid gap-16 m-t-20 m-b-20">
                    {Array.isArray(bedList) && bedList.map((patient, index) => (
                      <div key={index}>
                        <FacilityCard
                          wards={wards}
                          availableBed={availableBed}
                          occupiedBeds={occupiedBeds}
                          fetchBedList={getBedList}
                          data={patient}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pagination flex space-between float-right col-6 m-t-20 m-b-80">
                  <div className="flex gap-8">
                    <div className="bold-text">Page</div>
                    <div>{currentPage}/{totalPages}</div>
                  </div>
                  <div className="flex gap-8">
                    <button
                      className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages > 3 ? 3 : totalPages }, (_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {totalPages > 3 && <span>...</span>}
                    <button
                      className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex m-t-40 col-3 flex-direction-v">
                <div className="m-b-10 m-r-20">
                  <StatCard
                    data={{
                      number: admittedpatients,
                      title: "Admitted Patients",
                    }}
                    icon={<RiHotelBedFill className="icon" size={32} />}
                  />
                </div>
                <div className="m-b-10 m-r-20">
                  <StatCard
                    data={{
                      number: availableBed,
                      title: "Available Beds",
                    }}
                    icon={<RiHotelBedFill className="icon" size={32} />}
                  />
                </div>
                <div className="m-b-10 m-r-20">
                  <StatCard
                    data={{
                      number: occupiedBeds,
                      title: "Occupied Beds",
                    }}
                    icon={<RiHotelBedFill className="icon" size={32} />}
                  />
                </div>
              </div>
            </div>
            <div className="m-t-40">
              <AssignedBed fetchBedList={getBedList} />
            </div>
          </div>
        );
      case "equipments":
        return (
          <div>
            <div className="flex m-t-40">
              <div
                style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTabInner === "equipmentList" ? '2px solid #3C7E2D' : 'none', color: selectedTabInner === "equipmentList" ? '#3C7E2D' : '#393939' }}
                onClick={() => setSelectedTabInner('equipmentList')}
              >
                Equipment List
              </div>
              <div
                style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTabInner === "assignedEquipment" ? '2px solid #3C7E2D' : 'none', color: selectedTabInner === "assignedEquipment" ? '#3C7E2D' : '#393939' }}
                onClick={() => setSelectedTabInner('assignedEquipment')}
              >
                View Patient Usage
              </div>
            </div>
            {selectedTabInner === "equipmentList" ? (
              <EquipmentTable />
            ) : selectedTabInner === "assignedEquipment" ? (
              <EquipmentTableAssigned />
            ) : null}
          </div>
        );
      case "ambulance":
        return (
          <div>
            <div className="flex m-t-40">
              <div
                style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTabInner === "ambulanceList" ? '2px solid #3C7E2D' : 'none', color: selectedTabInner === "ambulanceList" ? '#3C7E2D' : '#393939' }}
                onClick={() => setSelectedTabInner('ambulanceList')}
              >
                Ambulance List
              </div>
              <div
                style={{ cursor: 'pointer', padding: '10px', borderBottom: selectedTabInner === "assignedAmbulance" ? '2px solid #3C7E2D' : 'none', color: selectedTabInner === "assignedAmbulance" ? '#3C7E2D' : '#393939' }}
                onClick={() => setSelectedTabInner('assignedAmbulance')}
              >
                View Patient Usage
              </div>
            </div>
            {selectedTabInner === "ambulanceList" ? (
              <AmbulanceTable />
            ) : selectedTabInner === "assignedAmbulance" ? (
              <AmbulanceTableAssigned />
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-80 bold-text">Facility | Bed Management</div>
      <div className="tabs m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "beds" ? "active" : ""}`}
          onClick={() => setSelectedTab("beds")}
        >
          Beds
        </div>
        <div
          className={`tab-item ${selectedTab === "equipments" ? "active" : ""}`}
          onClick={() => { setSelectedTab("equipments"); setSelectedTabInner('equipmentList'); }}
        >
          Equipments
        </div>
        <div
          className={`tab-item ${selectedTab === "ambulance" ? "active" : ""}`}
          onClick={() => { setSelectedTab("ambulance"); setSelectedTabInner('ambulanceList'); }}
        >
          Ambulance
        </div>
      </div>
      <div className="w-25 m-t-20">
        <TagInputs
          label="Select Room"
          onChange={handleWardChange}
          options={rooms}
          name="ward"
          type="R-select"
        />
      </div>
      {renderTabContent()}
    </div>
  );
}

export default Facility;
