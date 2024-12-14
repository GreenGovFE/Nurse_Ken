import React, { useEffect, useState } from "react";
import { get, post } from "../../../utility/fetch";
import AddMedicalRecord from "../../modals/AddMedicalRecord";
import MedicalRecordTable from "../../tables/MedicalRecordTable";
import toast from "react-hot-toast";
import { usePatient } from "../../../contexts";
import Spinner from "../../UI/Spinner";

function MedicalRecord({ data, next, fetchData }) {
  const [selectedTab, setSelectedTab] = useState(1);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [medicalTypes, setMedicalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeComment, setTypeComment] = useState("");
  const [newData, setNewData] = useState(false);
  const { patientId, patientInfo, setPatientId, setPatientInfo } = usePatient();



  const getNewData = async () => {

    setLoading(true);
    try {
      const res = await get(`/Patients/${patientId}/medicalrecord`);
      setNewData(res);

    } catch (error) {
    }
    setLoading(false);
  };



  const getMedicalTypes = async () => {
    setLoading(true);
    try {
      const res = await get("/Patients/getAllMedicalTypes");
      setMedicalTypes(res);

    } catch (error) {
    }
    setLoading(false);
  };

  const toggleModal = () => {
    setModal(!modal);
  }

  const addMedicalRecord = async () => {
    if (typeComment === "" || typeName === "") {
      toast("Please fill in fields")
      return
    }
    setLoading(true);
    const payload = {
      medicalRecordType: selectedTab,
      name: typeName,
      comment: typeComment,
      patientId: patientId
    };
    try {
      await post(`/patients/addmedicalrecord`, payload);
      toast.success('Medical record added successfully');
      await fetchData();

    } catch (error) {
      toast.error('Error adding medical record');
    }
    setLoading(false);
  };

  useEffect(() => {
    getNewData();
    getMedicalTypes();

  }, []);

  useEffect(() => {
    if (medicalTypes && medicalTypes?.length > 0) {
      setSelectedTab(medicalTypes[0]?.index);
      initializeMedicalRecords();
    }
  }, [medicalTypes]);

  const initializeMedicalRecords = () => {
    const initialRecords = {};
    if (selectedTab !== "") {
      const selectedType = medicalTypes?.find(type => type?.index === selectedTab);
      if (selectedType) {
        const recordsOfType = data?.filter(record => record?.medicalRecordType === selectedType?.index);
        if (recordsOfType?.length === 0) {
          initialRecords[selectedType?.index] = [{ name: "", comment: "" }];
        } else {
          initialRecords[selectedType?.index] = recordsOfType?.map(record => ({
            name: record.name || "",
            comment: record?.comment || "",
            actionTaken: record?.actionTaken || "",
            createdAt: record?.createdAt || ""
          }));
        }
      }
    }
    setMedicalRecords(initialRecords);
  };

  useEffect(() => {
    if (selectedTab) {
      initializeMedicalRecords();
    }
  }, [selectedTab]);

  return (
    <div>
      {
        loading ? <Spinner /> : (
          <div>
            <div className="m-t-40 bold-text">Medical Records</div>
            <div>
              <div className="w-100">
                <MedicalRecordTable data={newData || []} />
              </div>
            </div>
          </div>
        )
      }

      {
        modal && <AddMedicalRecord
          closeModal={toggleModal}
          patientId={patientId}
          fetchData={getNewData}
          medicalRecordType={selectedTab}
        />
      }

    </div>
  );
}

export default MedicalRecord;
