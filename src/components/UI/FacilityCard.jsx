import React, { useEffect, useState } from "react";
import { RiEdit2Fill, RiHotelBedFill } from "react-icons/ri";
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
          {data?.status === 'Unavailable' ?
            <div>
              <div onClick={openModal} className="cards-unavailable">
                <RiHotelBedFill size={98} className="text-red" />
                <p>{data?.name}</p>
              </div>
              <div className="flex">
                <div style={{border: '1px solid red !important', color: 'white', backgroundColor: 'red'}} className="comments-btn w-80">
                  <p className="text-center">{data?.status}</p>
                </div>
                {/* <button className="m-l-5 facility-edit" onClick={openModal}><RiEdit2Fill /></button> */}
              </div>
            </div>
            :
            <div>
              <div onClick={openModal} className="cards ">
                <RiHotelBedFill size={98} className="text-green" />
                <p>{data?.name}</p>
              </div>
              <div className="flex">
                <div className="comments-btn w-80">
                  <p className="text-center">{data?.status}</p>
                </div>
                <button className="m-l-5 facility-edit" onClick={openModal}><RiEdit2Fill /></button>
              </div>
            </div>
          }
        </div>
      ) : (
        <div>
          <div className="cards  gray-bg">
            <RiHotelBedFill size={98} className="text-gray" />
            <p>{data?.name}</p>
          </div>
          <div className="flex">
            <button className="comments-btn w-80" disabled={data?.status === 'Occupied'}>
              <p className="text-center">{data?.status}</p>
            </button>
            {/* <button className="m-l-5 facility-edit" onClick={openModal}><RiEdit2Fill/></button> */}
          </div>
        </div>
      )}

      {isModalOpen &&
        <div>
          <AddBed
            closeModal={closeModal}
            bedId={data?.id}
            fetchBedList={fetchBedList}
            assigned={data?.status}
          />
        </div>
      }
    </div>
  );
}

export default FacilityCard;
