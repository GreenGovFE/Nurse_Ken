import Cookies from 'js-cookie';
import React, { createContext, useState, useContext, useEffect } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patientId, setPatientId] = useState(Cookies.get('patientId'));
  const [patientName, setPatientName] = useState(Cookies.get('patientName'));
  const [patientPage, setPatientPage] = useState('');
  const [patientInfo, setPatientInfo] = useState(Cookies.get('patientInfo'));
  const [hmoId, setHmoId] = useState('');
  const [hmoDetails, setHmoDetails] = useState({});
  const [diagnosis, setDiagnosis] = useState([]);
  const [states, setStates] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
  const nuresRole = userInfo?.role ? userInfo?.role[0]?.toLowerCase()?.replace(/\s+/g, '') : '';
  const [nurseTypes, setNurseTypes] = useState(nuresRole === 'vitalnurse' ? 'vital' : nuresRole === 'nurse' ?  'admin' : 'checkin')

  useEffect(() => {
    setNurseTypes(
      nuresRole === 'vitalnurse' ? 'vital' :
      nuresRole === 'nurse' ? 'admin' :
      'checkin'
    );
  }, [nuresRole]);

  return (
    <PatientContext.Provider value={{diagnosis, setDiagnosis ,nurseTypes, setNurseTypes, states, setStates, patientId, setPatientId, patientName, setPatientName, patientPage, setPatientPage, hmoId, setHmoId, patientInfo, setPatientInfo, hmoDetails, setHmoDetails }}>
      {children}
    </PatientContext.Provider>
  );
};
