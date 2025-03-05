import React, { useEffect, useState } from 'react';
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

const App = () => {
  const navigate = useNavigate();
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [inactivityMinutesLeft, setInactivityMinutesLeft] = useState(5); // 5 minutes countdown

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
        setInactivityMinutesLeft(5); // Reset countdown
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
      }, 7200000);
    };

    const checkAndSetTimeout = () => {
      const loginTime = localStorage.getItem('LOGIN_TIME');

      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - loginTime;
        const sessionDuration = 21600000;
        const timeRemaining = sessionDuration - timeElapsed;

        if (timeRemaining <= 600000 && timeRemaining > 0) {
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
