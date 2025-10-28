import React, { useEffect, useState } from "react";
import TagInputs from "../../layouts/TagInputs";
import notification from "../../../utility/notification";
import { get, post } from "../../../utility/fetch";
import { usePatient } from "../../../contexts";
import axios from "axios";

function ContactDetails({ setSelectedTab, hide }) {
  const { patientId, patientInfo } = usePatient();
  const [states, setStates] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allCountryStates, setAllCountryStates] = useState([]);
  const [payload, setPayload] = useState({
    nationality: patientInfo?.nationality || "",
    stateOfResidence: "",
    lgaResidence: "",
    city: "",
    homeAddress: "",
    phone: patientInfo?.phoneNumber || "",
    email: patientInfo?.email || "",
    altPhone: patientInfo?.altPhone || "",
  });

  useEffect(() => {
    // On first load, set payload.nationality to 'Nigeria' if patientInfo.nationality is 'Nigerian', else set to patientInfo.nationality
    // if (patientInfo && patientInfo.nationality) {
    //   setPayload((prev) => ({
    //     ...prev,
    //     nationality:
    //       patientInfo.nationality === "Nigeria"
    //         ? "Nigeria"
    //         : patientInfo.nationality,
    //   }));
    // }
    getContact();
    fetchCountriesAndStates();
    // eslint-disable-next-line
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
    console.log(payload?.nationality);
    let countryName =
      payload?.nationality === "Nigerian" ? "Nigeria" : payload?.nationality;
    console.log(countryName);
    if (!countryName) {
      setStates([{ name: "Select State", value: "" }]);
      return;
    }
    const country = allCountryStates.find((c) => c?.name === countryName);
    if (country && country.states) {
      const stateOptions = country.states.map((s) => ({
        name: s?.name,
        value: s?.name,
      }));
      stateOptions.unshift({ name: "Select State", value: "" });
      setStates(stateOptions);
    } else {
      setStates([{ name: "Select State", value: "" }]);
    }
  }, [payload?.nationality, allCountryStates]);

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
    stateOfResidence: "State Of Residence",
    lgaResidence: "LGA",
    city: "City",
    homeAddress: "Home Address",
    phone: "Phone Number",
    email: "Email Address",
    altPhone: "Alt Phone Number",
  };

  // Removed old fetchStates, now handled by countriesnow.space API

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const checkMissingFields = (payload) => {
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !payload[field]
    );
    return missingFields;
  };

  const submitPayload = async () => {
    // Validate phone number

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

    console.log(payload);
    // return;

    try {
      let res = await post("/patients/updateContact", {
        ...payload,
        patientId: Number(patientId),
      });
      if (res) {
        notification({ message: res?.messages, type: "success" });
        setSelectedTab("emergencyContact");
      }
    } catch (error) {
      notification({
        message: error?.response?.data?.errorData[0] || error?.message,
        type: "error",
      });
    }
  };

  const getContact = async () => {
    try {
      let res = await get(`/patients/${Number(patientId)}/contact`);
      if (res) {
        let nationality = res.nationality || "";
        // If stateOfResidence is present, derive nationality from state
        if (res.stateOfResidence && allCountryStates.length > 0) {
          const foundCountry = allCountryStates.find((country) =>
            country.states.some((state) => state.name === res.stateOfResidence)
          );
          if (foundCountry) {
            nationality = foundCountry.name;
          }
        }
        setPayload({
          ...res,
          nationality,
          altPhone: res?.altPhone || patientInfo?.altPhone || "",
          email: res?.email || patientInfo?.email || "",
          phone: res?.phoneNumber || patientInfo?.phoneNumber || "",
        });
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };

  useEffect(() => {
    if (payload.stateOfResidence && allCountryStates.length > 0) {
      // Find the country that contains the selected stateOfResidence
      const foundCountry = allCountryStates.find((country) =>
        country.states.some((state) => state.name === payload.stateOfResidence)
      );
      if (foundCountry && payload.nationality !== foundCountry.name) {
        setPayload((prev) => ({
          ...prev,
          nationality: foundCountry.name,
        }));
      }
    }
    // Only run when stateOfResidence or allCountryStates changes
    // eslint-disable-next-line
  }, [ patientInfo, payload.stateOfResidence, allCountryStates]);

  return (
    <div>
      <div className="w-50">
        <div className="m-t-40"></div>
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          value={payload?.nationality || ""}
          name="nationality"
          type="select"
          label="Nationality*"
          options={allCountries}
        />
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          options={states}
          value={payload?.stateOfResidence || ""}
          name="stateOfResidence"
          label="State Of Residence"
          type="select"
        />
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          value={payload?.lgaResidence || ""}
          name="lgaResidence"
          label="LGA/County Of Residence"
        />
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          value={payload?.city || ""}
          name="city"
          label="City"
        />
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          value={payload?.homeAddress || ""}
          name="homeAddress"
          label="Home Address"
        />
        <TagInputs
          onChange={handleChange}
          disabled={hide}
          value={payload?.phone || patientInfo?.phoneNumber || ""}
          name="phone"
          label="Phone Number"
        />
        <TagInputs
          onChange={handleChange}
          disabled={hide}
          value={payload?.email || patientInfo?.email}
          name="email"
          label="Email Address"
        />
        <TagInputs
          onChange={handleChange}
          disabled={!hide}
          value={payload?.altPhone || patientInfo?.altPhone || ""}
          name="altPhone"
          label="Alt Phone Number"
        />

        {hide === true && (
          <button onClick={submitPayload} className="submit-btn  m-t-20 w-100">
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export default ContactDetails;
