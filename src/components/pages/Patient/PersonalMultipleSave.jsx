import React, { useEffect, useState } from "react";
import axios from "axios";
import TagInputs from "../../layouts/TagInputs";
import { get, post, put } from "../../../utility/fetch";
import notification from "../../../utility/notification";
import ProfilePix from "../../../assets/images/profile-pix copy.jpg";
import UploadPic from "../../UI/UploadPic";
import { usePatient } from "../../../contexts";
import Spinner from "../../UI/Spinner";

function Personal({ setSelectedTab, hide }) {
  const { patientId, patientInfo, setPatientId, setPatientInfo } = usePatient();
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    stateOfOrigin: "",
    lga: "",
    placeOfBirth: "",
    maritalStatus: "",
    nationality: "Nigerian",
    clinicId: 0,
    pictureUrl: "",
    nin: "",
    hasHmo: false,
    hasRetainership: false,
  });
  const [pictureUrl, setPictureUrl] = useState(null);
  const [fileName, setFilename] = useState("");
  const [states, setStates] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allCountryStates, setAllCountryStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState(false);
  const [loader, setLoader] = useState(false);

  const gender = [
    { value: "choose", name: "Choose Gender" },
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },
  ];

  const maritalStatus = [
    { value: "choose", name: "Choose Marital Status" },
    { value: "Single", name: "Single" },
    { value: "Married", name: "Married" },
  ];

  const patientType = [
    { value: "New", name: "New" },
    { value: "Referred", name: "Referred" },
  ];

  const options = [
    { label: "Private", value: "private" },
    { label: "HMO", value: "hasHmo" },
    { label: "Retainership", value: "hasRetainership" },
  ];

  // Example: update options on load (if needed)
  useEffect(() => {
    // You can fetch or update options here if needed
    // setOptions([...]);
  }, []);

  useEffect(() => {
    console.log(patientInfo);
    if (patientInfo) {
      setPayload({
        firstName: patientInfo?.firstName || "",
        lastName: patientInfo?.lastName || "",
        gender: patientInfo?.gender || "",
        dateOfBirth: patientInfo?.dateOfBirth || "",
        email: patientInfo?.email || "",
        phoneNumber: patientInfo?.phoneNumber || "",
        stateOfOrigin: patientInfo?.stateOfOrigin || "",
        lga: patientInfo?.lga || "",
        placeOfBirth: patientInfo?.placeOfBirth || "",
        maritalStatus: patientInfo?.maritalStatus || "",
        nationality: patientInfo?.nationality || "",
        clinicId: patientInfo?.clinicId || 0,
        pictureUrl: patientInfo?.pictureUrl || "",
        patientRef: patientInfo?.patientRef || "",
        nin: patientInfo?.nin || "",
        hasHmo: patientInfo?.hasHmo || false,
        hasRetainership: patientInfo?.hasRetainership || false,
      });
    } else {
      setPayload({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        stateOfOrigin: "",
        lga: "",
        placeOfBirth: "",
        maritalStatus: "",
        nationality: "",
        clinicId: 0,
        pictureUrl: "",
        nin: "",
        hasHmo: false,
        hasRetainership: false,
      });
    }
  }, [patientInfo]);

  // Fetch countries and states from API
  useEffect(() => {
    const fetchCountriesAndStates = async () => {
      try {
        const res = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/states"
        );
        if (res.data && res.data.data) {
          const countryOptions = res.data.data.map((c) => ({
            name: c.name,
            value: c.name,
          }));
          countryOptions.unshift({ name: "Select Nationality", value: "" });
          setAllCountries(countryOptions);
          setAllCountryStates(res.data.data);
        }
        // if (res.data && res.data.data) {
        //   setAllCountries(
        //     res.data.data.map((c) => ({ name: c.name, value: c.name }))
        //   );
        //   setAllCountryStates(res.data.data);
        // }
      } catch (error) {
        notification({
          message: "Failed to fetch countries and states",
          type: "error",
        });
      }
    };
    fetchCountriesAndStates();
  }, []);

  // Update states when nationality (country) changes
  useEffect(() => {
    let countryName =
      payload?.nationality === "Nigerian" ? "Nigeria" : payload?.nationality;
    if (!countryName) {
      setStates([{ name: "Select State", value: "" }]);
      return;
    }
    const country = allCountryStates.find((c) => c.name === countryName);
    if (country && country.states) {
      const stateOptions = country.states.map((s) => ({
        name: s.name,
        value: s.name,
      }));
      stateOptions.unshift({ name: "Select State", value: "" });
      setStates(stateOptions);
    } else {
      setStates([{ name: "Select State", value: "" }]);
    }
  }, [payload.nationality, allCountryStates]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setPayload((prevPayload) => ({ ...prevPayload, [name]: checked }));
    } else {
      setPayload((prevPayload) => ({ ...prevPayload, [name]: value }));
    }
  };

  const handleDropdownChange = (selectedOptions) => {
    // Reset the flags for all available options
    const updatedPayload = {
      hasHmo: false,
      hasRetainership: false,
      private: false,
    };

    // Ensure selectedOptions is always an array
    const optionsArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : selectedOptions
      ? [selectedOptions]
      : [];

    // Set the corresponding flag to true for each selected option
    optionsArray.forEach((option) => {
      updatedPayload[option.value] = true;
    });

    setPayload((prevPayload) => ({ ...prevPayload, ...updatedPayload }));
  };

  const requiredFields = {
    // email: "Email",
    // gender: "Gender",
    lastName: "Last Name",
    firstName: "First Name",
    // nationality: "Nationality",
    phoneNumber: "Phone Number",
    dateOfBirth: "Date Of Birth",
    // maritalStatus: "Marital Status"
  };

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !payload[field]
    );
    return missingFields;
  };

  const submitPayload = async () => {
    // const missingFields = checkMissingFields(payload);
    // if (missingFields.length > 0) {
    //   const missingFieldLabels = missingFields.map(field => requiredFields[field]);
    //   notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
    //   return;
    // }

    if (patientInfo) {
      setSelectedTab("contactDetails");
      return;
    }

    // if (!payload.phoneNumber || payload.phoneNumber.length !== 11 || isNaN(payload.phoneNumber)) {
    //   notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter valid email', type: "error" });
    //   return;
    // }
    console.log({
      ...payload,
      clinicId: Number(sessionStorage.getItem("clinicId")),
      pictureUrl,
    });
    // return;
    setLoader(true);
    try {
      let res = await post("/patients/AddPatient", {
        ...payload,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        pictureUrl,
      });
      if (res?.patientId) {
        notification({
          message: res?.messages || "Patient added successfully",
          type: "success",
        });
        setSelectedTab("contactDetails");
        setPatientId(res.patientId);
        setPatientInfo(payload);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (error.status && error.status === 409) {
        notification({ message: "Patient already exists", type: "error" });
      } else {
        notification({
          message: "An error occurred while adding the patient",
          type: "error",
        });
      }
    } finally {
      setLoader(false);
    }
  };

  const fetchPatientById = async (id) => {
    try {
      let res = await get(`/patients/AllPatientById?patientId=${id}`);
      setPayload(res);
      setPatientInfo(res);
    } catch (error) {}
  };

  const fetchStates = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      notification({
        message: "Token not found in session storage",
        type: "error",
      });
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/state/list/1/100`,
        options
      );
      let tempDoc = res?.data?.resultList.map((doc) => {
        return { name: doc?.name, value: doc?.name };
      });

      tempDoc?.unshift({ name: "Select State", value: "" });
      setStates(tempDoc);
    } catch (error) {}
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const fetchNationality = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      notification({
        message: "Token not found in session storage",
        type: "error",
      });
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/nationality/list/1/100`,
        options
      );
      let tempDoc = res?.data?.resultList.map((doc) => {
        return { name: doc?.name, value: doc?.name };
      });

      tempDoc?.unshift({ name: "Select Nationality", value: "" });
      setNationality(tempDoc);
    } catch (error) {
      notification({
        message: "An error occurred while fetching nationality",
        type: "error",
      });
    }
  };

  const updatePatient = async () => {
    const missingFields = checkMissingFields(payload);
    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map(
        (field) => requiredFields[field]
      );
      notification({
        message: `Missing required fields: ${missingFieldLabels.join(", ")}`,
        type: "error",
      });
      return;
    }

    if (
      !payload.phoneNumber ||
      payload.phoneNumber.length !== 11 ||
      isNaN(payload.phoneNumber)
    ) {
      notification({
        message: "Please make sure phone number is 11 digits",
        type: "error",
      });
      return;
    }

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter valid email', type: "error" });
    //   return;
    // }
    setLoader(true);
    try {
      let res = await post("/patients/UpdatePatient", {
        ...payload,
        clinicId: Number(sessionStorage.getItem("clinicId")),
        pictureUrl,
      });
      if (res.patientId) {
        notification({
          message: res?.messages || "Patient updated successfully",
          type: "success",
        });
        setPatientId(res.patientId);
        setPatientInfo(payload);
        fetchPatientById(res?.patientId);
      }
    } catch (error) {
      notification({
        message: "An error occurred while updating patient",
        type: "error",
      });
    } finally {
      setLoader(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return;
    }
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = ProfilePix;
  };

  return (
    <div className="w-80">
      <div className="m-t-40 "></div>
      <div className="flex wrap space-between">
        <div className="col-7">
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.firstName || ""}
            name="firstName"
            label="First Name*"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.lastName || ""}
            name="lastName"
            label="Last Name*"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.gender || ""}
            name="gender"
            type="select"
            label="Gender*"
            options={gender}
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={formatDate(payload?.dateOfBirth) || ""}
            name="dateOfBirth"
            dateRestriction={"past"}
            type="date"
            label="Date Of Birth*"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.email || ""}
            name="email"
            label="Email"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.phoneNumber || ""}
            name="phoneNumber"
            label="Phone Number*"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.altPhone || patientInfo?.altPhone || ""}
            name="altPhone"
            label="Alt Phone Number"
          />

          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={
              payload?.nationality === "Nigerian"
                ? "Nigeria"
                : payload?.nationality
            }
            name="nationality"
            type="select"
            label="Nationality*"
            options={allCountries}
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.stateOfOrigin || ""}
            name="stateOfOrigin"
            type="select"
            label="State"
            options={states}
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.lga || ""}
            name="lga"
            label="LGA/City"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.nin || ""}
            name="nin"
            label="NIN"
          />

          {/* <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.stateOfOrigin || ""}
            name="stateOfOrigin"
            type="select"
            label="State Of Origin"
            options={states}
          /> */}
          {/* <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.lga || ""}
            name="lga"
            label="LGA"
          /> */}
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.placeOfBirth || ""}
            name="placeOfBirth"
            label="Place Of Birth"
          />
          <TagInputs
            onChange={handleChange}
            disabled={!hide}
            value={payload?.maritalStatus || ""}
            name="maritalStatus"
            type="select"
            label="Marital Status*"
            options={maritalStatus}
          />
          <TagInputs
            label="Patient Class"
            name="patientClass"
            value={options.filter((opt) => payload[opt.value])}
            onChange={(selectedOptions) =>
              setPayload((prevPayload) => ({
                ...prevPayload,
                ...selectedOptions.reduce(
                  (acc, option) => ({ ...acc, [option.value]: true }),
                  {}
                ),
              }))
            }
            type="R-select"
            options={options}
            isMulti={true}
          />
        </div>
        <div className="col-4">
          <>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <p className="m-b-20">Profile Picture</p>
                <div
                  className="m-t-20"
                  style={{
                    width: "180px",
                    height: "180px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    onError={addDefaultSrc}
                    src={payload?.pictureUrl || pictureUrl || ProfilePix}
                    alt={fileName || "Profile Picture"}
                  />
                </div>
              </>
            )}
          </>

          <div>
            <div className="flex space-between m-t-20 m-b-10">
              <div className="flex-col no-margin">
                <UploadPic
                  setLoading={setLoading}
                  handlePicChange={setPictureUrl}
                  name={setFilename}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {hide === true && (
          <>
            <button
              onClick={submitPayload}
              disabled={loader}
              className="submit-btn m-t-20 col-7"
            >
              Continue
            </button>
            {patientId !== 0 && patientId !== null && (
              <button
                onClick={updatePatient}
                disabled={loader}
                className="save-drafts col-7"
              >
                Update
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Personal;
