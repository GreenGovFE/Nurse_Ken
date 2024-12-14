import { useEffect, useState } from "react";
import FacilityCard from "../UI/FacilityCard";
import TagInputs from "../layouts/TagInputs";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import BedAssignModal from "../layouts/BedAssignModal";
import Notify from "../../utility/notify";
import EquipmentTable from "../tables/AssignedEquipmentTable";
import AmbulanceTable from "../tables/AmbulanceTable";




const location = [
  { value: "", name: "Select location" },
  { value: "Left", name: "Left" },
  { value: "Right", name: "Right" },

]

function Facility() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("beds");
  const [payload, setPayload] = useState({
    name: "",
    roomId: 0,
    location: "Left",
    note: "",
    userId: Number(sessionStorage.getItem("userId"))
  })
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  const [ambulances, setAmbulances] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState([]);


  const getBeds = async () => {
    let res = await get("/bed/list/1/100");
    if (res) {
      setBeds(res.resultList);
    }
  }

  let handleAssign = (data) => {
    setShowAssignModal(true);
    setAssignmentData(data);
  }


  const clearForm = () => {
    setPayload({
      name: "",
      roomId: "",
      location: "Left",
      note: "",
      userId: Number(sessionStorage.getItem("userId"))
    });
    getRooms();
  }

  const addBed = async () => {
    const {
      name,
      roomId,
      location,
      note,
      userId
    } = payload;

    if (name === "" || roomId === "" || location === "" || note === "" || userId === "") {
      Notify({ title: "Error", message: "Please fill in all the fields", type: "danger" });
      return;
    }

    let res = await post("/bed/bed", payload);

    if (res?.statusCode === 400) {
      Notify({ title: "Error", message: res?.errorData[0], type: "danger" });
      return;
    }
    else if (res?.statusCode === 409) {
      Notify({ title: "Error", message: res?.errorData[0], type: "danger" });
      return;
    }
    else if (res) {
      Notify({ title: "Success", message: "You have successfully added a Bed ", type: "success" });
      setPayload({ ...payload, name: "", note: "" });
      getBeds();
    }

  }

  const getRooms = async () => {
    let res = await get("/room/list/1/100");
    let roomList = res?.resultList;
    roomList.unshift({ name: "Select Room", id: "" })
    setRooms(res?.resultList?.map((item) => ({ value: item?.id, name: item.name })));
  }


  const getAmbulance = async () => {
    let res = await get("/assignambulance/list/1/10000")
    setAmbulances(res?.resultList);
  }

  const getEquipment = async () => {
    let res = await get("/assignequipment/list/1/10000")
    setEquipment(res?.resultList);
  }


  useEffect(() => {
    getRooms();
    getBeds();
    getAmbulance();
    getEquipment();
  }, [])


  const handleChange = (event) => {
    if (event.target.name === "roomId") {
      setPayload({ ...payload, [event.target.name]: Number(event.target.value) })
    }
    else {
      setPayload({ ...payload, [event.target.name]: event.target.value })
    }
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "beds":
        return (
          <div className=" m-t-20">
            <div className="flex">
              <div className="flex-30 m-r-20 ">
                <h3 className="m-b-10">Total Available Beds: {beds?.length}</h3>
                <TagInputs type="select" options={rooms} onChange={handleChange} name="roomId" label="Select Room" />

                <h3 className="m-t-40 m-b-10">Add Beds</h3>
                <TagInputs onChange={handleChange} value={payload?.name} name="name" label="Bed Name" />
                <TagInputs type="select" options={location} onChange={handleChange} name="location" label="Select Location" />
                <TagInputs type="textArea" onChange={handleChange} name="note" label="Add Note" value={payload?.note} />

                <div className="flex">
                  <button onClick={clearForm} className="btn-gray w-100 m-t-10 m-r-10">Clear</button>
                  <button onClick={addBed} className="btn w-100 m-t-10">Submit</button>
                </div>

              </div>
              <div className="flex-60 grid gap-16">
                {Array.isArray(beds) && beds?.map((bed, index) => (
                  <FacilityCard handleAssign={handleAssign} key={index} data={bed} />
                ))}
              </div>
            </div>

          </div>
        );

      case "equipments":
        // Render equipment content here
        return (
          <div className=" m-t-20">
            <div className="flex">
              <div className="flex-30 m-r-20 ">
                <h3 className="m-b-10">Total Equipment: {equipment?.length}</h3>
                <TagInputs type="select" options={rooms} onChange={handleChange} name="roomId" label="Select Room" />

              </div>
              <div className="flex-60 grid gap-16">
                  <EquipmentTable data={equipment} roomId={payload?.roomId} handleAssign={handleAssign} />
              </div>
            </div>

          </div>
        );

      case "ambulance":
        // Render ambulance content here
        return (
          <div className=" m-t-20">
            <div className="flex">
              <div className="flex-30 m-r-20 ">
                <h3 className="m-b-10">Total Ambulances: {ambulances?.length}</h3>
              </div>
              <div className="flex-60 grid gap-16">
                  <AmbulanceTable data={ambulances} handleAssign={handleAssign} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    };
  }

  return (
    <div className="w-100">
      <div  className="m-t-40 bold-text">Facility | Bed Management</div>

      <div className="tabs m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "beds" ? "active" : ""}`}
          onClick={() => setSelectedTab("beds")}
        >
          Beds
        </div>

        <div
          className={`tab-item ${selectedTab === "equipments" ? "active" : ""}`}
          onClick={() => setSelectedTab("equipments")}
        >
          Equipments
        </div>

        <div
          className={`tab-item ${selectedTab === "ambulance" ? "active" : ""}`}
          onClick={() => setSelectedTab("ambulance")}
        >
          Ambulance
        </div>
      </div>


      <div className="m-t-20 bold-text">
        Assigned Patients location | Ward A
      </div>

      {renderTabContent()}

      {showAssignModal && <BedAssignModal data={assignmentData} closeModal={() => setShowAssignModal(false)} getBeds={getBeds} />}
    </div>
  );
}

export default Facility;
