import React, { useEffect, useState } from "react";
import { RiHotelBedFill } from "react-icons/ri";
import AddBed from "../modals/AddBed";
import { get } from "../../utility/fetch";

function FacilityCard({ data, wards, availableBed, occupiedBeds, fetchBedList, patientName }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patient, setPatient] = useState({})


  console.log(data)



  const openModal = () => {
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);

  };

  //
  return (
    <div>
      {data?.status !== 'Occupied' ? (
        <div>
          <div onClick={openModal} className="cards pointer">
            <RiHotelBedFill size={98} className="text-green" />
            <p>{data?.name}</p>
          </div>
          <div className="comments-btn w-80">
            <p className="text-center">{data?.status}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="cards pointer gray-bg">
            <RiHotelBedFill size={98} className="text-gray" />
            <p>{data?.name}</p>
          </div>
          <button className="comments-btn w-80" disabled={data?.status === 'Occupied'}>
            <p className="text-center">{data?.status}</p>
          </button>
        </div>
      )}

      {isModalOpen &&
        <div>
          <AddBed
            closeModal={closeModal}
            bedId={data?.id}
            fetchBedList={fetchBedList}
          />
        </div>
      }
    </div>
  );
}

export default FacilityCard;
