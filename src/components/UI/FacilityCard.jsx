import React from "react";
import { RiHotelBedFill } from "react-icons/ri";

function FacilityCard({ data }) {
  return (
    <div>
      {data?.occupied ? (
        <div>
          <div className="card">
            <RiHotelBedFill size={98} className="text-green" />
            <p>{data?.facilityId}</p>
          </div>
          <div className="comment-btn w-80">
            <p className="text-center p-10">{data?.patientName}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="card gray-bg">
            <RiHotelBedFill size={98} className="text-gray" />
            <p>{data?.facilityId}</p>
          </div>
          <button className="comment-btn w-80" disabled>
            <p className="text-center p-10">{data?.patientName}</p>
          </button>
        </div>
      )}
    </div>
  );
}

export default FacilityCard;
