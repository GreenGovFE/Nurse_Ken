import React, { useEffect, useState, useRef } from "react";
import TagInputs from "../../layouts/TagInputs";
import TextArea from "../../UI/TextArea";
import UploadButton from "../../../Input/UploadButton";
import { RiDeleteBinLine } from "react-icons/ri";
import ImmunizationTable from "../../tables/immunizationTable";
import { get, post } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import { usePatient } from "../../../contexts";
import EDMSFiles from "../../UI/EDMSFiles";
import SpeechToTextButton from "../../UI/SpeechToTextButton";

function Immunization({ setSelectedTab }) {
  const { patientId } = usePatient();

  const [documentArray, setDocumentArray] = useState([]);
  const [payload, setPayload] = useState({
    vaccine: null,
    vaccineBrand: null,
    batchId: null,
    quantity: null,
    age: null,
    weight: null,
    temperature: null,
    dateGiven: null,
    notes: null,
  });
  const [immunizationData, setImmunizationData] = useState([]);
  const [errors, setErrors] = useState({});
  const [docNames, setDocNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMfiles, setSelectedMfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;
  };

  const deleteDoc = (doc) => {
    let newArr = documentArray.filter((id) => id.name !== doc);
    setDocumentArray(newArr);
  };

  const getImmunization = async () => {
    try {
      let res = await get(`/patients/getAllImmunizationRecordByPatientId?patientId=${patientId}&pageIndex=${currentPage}&pageSize=10`);
      setImmunizationData(res.data);
      setTotalPages(res.pageCount)

    } catch (error) {
      console.error("Error fetching immunization data:", error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "dateGiven") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate > currentDate) {
        notification({ message: 'Date selected cannot be a future date', type: "error" });

        // Reset the date input to an empty string
        event.target.value = "";
        setPayload(prevPayload => ({ ...prevPayload, [name]: "" }));
        return;
      }
    }
    setPayload({ ...payload, [name]: value });
  };

  const fieldLabels = {
    vaccine: "Vaccine",
    vaccineBrand: "Vaccine brand",
    batchId: "Batch ID",
    quantity: "Quantity",
    age: "Age",
    weight: "Weight",
    temperature: "Temperature",
    dateGiven: "Date given",
    notes: "Notes",
  };

  const validatePayload = () => {
    let validationErrors = {};
    let missingFields = [];

    if (!payload.vaccine) {
      validationErrors.vaccine = "Vaccine is required";
      missingFields.push(fieldLabels.vaccine);
    }
    if (!payload.vaccineBrand) {
      validationErrors.vaccineBrand = "Vaccine brand is required";
      missingFields.push(fieldLabels.vaccineBrand);
    }
    if (!payload.batchId) {
      validationErrors.batchId = "Batch ID is required";
      missingFields.push(fieldLabels.batchId);
    }
    if (!payload.quantity) {
      validationErrors.quantity = "Quantity is required";
      missingFields.push(fieldLabels.quantity);
    }
    if (!payload.age) {
      validationErrors.age = "Age is required";
      missingFields.push(fieldLabels.age);
    }
    if (!payload.weight) {
      validationErrors.weight = "Weight is required";
      missingFields.push(fieldLabels.weight);
    }
    if (!payload.temperature) {
      validationErrors.temperature = "Temperature is required";
      missingFields.push(fieldLabels.temperature);
    }
    if (!payload.dateGiven) {
      validationErrors.dateGiven = "Date given is required";
      missingFields.push(fieldLabels.dateGiven);
    }
    if (!payload.notes) {
      validationErrors.notes = "Notes is required";
      missingFields.push(fieldLabels.notes);
    }

    setErrors(validationErrors);

    if (missingFields.length > 0) {
      const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
      notification({ message: errorMessage, type: "error" });
    }

    return Object.keys(validationErrors).length === 0;
  };

  const submitPayload = async () => {
    if (!validatePayload()) {
      return;
    }

    try {
      const patientID = Number(patientId);
      if (!patientId) {
        throw new Error("Patient ID not found in session storage");
      }

      const res = await post("/patients/addImmunizationRecords", {
        ...payload,
        age: parseInt(payload?.age),
        weight: parseInt(payload?.weight),
        temperature: parseInt(payload?.temperature),
        quantity: parseInt(payload?.quantity),
        dateGiven: payload?.dateGiven,
        docName: documentArray[0]?.name || selectedMfiles?.fileName,
        docPath: documentArray[0]?.path || selectedMfiles?.filePath,
        patientId: patientID,
      });

      if (typeof res === "object") {
        notification({ message: res?.message, type: "success" });
        getImmunization();
        setPayload({
          vaccine: null,
          vaccineBrand: null,
          batchId: null,
          quantity: null,
          age: null,
          weight: null,
          temperature: null,
          dateGiven: null,
          notes: null,
        });
      } else if (res.StatusCode === 401) {
        notification({ message: "Unauthorized Session", type: "error" });
      } else if (res.StatusCode === 500) {
        notification({ message: "Internal Server Error", type: "error" });
      } else {
        let errorMessage = "An error occurred";

        if (res && res.errors) {
          const errors = res.errors;
          const missingFields = Object.keys(errors).filter((field) => {
            return errors[field].some((errorMsg) => /is required/i.test(errorMsg));
          });
          if (missingFields.length > 0) {
            const formattedFields = missingFields.map((field) =>
              fieldLabels[field] || field.replace(/([a-z])([A-Z])/g, "$1 $2")
            );

            errorMessage = `The following fields are required: ${formattedFields.join(", ")}`;
          }
        }

        notification({ message: errorMessage, type: "error" });
      }
    } catch (error) {
    }
  };

  const next = () => {
    setSelectedTab("treatment");
  };

  useEffect(() => {
    getImmunization();
  }, [currentPage]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPayload(prevPayload => ({ ...prevPayload, notes: prevPayload.notes ? prevPayload.notes + ' ' + transcript : transcript }));
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleTranscript = (transcript) => {
    setPayload(prevPayload => ({ ...prevPayload, notes: prevPayload.notes ? prevPayload.notes + ' ' + transcript : transcript }));
  };

  return (
    <div className="">
      <div className="w-100  wrap flex ">
        <div className="col-3-3">
          <div>
            <TagInputs onChange={handleChange} value={payload?.vaccine || ''} name="vaccine" label="Vaccine" error={errors.vaccine} />
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.vaccineBrand || ''} name="vaccineBrand" label="Vaccine Brand" error={errors.vaccineBrand} />
          </div>
          <div>
            <TagInputs onChange={handleChange} value={payload?.batchId || ''} name="batchId" label="Batch #ID" error={errors.batchId} />
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.quantity || ''} variation={true} name="quantity" label="Quantity" error={errors.quantity} />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.age || ''} variation={true} name="age" label="Age" error={errors.age} />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.weight || ''} variation={true} name="weight" label="Weight" error={errors.weight} />
            </div>
          </div>
          <div className="flex">
            <div className="w-100">
              <TagInputs onChange={handleChange} value={payload?.temperature || ''} variation={true} name="temperature" label="Temperature" error={errors.temperature} />
            </div>
          </div>
          <div>
            <TagInputs onChange={handleChange} name="dateGiven" value={payload.dateGiven || ''} dateRestriction={'past'} label="Date Given" type="date" error={errors.dateGiven} />
          </div>
          <div>
            <TextArea
              label="Notes"
              name="notes"
              type="text"
              value={payload?.notes || ''}
              placeholder="Write your notes here..."
              onChange={handleChange}
            />
            <SpeechToTextButton onTranscript={handleTranscript} />
          </div>
          <div className="w-100 flex flex-h-end flex-direction-v">
            <div className="m-t-20 m-b-20">
              <UploadButton setDocNames={setDocNames} setdocumentArray={setDocumentArray} />
            </div>

            {documentArray?.map((item, index) => (
              <div key={index} className="m-t-10 flex">
                <a href={item.path} target="_blank" className="m-r-10">
                  {item.name}
                </a>
                <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
              </div>
            ))}
          </div>
          <div>
            <EDMSFiles
              selectedFile={selectedMfiles}
              setSelectedFile={setSelectedMfiles}
            />
          </div>
          <div className="w-100 ">
            <button onClick={submitPayload} className="submit-btn w-100 m-t-20">
              Add Record
            </button>
            <button onClick={next} className="save-drafts w-100 m-t-20">
              Continue
            </button>
          </div>
        </div>
        <div className="col-8 m-l-20">
          <ImmunizationTable data={immunizationData} />
          <div>
            <div className="pagination flex space-between float-right  col-5 m-t-20">
              <div className="flex gap-8">
                <div className="bold-text">Page</div> <div>{currentPage}/{totalPages}</div>
              </div>
              <div className="flex gap-8">
                <button
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"Previous"}
                </button>

                {generatePageNumbers().map((page, index) => (
                  <button
                    key={`page-${index}`}
                    className={`pagination-btn ${currentPage === page ? 'bg-green text-white' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {"Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Immunization;
