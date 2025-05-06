import React, { useEffect, useState } from "react";
import { get, post } from "../../../utility/fetch";
import AddMedicalRecord from "../../modals/AddMedicalRecord";
import MedicalRecordTable from "../../tables/MedicalRecordTable";
import toast from "react-hot-toast";
import { usePatient } from "../../../contexts";
import Spinner from "../../UI/Spinner";
import UploadButton from "../../../Input/UploadButtonMedRec";
import { RiDeleteBinLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import Cookies from "js-cookie";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";



function MedicalRecord({ data, next, fetchData }) {
  const [selectedTab, setSelectedTab] = useState(1);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [medicalTypes, setMedicalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeComment, setTypeComment] = useState("");
  const [newData, setNewData] = useState(false);
  const { patientId, setPatientId, setPatientInfo, patientInfo } = usePatient();
  const [fileNames, setfileNames] = useState([]);
  const [documentArray, setDocumentArray] = useState([]);
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [reset, setReset] = useState(false);
  const [isScannedFilesOpen, setIsScannedFilesOpen] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});




  useEffect(() => {
    const cookiePatientId = Cookies.get('patientId');

    console.log(cookiePatientId)

    if (cookiePatientId && cookiePatientId !== patientId) {
      setPatientId(cookiePatientId);
    }

    if (patientInfo && Object.keys(patientInfo).length === 0) {
      setPatientInfo(patientInfo);
    }
  }, [patientId, patientInfo, setPatientId, setPatientInfo]);


  const getNewData = async () => {

    setLoading(true);
    try {
      const res = await get(`/Patients/${patientId}/medicalrecord`);
      setNewData(res);

    } catch (error) {
    }
    setLoading(false);
  };


  const deleteDoc = (doc) => {
    let newArr = documentArray.filter((id) => id.name !== doc);
    setDocumentArray(newArr);
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

  const getMedicalFiles = async () => {
    setLoading(true);
    try {
      const res = await get(`/patients/${patientId}/patient_files`);
      setMedicalFiles(res);

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
    getMedicalFiles();
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

  const toggleScannedFiles = () => {
    setIsScannedFilesOpen(!isScannedFilesOpen);
  };

  const toggleFileView = (index) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getFileType = (filePath) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    return fileExtension;
  };

  const isImageFile = (fileType) => {
    return ['png', 'jpg', 'jpeg'].includes(fileType);
  };

  const isDocFile = (fileType) => {
    return ['pdf', 'tif', 'bmp', 'tiff'].includes(fileType);
  };

  return (
    <div>
      {
        loading ? <Spinner /> : (
          <div>
            <div className="m-t-40 bold-text">Medical Records</div>
            <div className="col-5">
              <UploadButton patientRef={patientInfo?.patientRef} fetch={getMedicalFiles} setdocumentArray={setDocumentArray} />
            </div>
            <div>
              <div className="flex m-t-20 flex-direction-v">
                <span onClick={toggleScannedFiles} className="pointer collapse">
                  {isScannedFilesOpen ? "Hide Scanned Medical Records" : "Show Scanned Medical Records"} {isScannedFilesOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </span>
                {isScannedFilesOpen && (
                  <div className="card m-t-10 p-10">
                    {medicalFiles?.map((item, index) => (
                      <div key={index} className="m-t-10 flex flex-direction-v">
                        <span onClick={() => toggleFileView(index)} className="pointer save-drafts">
                          {expandedFiles[index] ? "Hide  " : "Show  "} {item?.fileName}
                        </span>
                        {expandedFiles[index] && (
                          <div className="m-t-10">
                            {isDocFile(getFileType(item?.filePath)) ? (
                              <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(item?.filePath)}&embedded=true`}
                                title={item?.fileName}
                                width="100%"
                                height="800px"
                                frameBorder="0"
                              />
                            ) : isImageFile(getFileType(item?.filePath)) ? (
                              <img
                                src={item?.filePath}
                                alt={item?.fileName}
                                style={{
                                  width: 'auto',
                                  height: 'auto',
                                  maxHeight: '80vh',
                                  objectFit: 'contain',
                                }}
                              />
                            ) : (
                              <DocViewer
                                documents={[{ uri: item?.filePath }]}
                                pluginRenderers={DocViewerRenderers}
                                style={{ width: '100%', height: '500px' }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
