import React, { useEffect, useState } from "react";
import { get } from "../utility/fetch";

const MedicationTable = ({ data }) => {
  const [record, setRecord] = useState([]);
  useEffect(() => {
    fetchTreatmentRecord();
  }, []);

  const measurementUnits = [
    { id: 1, name: "Milligrams", symbol: "mg" },
    { id: 2, name: "Grams", symbol: "g" },
    { id: 3, name: "Micrograms", symbol: "µg" },
    { id: 4, name: "Milliliters", symbol: "mL" },
    { id: 5, name: "Liters", symbol: "L" },
    { id: 6, name: "Units", symbol: "U" },
    { id: 7, name: "Puffs" },
    { id: 8, name: "Sprays" },
    { id: 9, name: "Drops" },
    { id: 10, name: "Patch" },
    { id: 11, name: "Bottle" },
    { id: 12, name: "Transdermal System" },
    { id: 13, name: "Tablet" },
    { id: 14, name: "Capsule" },
    { id: 15, name: "Suppository" },
    { id: 16, name: "Scoop" },
    { id: 17, name: "Sachet" },
    { id: 18, name: "Ampoule" },
    { id: 19, name: "Vial" },
    { id: 20, name: "Injection Pen" },
    { id: 21, name: "Enema" },
    { id: 22, name: "Ounces", symbol: "oz" },
    { id: 23, name: "Teaspoon", symbol: "tsp" },
    { id: 24, name: "Tablespoon", symbol: "tbsp" },
    { id: 25, name: "Milliequivalents", symbol: "mEq" },
    { id: 26, name: "International Units", symbol: "IU" },
  ];

  const routesOfAdministration = [
    { id: 1, name: "Orally" },
    { id: 2, name: "Sublingual" },
    { id: 3, name: "Topical" },
    { id: 4, name: "Inhalation" },
    { id: 5, name: "Suppository" },
    { id: 6, name: "IV" },
    { id: 7, name: "IM" },
    { id: 8, name: "Subcut" },
    { id: 9, name: "Intradermal" },
    { id: 10, name: "PerRectum" },
    { id: 11, name: "PerVagina" },
    { id: 12, name: "Implant" },
  ];

  const administrationFrequencies = [
    { id: 1, name: "Immediately" },
    { id: 2, name: "As needed" },
    { id: 3, name: "Once daily" },
    { id: 4, name: "Twice a day" },
    { id: 5, name: "Three times a day" },
    { id: 6, name: "Four times a day" },
    { id: 7, name: "At night" },
    { id: 8, name: "Morning" },
    { id: 9, name: "Evening" },
    { id: 10, name: "Every 24 hours" },
    { id: 11, name: "Every 12 hours" },
    { id: 12, name: "Every 8 hours" },
    { id: 13, name: "Every 6 hours" },
    { id: 14, name: "Every 4 hours" },
    { id: 15, name: "Every 3 hours" },
    { id: 16, name: "Every 2 hours" },
    { id: 17, name: "Every hour" },
    { id: 18, name: "Every 2 months" },
    { id: 19, name: "Every 3 months" },
  ];

  const fetchTreatmentRecord = async () => {
    // setLoading(true);
    try {
      const response = await get(
        `/ServiceTreatment/list/${data.treatmentType}/${data.treatmentId}/1/1000`
      );
      if (response?.isSuccess) {
        setRecord(response.data.recordList);
        console.log(response.data.recordList[0]);

        // setFamilyMedcineTreatmentDataById(response.data.recordList[0] || {});
        // console.log(response.data.recordList[0] || {});
        // setDiagnosis(response.data.recordList[0].diagnosis || 89);
        // setCarePlan(response.data.recordList[0].carePlan || 89);
        // setAdditionalNotes(response.data.recordList[0].additionalNotes || 89);

        // setFormData({
        //   ...response.data.recordList[0],
        // });
        // console.log({
        //   ...response.data.recordList[0],
        // });
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      //   setLoading(false);
    }
  };

  // Flatten all medications across records
  const allMedications =
    record.flatMap((record, recordIndex) =>
      record.medications?.map((med, medIndex) => ({
        sn: `${recordIndex + 1}`,
        productName: med.pharmacyInventory?.productName || "N/A",
        dosage: med.quantity || "-",
        frequency: med.frequency || "-",
        strength: med.strength || "-",
        duration: med.duration || "-",
        drugStrengthUnit: med.drugStrengthUnit || "-",
        administrationFrequency: med.administrationFrequency || "-",
        routeOfAdministration: med.routeOfAdministration || "-",
      }))
    ) || [];

  return (
    <div>
      {record?.length>0 && (
        <div>
          <div className="field-column">
            <label>Patient's DIagnosis</label>
            <textarea
              className="input-field"
              rows={10}
              name="diagosis"
              value={record[0]?.diagnosis}
              // onChange={handleChange}
            ></textarea>
          </div>
          <div className="field-column">
            <label>Patient's Care Plan</label>
            <textarea
              className="input-field"
              rows={10}
              name="diagosis"
              value={record[0]?.carePlan}
              // onChange={handleChange}
            ></textarea>
          </div>
          <div className="field-column">
            <label>Prescriptions</label>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ backgroundColor: "#e9fbe9" }}>
                  <th style={cellStyle}>S/N</th>
                  <th style={cellStyle}>Medication</th>
                  <th style={cellStyle}>Quantity</th>
                  {/* <th style={cellStyle}>Frequency</th> */}
                  <th style={cellStyle}>Strength</th>
                  <th style={cellStyle}>Unit Of Measurement</th>
                  <th style={cellStyle}>Duration (days)</th>
                  <th style={cellStyle}>Administration Frequency </th>
                  <th style={cellStyle}>Administration Route </th>
                </tr>
              </thead>
              <tbody>
                {allMedications.map((med, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{med.sn}</td>
                    <td style={cellStyle}>{med.productName}</td>
                    <td style={cellStyle}>{med.dosage}</td>
                    {/* <td style={cellStyle}>{med.frequency}</td> */}
                    <td style={cellStyle}>{med.strength}</td>
                    <td style={cellStyle}>{measurementUnits.find(unit => unit.id == med.drugStrengthUnit)?.name }</td>
                    <td style={cellStyle}>{med.duration}</td>
                    <td style={cellStyle}>
                      {
                        administrationFrequencies.find(
                          (e) => e.id === med.administrationFrequency
                        )?.name
                      }
                    </td>
                    <td style={cellStyle}>
                      {
                        routesOfAdministration.find(
                          (e) => e.id === med.routeOfAdministration
                        )?.name
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic green-bordered cell styling
const cellStyle = {
  border: "1px solid green",
  padding: "6px",
  textAlign: "left",
};

export default MedicationTable;
