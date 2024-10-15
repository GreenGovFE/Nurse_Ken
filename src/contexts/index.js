import React, { createContext, useState, useContext } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPage, setPatientPage] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [hmoId, setHmoId] = useState('');
  const [hmoDetails, setHmoDetails] = useState({});
  const [states, setStates] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
  const nuresRole = userInfo?.role[0]?.toLowerCase().replace(/\s+/g, '');
  const [nurseTypes, setNurseTypes] = useState(nuresRole === 'vitalnurse' ? 'vital' : nuresRole === 'nurse' ?  'admin' : 'checkin')


  return (
    <PatientContext.Provider value={{nurseTypes, setNurseTypes, states, setStates, patientId, setPatientId, patientName, setPatientName, patientPage, setPatientPage, hmoId, setHmoId, patientInfo, setPatientInfo, hmoDetails, setHmoDetails }}>
      {children}
    </PatientContext.Provider>
  );
};
