import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmergencyContact({ setSelectedTab }) {
  const { patientId, patientInfo, setPatientId, setPatientInfo } = usePatient();

  const [allCountries, setAllCountries] = useState([]);
  const [allCountryStates, setAllCountryStates] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [data, setData] = useState([]);

  let navigate = useNavigate();

  const [payload, setPayload] = useState({
    nationality: "",
    stateOfResidence: "",
    city: "",
  });

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

  useEffect(() => {
    getContact();
    fetchCountriesAndStates();
  }, []);

  // Fetch countries and states from API
  const fetchCountriesAndStates = async () => {
    try {
      const res = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/states"
      );
      if (res.data && res.data.data) {
        const countryOptions = res.data.data.map((c) => ({
          name: c?.name,
          value: c?.name,
        }));
        countryOptions.unshift({ name: "Select Nationality", value: "" });
        setAllCountries(countryOptions);
        setAllCountryStates(res.data.data);
      }
    } catch (error) {
      notification({
        message: "Failed to fetch countries and states",
        type: "error",
      });
    }
  };

  // Update states when nationality (country) changes
  useEffect(() => {
    let countryName =
      payload?.nationality === "Nigerian" ? "Nigeria" : payload?.nationality;
    if (!countryName) {
      setStates([{ name: "Select State", value: "" }]);
      setCities([{ name: "Select City", value: "" }]);
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
    setCities([{ name: "Select City", value: "" }]);
  }, [payload.nationality, allCountryStates]);

  // Update cities when state changes (if API supports it)
  useEffect(() => {
    const fetchCities = async () => {
      if (!payload.stateOfResidence) {
        setCities([{ name: "Select City", value: "" }]);
        return;
      }
      try {
        const res = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            country:
              payload.nationality === "Nigerian"
                ? "Nigeria"
                : payload.nationality,
            state: payload.stateOfResidence,
          }
        );
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          const cityOptions = res.data.data.map((city) => ({
            name: city,
            value: city,
          }));
          cityOptions.unshift({ name: "Select City", value: "" });
          setCities(cityOptions);
        } else {
          setCities([{ name: "Select City", value: "" }]);
        }
      } catch (error) {
        setCities([{ name: "Select City", value: "" }]);
      }
    };
    fetchCities();
  }, [payload.stateOfResidence, payload.nationality]);

  // Removed old fetchStates, now handled by countriesnow.space API

  useEffect(() => {
    if (
      data &&
      data.stateOfResidence &&
      allCountryStates.length > 0
    ) {
      // Find the country that contains the stateOfResidence
      const foundCountry = allCountryStates.find((country) =>
        country.states.some(
          (state) => state.name === data.stateOfResidence
        )
      );
      console.log("Found country for state:", allCountryStates);

      console.log("Found country for state:", foundCountry?.name);

      if (foundCountry) {
        console.log("Found country for state:", foundCountry?.name);
        setPayload((prev) => ({
          ...prev,
          nationality: foundCountry?.name,
          stateOfResidence: data.stateOfResidence,
        }));
      }
    }
    // alert("data", data);
    // setPayload({
    //   ...payload,
    //   stateOfResidence: data?.stateOfResidence || "",
    // });

    // console.log("patientInfo", allCountryStates);
    // console.log("patientInfo", data);
  }, [patientInfo, allCountryStates,data]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (
      (name === "phone" || name === "altPhone") &&
      (isNaN(value) || value.length > 11)
    ) {
      notification({
        message: "Please enter a valid phone number",
        type: "error",
      });
      return;
    }

    setPayload((prevPayload) => ({ ...prevPayload, [name]: value }));
  };

  const requiredFields = {
    relationship: "Relationship",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    email: "Email",
    contactAddress: "Contact Address",
    stateOfResidence: "State Of Residence",
    lga: "LGA",
    city: "City",
    altPhone: "Alternative Phone Number",
  };

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !payload[field]
    );
    return missingFields;
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const submitPayload = async () => {
    // const missingFields = checkMissingFields(payload);
    // if (missingFields.length > 0) {
    //   const missingFieldLabels = missingFields.map(field => requiredFields[field]);
    //   notification({ message: `Missing required fields: ${missingFieldLabels.join(", ")}`, type: "error" });
    //   return;
    // }

    // if (!payload.phone || payload.phone.length !== 11 || isNaN(payload.phone)) {
    //   notification({ message: 'Please make sure phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!payload.altPhone || payload.altPhone.length !== 11 || isNaN(payload.altPhone)) {
    //   notification({ message: 'Please make sure alt phone number is 11 digits', type: "error" });
    //   return;
    // }

    // if (!isValidEmail(payload.email)) {
    //   notification({ message: 'Please enter a valid email address', type: "error" });
    //   return;
    // }

    try {
      let res = await post("/patients/emergencyContact", {
        ...payload,
        patientId: Number(patientId),
      });
      if (res.patientId) {
        notification({ message: res?.messages, type: "success" });
        // setSelectedTab("financeHmo");
        // setPayload({});
        // setPatientInfo({})
        // setSelectedTab('personal')
        navigate("/patients");

        sessionStorage.setItem("patientId", res?.patientId);
      } else {
        notification({ message: res?.messages, type: "error" });
      }
    } catch (error) {
      notification({ message: error?.detail, type: "error" });
    }
  };

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(patientId)}/emergencycontact`);
      if (res) {
        setPayload(res);
        setData(res);
      }
    } catch (error) {
      console.error("Error fetching emergency contact details:", error);
    }
  };

  return (
    <div className="w-50">
      <div className="m-t-40"></div>
      <TagInputs
        onChange={handleChange}
        value={payload?.relationship || ""}
        name="relationship"
        label="Relationship"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.firstName || ""}
        name="firstName"
        label="First Name"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.lastName || ""}
        name="lastName"
        label="Last Name"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.phoneNumber || payload?.phone || ""}
        name="phone"
        label="Phone Number"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.email || ""}
        name="email"
        label="Email"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.contactAddress || ""}
        name="contactAddress"
        label="Contact Address"
      />
      <TagInputs
        onChange={handleChange}
        disabled={false}
        options={allCountries}
        value={payload?.nationality || ""}
        name="nationality"
        type="select"
        label="Nationality*"
      />
      <TagInputs
        onChange={handleChange}
        disabled={false}
        options={states}
        value={payload?.stateOfResidence || ""}
        name="stateOfResidence"
        type="select"
        label="State Of Residence"
      />
      <TagInputs
        onChange={handleChange}
        disabled={false}
        options={cities}
        value={payload?.city || ""}
        name="city"
        type="select"
        label="City"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.lga || ""}
        name="lga"
        label="LGA/County"
      />
      <TagInputs
        onChange={handleChange}
        value={payload?.altPhone || ""}
        name="altPhone"
        label="Alt Phone Number"
      />

      <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">
        Continue
      </button>
    </div>
  );
}

export default EmergencyContact;
