import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import TagInputs from "../../../layouts/TagInputs";
import { get, post } from "../../../../utility/fetch";
import axios from "axios";
import notification from "../../../../utility/notification";

const BirthRecordForm = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO") || "{}");

  const [formData, setFormData] = useState({ nationality: "Nigerian" });
  const [motherDetails, setMotherDetails] = useState({ nationality: "Nigerian" });
  const [fatherDetails, setFatherDetails] = useState({ nationality: "Nigerian" });
  const [isMotherSectionOpen, setIsMotherSectionOpen] = useState(false);
  const [isFatherSectionOpen, setIsFatherSectionOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [nationality, setNationality] = useState([]);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await get(`/OG_BirthRecord/patient/${patientId}`);
        if (res.isSuccess) {
          const data = res.data;
          setFormData({
            ...data,
            dateOfBirth: data.dateOfBirth?.split('T')[0] || "",
            timeOfBirth: data.timeOfBirth?.value
              ? `${String(data.timeOfBirth.value.hours).padStart(2, '0')}:${String(data.timeOfBirth.value.minutes).padStart(2, '0')}`
              : "",
          });
          setMotherDetails(data.patientMother || {});
          setFatherDetails(data.patientFather || {});
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (patientId) fetchRecord();
  }, [patientId]);

  useEffect(() => {
    const fetchStates = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return notification({ message: 'Token not found', type: "error" });
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/state/list/1/100`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const options = res.data.resultList.map(s => ({ name: s.name, value: s.name }));
      setStates([{ name: "Select State", value: "" }, ...options]);
    };
    const fetchNationality = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return notification({ message: 'Token not found', type: "error" });
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/profile/nationality/list/1/100`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const options = res.data.resultList.map(n => ({ name: n.name, value: n.name }));
      setNationality([{ name: "Select Nationality", value: "" }, ...options]);
    };
    fetchStates();
    fetchNationality();
  }, []);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleParentChange = (e, type) => {
    const setter = type === 'mother' ? setMotherDetails : setFatherDetails;
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...formData,
      birthWeight: +formData.birthWeight,
      birthHeight: +formData.birthHeight,
      headCircumference: +formData.headCircumference,
      skinCircumference: +formData.skinCircumference,
      chestCircumference: +formData.chestCircumference,
      temperature: +formData.temperature,
      spO2: +formData.spO2,
      apgarScore: +formData.apgarScore,
      skinColor: +formData.skinColor,
      respiratoryEffort: +formData.respiratoryEffort,
      muscle: +formData.muscle,
      reflex: { reflexType: +formData.reflexType, normalReflexOption: formData.normalReflexOption },
      patientMother: motherDetails,
      patientFather: fatherDetails,
      appointmentId: +localStorage.getItem('appointmentId'),
      doctorId: docInfo.employeeId,
    };
    try {
      const res = await post('/OG_BirthRecord', payload);
      if (res.isSuccess) toast.success('Successfully Uploaded');
    } catch {
      toast.error('Submission failed: fill all fields properly');
    }
  };

  const maritalStatus = [
    { value: "choose", name: "Choose Marital Status" },
    { value: "Single", name: "Single" },
    { value: "Married", name: "Married" }
  ];

  return (
    <div className="w-100 m-t-80">
      <h3>Birth Record Form</h3>
      <p>Please fill all required fields (*) below:</p>
      <form onSubmit={handleSubmit}>
        <div className="section-box">
          <TagInputs label="First Name *" name="firstName" type="text" required value={formData.firstName || ''} onChange={handleChange} />
          <TagInputs label="Last Name *" name="lastName" type="text" required value={formData.lastName || ''} onChange={handleChange} />
          <TagInputs label="Email *" name="email" type="email" required value={formData.email || ''} onChange={handleChange} />
          <TagInputs label="Phone Number *" name="phoneNumber" type="text" required value={formData.phoneNumber || ''} onChange={handleChange} />
          <TagInputs label="State of Origin *" name="stateOfOrigin" type="select" required options={states} value={formData.stateOfOrigin || ''} onChange={handleChange} />
          <TagInputs label="LGA *" name="lga" type="text" required value={formData.lga || ''} onChange={handleChange} />
          <TagInputs label="Nationality *" name="nationality" type="select" required options={nationality} value={formData.nationality || ''} onChange={handleChange} />
          <TagInputs label="NIN" name="nin" type="text" value={formData.nin || ''} onChange={handleChange} />
          <TagInputs label="Date of Birth *" name="dateOfBirth" type="date" required value={formData.dateOfBirth || ''} onChange={handleChange} />
          <TagInputs label="Time of Birth *" name="timeOfBirth" type="time" required value={formData.timeOfBirth || ''} onChange={handleChange} />
          <TagInputs label="Sex *" name="sex" type="select" required options={[{ name: 'Choose Gender', value: '' }, { name: 'Male', value: 'MALE' }, { name: 'Female', value: 'FEMALE' }]} value={formData.sex || ''} onChange={handleChange} />
          <TagInputs label="Birth Weight (kg) *" name="birthWeight" type="number" required value={formData.birthWeight || ''} onChange={handleChange} />
          <TagInputs label="Birth Height (cm) *" name="birthHeight" type="number" required value={formData.birthHeight || ''} onChange={handleChange} />
          <TagInputs label="Head Circumference (cm) *" name="headCircumference" type="number" required value={formData.headCircumference || ''} onChange={handleChange} />
          <TagInputs label="Skin Circumference (cm) *" name="skinCircumference" type="number" required value={formData.skinCircumference || ''} onChange={handleChange} />
          <TagInputs label="Chest Circumference (cm) *" name="chestCircumference" type="number" required value={formData.chestCircumference || ''} onChange={handleChange} />
          <TagInputs label="Temperature (°C) *" name="temperature" type="number" required value={formData.temperature || ''} onChange={handleChange} />
          <TagInputs label="RBS *" name="rbs" type="text" required value={formData.rbs || ''} onChange={handleChange} />
          <TagInputs label="SpO2 (%) *" name="spO2" type="number" required value={formData.spO2 || ''} onChange={handleChange} />
          <TagInputs label="APGAR Score *" name="apgarScore" type="number" required value={formData.apgarScore || ''} onChange={handleChange} />
          <TagInputs label="Skin Color *" name="skinColor" type="select" required options={[
            { name: 'Select Color', value: '' },
            { name: 'Pink', value: 1 },
            { name: 'Blue', value: 2 },
            { name: 'Pale', value: 3 }
          ]} value={formData.skinColor || ''} onChange={handleChange} />
          <TagInputs label="Respiratory Effort *" name="respiratoryEffort" type="select" required options={[
            { name: 'Select Respiratory Effort', value: '' },
            { name: 'Good', value: 1 },
            { name: 'Weak', value: 3 },
            { name: 'Absent', value: 2 }
          ]} value={formData.respiratoryEffort || ''} onChange={handleChange} />
          <TagInputs label="Muscle Tone *" name="muscle" type="select" required options={[
            { name: 'Select Muscle Tone', value: '' },
            { name: 'Normal', value: 1 },
            { name: 'Reduced', value: 2 },
            { name: 'Absent', value: 3 }
          ]} value={formData.muscle || ''} onChange={handleChange} />
          <TagInputs label="Pulse *" name="pulse" type="text" required value={formData.pulse || ''} onChange={handleChange} />

          <h4 className="m-t-20 m-b-10">Reflexes</h4>
          <TagInputs label="Reflex Type *" name="reflexType" type="select" required options={[
            { name: 'Select Reflex Type', value: '' },
            { name: 'Absent', value: 1 },
            { name: 'Grimace', value: 2 },
            { name: 'Normal', value: 3 }
          ]} value={formData.reflexType || ''} onChange={handleChange} />
          <TagInputs label="Normal Reflex Option *" name="normalReflexOption" type="select" required options={[
            { name: 'Select Normal Reflex', value: '' },
            { name: 'Strong Cry', value: 'StrongCry' },
            { name: 'Cough', value: 'Cough' },
            { name: 'Sneeze', value: 'Sneeze' }
          ]} value={formData.normalReflexOption || ''} onChange={handleChange} />
        </div>

        {/* Mother Section */}
        <button type="button" className="collapse-btn w-100 m-t-20 m-b-20" onClick={() => setIsMotherSectionOpen(o => !o)}>
          {isMotherSectionOpen ? 'Hide Mother Details' : 'Show Mother Details'}
        </button>
        {isMotherSectionOpen && (
          <div className="section-box">
            <h3>Mother's Details</h3>
            <TagInputs label="First Name *" name="firstName" type="text" required value={motherDetails.firstName || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Last Name *" name="lastName" type="text" required value={motherDetails.lastName || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Gender *" name="gender" type="select" required options={[{ name: 'Female', value: 'FEMALE' }, { name: 'Male', value: 'MALE' }]} value={motherDetails.gender || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Email *" name="email" type="email" required value={motherDetails.email || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Phone Number *" name="phoneNumber" type="text" required value={motherDetails.phoneNumber || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="State of Origin *" name="stateOfOrigin" type="text" required value={motherDetails.stateOfOrigin || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="LGA *" name="lga" type="text" required value={motherDetails.lga || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Home Address *" name="homeAddress" type="text" required value={motherDetails.homeAddress || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Place of Birth *" name="placeOfBirth" type="text" required value={motherDetails.placeOfBirth || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Marital Status *" name="maritalStatus" type="select" options={maritalStatus} required value={motherDetails.maritalStatus || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="NIN *" name="nin" type="text" required value={motherDetails.nin || ''} onChange={e => handleParentChange(e, 'mother')} />
            <TagInputs label="Nationality *" name="nationality" type="select" required options={nationality} value={motherDetails.nationality || ''} onChange={e => handleParentChange(e, 'mother')} />
          </div>
        )}

        {/* Father Section */}
        <button type="button" className="collapse-btn w-100 m-t-20 m-b-20" onClick={() => setIsFatherSectionOpen(o => !o)}>
          {isFatherSectionOpen ? 'Hide Father Details' : 'Show Father Details'}
        </button>
        {isFatherSectionOpen && (
          <div className="section-box">
            <h3>Father's Details</h3>
            <TagInputs label="First Name *" name="firstName" type="text" required value={fatherDetails.firstName || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Last Name *" name="lastName" type="text" required value={fatherDetails.lastName || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Gender *" name="gender" type="select" required options={[{ name: 'Male', value: 'MALE' }, { name: 'Female', value: 'FEMALE' }]} value={fatherDetails.gender || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Email *" name="email" type="email" required value={fatherDetails.email || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Phone Number *" name="phoneNumber" type="text" required value={fatherDetails.phoneNumber || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="State of Origin *" name="stateOfOrigin" type="text" required value={fatherDetails.stateOfOrigin || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="LGA *" name="lga" type="text" required value={fatherDetails.lga || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Home Address *" name="homeAddress" type="text" required value={fatherDetails.homeAddress || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Place of Birth *" name="placeOfBirth" type="text" required value={fatherDetails.placeOfBirth || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Marital Status *" name="maritalStatus" type="select" options={maritalStatus}  required value={fatherDetails.maritalStatus || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="NIN *" name="nin" type="text" required value={fatherDetails.nin || ''} onChange={e => handleParentChange(e, 'father')} />
            <TagInputs label="Nationality *" name="nationality" type="select" required options={nationality} value={fatherDetails.nationality || ''} onChange={e => handleParentChange(e, 'father')} />
          </div>
        )}

        <button type="submit" className="submit-btn m-t-20">Submit</button>
      </form>
    </div>
  );
};

export default BirthRecordForm;
