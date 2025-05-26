import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import "./assets/css/general.css";
import "./assets/css/index.css";
import "./assets/css/pages-icons.css";
import "./assets/css/pages-sidebar.css";

import Homepage from './components/home';
import { PatientProvider } from './contexts';
import PageLayout from './components/layouts/PageLayout';
import { Toaster } from 'react-hot-toast';
import { BedProvider } from './contexts/bedContext';
import Connect from './components/home/connect';
import notification from './utility/notification';
import { get } from './utility/fetch';

const App = () => {
  const navigate = useNavigate();
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [inactivityMinutesLeft, setInactivityMinutesLeft] = useState(5); // 5 minutes countdown
  const [previousLabPatients, setPreviousLabPatients] = useState([]);
  const isInitialFetch = useRef(true);

  const getPatientsAwaitingLab = async () => {
    try {
      const res = await get(`/patients/labrequests-not-attended/${sessionStorage.getItem('clinicId')}`);
      
      // Only compare if this is not the initial fetch
      if (!isInitialFetch.current) {
        // Get IDs from both lists
        const previousIds = previousLabPatients.map(patient => patient.id);
        const currentIds = res.map(patient => patient.id);

        // Determine which records were removed (i.e. previously present but now missing)
        const removedRecords = previousLabPatients.filter(patient => !currentIds.includes(patient.id));
        
        if (removedRecords.length > 0) {
          const names = removedRecords.map(record => record.fullName).join(", ");
          notification({ message: `Lab records ready for: ${names}`, type: "success" });
        }
      } else {
        // Skip notification on initial fetch
        isInitialFetch.current = false;
      }
      
      // Update previousLabPatients with the current result for next comparison
      setPreviousLabPatients(res);
    } catch (error) {
      // notification({ message: "Error fetching lab patients", type: "error" });
    }
  };

  useEffect(() => {
    // Poll every 10 seconds
    const interval = setInterval(getPatientsAwaitingLab, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let activityTimeoutId;
    let inactivityTimeoutId;
    let checkSessionTimeoutId;

    const resetInactivityTimer = () => {
      if (activityTimeoutId) {
        clearTimeout(activityTimeoutId);
      }
      if (inactivityTimeoutId) {
        clearTimeout(inactivityTimeoutId);
        setInactivityWarning(false);
        setInactivityMinutesLeft(2); // Reset countdown to 2 minutes
      }

      activityTimeoutId = setTimeout(() => {
        inactivityTimeoutId = setInterval(() => {
          setInactivityMinutesLeft((prev) => {
            if (prev === 1) {
              setSessionExpired(true);
              setInactivityWarning(false);
              setWarningDisplayed(false);
              navigate('/');
              localStorage.removeItem('LOGIN_TIME');

              clearInterval(inactivityTimeoutId);
              setTimeout(() => {
                setSessionExpired(false);
              }, 5000);
              return 0;
            }
            return prev - 1;
          });
        }, 60000);
        setInactivityWarning(true);
      }, 780000); // 13 minutes (13 * 60 * 1000)
    };

    const checkAndSetTimeout = () => {
      const loginTime = localStorage.getItem('LOGIN_TIME');

      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - loginTime;
        const sessionDuration = 900000; // 15 minutes (15 * 60 * 1000)
        const timeRemaining = sessionDuration - timeElapsed;

        if (timeRemaining <= 120000 && timeRemaining > 0) { // 2 minutes warning
          const minutesLeft = Math.ceil(timeRemaining / 60000);
          setMinutesLeft(minutesLeft);
          if (!warningDisplayed) {
            setWarningDisplayed(true);
            setSessionExpired(false);
          }
        }
      }
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    checkAndSetTimeout();

    checkSessionTimeoutId = setInterval(checkAndSetTimeout, 60000);

    resetInactivityTimer();

    return () => {
      clearInterval(checkSessionTimeoutId);
      clearTimeout(activityTimeoutId);
      clearTimeout(inactivityTimeoutId);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
    };
  }, [navigate, warningDisplayed, sessionExpired]);

  return (
    <PatientProvider>
      <BedProvider>
        <div>
          <Routes>
            <Route path="/" element={<Connect />} />
            <Route path="*" element={<PageLayout />} />
            <Route render={() => <h1>Error 404. Page not found.</h1>} />
          </Routes>
          {warningDisplayed && (
            <div style={toastStyle}>
              <span role="img" aria-label="warning">⚠️</span>
              {` Session will time out in ${minutesLeft} minutes`}
            </div>
          )}
          {sessionExpired && (
            <div style={toastStyle}>
              <span role="img" aria-label="error">❌</span>
              {` Session has timed out. Please login again.`}
            </div>
          )}
          {inactivityWarning && (
            <div style={toastStyle}>
              <span role="img" aria-label="warning">⚠️</span>
              {`You will be logged out in ${inactivityMinutesLeft} minutes due to inactivity.`}
            </div>
          )}
        </div>
      </BedProvider>
    </PatientProvider>
  );
};

const toastStyle = {
  position: 'fixed',
  top: '20px',
  left: '22%',
  transform: 'translateX(-50%)',
  backgroundColor: '#393939',
  color: '#fff',
  padding: '15px',
  borderRadius: '5px',
  boxShadow: '1px 4px 11px 0px #35353628',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const RootApp = () => (
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
);

export default RootApp;
