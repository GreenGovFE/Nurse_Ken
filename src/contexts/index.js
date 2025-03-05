import Cookies from 'js-cookie';
import React, { createContext, useState, useContext, useEffect } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patientId, setPatientId] = useState(Cookies.get('patientId') || 0);
  const [patientName, setPatientName] = useState(Cookies.get('patientName'));
  const [patientPage, setPatientPage] = useState('');
  const [patientInfo, setPatientInfo] = useState(() => {
    try {
      return Cookies.get('patientInfo') ? JSON.parse(Cookies.get('patientInfo')) : null;
    } catch (e) {
      console.error("Error parsing patientInfo from cookies", e);
      return {};
    }
  });
  const [hmoId, setHmoId] = useState('');
  const [hmoDetails, setHmoDetails] = useState({});
  const [diagnosis, setDiagnosis] = useState([]);
  const [states, setStates] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'));
  const nurseRoles = userInfo?.role ? userInfo?.role.map(role => role.toLowerCase().replace(/\s+/g, '')) : [];


  return (
    <PatientContext.Provider value={{diagnosis, setDiagnosis , states, setStates, patientId, setPatientId, patientName, setPatientName, patientPage, setPatientPage, hmoId, setHmoId, patientInfo, setPatientInfo, hmoDetails, setHmoDetails, nurseRoles }}>
      {children}
    </PatientContext.Provider>
  );
};
