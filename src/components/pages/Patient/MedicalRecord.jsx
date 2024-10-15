import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TextArea from "../../UI/TextArea";
import { RiToggleFill } from "react-icons/ri";
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
      console.log(error);
    }
    setLoading(false);
  };



  const getMedicalTypes = async () => {
    setLoading(true);
    try {
      const res = await get("/Patients/getAllMedicalTypes");
      setMedicalTypes(res);

    } catch (error) {
      console.log(error);
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
    console.log(payload);
    try {
      await post(`/patients/addmedicalrecord`, payload);
      toast.success('Medical record added successfully');
      await fetchData();

    } catch (error) {
      toast.error('Error adding medical record');
      console.log(error);
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
          // Add an empty record if no records are found
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
        loading ? <Spinner/> : (
          <div>
            <div className="m-t-40 bold-text">Medical Records</div>
            <div>
              {/* <div className="flex m-t-30">
                <div className="m-r-80">
                  {medicalTypes &&
                    medicalTypes.map((type) => (
                      <div
                        key={type.index}
                        className={`pointer m-t-30 font-sm ${selectedTab === type.index ? "pilled bold-text " : ""
                          }`}
                        onClick={() => setSelectedTab(type.index)}
                      >
                        {type.value}
                      </div>
                    ))}
                </div>

                <div>
                  {(selectedTab && medicalTypes) &&

                    <div>
                      <InputField
                        label={`${medicalTypes[selectedTab - 1]?.value}`}
                        type="text"
                        placeholder={`${medicalTypes[selectedTab - 1]?.value}`}
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                      />
                      <TextArea
                        label="Comment"
                        type="text"
                        placeholder="Comment"
                        value={typeComment}
                        onChange={(e) => setTypeComment(e.target.value)}
                      />
                    </div>
                  }
                  <div className="w-100 flex flex-h-end">
                    <button
                      className="rounded-btn m-t-20"
                      onClick={() => addMedicalRecord()}
                    >
                      Add {medicalTypes[selectedTab - 1]?.value}
                    </button>
                  </div>
                  <button className="btn w-100 m-t-20" onClick={() => next()}>
                    Continue
                  </button>
                </div>
              </div> */}

              <div className="w-100">
                {/* <div className="flex flex-h-end">
                  <div className="rounded-btn" onClick={() => toggleModal()}>+ Add Record</div>
                </div> */}
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
