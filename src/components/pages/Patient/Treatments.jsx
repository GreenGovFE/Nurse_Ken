import React, { useEffect, useState } from "react";
import TreatmentTable from "../../tables/TreatmentTable";
import { allergyData } from "../mockdata/PatientData";
import { get } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";

function Treatments() {
  const { patientId, patientName, hmoId, patientInfo } = usePatient();

  const [treatment, setTreatment] = useState([])


  useEffect(() => {
    getTreatment()
  }, [])

  const getTreatment = async () => {
    try {
      let res = await get(`/patients/${patientId}/treatmentrecord`);
      console.log(res);
      setTreatment(res);
    } catch (error) {
      console.error('Error fetching treatment records:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  }
  
  return (
    <div>
      <div className="m-t-40">Treatments</div>
      <div className="w-100">
        <TreatmentTable data={treatment} />
      </div>
    </div>
  );
}

export default Treatments;
