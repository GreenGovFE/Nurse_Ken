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

const App = () => {
  const navigate = useNavigate();
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    const checkAndSetTimeout = () => {
      const loginTime = localStorage.getItem('LOGIN_TIME');

      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - loginTime;
        const sessionDuration = 3600000; // 1 hour in milliseconds
        const timeRemaining = sessionDuration - timeElapsed;

        if (timeRemaining <= 600000 && timeRemaining > 0) { // 10 minutes warning
          const minutesLeft = Math.ceil(timeRemaining / 60000);
          setMinutesLeft(minutesLeft);
          if (!warningDisplayed) {
            setWarningDisplayed(true);
            setSessionExpired(false);
          }
        }

        if (timeRemaining <= 0 && !sessionExpired) {
          setSessionExpired(true);
          setWarningDisplayed(false);
          navigate('/');
          localStorage.removeItem('LOGIN_TIME');

          // Hide the expired session notification after 5 seconds
          setTimeout(() => {
            setSessionExpired(false);
          }, 5000);
        }
      }
    };

    // Initial check when component mounts
    checkAndSetTimeout();

    // Set interval to check every minute (60000 milliseconds)
    const intervalId = setInterval(checkAndSetTimeout, 60000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [navigate, warningDisplayed, sessionExpired]);

  return (
    <PatientProvider>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<PageLayout />} />
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
      </div>
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
